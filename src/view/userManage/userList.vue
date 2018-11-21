<template>
    <Card  @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="注册日期" style="width: 200px"
                        @on-change="changeDate" class="search-input" :start-date="startDate"></DatePicker>

            <Input clearable placeholder="用户名" class="search-input"
                   v-model.trim="searchData.name" style="width: 130px"/>
            <Input clearable placeholder="手机号" class="search-input"
                   v-model.trim="searchData.mobile" style="width: 150px"/>
            <Select v-model="searchData.hubChefLevel" style="width:160px" class="search-input" >
                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <!--所在城市-->
            <Select  v-model="searchData.provinceId " style="width:160px;margin-right:10px;" @on-change="provinceChange" clearable  placeholder="不限省份">
                <Option v-for="item in provinceList"  :value="item.provinceId" :key="item.provinceId">{{item.provinceName}}</Option>
            </Select>

            <Select v-model="searchData.cityId" style="width:160px;margin-right:10px;" clearable placeholder="不限城市">
                <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{item.cityName}}</Option>
            </Select>

            <Button class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button class="search-btn" type="primary" @click="handleExport">
                导出
            </Button>
            <Button class="search-btn" type="primary" @click="AddCustomer">
                新增用户
            </Button>
        </div>

        <Table border :columns="columns" :data="tableData" style="margin-top:20px;text-align:center;">

        </Table>
        <Page :total="total" show-sizer show-total @on-change="pageChange"
              @on-page-size-change="sizeChange"/>
    </Card>
</template>
<script>
    import BASE_URL from '@/api/url'
    export default {
        name: 'userList',
        data() {
            return {
                total: 0,
                tableData: [],
                provinceList: [],
                cityList: [],
                startDate:null,
                searchData: {
                    page: 1,
                    size: 10,
                    name: '',
                    mobile: '',
                    start: '',
                    end: '',
                    hubChefLevel:-1,
                    cityId: null,
                    provinceId: null,
                },

                list1: [
                    {label: '全部会员', value: -1},
                    {label: '普通会员', value: 'normal'},
                    {label: '城市合伙人', value: 'partner'},
                    {label: '认证名厨', value: 'famous'}
                ],
                columns: [
                    {
                        title: '用户名',
                        key: 'userName',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '头像',
                        key: 'hubWeixinHead ',
                        align:'center',
                       minWidth:100,
                        render: (h, params) => {
                            return h('img', {
                                    style: {
                                        height: '60px',
                                        width: '60px',
                                        display:'block',
                                       margin:'0 auto',
                                    },
                                    attrs: {
                                        src: params.row.hubWeixinHead?params.row.hubWeixinHead.indexOf('http') === -1? `${BASE_URL}/${params.row.hubWeixinHead}`:params.row.hubWeixinHead:null

                                    }
                                }
                            )
                        }
                    },
                    {
                        title: '手机号',
                        key: 'mobile',
                        align:'center',
                        width:120,
                    },
                    {
                        title: '会员身份',
                        key: 'hubChefLevel',
                        align:'center',
                        width:100,
                        render: (h, params) => {
                            return h('div', [
                                    params.row.hubChefLevel === 'normal' ? '普通会员' : params.row.hubChefLevel === 'partner' ? '城市合伙人' : '认证名厨'
                                ]
                            )
                        }
                    },
                    {
                        title: '所在省份',
                        key: 'provinceName',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '所在城市',
                        key: 'cityName',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '参与活动数',
                        key: 'activityCount',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '厨艺秀发布数',
                        key: 'blogCount',
                        align:'center',
                        width:120,
                    },
                    {
                        title: '问答数',
                        key: 'answerCount',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '粉丝数',
                        key: 'fanCount',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '关注数',
                        key: 'attentionCount',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align:'center',
                        width:80,
                        render: (h, params) => {
                            return h('div', [
                                    params.row.status === 1 ? '有效' : '无效'
                                ]
                            )
                        }
                    },
                    {
                        title: '注册途径',
                        key: 'registerWay',
                        align:'center',
                        width:120,
                        render: (h, params) => {
                            return h('div', [
                                params.row.registerWay === 1 ? '前台' : params.row.registerWay === 0 ? '后台' : params.row.registerWay === 2 ? '手机' : params.row.registerWay === 3 ? '微信' : '小程序'
                            ])
                        }

                    },
                    {
                        title: '注册时间',
                        align:'center',
                        width:140,
                        render: (h, params) => {
                            return h('div', [
                                    `${this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm')}`
                                ]
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align:'center',
                        width:120,
                        fixed:'right',
                        render: (h, params) => {
                            return h('div',
                                [
                                    // params.row.status !== 1 ?
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
                                                    name: 'customerEdit',
                                                    query:{
                                                        id:params.row.restaurantId,
                                                        status: params.row.status
                                                    }
                                                });

                                            }
                                        }
                                    }, '编辑'),
                                    params.row.status === 1 ?
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
                                                this.remove(params.row.restaurantId,0)
                                            }
                                        }
                                    }, '无效'):params.row.status ===0 ?
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
                                                    this.remove(params.row.restaurantId,1)
                                                }
                                            }
                                        },'有效'):null,
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
                                                    name: 'coreDetail',
                                                    query: {
                                                        id: params.row.restaurantId,

                                                    }
                                                });
                                            }
                                        }
                                    }, '积分详情')

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
            this.$get('/area/province').then(data => {
                this.provinceList = data.data;
            });
            this.fetchData();

        },
        activated(){
            this.fetchData();
        },
        methods: {
            fetchData() {
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj))
                //深拷贝
                if (newObj.hubChefLevel === -1) {
                    newObj.hubChefLevel = null
                }
                this.$post(`/user/admin/list`, newObj,true).then((data) => {
                    this.tableData = data.data.items;
                    this.total = data.data.totalNum
                });

            },
            remove(id,param){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认更改状态吗?</p>',
                    onOk: () => {
                        this.$put(`/user/admin/validTrigger/${id}/${param}`).then(()=>{
                            this.fetchData();
                        }).catch(()=>{
                        })
                    },
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
                this.searchData.page = page
                this.fetchData()
            },
            sizeChange(size) {
                this.searchData.size = size
                this.fetchData()
            },
            handleExport() {
                //深拷贝
                let obj = this.searchData;
                let newObj = JSON.parse(JSON.stringify(obj));
                if (newObj.hubChefLevel === -1) {
                    newObj.hubChefLevel = null;
                }
                //导出用户列表
                this.$post('/user/admin/export', newObj).then(data => {
                    window.location.href=`${BASE_URL}/${data.data}`;
                })
            },
            AddCustomer() {
                this.$router.push({
                    name: 'customerNew'
                })
            },
            provinceChange(params) {
                //判空操作
                    if(params){
                        this.$get('/area/city',{provinceId: params}).then((data) => {
                            this.cityList = data.data;
                        })
                    }
            }
        }
    }
</script>
<style scoped lang="less">
    .ivu-page{text-align:right;margin-top:20px;}
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
        textarea{
            border: 1px solid #e8eaec;
        }

    }
</style>