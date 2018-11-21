<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form ></login-form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import LoginForm from '@/components/login-form'


    export default {
        components: {
            LoginForm
        },
        data() {
            return {
                timestamp: Date.now()
            }
        },
    }
</script>

<style>

</style>
