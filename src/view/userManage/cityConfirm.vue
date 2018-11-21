<template>
    <Card  @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="申请日期" style="width: 200px" @on-change="changeDate"
                        class="search-input" :start-date="startDate"></DatePicker>

            <Input clearable placeholder="用户名" class="search-input"
                   v-model.trim="searchData.userName" style="width:200px"/>
            <Input clearable placeholder="姓名" class="search-input"
                   v-model.trim="searchData.realName" style="width:200px"/>
            <Input clearable placeholder="手机号" class="search-input"
                   v-model.trim="searchData.mobile" style="width:200px"/>

            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>

        </div>
        <Table border :columns="columns" :data="tableData" style="margin-top: 20px">
        </Table>
        <Page :total="total" show-sizer show-total @on-change="pageChange"
              @on-page-size-change="sizeChange"/>
    </Card>
</template>

<script>
    // import BASE_URL from '@/api/url';
    export default {
        name: "cityConfirm",
        data() {
            return {
                startDate:null,
                searchData: {
                    page: 1,
                    size: 10,
                    start: '',
                    end: '',
                    userName: '',
                    realName:'',
                    mobile:'',
                    // restaurantId:''
                },
                total: 0,
                tableData: [],
                columns: [
                    {
                        title: '用户名',
                        key: 'userName',
                        align:'center',
                        minWidth:80,
                    },
                    {
                        title: '真实姓名',
                        key: 'realName',
                        align:'center',
                        minWidth: 60,
                    },
                    {
                        title: '手机号',
                        key: 'mobile',
                        align:'center',
                        minWidth: 100,
                    },
                    {
                        title: '申请城市',
                        key: 'cityName',
                        align:'center',
                        minWidth: 60,
                    },
                    {
                        title: '审核结果',
                        key: 'status',
                        align:'center',
                        minWidth: 60,
                        render: (h, params) => {
                            return h('div', [
                                    params.row.status === 0 ? '待审核' : params.row.status === 1 ? '审核通过' : '审核拒绝 '
                                ]
                            )
                        }
                    },
                    {
                        title: '申请时间',
                        key:'createTime',
                        align:'center',
                        minWidth: 100,
                        render:(h,params)=>{
                            return h('div',[
                                `${this.$moment(params.row.createTime ).format('YYYY-MM-DD HH:mm')}`
                            ])
                        }
                    },
                    {
                        title: '操作',
                        align:'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div',
                                [
                                    params.row.status === 0 ?
                                      h('Button', {
                                            props: {
                                                type: 'primary',
                                                size: 'small'
                                            },
                                            style: {
                                                display:'flex',
                                                width:'80px',
                                                'justify-content':'center',
                                                margin:'5px  auto 5px auto'
                                            },
                                            on: {
                                                click: () => {
                                                    this.$router.push({
                                                        name: 'cityDeal',
                                                        query: {
                                                            id: params.row.id,
                                                            status: params.row.status
                                                        }
                                                    })
                                                }
                                            }
                                        }, '处理'):null,
                                    params.row.status === 0 ? h('Button', {
                                            props: {
                                                type: 'primary',
                                                size: 'small'
                                            },
                                            style: {
                                                display:'flex',
                                                width:'80px',
                                                'justify-content':'center',
                                                margin:'5px  auto 5px auto'
                                            },
                                            on: {
                                                click: () => {
                                                    this.remove(params.row.id,2)
                                                    // this.$router.push({
                                                    //     name: 'cityDeal',
                                                    //     query: {
                                                    //         id: params.row.id,
                                                    //         status: params.row.status
                                                    //     }
                                                    // })
                                                }
                                            }
                                        }, '审核拒绝'):null,

                                    params.row.status ===1? h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            display:'flex',
                                            'justify-content':'center',
                                            width:'80px',
                                            margin:'5px  auto 5px auto'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: 'dealDetail',
                                                    query: {
                                                        id: params.row.id,
                                                        status: params.row.status
                                                    }
                                                })
                                            }
                                        }
                                    }, '详情'):null,
                                    params.row.status ===2 ? h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            display:'flex',
                                            'justify-content':'center',
                                            width:'80px',
                                            margin:'5px  auto 5px auto'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: 'dealDetail',
                                                    query: {
                                                        id: params.row.id,
                                                        status: params.row.status
                                                    }
                                                });
                                            }
                                        }
                                    }, '详情'):null,
                                ]);
                        }
                    }
                ],
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

                if (newObj.status === 0) {
                    newObj.status = null
                }
                this.$post('/cityPartner/admin/list', newObj,true).then((data) => {
                    this.tableData = data.data.items;
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

            changeDate(date) {
                this.searchData.start = date[0];
                this.searchData.end = date[1];
            },
            remove(id,param){
                console.log(id)
                console.log(param)
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认审核拒绝吗?</p>',
                    onOk: () => {
                        this.$put(`/cityPartner/admin/update/${id}/${param}`).then(()=>{
                            this.fetchData();
                        });

                    },
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .ivu-page{text-align:right;margin-top:100px;}
    .search-con {
        padding: 10px 0;
        text-align: left;
        .search {
            &-col {
                display: inline-block;
            }
            &-input {
                display: inline-block;
                /*margin-right:20px;*/
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
    /*.ivu-btn-primary{  width:90px;background-color:rgba(22, 155, 213, 1); border-radius:5px;}*/
</style>