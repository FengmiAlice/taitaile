<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="通知日期" style="width: 240px"
                        @on-change="changeDate" class="search-input" :start-date="startDate"></DatePicker>
            <Input clearable placeholder="内容" class="search-input"
                   v-model.trim="searchData.content" style="width: 400px"/>

            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button class="search-btn" type="primary" @click="AddInform">
                新增通知
            </Button>
        </div>

        <Table border :columns="columns" :data="tableData">
        </Table>
        <Page :total="total" show-sizer show-total  @on-change="pageChange"
              @on-page-size-change="sizeChange"/>
    </Card>
</template>
<script>


    export default {
        name: 'informList',
        data() {
            return {
                startDate:null,
                total: 0,
                tableData: [],
                searchData: {
                    page: 1,
                    size: 10,
                    // beginDate: null,
                    // endDate: null,
                    // content:null
                },
                columns: [
                    {
                        title:'标题',
                        key:'title',
                        align:'center',
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align:'center',
                    },
                    {
                        title: '通知时间',
                        key: 'createTime',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                `${this.$moment(params.row.createTime ).format('YYYY-MM-DD HH:mm')}`
                                ]
                            )
                        }
                    },
                    {
                        title: '通知对象',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                !params.row.cityNames? '城市：全国':`城市：${params.row.cityNames}`,
                                    h('div',[
                                        `用户对象：${params.row.userLevelList}`
                                    ])
                                ]
                            )
                        }

                    },
                    {
                        title:'操作',
                        key:'action',
                        align:'center',
                        render:(h,params) =>{
                            return h('div',
                                [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            display:'flex',
                                            margin:'5px  auto 5px auto',
                                            padding:'5px auto 5px auto'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: 'informListDetail',
                                                    query:{
                                                        id:params.row.id,
                                                    }
                                                });

                                            }
                                        }
                                    }, '查看详细'),
                            ])
                        }
                    }

                ]
            }
        },
        beforeMount(){
            //转化为Date对象，截取上个月与当前月的日期
            this.startDate = this.$moment(new Date()).subtract(1, 'months').toDate();
        },
        mounted() {
            this.fetchData();
            this.tableData.ids=this.$router.id
        },
        methods: {
            fetchData() {
                this.$get(`/systemNotification/admin/adminSearchSystemNotificationList`, this.searchData).then((data) => {
                    this.tableData = data.data.items;
                    this.total = data.data.totalNum;
                    for(let i=0;i<this.tableData.length;i++){
                        if(this.tableData[i].userLevelList){
                            for(let j = 0;j<this.tableData[i].userLevelList.length;j++){
                                if(this.tableData[i].userLevelList[j] ==='normal'){
                                    this.$set( this.tableData[i].userLevelList,j,'普通会员');
                                }else if(this.tableData[i].userLevelList[j] === 'partner'){
                                    this.$set(this.tableData[i].userLevelList,j,'城市合伙人');
                                }else if(this.tableData[i].userLevelList[j] === 'famous'){
                                    this.$set(this.tableData[i].userLevelList,j,'认证名厨');
                                }else{
                                    this.$set(this.tableData[i].userLevelList,j,'全部会员');
                                }
                            }
                        }else{
                            this.tableData[i].userLevelList='全部会员';
                        }
                    }
                });
            },
            changeDate(date) {
                this.searchData.beginDate = date[0];
                this.searchData.endDate = date[1];
            },
            handleSearch() {
                this.fetchData()
            },
            pageChange(page) {
                this.searchData.page = page
                this.fetchData()
            },
            sizeChange(size) {
                this.searchData.size = size
                this.fetchData()
            },
            AddInform() {
                this.$router.push({
                    name: 'informListAdd'
                })
            },
        }
    }
</script>
<style scoped lang="less">
    .ivu-page{text-align:right;margin-top:20px;}
    .ivu-table-cell {
        widh: 300px;
        padding: 0;
        margin: 0;
    }
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
    table {
        width: 100%;
        font-size: 14px;
        border-collapse: collapse;
        border: 1px solid #e8eaec;
        tr{
            border: 1px solid #e8eaec;
            text-align:center;
        }
        td {
            padding: 10px 0;
            text-align: left;
            padding-left: 10px;
            border: 1px solid #e8eaec;
            text-align:center;
        }

    }
</style>