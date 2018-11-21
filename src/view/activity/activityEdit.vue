<template>
    <Card>
        <Form ref="formCustom" :model="tableData" :rules="ruleCustom">

            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2">活动新增:</td>
                </tr>
                <tr>
                    <td>封面图片:</td>
                    <td>
                        <FormItem prop="coverImage">
                            <upload-img :imgName="tableData.coverImage"
                                        @fetchImgUrl="uploadCoverImage"
                                        @removeImgUrl="removeCoverImage"
                                        v-model="tableData.coverImage" :status="false"></upload-img>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>标题:</td>
                    <td>
                        <FormItem prop="title">
                            <Input v-model="tableData.title" :maxlength="20"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>活动时间:</td>
                    <td>
                        <div style="display: flex;">
                            <FormItem prop="activityStartStr">
                                <DatePicker type="datetime" placeholder="活动开始日期" style="width: 150px"
                                            format="yyyy-MM-dd HH:mm"
                                            :value="tableData.activityStartStr"
                                            @on-change="activityDateStarChange"
                               ></DatePicker>
                            </FormItem>
                            <span style="align-items: center;display: flex">至</span>
                            <FormItem prop="activityEndStr">
                                <DatePicker type="datetime" placeholder="活动结束日期" style="width: 150px"
                                            format="yyyy-MM-dd HH:mm"
                                            :value="tableData.activityEndStr"
                                            @on-change="activityDateEndChange"
                                            :options="options"></DatePicker>
                            </FormItem>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>报名时间:</td>
                    <td>
                        <div style="display: flex;">
                            <FormItem prop="enrollStartStr">
                                <DatePicker type="datetime" placeholder="报名开始日期" style="width: 150px"
                                            format="yyyy-MM-dd HH:mm"
                                            :value="tableData.enrollStartStr"
                                            @on-change="enrollDateStartChange"></DatePicker>
                            </FormItem>
                            <span style="align-items: center;display: flex">至</span>
                            <FormItem prop="enrollEndStr">
                                <DatePicker type="datetime" placeholder="报名结束日期" style="width: 150px"
                                            format="yyyy-MM-dd HH:mm"
                                            :value="tableData.enrollEndStr"
                                            @on-change="enrollDateEndChange"
                                            :options="options1"></DatePicker>
                            </FormItem>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>活动类型:</td>
                    <td>
                        <FormItem prop="activityType">
                            <Select v-model="tableData.activityType" style="width: 200px">
                                <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>地点:</td>
                    <td>
                        <div style="display: flex">
                            <!--<FormItem prop="city">-->
                                <Select v-model="tableData.city" style="width:160px;margin-right:10px;" label-in-value @on-change="cityChange" filterable clearable>
                                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{item.value}}</Option>
                                </Select>
                            <!--</FormItem>-->
                        </div>
                        <FormItem prop="activityAddress" v-if="tableData.city">
                            <Input v-model="tableData.activityAddress" placeholder="请填写详细地址"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>费用:</td>
                    <td>
                        <FormItem prop="usePoint">
                            <Input v-model="tableData.usePoint" style="width: 200px"/><span>积分</span>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>活动人数:</td>
                    <td>
                        <Input v-model="tableData.maxParticipator"/>
                    </td>
                </tr>
                <tr>
                    <td>活动介绍:</td>
                    <td>
                        <Input v-model="tableData.describe" :maxlength="500" type="textarea"/>
                    </td>
                </tr>
                <tr>
                    <td>发布人:</td>
                    <td>
                        <Select v-model="tableData.userId"  placeholder="不选则为全国" clearable>
                            <Option v-for="item in publisher" :value="item.restaurantId" :key="item.restaurantId">{{item.userName }}</Option>
                        </Select>

                    </td>
                </tr>
                <tr>
                    <td>发布时间:</td>
                    <td>
                        <FormItem prop="publishDateStr">
                            <DatePicker type="datetime" placeholder="发布日期" style="width: 150px"
                                        format="yyyy-MM-dd HH:mm"
                                        :value="tableData.publishDateStr"
                                        @on-change="publishDateChange"></DatePicker>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>报名表单设置:</td>
                    <td>
                        <CheckboxGroup v-model="checkAllGroup">
                            <Checkbox label="姓名" disabled>
                            </Checkbox>
                            <Checkbox label="手机" disabled>
                            </Checkbox>
                            <Checkbox label="邮箱">
                            </Checkbox>
                            <Checkbox label="所属地">
                            </Checkbox>
                            <Checkbox label="就职餐厅">
                            </Checkbox>
                            <Checkbox label="年龄">
                            </Checkbox>
                            <Checkbox label="性别">
                            </Checkbox>
                        </CheckboxGroup>
                    </td>
                </tr>
                <tr>
                    <td>需要人工审核:</td>
                    <td>
                        <Checkbox @on-change="handleCheck" v-model="tableData.needApproval">
                            <span>勾选本项，则所有报名者需要经过管理员审核；如开放式报名，则不勾选。</span>
                        </Checkbox>
                    </td>
                </tr>
                <tr>
                    <td>是否置顶：</td>
                    <td>
                        <Select v-model.trim="tableData.topFlag " style="width: 200px">
                            <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select></td>
                    </td>
                </tr>
            </table>

            <div class="button-group">
                <Button type="primary" @click="handleSubmit">保存</Button>
                <Button type="primary" @click="turnBack">返回</Button>
            </div>
        </Form>
    </Card>
</template>

<script>
    import uploadImg from '@/components/uploadImg'

    export default {
        name: "activityEdit",
        components: {
            uploadImg,
        },
        data() {
            const _this = this;
            const usePoint = (rule, value, callback) => {
                if (value === '') {
                    callback();
                } else {
                    let reg = /^[0-9]*$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入整数'));
                    }
                    callback();
                }
            };
            return {
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() < _this.$moment(_this.tableData.activityStartStr).valueOf();
                    }
                },
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() < _this.$moment(_this.tableData.enrollStartStr).valueOf();
                    }
                },
                list: [
                    {label: '全部类型', value: -1},
                    {label: '公开课', value: 'public'},
                    {label: '发布会', value: 'publish'},
                    {label: '品鉴会', value: 'tasting'},
                    {label: '厨艺竞赛', value: 'competition'},
                    {label: '行业活动', value: 'industry'},
                    {label: '其他', value: 'other'},

                ],
                list1: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                tableData: {
                    activityAddress: '',
                    activityEndStr: '',
                    activityStartStr: '',
                    activityType: '',
                    city: '',
                    coverImage: 'default',
                    describe: '',
                    enrollEndStr: '',
                    enrollItem: '',
                    enrollStartStr: '',
                    id: '',
                    maxParticipator: '',
                    needApproval: 0,
                    publishDate: '',
                    userName: '',
                    title: '',
                    usePoint: '',
                    publisher:'',
                    topFlag:0,
                    userId:null,
                },
                publisher: [],
                cityList:[],
                checkAllGroup: ['姓名', '手机'],
                ruleCustom: {
                    coverImage: [
                        {required: true, trigger: 'change', message: "不能为空"}
                    ],
                    title: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    activityStartStr: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    activityEndStr: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    enrollStartStr: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    enrollEndStr: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    activityType: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    activityAddress: [
                        {required: true, trigger: 'blur', message: "不能为空"}
                    ],
                    usePoint: [
                        {validator:usePoint,trigger: 'blur', type: 'number'}
                    ],
                    city:[
                        {required: true, trigger: 'change', message: "不能为空"}
                    ]
                }
            }
        },
        mounted() {
            this.$get(`/activity/admin/detail/${this.$route.query.id}`).then(data=>{
                this.tableData = data.data;
                this.tableData.userId =  parseInt(this.tableData.userId)
                this.tableData.needApproval === 0?this.tableData.needApproval = false:this.tableData.needApproval = true;
                this.checkAllGroup = this.tableData.enrollItem.split(",");
                this.tableData.activityEndStr= this.$moment( this.tableData.activityEnd).format('YYYY-MM-DD HH:mm');
                this.tableData.activityStartStr = this.$moment( this.tableData.activityStart).format('YYYY-MM-DD HH:mm');
                this.tableData.enrollEndStr = this.$moment( this.tableData.enrollEnd).format('YYYY-MM-DD HH:mm');
                this.tableData.enrollStartStr = this.$moment( this.tableData.enrollStart).format('YYYY-MM-DD HH:mm');
                this.tableData.publishDateStr = this.$moment( this.tableData.publishDate).format('YYYY-MM-DD HH:mm');
            });

            this.$get('/Common/admin/findPublisher').then(data => {
                this.publisher = data.data;
            });
            this.$get(`/area/getCity`).then((data)=>{
                let result = data.data.map(o=>{
                    return {value:o.cityName,label:o.cityName}
                });
                this.cityList=result;
            });

        },

        methods: {
            handleSubmit() {
                this.tableData.enrollItem = this.checkAllGroup.toString();
                this.tableData.needApproval === false?this.tableData.needApproval = 0:this.tableData.needApproval = 1;
                //非正统验证图片上传
                if (this.tableData.coverImage === 'default') {
                    this.tableData.coverImage = ''
                }
                this.$refs.formCustom.validate((valid) => {
                    if (valid) {
                        this.$put(`/activity/admin/edit/${this.$route.query.id}`, this.tableData).then(()=>{
                            this.$router.push({
                                name:'activityList'
                            })
                        })
                    }
                })
            },
            uploadCoverImage(evtValue) {
                this.tableData.coverImage = evtValue;
            },
            activityDateStarChange(date) {
                this.tableData.activityStartStr = date;
            },
            activityDateEndChange(date) {
                this.tableData.activityEndStr = date;
            },
            enrollDateStartChange(date) {
                this.tableData.enrollStartStr = date;
            },
            enrollDateEndChange(date) {
                this.tableData.enrollEndStr = date;
            },
            publishDateChange(date) {
                this.tableData.publishDateStr = date;
            },
            turnBack() {
                this.$router.push({
                    name:'activityList'
                })
            },
            handleCheck(param){
                if(param){
                    this.tableData.needApproval = 1
                }else{
                    this.tableData.needApproval = 0
                }
            },
            removeCoverImage() {
                    this.tableData.coverImage = 'default'
            },
            cityChange(params){
                if(params){
                    this.tableData.city = params.label;
                }
            },
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
        /*border-collapse: collapse;*/
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
            border-bottom: 0;
        }
        td:nth-child(2n+1) {
            width: 20%;
            border-right:0 ;
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