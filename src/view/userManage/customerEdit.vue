<template>
    <Card>
        <Form ref="formCustom" :rules="ruleValidate" :model="tableData">
            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">用户编辑</td>
                </tr>
                <tr>
                    <td>用户名：</td>
                    <td>
                        <FormItem prop="userName">
                            <Input v-model.trim="tableData.userName"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>密码：</td>
                    <td>
                        <FormItem prop="password">
                            <Input v-model.trim="tableData.password" type="password" placeholder="不修改可不填"/>
                        </FormItem>

                    </td>
                </tr>
                <tr>
                    <td>头像:</td>
                    <td>
                        <FormItem prop="hubWeixinHead ">
                            <upload-img :imgName="tableData.hubWeixinHead"
                                        @fetchImgUrl="uploadCoverImage"
                                        @removeImgUrl="removeCoverImage"
                                        v-model="tableData.hubWeixinHead" :status="false">

                            </upload-img>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>会员身份：</td>
                    <td>
                        <formItem prop="hubChefLevel">
                            <Select v-model="tableData.hubChefLevel" style="width: 200px;margin-right:10px;" @on-change="hubChefLevelChange">
                                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label}}
                                </Option>
                            </Select>
                        </formItem>
                        <!--城市合伙人-->
                        <FormItem prop="cityPartnerCityName" v-if="show">
                            <Select v-model="tableData.cityPartnerCityName" style="width:200px;"
                                    @on-change="cityPartnerChange" v-if="true" :label-in-value="true">
                                <Option v-for="item in tableForm" :value="item.value" :key="item.label">{{item.value}}
                                </Option>
                            </Select>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>所在省份：</td>
                    <td>
                        <Select v-model="tableData.provinceId" style="width:100px;" @on-change="provinceChange">
                            <Option v-for="item in provinceList" :value="item.provinceId" :key="item.provinceId">
                                {{item.provinceName}}
                            </Option>
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>所在城市：</td>
                    <td>
                        <Select v-model="tableData.cityId" style="width:100px;">
                            <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{item.cityName}}
                            </Option>
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>手机号：</td>
                    <td>
                        <FormItem prop="mobile">
                            <Input v-model.trim="tableData.mobile"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>有效/无效：</td>
                    <td>
                        <Select v-model="tableData.status " style="width: 200px">
                            <Option v-for="item in list2" :value="item.status" :key="item.status">{{ item.label }}
                            </Option>
                        </Select>
                    </td>
                </tr>
            </table>
            <div class="button-group">
                <Button type="primary" @click="handleSubmit">保存</Button>
                <Button type="primary" @click="turnBack">返回</Button>
            </div>

        </Form>

    </Card>
</template>
<script>
    import uploadImg from '@/components/uploadImg'

    export default {
        name: 'customerEdit',
        components: {uploadImg},
        data() {
            return {
                tableData: {
                    hubWeixinHead: 'default',
                    hubChefLevel: '',
                    userName: '',
                    password: '',
                    mobile: '',
                    status: null,
                    provinceId: null,
                    cityId: null,
                    cityPartnerCityName:''
                },
                show:false,
                cityName:'',
                provinceName:'',
                tableForm: [],
                provinceList: [],
                cityList: [],
                ruleValidate: {
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                    ],
                    hubChefLevel: [
                        {required: true, message: '请选择会员身份'}
                    ],
                    mobile: [
                        {required: true, trigger: 'blur', message: "手机号不能为空"},
                        {pattern: /^1\d{10}$/, max: 11, trigger: 'blur', message: "请输入11位以内正确的手机号"}
                    ]
                },
                list1: [
                    {label: '普通会员', value: 'normal'},
                    {label: '城市合伙人', value: 'partner'},
                    {label: '认证名厨', value: 'famous'}
                ],
                list2: [
                    {label: '有效', status: 1},
                    {label: '无效', status: 0}
                ]
            }
        },
        mounted() {
            this.$get(`/user/admin/${this.$route.query.id}/detail`).then((data) => {
                this.tableData = data.data;
               //ajax异步调取
                if(this.tableData.hubChefLevel === 'partner'){
                    this.show=true
                }

                this.$get('/area/city', {provinceId: data.data.provinceId}).then(data => {
                    this.cityList = data.data;
                })

            })

                this.$get('/area/province').then(data => {
                    this.provinceList = data.data;
                });

            this.$get(`/area/getCity`).then((data) => {
                let result = data.data.map(o => {
                    return {value: o.cityName, label: o.cityName}
                });
                this.tableForm = result;
            })

        },
        methods: {
            provinceChange(params){
                console.log(params)
                //筛选港澳台、直辖市，后面的城市不显示
                //     switch(params.value){
                //         case 30:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         case 9:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         case 7:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         case 5:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         case 27:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         case 16:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         case 11:
                //             this.$refs.cityList.$el.style.display = 'none';
                //             break;
                //         default:
                //             this.$refs.cityList.$el.style.display='inline-block';
                //             this.$get('/area/city', {provinceId: params.value}).then(data => {
                //                 this.cityList = data.data;
                //             })
                //     }

                this.$get('/area/city', {provinceId: params}).then(data => {
                    this.cityList = data.data;
                })

            },

            uploadCoverImage(evtValue) {
                this.tableData.hubWeixinHead = evtValue;
            },
            removeCoverImage() {
                this.tableData.hubWeixinHead = 'default'
            },
            cityPartnerChange(params) {
                // console.log(params)
                this.tableData.cityPartnerCityName = params.value;
            },
            //城市合伙人显示与隐藏
            hubChefLevelChange(param){
                param === 'partner'?this.show = true:this.show = false;
            },
            handleSubmit() {
                if (this.tableData.hubWeixinHead === 'default') {
                    this.tableData.hubWeixinHead = ''
                }
                this.$refs.formCustom.validate((valid) => {
                    if (valid) {
                        this.$put('/user/admin/update', this.tableData).then(()=> {

                            this.$router.push({
                                name: 'userList'
                            })
                        })
                    }
                });
            },
            turnBack() {
                this.$router.push({
                    name: 'userList'
                })
            }
        }
    }
</script>
<style scoped lang="less">
    table:nth-child(n+2) {
        margin-top: 20px;
    }

    table {
        background: #fff;
        width: 100%;
        font-size: 14px;
        border-collapse: collapse;
        border: 1px solid #e8eaec;
        tr {
            border: 1px solid #e8eaec;
        }
        tr:nth-child(1) {
            background: #f8f8f9;
            font-size: 16px;
            border: 1px solid #e8eaec;
        }
        td {
            padding: 10px 0;
            text-align: left;
            padding-left: 10px;
            border: 1px solid #e8eaec;
        }
        td:nth-child(2n+1) {
            width: 20%;
        }

    }

    .button-group {
        background: #fff;
        padding: 20px 0;
        .ivu-btn {
            margin-right: 10px;
        }
    }

</style>