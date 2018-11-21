<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="发表时间" class="search-input"
                        @on-change="changeDate" :start-date="startDate"></DatePicker>
            <Input clearable placeholder="发表人" class="search-input"
                   v-model.trim="searchData.publisher"/>
            <Input clearable placeholder="回答内容" class="search-input"
                   v-model.trim="searchData.content"/>


            <Select v-model="searchData.status" style="width:100px" class="search-input">
                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button @click="handleDelete" class="search-btn" type="primary">
                批量删除
            </Button>
            <Button class="search-btn" type="primary" @click="handleAdd">
                新增回答
            </Button>
        </div>

        <Table border :columns="columns" :data="tableData" ref="selection" @on-select="handleSelect"
               @on-select-all="handleSelectAll">
        </Table>
        <footer>
            <div>
                <Button type="primary" @click="turnBack">返回</Button>
            </div>
            <div>
                <Page :total="total" show-sizer show-total @on-change="pageChange"
                      @on-page-size-change="sizeChange">
                </Page>
            </div>
        </footer>
    </Card>
</template>

<script>
    export default {
        name: "faqManage",
        data() {
            return {
                list: [],
                startDate:null,
                searchData: {
                    page: 1,
                    size: 10,
                    beginTime: null,
                    endTime: null,
                    id: this.$route.query.id,
                    content: null,
                    status: -1,
                    publisher: null,

                },
                list1: [
                    {label: '全部', value: -1},
                    {label: '发表中', value: 0},
                    {label: '已删除', value: 1}
                ],
                total: 0,
                tableData: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '回答内容',
                        key: 'content',
                        align:'center',
                    },

                    {
                        title: '发表人',
                        key: 'publisher',
                        align:'center',
                    },

                    {
                        title: '发表状态',
                        key: 'status',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                params.row.status === 0 ? '已删除' : '发表中']
                            )
                        }

                    },

                    {
                        title: '推荐答案',
                        key: 'bestAnswer',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    params.row.bestAnswer === 1 ? '是' : '否'
                                ]
                            )
                        }
                    },
                    {
                        title: '发表时间',
                        key: 'publishTime',
                        render: (h, params) => {
                            return h('div', [
                                    this.$moment(params.row.publishTime).format('YYYY-MM-DD HH:mm')
                                ]
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align:'center',
                        render: (h, params) => {

                            return h('div', [
                               params.row.status === 1 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        display:'flex',
                                        margin:'5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除') : null,
                                params.row.status === 1?  params.row.bestAnswer === 0 ?
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            display:'flex',
                                            margin:'5px  auto 5px auto'
                                        },
                                        on: {
                                            click: () => {
                                                this.$post(`/answer/admin/${params.row.id}/bestAnswer`).then(data => {
                                                    if (data.code === 0) {
                                                        this.fetchData()
                                                    }
                                                })
                                            }
                                        }
                                    }, '设为推荐') : h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            display:'flex',
                                            margin:'5px  auto 5px auto'
                                        },
                                        on: {
                                            click: () => {
                                                this.$post(`/answer/admin/${params.row.id}/cancelBestAnswer`).then(data => {
                                                    if (data.code === 0) {
                                                        this.fetchData()
                                                    }
                                                })
                                            }
                                        }
                                    }, '取消推荐'):null,

                                params.row.status === 1?    h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style:{
                                        display:'flex',
                                        margin:'5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name:'faqCommentList',
                                                query:{id:params.row.id}
                                            })
                                        }
                                    }
                                }, '评论管理'):null,
                            ]);
                        }
                    }
                ]
            }

        },
        beforeMount(){
            this.startDate = this.$moment(new Date()).subtract(1, 'months').toDate();
        },
        mounted() {
            this.fetchData()
        },
        methods: {
            fetchData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if (newObj.status === -1) {
                    newObj.status = null
                }

                this.$post(`/answer/admin/answerList`, newObj,true).then(data => {
                    let arr = data.data.items;
                    arr.map((value, index) => {
                        if (value.status !==1) {
                            value._disabled = true;
                        }
                    });
                    this.tableData = arr;
                    this.total = data.data.totalNum
                })
            },
            changeDate(date) {
                this.searchData.beginTime = date[0];
                this.searchData.endTime = date[1];
            },
            handleSearch() {
                this.fetchData()
            },
            pageChange(page) {
                this.searchData.page = page;
                this.fetchData();
            },
            sizeChange(size) {
                this.searchData.size = size;
                this.fetchData();
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$DELETE(`/answer/admin/${id}/delete`).then(()=>{
                                this.fetchData()
                        }


                        );
                    },
                })
            },
            handleAdd() {
                this.$router.push({
                    name: 'askAdd',
                    query: {pageType: 'add',id:this.$route.query.id}
                })
            },

            handleSelect(selection, row) {
                for(let i=0,flag=true,len=selection.length;i<len;flag ? i++ : i){
                    if( selection[i]&&selection[i].status=== 1 ){
                        selection.splice(i,1);
                        flag = false;
                    } else {
                        flag = true;
                    }
                }
                selection.map((val, index) => {
                    this.list.push(val.id);
                });
            },
            handleSelectAll(selection, row) {
                for(let i=0,flag=true,len=selection.length;i<len;flag ? i++ : i){
                    if( selection[i]&&selection[i].status=== 1 ){
                        selection.splice(i,1);
                        flag = false;
                    } else {
                        flag = true;
                    }
                }

                selection.map((val, index) => {
                    this.list.push(val.id);
                })
            },
            handleDelete() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        if (this.list.length !== 0) {
                            this.$post('/answer/admin/batchDelete', {list: Array.from(new Set(this.list))}).then(data => {
                                if (data.code === 0) {
                                    this.fetchData()
                                }
                            })
                        }
                    },
                })
            },
            turnBack(){
                this.$router.push({
                    name: 'faqList'
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .search-con {
        padding: 10px 0;
        display: flex;
        justify-content: flex-start;
        .search {
            &-col {
                display: inline-block;
                width: 200px;
            }
            &-input {
                display: inline-block;
                width: 200px;
                margin-left: 2px;
            }
            &-btn {
                margin-left: 2px;
            }
        }
    }
</style>
