<template>
    <Card>
        <Form ref="formCustom" :model="tableData" :rules="ruleCustom">

            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">问题新增</td>
                </tr>
                <tr>
                    <td>问题：</td>
                    <td>
                        <FormItem prop="question">
                            <Input v-model="tableData.question" :maxlength="20"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>问题详述：</td>
                    <td>
                        <FormItem prop="content">
                            <Input v-model="tableData.content" :maxlength="200" type="textarea"/>
                        </FormItem>

                    </td>
                </tr>
                <tr>
                    <td>发布人：</td>
                    <td>
                        <FormItem prop="questioner">
                            <Select v-model="tableData.questioner" filterable>
                                <Option v-for="item in publisherList" :value="item.restaurantId"
                                        :key="item.restaurantId">{{item.userName }}</Option>
                            </Select>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td> 发布时间：</td>
                    <td>
                        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="tableData.publishTime"
                                    @on-change="handleDateChange" :options="options"></DatePicker>
                    </td>
                </tr>

                <tr>
                    <td>是否热门：</td>
                    <td>
                        <Select v-model="tableData.hot " style="width: 200px">
                            <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
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
        name: "faqAdd",
        data() {
            return {
                status: null,
                pageType: null,
                publisherList: [],
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: {
                    content: "",
                    hot: 0,
                    publishTime: "",
                    question: "",
                    questioner: null,
                },
                list: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                ruleCustom: {
                    question: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    content: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    questioner: [
                        {required: true, trigger: 'blur', message: "不能为空",type:'number'}
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
            approval(param) {
                this.$put(`/blog/admin/${param}/${this.$route.query.id}`)
            },
            handleSubmit() {
                this.$refs.formCustom.validate((valid) => {
                    if (valid) {
                        this.$post('/question/admin/askQuestion', this.tableData).then(data => {
                            if (data.code === 0) {
                                this.$router.push({
                                    name: 'faqList'
                                })
                            }
                        })
                    }
                })


            },
            handleDateChange(date) {
                this.tableData.publishTime = date;
            },
            turnBack() {
                this.$router.push({
                    name: "faqList"
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

