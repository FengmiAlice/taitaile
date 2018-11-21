<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="订单时间" style="width: 200px" @on-change="changeDate"
                        class="search-input"></DatePicker>

            <Input clearable placeholder="订单号" class="search-input"
                   v-model.trim="searchData.orderNum" style="width:200px"/>

            <Input clearable placeholder="订单用户" class="search-input"
                   v-model.trim="searchData.name" style="width:200px"/>

            <Input clearable placeholder="手机号" class="search-input"
                   v-model.trim="searchData.phone" style="width:200px"/>

            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>

            <Button type="primary" class="search-button" @click="exportData">导出</Button>

        </div>
        <Table border :columns="columns" :data="tableData" style="margin-top: 20px">
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
        name: "activityList",
        data() {
            return {
                searchData: {
                    page: 1,
                    size: 10,
                    start: '',
                    end: '',
                    name:'',
                    orderContent:'',
                    phone:'',
                    orderNum:'',
                },
                total: 0,
                tableData: [],
                columns: [
                    {
                        title: '订单内容',
                        key: 'orderContent',
                        align: 'center',

                    },

                    {
                        title: '订单号',
                        key: `orderNum`,
                        align: 'center',

                    },

                    {
                        title: '订单用户',
                        key: 'name',
                        align: 'center',

                    },
                    {
                        title: '手机',
                        key: 'phone',
                        align: 'center',
                    },
                    {
                        title: '订单时间',
                        key:'orderDate',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    this.$moment(params.row.orderDate).format('YYYY-MM-DD HH:mm:ss')
                                ]
                            )
                        }
                    },
                    {
                        title: '费用',
                        key: 'usePoint',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                    `${params.row.usePoint}积分`
                                ]
                            )
                        }
                    },
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
                this.$post(`/activity/admin/orders/${this.$route.query.id}`, this.searchData,true).then((data) => {
                    this.tableData = data.data.items;
                    this.total = data.data.totalNum

                })
            },
            exportData() {
                this.$post(`/activity/admin/orders/export/${this.$route.query.id}`, this.searchData).then(data => {
                    window.location.href = `${BASE_URL}/${data.data}`
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
                        this.$put(`/activity/admin/delete/${id}`);
                        this.fetchData();
                    },
                })

            },
            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
            },
            turnBack(){
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