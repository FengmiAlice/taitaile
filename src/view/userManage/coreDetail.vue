<template>
    <Card>
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="时间" style="width: 200px" @on-change="changeDate"
                        class="search-input" :start-date="startDate">
            </DatePicker>
            <Input clearable placeholder="订单号" class="search-input"
                   v-model.trim="searchData.itemNumber" style="width:200px"/>
            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
        </div>
        <Table border :columns="columns" :data="tableData" style="margin-top: 20px">
        </Table>

        <footer>
            <div>
                <Button type="primary"  @click="turnBack">返回</Button>
            </div>
            <div>
                <Page :total="total" show-sizer show-total @on-change="pageChange"
                      @on-page-size-change="sizeChange" >
                </Page>
            </div>
        </footer>

    </Card>
</template>

<script>
    export default {
        name: "coreDetail",
        data() {
            return {
                startDate:null,
                searchData: {
                    page: 1,
                    size: 10,
                    restaurantId:null,
                },
                total: 0,
                tableData: [],
                columns: [
                    {
                        title: '时间',
                        key:'itemTime',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    `${this.$moment(params.row.itemTime).format('YYYY-MM-DD HH:mm')}`
                                ]
                            )
                        }
                    },
                    {
                        title: '变动积分',
                        // key: `integral`,
                        align:'center',
                        render:(h,params)=>{
                            return h('div',[
                                params.row.amount > 0 ? `+${params.row.amount}`:params.row.amount
                            ])
                        }
                    },
                    {
                        title: '积分变动原因',
                        key: `itemName`,
                        align:'center',
                    },
                    {
                        title: '订单号',
                        key: `itemNumber`,
                        align:'center',
                    },
                    {
                        title: '积分余额',
                        key: 'afterValue',
                        align:'center',

                    },
                ],
            }
        },
        beforeMount(){
            this.startDate = this.$moment(new Date()).subtract(1, 'months').toDate();
        },
        mounted() {
            this.searchData.restaurantId=this.$route.query.id;
            this.fetchData()
        },
        activated(){
            this.fetchData();
        },
        methods: {
            fetchData() {
                this.$get(`/integral/admin/getList`,this.searchData).then((data) => {

                    this.tableData = data.data.items;
                    this.total = data.data.totalNum;
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
            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
            },
            turnBack(){
                this.$router.push({
                    name: 'userList'
                })
            }
        }
    }
</script>

<style scoped lang="less">
    /*.ivu-page{text-align:right;margin-top:20px;position:relative;}*/
    /*.turnback{position:absolute;left:20px;top:10px;}*/
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