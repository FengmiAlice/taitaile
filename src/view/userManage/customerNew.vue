<template>
    <Card>
        <Form  ref="formCustom" :rules="ruleValidate" :model="tableData">
            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">用户新增</td>
                </tr>
                <tr>
                    <td>用户名：</td>
                    <td>
                        <FormItem prop="userName">
                            <Input v-model.trim="tableData.userName" placeholder="请输入用户名"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>密码：</td>
                    <td>
                        <FormItem prop="password">
                            <Input v-model.trim="tableData.password" type="password" placeholder="请输入密码"/>
                        </FormItem>

                    </td>
                </tr>
                <tr>
                    <td>头像:</td>
                    <td>
                        <FormItem prop="hubWeixinHead ">
                            <upload-img :imgName="tableData.hubWeixinHead"
                                        @fetchImgUrl="uploadCoverImage"
                                        @removeImgUrl = "removeCoverImage"
                                        v-model="tableData.hubWeixinHead" :status="true">

                            </upload-img>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>会员身份：</td>
                    <td>
                        <FormItem prop="hubChefLevel">
                            <Select v-model="tableData.hubChefLevel" style="width: 200px;float:left;" @on-change="hubChefLevelChange">
                                <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>

                      <FormItem prop="cityPartnerCityName" v-if="show">
                          <Select v-model="tableData.cityPartnerCityName" style="width:200px;" :label-in-value="true"  @on-change="ciChange" v-if="true">
                              <Option v-for="item in tableForm" :value="item.value" :key="item.label">{{item.value}}</Option>
                          </Select>
                      </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>所在省份：</td>
                    <td>
                        <Select  v-model="tableData.provinceId " style="width:100px;" @on-change="provinceChange">
                            <Option v-for="item in provinceList"  :value="item.provinceId" :key="item.provinceId" >{{item.provinceName}}</Option>
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>所在城市：</td>
                    <td>
                        <Select v-model="tableData.cityId" style="width:100px;">
                            <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{item.cityName}}</Option>
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>手机号：</td>
                    <td>
                        <FormItem prop="mobile">
                            <Input v-model.trim="tableData.mobile" placeholder="请输入手机号"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>有效/无效：</td>
                    <td>
                        <Select v-model="tableData.status" style="width: 200px;">
                            <Option v-for="item in list2" :value="item.status" :key="item.status">{{ item.label }}</Option>
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
    export default{
        name:'customerNew',
        components:{uploadImg},
        data(){
            return{
               personList:[],
                tableData:{
                    hubWeixinHead:'default',
                    hubChefLevel:'normal',
                    userName:'',
                    password:'',
                    mobile:'',
                    status:1,
                    provinceId: null,
                    cityId: null,
                    cityPartnerCityName:'',
                },
                show:false,
                tableForm:[],
                provinceList: [],
                cityList: [],
                ruleValidate:{
                    userName:[
                        {required:true,message:'用户名不能为空',trigger:'blur'},
                        // { pattern:/^(\w){6,20}$/, message: '请输入6~20位数字字母下划线', trigger: 'blur'}
                    ],
                    password:[
                        {required:true,message:"密码不能为空",trigger:'blur'},
                        // {pattern:/[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/,trigger: 'blur',message: '请输入六位及以上数字和字母的组合'}

                    ],
                    hubWeixinHead: [
                                {required: true, trigger: 'blur', message: "头像不能为空"}
                            ],
                    hubChefLevel:[
                        {required:true,message:'请选择会员身份'}
                    ],
                    mobile:[
                        {required:true,trigger:'blur',message:"手机号不能为空"},
                        {pattern: /^1\d{10}$/, max:11,trigger:'blur',message:"请输入11位以的手机号"}
                    ]
                },

                list1: [
                    {label: '普通会员', value:'normal'},
                    {label: '城市合伙人', value: 'partner'},
                    {label: '认证名厨', value: 'famous'}
                ],
                list2:[
                    {label:'有效',status:1},
                    {label:'无效',status:0}
                ]
            }
        },
        mounted(){
            this.$get(`/area/province`).then(data => {
                this.provinceList = data.data;
                // let result = this.provinceList.map(o => {
                //     return {value: o.provinceId, label: o.provinceName}
                // });
                // this.newProvinceList = result;
                // console.log(result)

            });

            this.$get(`/area/getCity`).then((data)=>{
                let result=data.data.map(o=>{
                    return {value:o.cityName,label:o.cityName}
                })
                this.tableForm=result;
            })
        },
        methods:{
            provinceChange(params) {
                 this.$get('/area/city',{provinceId:params}).then( (data) => {
                     this.cityList = data.data;
                     // this.newCityList = this.cityList.map(o => {
                     //     return {value: o.cityId, label: o.cityName}
                     // });
                     // console.log(params)
                     // this.newProvinceList.map((value, index) => {
                     //     if (value.value === id[0]) {
                     //         this.newProvinceList[index].children = arr;
                     //     }
                     // })
                 })
             },
            uploadCoverImage(evtValue){
                this.tableData.hubWeixinHead=evtValue;
            },
            removeCoverImage(){
              this.tableData.hubWeixinHead='default'
            },
            ciChange(params){
                console.log(params)
                this.tableData.cityPartnerCityName=params.value
            },
            handleSubmit(){
              if(this.tableData.hubWeixinHead ==='default'){
                  this.tableData.hubWeixinHead=''
              }
                this.$refs.formCustom.validate((valid) => {
                    if (valid) {
                        this.$post('/user/admin/insert', this.tableData).then((data) => {
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
            },
            hubChefLevelChange(param){
                param === 'partner'?this.show = true:this.show = false;
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
        tr{
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