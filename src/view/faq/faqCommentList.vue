<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="发表日期" style="width: 200px" @on-change="changeDate"
                        class="search-input" :start-date="startDate"></DatePicker>
            <Input clearable placeholder="发表人" class="search-input"
                   v-model.trim="searchData.publisherName" style="width: 200px"/>
            <Input clearable placeholder="回答内容" class="search-input"
                   v-model.trim="searchData.content" style="width: 200px"/>
            <Select v-model="searchData.active" style="width:100px" class="search-input">
                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button @click="handleDelete" class="search-btn" type="primary">
                批量删除
            </Button>
            <Button class="search-btn" type="primary" @click="handleAdd">
                新增评论
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
        name: "faqCommentList",
        data() {
            return {
                startDate:null,
                list: [],
                total:null,
                list1: [
                    {label: '全部', value: -1},
                    {label: '发表中', value: 1},
                    {label: '已删除', value: 2}
                ],
                searchData: {
                    page: 1,
                    size: 10,
                    active: -1,
                    start:null,
                    end:null,
                    replyId:this.$route.query.id,
                    publisherName:null,
                },
                tableData: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '评论内容',
                        key: 'content',
                        align: 'center',
                    },


                    {
                        title: '发表人',
                        key: 'publisherName',
                        align: 'center',
                    },

                    {
                        title: '发表状态',
                        key: 'active',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                params.row.active === 1 ? '发表中' : '已删除']
                            )
                        }

                    },
                    {
                        title: '发表时间',
                        key: 'publishDate',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    this.$moment(params.row.publishDate).format('YYYY-MM-DD HH:mm')
                                ]
                            )
                        }
                    },

                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                params.row.active === 1 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除') : null,
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
        activated(){
            this.fetchData();
        },
        methods: {
            fetchData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if (newObj.active === -1) {
                    newObj.active = null
                }
                this.$get(`/answer/admin/getListForB`, newObj).then(data => {
                    let arr = data.data.items;
                    arr.map((value, index) => {
                        if (value.active !==1) {
                            value._disabled = true;
                        }
                    });
                    this.tableData = arr;
                    this.total = data.data.totalNum
                })
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
            handleSelect(selection, row) {
                for (let i = 0, flag = true, len = selection.length; i < len; flag ? i++ : i) {
                    if (selection[i] && selection[i].active === 2) {
                        selection.splice(i, 1);
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
                for (let i = 0, flag = true, len = selection.length; i < len; flag ? i++ : i) {
                    if (selection[i] && selection[i].active === 2) {
                        selection.splice(i, 1);
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
                        if(this.list.length !==0) {
                            this.$post('/answer/admin/deleteComment', {ids: Array.from(new Set(this.list))}).then(data => {
                                if (data.code === 0) {
                                    this.fetchData()
                                }
                            })
                        }
                    },
                })
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$post(`/answer/admin/${id}/deleteComment   `).then(() => {
                                this.fetchData()
                            }
                        );
                    },
                })
            },
            handleAdd(){
            this.$router.push({
                name:'faqCommentAdd',
                query:{id:this.$route.query.id}
            })
            },
            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
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
        text-align: left;

        .search {
            &-col {
                display: inline-block;
            }
            &-input {
                display: inline-block;

                margin-left: 2px;
            }
            &-btn {
                margin-left: 2px;
            }
        }
    }

    .search-button {
        margin-left: 2px;
    }
</style>