<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
            <Input v-model="form.name" placeholder="请输入用户名">
            <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码">
            <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="captcha" ref="captchaField">
            <Input v-model="form.captcha" placeholder="验证码" style="width: 168px"/>
            <img :src="captchaUrl" style="height: 32px; vertical-align: middle"
                 @click="timestamp = Date.now()">
        </FormItem>
        <FormItem>
            <Button @click="handleSubmit()" type="primary" long style="margin-top: 10px">登录</Button>
        </FormItem>
    </Form>
</template>
<script>
    import BASE_URL from '@/api/url'
    import {mapMutations, mapActions} from 'vuex'

    export default {
        name: 'LoginForm',
        props: {
            nameRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ]
                }
            },
            passwordRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            },
            captchaRules: {
                type: Array,
                default: () => {
                    return [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                }
            },

        },
        data() {
            return {
                form: {
                    name: 'admin',
                    password: '123456',
                    captcha: null,
                },
                timestamp: Date.now() ? Date.now() : new Date().getTime(),
            }
        },
        mounted() {
        },
        computed: {
            rules() {
                return {
                    name: this.nameRules,
                    password: this.passwordRules,
                    captcha: this.captchaRules
                }
            },
            captchaUrl() {
                return `${BASE_URL}/Captcha/getCaptcha?${this.timestamp}`;
            }
        },
        methods: {
            ...mapMutations([
                'setBreadCrumb',
                'setAccess'
                // 'setTagNavList',
                // 'addTag',
                // 'setLocal'
            ]),
            handleSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$post('/User/login', this.form).then((data) => {
                            window.sessionStorage.setItem('token', data.data.token);
                            window.sessionStorage.setItem('currentUser', this.form.name);
                            window.sessionStorage.setItem('access', data.data.privileges);
                            this.setAccess(window.sessionStorage.getItem('access').split(','));
                            let arr = [];
                            if(data.data.privileges !==''){
                                 arr = data.data.privileges.split(',');
                            }else{
                                arr = ['']
                            }


                                for(let i = 0 ;i < arr.length;i++){
                                    if(arr[i] === 'all'||arr[i] === '1'){
                                        this.$router.push({
                                            name:'cookingList'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '2'){
                                        this.$router.push({
                                            name:'activityList'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '3'){
                                        this.$router.push({
                                            name:'faqList'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '4'){
                                        this.$router.push({
                                            name:'userList'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '5'){
                                        this.$router.push({
                                            name:'cityConfirm'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '6'){
                                        this.$router.push({
                                            name:'allCommentList'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '7'){
                                        this.$router.push({
                                            name:'informList'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '8'){
                                        this.$router.push({
                                            name:'userDesign'
                                        });
                                        break;
                                    }
                                    if(arr[i] === '9'){
                                        this.$router.push({
                                            name:'roleDesign'
                                        });
                                        break;
                                    }
                                    if(arr[i] === ''){
                                        this.$router.push({
                                            name:'pwdGai'
                                        });
                                    }
                            }

                        }).catch(() => {
                            this.timestamp = Date.now() ? Date.now() : new Date().getTime();
                            this.form.captcha = null;
                        })
                    }
                })
            }
        },

    }
</script>
