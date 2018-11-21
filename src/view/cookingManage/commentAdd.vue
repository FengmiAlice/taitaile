<template>
    <Card>
        <Form ref="formCustom" :model="tableData" :rules="ruleCustom">

            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">评论新增</td>
                </tr>
                <tr>
                    <td>评论内容：</td>
                    <td>
                        <FormItem prop="content">
                            <Input type="textarea" v-model.trim="tableData.content"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>发布人：</td>
                    <td>
                        <FormItem prop="publisher">
                            <Select v-model="tableData.publisher" filterable>
                                <Option v-for="item in publisherList" :value="item.restaurantId"
                                        :key="item.restaurantId">{{ item.userName }}
                                </Option>
                            </Select>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td> 发布时间：</td>
                    <td>
                        <FormItem prop="publishTime">
                            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="tableData.publishTime"
                                        @on-change="handleDateChange" :options="options"></DatePicker>
                        </FormItem>
                    </td>
                </tr>

            </table>

            <div class="button-group">
                <Button type="primary" @click="handleSubmit">保存</Button>
                <Button type="primary" @click="turnBack"> 返回</Button>
            </div>
        </Form>
    </Card>
</template>

<script>


    export default {
        name: "commentAdd",

        data() {

            return {

                publisherList: [],
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: {
                    commentType: 'blog',
                    content: "",
                    publishTime: '',
                    publisher: null,
                    replyId: this.$route.query.id

                },
                list: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                ruleCustom: {
                    content: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    publishTime: [
                        {required: true, trigger: 'change', message: "不能为空"}
                    ],
                    publisher: [
                        {required: true, trigger: 'blur', message: "不能为空", type: 'number'}
                    ]
                }
            }
        },
        mounted() {
            let myDate = new Date();
            this.tableData.publishTime = this.$moment(myDate).format('YYYY-MM-DD HH:mm');
            this.$get('/Common/admin/findPublisher').then(data => {
                this.publisherList = data.data;
            });
        },
        methods: {

            handleSubmit() {
                this.$refs.formCustom.validate((valid) => {
                    if (valid) {
                        this.$post('/blog/admin/addComment', this.tableData).then(data => {
                            this.$router.push({
                                name: 'commentList',
                                query: {id: this.$route.query.id}
                            })
                        })
                    }
                })
            },
            handleDateChange(date) {
                this.tableData.publishTime = date;
            },
            turnBack() {
                this.$router.push({
                    name: 'commentList',
                    query: {id: this.$route.query.id}
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
        textarea {
            border: 1px solid #e8eaec;
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