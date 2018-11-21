<template>
    <Card>
        <Form :model="form" :rules="ruleValidate" ref="form" :label-width="100">
            <div class="card">
                <Row>
                    <Col>
                        <Card dis-hover>
                            <div class="ivu-card-head">
                                <p slot="title">用户编辑</p>
                            </div>

                            <div class="card_form_input">
                                <FormItem label="用户名" prop="name">
                                    <Input v-model.trim="form.name" style="width:86%;" clearable type="text" />
                                </FormItem>
                                <FormItem label="密码" prop="password">
                                    <Input v-model.trim="form.password" style="width:86%;" clearable type="password" placeholder="不修改可不填写" />
                                </FormItem>
                                <FormItem label="再次确认密码" prop="checkPassword">
                                    <Input v-model.trim="form.checkPassword" style="width:86%;" clearable type="password" placeholder="不修改可不填写" />
                                </FormItem>
                                <FormItem label="角色名" prop="roleId" class="roleSelect">
                                    <Select v-model.trim="form.roleId" style="width:432px" >
                                        <Option v-for="item in options" :value="item.id" :key="item.id">{{item.roleName }}</Option>
                                    </Select>
                                </FormItem>
                                <div class="action_row">
                                    <Button type="primary" @click="handleSubmit('form')" style="margin:30px;">确定</Button>
                                    <Button @click="() => {this.$router.go(-1)}">取消</Button>
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
        name:'userEdit',
        data(){
            // const validatePass = (rule, value, callback) => {
            //     if (value === '') {
            //         callback(new Error('请输入密码'));
            //     } else {
            //         if (this.form.checkPassword!== ''){
            //             this.$refs.form.validateField('checknewPassword');
            //         }
            //         callback();
            //     }
            // };
            // const validatePassCheck = (rule, value, callback) => {
            //     if (value === '') {
            //         callback(new Error('请再次输入密码'));
            //     } else if (value !== this.form.password) {
            //         callback(new Error('两次密码输入不一致'));
            //     } else {
            //         callback();
            //     }
            // };
            return{
                form: {
                    id:null,
                    name: '',
                    password:'',
                    roleId: null,

                },
                options:[],
                pageMessage:{
                    page:1,
                    size:10,
                },
                ruleValidate:{
                    // name:[
                    //     {required:true,message:'用户名不能为空',trigger:'blur'},
                    // ],
                    // password: [
                    //     { validator: validatePass,required:true, trigger: 'blur' }
                    // ],
                    // checkPassword: [
                    //     { validator: validatePassCheck,required:true, trigger: 'blur' }
                    // ],
                    // password:[
                    //     {required:true,message:"确认密码",trigger:'blur'},
                    //     {pattern:/[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/, trigger: 'blur',message: '请输入六位及以上数字和字母的组合'}
                    // ],
                    // checkPassword:[
                    //     {required:true,message:"再次确认密码",trigger:'blur'},
                    // ],
                    roleId:[
                        {required:true,message:'请选择角色'}
                    ]
                },

            }
        },
        mounted(){
            this.initData()
        },
        methods:{
            initData(){
                this.$get(`/Role/admin/list`,this.pageMessage).then((data) => {
                    this.options = data.data.items;
                })
                this.$get(`/User/admin/${this.$route.query.id}/detail`,this.pageMessage).then((data)=>{
                    this.form = data.data;
                }).catch((err)=>{
                    console.log(err)
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$put('/User/admin/update',this.form).then((data)=>{
                                this.$router.push({
                                    name:'userDesign'
                                })
                        })
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
<style scoped lang="less">
    .ivu-card-head{background:#e8eaec!important;text-align:left;}
    .ivu-card-head p{font-size:13px;color:#333;font-weight:normal;}
    .ivu-form-item{width:600px;margin:26px auto!important;}
    .ivu-form-item-content{width:400px;}
    .ivu-form .ivu-form-item-label{text-align:left;}
</style>
<style>
    .ivu-select-placeholder, .ivu-select-selected-value{text-align:left;}
    .roleSelect .ivu-select-item{text-align:left;}
</style>