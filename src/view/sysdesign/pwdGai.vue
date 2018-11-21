<template>
    <Card>
        <Form :model="formCustom" :rules="ruleCustom" ref="formCustom" :label-width="100" label-position="left">
            <div class="card">
                <Row>
                    <Col>
                        <Card dis-hover >
                            <div class="ivu-card-head">
                                <p slot="title">密码修改</p>
                            </div>

                            <div class="card_form_content">
                                <FormItem label="原密码" prop="password" >
                                    <Input v-model.trim="formCustom.password"  clearable  type="password"/>
                                </FormItem>
                                <FormItem label="新密码" prop="newPassword">
                                    <Input v-model.trim="formCustom.newPassword" clearable type="password"  />
                                </FormItem>
                                <FormItem label="确认新密码" prop="checknewPassword">
                                   <Input v-model.trim="formCustom.checknewPassword" clearable type="password" />
                                </FormItem>
                                <div class="action_row">
                                    <Button class="sure"  type="primary" @click="handleSubmit" style="margin:30px;">确定</Button>
                                    <Button @click="handleCancle">取消</Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Form>
    </Card>

</template>
<script>
    export default{
        data(){
            const validatePassCheck = (rule, value, callback) => {
               if (value !== this.formCustom.newPassword) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };
            return{
                formCustom:{
                    password:'',
                    newPassword:'',
                    checknewPassword:'',
                    roleId:'',
                    roleName:'',
                    userId:'',
                },
                ruleCustom: {
                    password:[
                        {required:true,message:'请输入原密码',trigger:'blur'}
                    ],
                    newPassword: [
                        {required:true,message:'请输入新密码',trigger: 'blur' }
                    ],
                    checknewPassword: [
                        {required:true,message:'请确认新密码',trigger: 'blur' },
                        {validator:validatePassCheck,trigger:'blur'}
                    ],
                }
            }
        },
        mounted(){
            // this.$get(`/Common/admin/getPrivileges`,this.formCustom).then((data)=>{
            //     this.formCustom=data.data;
            // })
        },

        methods:{
            handleSubmit() {
            let obj={
                password: this.formCustom.password,
                newPassword : this.formCustom.newPassword,
                checknewPassword:this.formCustom.checknewPassword,
            }
                this.$refs.formCustom.validate( (valid) => {
                    if (valid) {
                        this.$put(`/Common/admin/changePassword.do`,obj).then((data)=>{
                            this.formCustom = data.data;
                            window.sessionStorage.removeItem('token');
                                this.$router.push({
                                    name:'login'
                                })
                        })
                    }
                })
            },
            handleCancle(){
                this.formCustom.password = ''||null;
                this.formCustom.newPassword = ''||null;
                this.formCustom.checknewPassword = ''||null;
            }
        }
    }
</script>
<style scoped lang="less">
    .ivu-form-item{margin:28px 0!important;}
    .ivu-card-head {text-align:left!important;background: #e8eaec!important;}
    .ivu-card-head p{font-size:13px;color:#333;font-weight:normal;text-align:left;}
    .card_form_input{width:700px;margin:0 auto;}
</style>
<style>
    .card_form_content{width:600px;margin:0 auto;}
    .action_row {width: 500px;margin: 0 auto;}
    .card_form_content .ivu-form-item-error-tip{left:0!important;}
</style>