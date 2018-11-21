<template>
    <Card>
        <Form ref="formCustom" :model="tableData.blog" :rules="ruleCustom">
            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">厨艺秀编辑</td>
                </tr>
                <tr>
                    <td>封面图片：</td>
                    <td>
                        <FormItem prop="coverImage">
                            <upload-img :imgName="tableData.blog.coverImage"
                                        @fetchImgUrl="uploadCoverImage"
                                        @removeImgUrl="removeCoverImage"
                                        v-model="tableData.blog.coverImage" :status="$route.query.state"></upload-img>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>食谱名：</td>
                    <td>
                        <FormItem prop="title">
                            <Input v-model="tableData.blog.title" :maxlength='20'/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>食谱描述：</td>
                    <td>

                        <Input v-model="tableData.blog.describe" :maxlength='200' type="textarea"/>
                    </td>
                </tr>
                <tr v-if="pageType === 'video'">
                    <td> 步骤视频：</td>
                    <td>
                        <FormItem prop="video" v-if="true">
                            <upload-video :videoName="tableData.blog.video"
                                          @fetchImgUrl="uploadVideo"
                                          v-model="tableData.blog.video" :status="$route.query.state"></upload-video>
                        </FormItem>
                    </td>
                </tr>
                <tr v-if="pageType === 'video'">
                    <td>详细描述：</td>
                    <td>
                        <Input v-model="tableData.blog.makeStep" :maxlength='200' type="textarea"/>
                    </td>
                </tr>
                <tr>
                    <td> 发布人：</td>
                    <td>{{tableData.restaurantVo.userName}}</td>
                </tr>
                <tr>
                    <td>发布时间：</td>
                    <td>
                        <FormItem prop="publishDateStr">
                            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :value="tableData.blog.publishDateStr"
                                        @on-change="handleDateChange" :options="options"></DatePicker>
                        </FormItem>
                    </td>
                </tr>

                <tr>
                    <td>是否置顶：</td>
                    <td>
                        <Select v-model="tableData.blog.topBlog " style="width: 200px">
                            <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select></td>
                </tr>
            </table>

            <table border="1" cellspacing="0" v-if="pageType === 'image'">

                <tr>
                    <td colspan="5">食材 <a style="float:right;margin-right: 10px;" @click="addList">增加</a></td>
                </tr>
                <tr v-for="(item,index) in tableData.ingredient" :key="index">

                    <td>食材{{index+1}}：</td>
                    <td>
                        <Input v-model="item.food" :maxlength="20"/>
                    </td>
                    <td>用量{{index+1}}：</td>
                    <td>
                        <Input v-model="item.quantity" :maxlength="20"/>
                    </td>
                    <td style="text-align: center"><a @click="deleteList(index)">删除</a></td>
                </tr>
            </table>

            <table border="1" cellspacing="0" v-if="pageType === 'image'">


                <tr>
                    <td colspan="5">调料<a style="float:right;margin-right: 10px;" @click="addList1">增加</a></td>
                </tr>
                <tr v-for="(item,index) in tableData.seasoning">
                    <td>食材{{index+1}}：</td>
                    <td>
                        <Input v-model="item.food"/>
                    </td>
                    <td>用量{{index+1}}：</td>
                    <td>
                        <Input v-model="item.quantity"/>
                    </td>
                    <td style="text-align: center"><a @click="deleteList1(index)">删除</a></td>
                </tr>
            </table>


            <table border="1" cellspacing="0" v-if="pageType === 'image'">

                <tr>
                    <td colspan="2">烹饪步骤</td>
                </tr>
                <tr>
                    <td> 烹饪步骤：</td>
                    <td>
                        <Input v-model="tableData.blog.makeStep" :maxlength="200" type="textarea"/>
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

    import uploadImg from '@/components/uploadImg'
    import uploadVideo from '@/components/uploadVideo'


    export default {
        name: "edit",
        components: {
            uploadImg,
            uploadVideo
        },

        data() {
            return {
                status: null,
                pageType: null,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                list: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                tableData: {
                    blog: {
                        active: '',
                        agreeCount: '',
                        approvalDate: '',
                        approvalStatus: '',
                        approvalUser: '',
                        blogType: '',
                        commentCount: '',
                        coverImage: '',
                        createTime: '',
                        describe: '',
                        id: '',
                        makeStep: '',
                        originId: '',
                        publishDateStr: '',
                        publisher: '',
                        shareCount: '',
                        title: '',
                        topBlog: '',
                        topDate: '',
                        updateTime: '',
                        video: ''
                    },
                    ingredient: [{
                        createTime: '',
                        food: '',
                        id: '',
                        materialType: '',
                        quantity: '',
                        recipesId: '',
                        updateTime: ''
                    }],
                    seasoning: [{
                        createTime: '',
                        food: '',
                        id: '',
                        materialType: '',
                        quantity: '',
                        recipesId: '',
                        updateTime: ''
                    }],
                    isFavor: 0,
                    publishAfter: null,
                    restaurantVo: {
                        userName: '',
                        customerType: null,
                        hubWeixinHead: null,
                        restaurantName: null
                    }
                },
                ruleCustom: {
                    blog: {
                        type: "object", required: true,
                        // fields:{

                        // }
                    },
                    title: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                        ],
                    coverImage: [
                        {required: true, trigger: 'change', message: "不能为空"}
                    ],
                    describe: [
                        {required: true, trigger: 'blur', message: "不能为空",}
                    ],
                    video: [
                        {required: true, trigger: 'change', message: "不能为空"}
                    ],
                    publisher: [
                        {required: true, trigger: 'blur', message: "不能为空", type: 'number'}
                    ],
                    publishDateStr: [
                        {required: true, trigger: 'blur', message: "不能为空", type: 'string'}
                    ],
                    makeStep: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    food: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ]
                }
            }
        },
        mounted() {
            this.pageType = this.$route.query.pageType;
            this.status = this.$route.query.status;

            if (!this.$route.query.state) {
                this.$get(`/blog/admin/detail/${this.$route.query.id}`).then(data => {
                    this.tableData = data.data;
                    this.tableData.blog.publishDateStr = this.$moment(this.tableData.blog.publishDateStr).format('YYYY-MM-DD HH:mm');

                })
            }
        },
        methods: {
            handleSubmit() {
                if (!this.$route.query.state) {
                    this.$refs.formCustom.validate((valid) => {
                        if (valid) {
                            this.$put(`/blog/admin/edit/${this.$route.query.id}`, this.tableData).then(() => {
                                this.$router.push({
                                    name: 'cookingList'
                                })
                            })
                        }
                    })
                }
            },
            uploadCoverImage(evtValue) {
                this.tableData.blog.coverImage = evtValue;
            },
            uploadVideo(evtValue) {
                this.tableData.blog.video = evtValue;
            },
            handleDateChange(time) {
                this.tableData.blog.publishDateStr = time
            },
            addList() {
                this.tableData.ingredient.push({
                    // createTime: '',
                    food: '',
                    // id: '',
                    // materialType: '',
                    quantity: '',
                    // recipesId: '',
                    // updateTime: ''
                })
            },
            deleteList(index) {
                if (this.tableData.ingredient.length > 1) {
                    this.tableData.ingredient.splice(index, 1)
                }
            },
            addList1() {
                this.tableData.seasoning.push({
                    // createTime: '',
                    food: '',
                    // id: '',
                    // materialType: '',
                    quantity: '',
                    // recipesId: '',
                    // updateTime: ''
                })
            },
            deleteList1(index) {

                if (this.tableData.seasoning.length > 1) {
                    this.tableData.seasoning.splice(index, 1)
                }
            },
            turnBack() {
                this.$router.push({
                    name: 'cookingList'
                })
            },
            removeCoverImage() {
                this.tableData.blog.coverImage = ''
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

    }

    .button-group {
        background: #fff;
        padding: 20px 0;
        .ivu-btn {
            margin-right: 10px;
        }
    }
</style>
