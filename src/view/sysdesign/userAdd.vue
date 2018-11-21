<template>
    <Card>
        <Form :model="form" :rules="ruleValidate" ref="form" :label-width="100">
            <div class="card">
                <Row>
                    <Col>
                        <Card dis-hover >
                            <div class="ivu-card-head">
                                <p slot="title">用户添加</p>
                            </div>

                            <div class="card_form_input formContent">
                                <FormItem label="用户名" prop="name">
                                    <Input v-model.trim="form.name" style="width:86%;" clearable />
                                </FormItem>
                                <FormItem label="密码" prop="password">
                                    <Input v-model.trim="form.password" style="width:86%;" clearable type="password" />
                                </FormItem>
                                <FormItem label="确认密码" prop="checkPassword">
                                    <Input v-model.trim="form.checkPassword" style="width:86%;" clearable type="password" />
                                </FormItem>
                                <FormItem label="角色名" prop="roleId" class="roleSelect">
                                    <Select v-model.trim="form.roleId" style="width:432px" >
                                        <Option v-for="item in options" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
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
    // import AppClient from '@/api/index'
    export default {
        name:'addUser',
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value !== this.form.password){
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    name: '',
                    roleName: '',
                    password:'',
                    roleId: null
                },
                pageMessage:{
                    page:1,
                    size:999
                },
                ruleValidate:{
                    name:[
                        {required:true,message:'请输入用户名',trigger:'blur'},
                        { pattern:/^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,}$/, message: '请输入6~20位数字字母下划线', trigger: 'blur'}
                    ],
                    password:[
                        {required:true,message:'请输入密码',trigger:'blur'},
                        {pattern:/[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/, trigger: 'blur',message: '请输入六位及以上数字和字母的组合'}
                    ],
                    checkPassword: [
                        {required:true,message:'请再次确认密码',trigger: 'blur'},
                        {validator:validatePassCheck,trigger:'blur'}
                    ],
                    roleId:[
                        {required:true,message:'请选择角色'}
                    ]
                },
                options:[]
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData(){
                this.$get(`/Role/admin/list`,this.pageMessage).then((data) => {
                    this.options = data.data.items
                })
            },
                handleSubmit (name) {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.$post('/User/admin/add',this.form).then((data)=>{
                                this.$router.push({
                                    name: 'userDesign'
                                })
                                this.initData()
                            }).catch((data)=>{
                            })
                        }
                    })

                },
                handleReset (name) {
                    this.$refs[name].resetFields();
                },
        }
    }
</script>
<style scoped lang="less">
    .ivu-card-head{background:#e8eaec!important;text-align:left;}
    .ivu-card-head p{font-size:13px;color:#333;font-weight:normal;}
    .ivu-form-item{width:600px;margin:26px auto!important;}
    .ivu-form .ivu-form-item-label{text-align:left;}
</style>
<style>
    .card_form_input{width:600px;margin:0 auto;}
    .card_form_input .ivu-form-item-error-tip{left:36px!important;}
    .ivu-select-placeholder, .ivu-select-selected-value{text-align:left;}
    .roleSelect .ivu-select-item{text-align:left;}
</style>