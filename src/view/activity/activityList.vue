<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="活动日期" style="width: 200px" @on-change="changeDate"
                        class="search-input" ></DatePicker>
            <Select v-model="searchData.activityType" style="width:100px" class="search-input">
                <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Input clearable placeholder="活动标题" class="search-input"
                   v-model.trim="searchData.title" style="width:200px"/>
            <Select v-model="searchData.activityStatus" style="width:100px" class="search-input">
                <Option v-for="item in list1" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
            <Input clearable placeholder="发布人" class="search-input"
                   v-model.trim="searchData.userName" style="width:100px"/>
            <Select v-model="searchData.approvalStatus" style="width:110px" class="search-input">
                <Option v-for="item in list2" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button class="search-btn" type="primary" @click="handleAdd">
                新增活动
            </Button>
            <Button type="primary" class="search-button" @click="exportData">导出</Button>

        </div>
        <Table border :columns="columns" :data="tableData" style="margin-top: 20px">
        </Table>
        <Page :total="total" show-sizer show-total style="margin-top: 20px" @on-change="pageChange"
              @on-page-size-change="sizeChange"/>
    </Card>
</template>

<script>
    import BASE_URL from '@/api/url'

    export default {
        name: "activityList",
        data() {
            return {
                searchData: {
                    page: 1,
                    size: 10,
                    start: '',
                    end: '',
                    activityStatus: -1,
                    activityType: -1,
                    approvalStatus:-1,
                    title: '',
                    userName: '',
                },
                total: 0,
                list: [
                    {label: '全部类型', value: -1},
                    {label: '公开课', value: 'public'},
                    {label: '发布会', value: 'publish'},
                    {label: '品鉴会', value: 'tasting'},
                    {label: '厨艺竞赛', value: 'competition'},
                    {label: '行业活动', value: 'industry'},
                    {label: '其他', value: 'other'},

                ],
                list1: [
                    {label: '全部状态', value: -1},
                    {label: '进行中', value: 1},
                    {label: '即将开始', value: 2},
                    {label: '已结束', value: 3}
                ],
                list2: [
                    {label: '全部审核状态', value: -1},
                    {label: '待审核', value: 1},
                    {label: '已通过', value: 2},
                    {label: '未通过', value: 3}
                ],
                tableData: [],
                columns: [
                    {
                        title: '活动标题',
                        key: 'title',
                        align:'center',
                        minWidth: 200,
                        // width: 200,
                    },

                    {
                        title: '活动类型',
                        key: `activityType`,
                        align:'center',
                        // minWidth: 60,
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                    params.row.activityType === 'public' ? '公开课' : params.row.activityType === 'publish' ? '发布会' : params.row.activityType === 'tasting' ? '品鉴会' : params.row.activityType ==='competition'?'厨艺竞赛':params.row.activityType==='industry'?'行业活动':'其他'
                                ]
                            )
                        }
                    },

                    {
                        title: '封面图片',
                        key: 'coverImage',
                        align:'center',
                        // minWidth: 120,
                        width:120,
                        render: (h, params) => {
                            return h('img', {
                                    style: {
                                        height: '80px',
                                        width: '80px',
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
                        title: '发布时间',
                        key: 'publishDate',
                        align:'center',
                        // minWidth: 80,
                        width:140,
                        render: (h, params) => {
                            return h('div', [
                                    this.$moment(params.row.publishDate).format('YYYY-MM-DD HH:mm')
                                ]
                            )
                        }
                    },
                    {
                        title: '活动状态',
                        key: 'activityStatus',
                        align:'center',
                        // minWidth: 60,
                        width:100,
                    },
                    {
                        title: '费用',
                        key: 'usePoint',
                        align:'center',
                        // minWidth: 70,
                        width:100,
                        render: (h, params) => {
                            return h('div', [
                                    `${params.row.usePoint}积分`
                                ]
                            )
                        }
                    },
                    {
                        title: '报名人数',
                        key: 'maxParticipator',
                        align:'center',
                        // minWidth: 60,
                        width:100,
                    },
                    {
                        title: '发布人',
                        key: 'userName',
                        align:'center',
                        // minWidth: 60,
                        width:80,
                    },
                    {
                        title: '会员身份',
                        key: 'customerType',
                        align:'center',
                        // minWidth: 60,
                        width:100,
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
                        // minWidth: 60,
                        width:100,
                        render: (h, params) => {
                            return h('div', [
                                    params.row.approvalStatus === 1 ? '未审核' : params.row.approvalStatus === 2 ? '已通过' : '未通过 '
                                ]
                            )
                        }
                    },
                    {
                        title: '是否置顶',
                        key: 'topFlag',
                        align:'center',
                        // minWidth: 60,
                        width:100,
                        render: (h, params) => {
                            return h('div', [
                                params.row.topFlag === 1 ? '是' : '否'
                                ]
                            )
                        }
                    },
                    {
                        title: '活动时间',
                        // minWidth: 100,
                        align:'center',
                        width:180,
                        render: (h, params) => {
                            return h('div', [
                                    `${this.$moment(params.row.activityStart).format('YYYY-MM-DD HH:mm')} 至 ${this.$moment(params.row.activityEnd).format('YYYY-MM-DD HH:mm')}`
                                ]
                            )
                        }
                    },
                    {
                        title: '操作',
                        align:'center',
                        // minWidth: 100,
                        width:100,
                        fixed:'right',
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
                                                        name: 'activityListDetails',
                                                        query: {
                                                            id: params.row.id,
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
                                                        name: 'activityListDetails',
                                                        query: {
                                                            id: params.row.id,
                                                            status: params.row.approvalStatus
                                                        }
                                                    });
                                                }
                                            }
                                        }, '审核'),

                                    params.row.editFlag === 1 ? h('Button', {
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
                                                    name: 'activityEdit',
                                                    query: {
                                                        id: params.row.id,
                                                        pageType: params.row.blogType,
                                                        status: params.row.approvalStatus
                                                    }
                                                });
                                            }
                                        }
                                    }, '编辑') : null,
                                    params.row.editFlag === 1 ?   h('Button', {
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
                                    }, '删除'):null,
                                    params.row.approvalStatus === 2 ? h('Button', {
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
                                                    name: 'participatorList',
                                                    query: {id: params.row.id}
                                                })
                                            }
                                        }
                                    }, '名单管理') : null,
                                    params.row.approvalStatus === 2 ? h('Button', {
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
                                                    name: 'order',
                                                    query: {id: params.row.id}
                                                })
                                            }
                                        }
                                    }, '订单管理') : null,
                                ]);
                        }
                    }
                ],
            }
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

                if (newObj.activityStatus === -1) {
                    newObj.activityStatus = null
                }
                if (newObj.activityType === -1) {
                    newObj.activityType = null
                }
                if (newObj.approvalStatus === -1) {
                    newObj.approvalStatus = null
                }

                this.$post('/activity/admin/list', newObj,true).then((data) => {
                    this.tableData = data.data.items;
                    this.total = data.data.totalNum

                })
            },
            exportData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if (newObj.activityStatus === -1) {
                    newObj.activityStatus = null
                }
                if (newObj.activityType === -1) {
                    newObj.activityType = null
                }
                if (newObj.approvalStatus === -1) {
                    newObj.approvalStatus = null
                }

                this.$post('/activity/admin/activity/export', newObj).then(data => {
                    window.location.href = `${BASE_URL}/${data.data}`
                    // window.open(`${BASE_URL}/${data.data}`);
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
            remove(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$put(`/activity/admin/delete/${id}`).then(()=>{
                            this.fetchData();
                        });

                    },
                })

            },
            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
            },
            handleAdd() {
                this.$router.push({
                    name: 'activityAdd'
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