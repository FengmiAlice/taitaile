<template>
    <Card>
        <table border="1" cellspacing="0">
            <tr>
                <td colspan="2">问题详情:</td>
            </tr>
            <tr>
                <td>问题:</td>
                <td>{{tableData.question}}</td>
            </tr>
            <tr>
                <td>问题详述:</td>
                <td>{{tableData.content}}</td>
            </tr>
            <tr>
                <td>发布人:</td>
                <td>{{tableData.questioner}}</td>

            </tr>
            <tr>
                <td>发布时间:</td>
                <td>{{tableData.publishTime}}</td>


            </tr>

            <tr>
                <td>回答数:</td>
                <td>{{tableData.answerCount}}</td>
            </tr>
            <tr>
                <td>是否热门:</td>
                <td>{{tableData.hot ===1?'是':'否'}}</td>

            </tr>
        </table>

        <div class="button-group">
            <Button type="primary" @click="turnBack"> 返回</Button>
        </div>
    </Card>
</template>

<script>
    export default {
        name: "faqDetails",
        data() {
            return {
                tableData: {
                    agreeCount: '',
                    answerCount: '',
                    collectCount: '',
                    content: '',
                    createTime: '',
                    editPerson: '',
                    hot: 0,
                    hotTime: '',
                    id: null,
                    images: '',
                    publishTime: '',
                    question: '',
                    questioner: '',
                    shareCount: '',
                    status: '',
                    updateTime: ''
                },
                list: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],

                pageType: null
            }
        },
        mounted() {

            this.$get(`/question/admin/${this.$route.query.id}/detail`).then((data) => {
                this.tableData = data.data;
                this.tableData.publishTime = this.$moment(this.tableData.publishTime).format('YYYY-MM-DD HH:mm');

            })


        },

        methods: {

            turnBack() {
                this.$router.push({
                    name: 'faqList'
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
