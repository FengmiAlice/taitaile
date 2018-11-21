<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="报名日期" style="width: 200px" @on-change="changeDate"
                        class="search-input"></DatePicker>
            <Input clearable placeholder="姓名" class="search-input"
                   v-model.trim="searchData.name"/>

            <Select v-model.trim="searchData.approvalStatus" style="width:100px" class="search-input">
                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button @click="operate('pass')" class="search-btn" type="primary">
                批量审核通过
            </Button>
            <Button @click="operate('unpass')" class="search-btn" type="primary">
                批量审核拒绝
            </Button>
            <Button class="search-btn" type="primary" @click="exportData">
                导出
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
    import BASE_URL from '@/api/url'

    export default {
        name: "participatorList",
        data() {
            return {
                list: [],
                searchData: {
                    page: 1,
                    size: 10,
                    beginTime: null,
                    endTime: null,
                    id: this.$route.query.id,
                    content: null,
                    approvalStatus: -1,
                    name: null,
                },
                list1: [
                    {label: '全部', value: -1},
                    {label: '待审核', value: 1},
                    {label: '审核通过', value: 2},
                    {label: '审核拒绝', value: 3}
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
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                    },


                    {
                        title: '手机',
                        key: 'phone',
                        align: 'center',
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                        align: 'center',
                    },

                    {
                        title: '所属地',
                        key: 'belongAddress',
                        align: 'center',
                    },
                    {
                        title: '就职餐厅',
                        key: 'serviceRestaurant',
                        align: 'center',
                    },
                    {
                        title: '年龄',
                        key: 'age',
                        align: 'center',
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        align: 'center',
                    },
                    {
                        title: '报名时间',
                        key: 'enrollDate',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    this.$moment(params.row.enrollDate).format('YYYY-MM-DD HH:mm')
                                ]
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                params.row.approvalStatus === 1 ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        display: 'flex',
                                        margin: '5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                            this.$put(`/activity/admin/participator/approval/${this.$route.query.id}`, {
                                                operate: 'pass',
                                                participators: [params.row.id]
                                            }).then(() => {
                                                this.fetchData()
                                            })
                                            // this.operate('pass')
                                        }
                                    }
                                }, '审核通过') : null,
                                params.row.approvalStatus === 1 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        display: 'flex',
                                        margin: '5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                            this.$put(`/activity/admin/participator/approval/${this.$route.query.id}`, {
                                                operate: 'unpass',
                                                participators: [params.row.id]
                                            }).then(() => {
                                                this.fetchData()
                                            })
                                            // this.operate('unpass')
                                        }
                                    }
                                }, '审核拒绝') : null,
                                params.row.approvalStatus === 2 ? h('div', {}, '已通过') : null,
                                params.row.approvalStatus === 3 ? h('div', {}, '已拒绝') : null,
                            ]);
                        }
                    }
                ]
            }

        },
        mounted() {
            this.fetchData()
        },
        activated() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if (newObj.approvalStatus === -1) {
                    newObj.approvalStatus = null
                }
                this.$post(`/activity/admin/participator/list/${this.$route.query.id}`, newObj, true).then(data => {
                    let arr = data.data.items;
                    arr.map((value, index) => {
                        if (value.approvalStatus !== 1) {
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
            remove(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$DELETE(`/answer/admin/${id}/delete`).then(() => {
                                this.fetchData()
                            }
                        );
                    },
                })
            },
            exportData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if (newObj.approvalStatus === -1) {
                    newObj.approvalStatus = null
                }
                this.$post(`/activity/admin/participator/export/${this.$route.query.id}`, newObj).then(data => {
                    window.location.href = `${BASE_URL}/${data.data}`
                })
            },

            handleSelect(selection, row) {
                for (let i = 0, flag = true, len = selection.length; i < len; flag ? i++ : i) {
                    if (selection[i] && selection[i].status === 1) {
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
                    if (selection[i] && selection[i].status === 1) {
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
                this.$post('/answer/admin/batchDelete', {list: Array.from(new Set(this.list))}).then(data => {
                    if (data.code === 0) {
                        this.fetchData()
                    }
                })
            },
            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
            },
            operate(params) {
                if (this.list.length !== 0) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确认执行此操作?</p>',
                        onOk: () => {
                            this.$put(`/activity/admin/participator/approval/${this.$route.query.id}`, {
                                operate: params,
                                participators: this.list
                            }).then(() => {
                                this.fetchData()
                            })
                        },
                    })
                }


            },
            turnBack() {
                this.$router.push({
                    name: 'activityList'
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
