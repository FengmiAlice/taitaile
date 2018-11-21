<template>
    <Card>
        <Form ref="formCustom" :model="tableData" :rules="ruleCustom">

        <table border="1" cellspacing="0">
        <tr>
            <td colspan="2">问题编辑:</td>
        </tr>
        <tr>
            <td>问题:</td>
            <td >
                <FormItem  prop="question">
                <Input v-model="tableData.question" />
                </FormItem>
            </td>
        </tr>
        <tr>
            <td>问题详述:</td>
            <td>
                <FormItem  prop="content">
                <Input v-model="tableData.content"  :maxlength="200" type="textarea"/>
                </FormItem>
            </td>

        </tr>
        <tr>
            <td>发布人:</td>
            <td >{{tableData.questionerName}}</td>

        </tr>
        <tr>
            <td >发布时间:</td>
            <td >
                <FormItem  prop="publishTime">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="tableData.publishTime" @on-change="handleDateChange" :options="options"></DatePicker>
                </FormItem>
            </td>
        </tr>

        <tr>
            <td>回答数:</td>
            <td>{{tableData.answerCount}}</td>
        </tr>
        <tr>
            <td>是否热门:</td>

            <td >
            <Select v-model="tableData.hot"  style="width: 200px">
                <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </td>

        </tr>
    </table>

        <div class="button-group">
            <Button type="primary" @click="handleSubmit" >保存</Button>
            <Button type="primary" @click="turnBack"> 返回</Button>
        </div>
        </Form>
    </Card>
</template>

<script>
    export default {
        name: "faqEdit",
        data(){
            return {
                options:{
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData:{
                    agreeCount:'',
                    answerCount:'',
                    collectCount:'',
                    content:'',
                    createTime:'',
                    editPerson:'',
                    hot:0,
                    hotTime:'',
                    id:null,
                    images:'',
                    publishTime:'',
                    question:'',
                    questioner:'',
                    shareCount:'',
                    status:'',
                    updateTime:'',
                    questionerName:''
                },
                list: [
                {label: '是', value: 1},
                {label: '否', value: 0}
              ],
                ruleCustom:{
                    question: [
                        { required: true, message: '问题不能为空', trigger: 'blur' }
                    ],
                    content:[
                        { required: true, message: '问题详述不能为空', trigger: 'blur' }
                    ],
                    questioner:[
                        { required: true, message: '发布人不能为空', trigger: 'blur' }
                    ],
                    publishTime:[
                        { required: true, message: '发布时间不能为空', trigger: 'blur' }
                    ],
                },
            }
        },
        mounted(){

                this.$get(`/question/admin/${this.$route.query.id}/detail`).then((data)=>{
                    this.tableData = data.data;
                    this.tableData.publishTime = this.$moment(this.tableData.publishTime).format('YYYY-MM-DD HH:mm');
                })
        },

            methods:{
                handleSubmit(){
                    this.$refs.formCustom.validate((valid) => {
                        if (valid) {
                            this.$post('/question/admin/edit',{content:this.tableData.content,hot:this.tableData.hot,id:this.tableData.id,publishTime:  this.tableData.publishTime,question:this.tableData.question}).then((data)=>{
                            if(data.code === 0){
                                this.$router.push({
                                  name:'faqList'
                                })
                            }

                            })

                        } else {
                            this.$Message.error('请完善信息');
                        }
                    });
                },
                handleDateChange(time){
                  this.tableData.publishTime =  time
                },
                turnBack(){
                    this.$router.push({
                        name:'faqList'
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
        td:nth-child(1){
            width: 20%;
        }

    }

    .button-group {
        background: #fff;
        padding: 20px 0;
    .ivu-btn{
        margin-right: 10px;
    }
    }
</style>
