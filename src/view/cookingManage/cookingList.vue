<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top" >
            <DatePicker type="daterange" split-panels placeholder="发布日期" style="width: 200px" @on-change="changeDate"
                        class="search-input" :start-date="startDate"></DatePicker>

            <Select v-model="searchData.blogType" style="width:100px" class="search-input">
                <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Input v-model.trim="searchData.title" placeholder="食谱名称" style="width:200px" class="search-input" clearable/>
            <Input v-model.trim="searchData.userName" placeholder="发布人" style="width: 160px" class="search-input" clearable/>
            <Select v-model="searchData.customerType" style="width:100px" class="search-input">
                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="searchData.approvalStatus" style="width:110px" class="search-input">
                <Option v-for="item in list2" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" class="search-btn" @click="handleSearch">搜索</Button>
            <Button type="primary" class="search-button" @click="exportData">导出</Button>
            <Button type="primary" class="search-button" @click="addNewVideo">新增烹饪视频</Button>
            <Button type="primary" class="search-button" @click="addNewBook">新增图文菜谱</Button>
        </div>
        <!--<Row>-->

        <!--</Row>-->
        <Table border :columns="columns" :data="tableData" style="margin-top: 20px">
        </Table>
        <Page :total="total" show-sizer show-total style="margin-top: 20px" @on-change="pageChange"
              @on-page-size-change="sizeChange"/>

    </Card>
</template>

<script>
    import BASE_URL from '@/api/url'

    export default {
        name: "cookingList",
        data() {
            return {
                total: 0,
                startDate:null,
                tableData: [],
                columns: [
                    {
                        title: '食谱名称',
                        key: 'title',
                        align:'center',
                        minWidth: 80,

                    },

                    {
                        title: '类型',
                        key: 'blogType',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    params.row.blogType === 'image' ? '图文菜谱' : '烹饪视频'
                                ]
                            )
                        }
                    },
                    {
                        title: '封面图片',
                        key: 'coverImage',
                        align:'center',
                        minWidth:40,
                        render: (h, params) => {
                            return h('img', {
                                    style: {
                                        height: '100px',
                                        width: '100px',
                                        display:'block',
                                        margin:'0 auto'
                                    },
                                    attrs: {
                                        src: `${BASE_URL}/${params.row.coverImage}`
                                    }
                                }
                            )
                        }

                    },
                    {
                        title: '发布人',
                        key: 'userName',
                        align:'center',
                    },
                    {
                        title: '会员身份',
                        key: 'customerType',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    params.row.customerType === 'normal' ? '普通会员' : params.row.customerType === 'partner' ? '城市合伙人' : '认证名厨'
                                ]
                            )
                        }
                    },
                    {
                        title: '审核状态',
                        key: 'approvalStatus',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    params.row.approvalStatus === 1 ? '未审核' : params.row.approvalStatus === 2 ? '已通过' : '未通过 '
                                ]
                            )
                        }
                    },
                    {
                        title: '是否置顶',
                        key: 'topBlog',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    params.row.topBlog === 1 ? '是' : '否'
                                ]
                            )
                        }
                    },
                    {
                        title: '发布时间',
                        key: 'publishDate',
                        align:'center',
                        render: (h, params) => {

                            return h('div', [
                                    this.$moment(params.row.publishDate).format('YYYY-MM-DD HH:mm')
                                ]
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'address',
                        align:'center',
                        minWidth: 60,
                        render: (h, params) => {
                            return h('div',
                                [
                                    params.row.approvalStatus !== 1 ?
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
                                                    this.$router.push({
                                                        name: 'details',
                                                        query: {
                                                            id: params.row.id,
                                                            pageType: params.row.blogType,
                                                            status: params.row.approvalStatus
                                                        }
                                                    });
                                                }
                                            }
                                        }, '详情') : h('Button', {
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
                                                    this.$router.push({
                                                        name: 'details',
                                                        query: {id: params.row.id,
                                                            status: params.row.approvalStatus,
                                                            pageType:params.row.blogType
                                                        }
                                                    });
                                                }
                                            }
                                        }, '审核'),

                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',

                                        },
                                        style: {
                                            display:'flex',
                                            margin:'5px  auto 5px auto'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: 'edit',
                                                    query: {
                                                        id: params.row.id,
                                                        pageType: params.row.blogType,
                                                        status: params.row.approvalStatus
                                                    }
                                                });

                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
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
                                    }, '删除'),
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
                                          this.$router.push({
                                              name:'commentList',
                                              query:{id:params.row.id}
                                          })
                                            }
                                        }
                                    }, '评论管理'),
                                ]);
                        }
                    }
                ],
                list: [
                    {label: '全部', value: 0},
                    {label: '烹饪视频', value: 'video'},
                    {label: '图文菜谱', value: 'image'}
                ],
                list1: [
                    {label: '全部会员', value: 0},
                    {label: '普通会员', value: 'normal'},
                    {label: '城市合伙人', value: 'partner'},
                    {label: '认证名厨', value: 'famous'}
                ],
                list2: [
                    {label: '全部审核状态', value: 0},
                    {label: '待审核', value: 1},
                    {label: '已通过', value: 2},
                    {label: '未通过', value: 3}
                ],

                searchData: {
                    page: 1,
                    size: 10,
                    start: null,
                    end: null,
                    userName: null,
                    customerType: 0,
                    blogType: 0,
                    title: null,
                    approvalStatus: 0,
                }
            }
        },
        beforeMount(){
            this.startDate = this.$moment(new Date()).subtract(1, 'months').toDate();
        },
        mounted() {
            this.fetchData();
        },
        activated(){
            this.fetchData();
        },
        methods: {
            fetchData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if(newObj.blogType === 0){
                    newObj.blogType = null
                }

                if(newObj.customerType === 0){
                    newObj.customerType = null
                }

                if(newObj.approvalStatus === 0){
                    newObj.approvalStatus = null
                }

                this.$post('/blog/admin/list', newObj,true).then((data) => {
                    this.tableData = data.data.items;
                    this.total = data.data.totalNum

                })
            },

            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
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
            exportData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if(newObj.blogType === 0){
                    newObj.blogType = null
                }

                if(newObj.customerType === 0){
                    newObj.customerType = null
                }

                if(newObj.approvalStatus === 0){
                    newObj.approvalStatus = null
                }
                this.$post('/blog/admin/export', newObj).then(data => {
                    window.location.href = `${BASE_URL}/${data.data}`
                })
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$DELETE(`/blog/admin/delete/${id}`);
                        this.fetchData();
                    },
                })

            },
            addNewVideo() {
                this.$router.push({
                    name: 'add',
                    query: {pageType: 'video', state: true}
                })
            },
            addNewBook() {
                this.$router.push({
                    name: 'add',
                    query: {pageType: 'image', state: true}
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
