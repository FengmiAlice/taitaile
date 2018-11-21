<template>
    <Card>
        <table border="1" cellspacing="0">
            <tr>
                <td colspan="2">审核处理:</td>
            </tr>
            <tr>
                <td>真实姓名:</td>
                <td>{{tableData.realName }}</td>
            </tr>
            <tr>
                <td>手机:</td>
                <td>{{tableData.mobile }}</td>
            </tr>
            <tr>
                <td>邮箱:</td>
                <td>{{tableData.email}}</td>
            </tr>
            <tr>
                <td>申请城市:</td>
                <td>{{tableData.cityName}}</td>
            </tr>

            <tr>
                <td>就职单位名称:</td>
                <td>{{tableData.companyName }}</td>
            </tr>
            <tr>
                <td>职位称号:</td>
                <td>{{tableData.positionName}}</td>
            </tr>
            <tr>
                <td>工作简历:</td>
                <td>{{tableData.workExperience}}</td>
            </tr>
            <tr>
                <td>申请城市合伙人的理由:</td>
                <td>{{tableData.reason }}</td>
            </tr>
        </table>

        <div class="button-group">
            <Button type="primary" @click="approval(1)" >审核通过</Button>
            <Button type="error" @click="reject(2)" >审核拒绝</Button>
            <Button type="primary" @click="turnBack">返回</Button>
        </div>
    </Card>
</template>

<script>

    export default {
        name: "cityDeal",
        data() {
            return {
                tableData: {
                    realName:'',
                    mobile:'',
                    email:'',
                    cityName:'',
                    companyName:'',
                    positionName:'',
                    workExperience:'',
                    reason:''
                },
                proStatus:null
            }
        },
        mounted() {
            this.id=this.$route.query.id;
            this.proStatus = this.$route.query.status;
            this.$get(`/cityPartner/admin/${this.$route.query.id}/detail`).then((data) => {
                console.log(data)
                this.tableData = data.data;
            })
        },
        methods: {
            approval(params) {

               this.$Modal.confirm({
                   title:'提示',
                   content:'<p>确认审核通过吗？</p>',
                   onOk:()=>{
                       this.$put(`/cityPartner/admin/update/${this.$route.query.id}/${params}`).then(()=>{
                           this.$router.push({
                               name: 'cityConfirm'
                           })
                       })
                   }
               })

            },
            reject(params){
                this.$Modal.confirm({
                    title:'提示',
                    content:'<p>确认审核拒绝吗？</p>',
                    onOk:()=>{
                        this.$put(`/cityPartner/admin/update/${this.$route.query.id}/${params}`).then(()=>{
                            this.$router.push({
                                name: 'cityConfirm'
                            })
                        })
                    }
                })
            },
            turnBack() {
                this.$router.push({
                    name: 'cityConfirm'
                })
            },
        }
    }
</script>

<style scoped lang="less">
    table {
        background: #fff;
        width: 100%;
        font-size: 14px;
        border-collapse: collapse;
        border: 1px solid #e8eaec;
        tr:nth-child(1) {
            background: #f8f8f9;
            font-size: 16px;
            border: 1px solid #e8eaec;
        }
        td {
            padding: 10px 0;
            text-align: left;
            padding-left: 10px;
        }
        td:nth-child(1) {
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