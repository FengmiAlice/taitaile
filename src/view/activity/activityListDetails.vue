<template>
    <Card>
        <table border="1" cellspacing="0">
            <tr>
                <td colspan="2">活动详情:</td>
            </tr>
            <tr>
                <td>封面图片:</td>
                <td>
                    <img-magnifying :imgSrc="tableData.coverImage|imgSrc"></img-magnifying>
                </td>
            </tr>
            <tr>
                <td>标题:</td>
                <td>{{tableData.title }}</td>
            </tr>
            <tr>
                <td>活动时间:</td>
                <td>{{tableData.activityStart|formatWithhour }}至{{tableData.activityEnd|formatWithhour }}</td>

            </tr>
            <tr>
                <td>报名时间:</td>
                <td>{{tableData.enrollStart |formatWithhour }}至{{tableData.enrollEnd |formatWithhour }}</td>



            </tr>

            <tr>
                <td>活动类型:</td>
                <td>
                    {{tableData.activityType === 'public' ? '公开课' : tableData.activityType === 'publish' ? '发布会' : tableData.activityType === 'tasting' ? '品鉴会' : tableData.activityType ==='competition'?'厨艺竞赛':tableData.activityType==='industry'?'行业活动':'其他'}}</td>
            </tr>
            <tr>
                <td>地点:</td>
                <td>{{tableData.activityAddress }}</td>
            </tr>
            <tr>
                <td>费用:</td>
                <td>{{!tableData.usePoint?'免费':(tableData.usePoint| moneyFilter)}}</td>
            </tr>
            <tr>
                <td>活动人数:</td>
                <td>{{tableData.maxParticipator }}</td>
            </tr>
            <tr>
                <td>活动介绍:</td>
                <td>{{tableData.describe}}</td>
            </tr>
            <tr>
                <td>发布人:</td>
                <td>{{tableData.userName }}</td>
            </tr>
            <tr>
                <td>发布时间:</td>
                <td>{{tableData.publishDate|formatWithhour}}</td>
            </tr>
            <tr>
                <td>报名表单设置:</td>
                <td>{{tableData.enrollItem }}</td>
            </tr>
            <tr>
                <td>需要人工审核:</td>
                <td>{{tableData.needApproval  ===1?'是':'否'}}</td>
            </tr>
            <tr>
                <td>是否置顶:</td>
                <td>{{tableData.topFlag  ===1?'是':'否'}}</td>
            </tr>
        </table>

        <div class="button-group">
            <Button type="primary" @click="approval('pass')" v-if="status === 1">审核通过</Button>
            <Button type="error" @click="approval('unpass')" v-if="status === 1">审核拒绝</Button>
            <Button type="primary" @click="turnBack">返回</Button>
        </div>
    </Card>
</template>

<script>
    import imgMagnifying from '@/components/imgMagnifying'
    export default {
        name: "activityListDetails",
        components: {
            imgMagnifying,
        },
        data() {
            return {
                tableData: {
                    activityAddress:'',
                    activityEnd:'',
                    activityStart:'',
                    activityType:'',
                    city:'',
                    coverImage:'',
                    describe:'',
                    enrollEnd:'',
                    enrollItem:'',
                    enrollStart:'',
                    id:'',
                    maxParticipator:'',
                    needApproval:'',
                    publishDate:'',
                    title:'',
                    usePoint:'',
                    userName:'',
                },
                status:null

            }
        },
        mounted() {
            this.status = this.$route.query.status;
            this.$get(`/activity/admin/detail/${this.$route.query.id}`).then((data) => {
                this.tableData = data.data;
                this.tableData.publishTime = this.$moment(this.tableData.publishTime).format('YYYY-MM-DD HH:mm');

            })


        },

        methods: {
            turnBack() {
                this.$router.push({
                    name: 'activityList'
                })
            },
            approval(param){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认执行此操作?</p>',
                    onOk: () => {
                        this.$put(`/activity/admin/${param}/${this.$route.query.id}`).then(()=>{
                            this.$router.push({
                                name:'activityList'
                            })
                        })
                    },
                })

            }


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
