<template>
    <Card>
        <Form ref="formCustom" :model="tableData" :rules="ruleCustom" >

            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">通知新增</td>
                </tr>
                <tr>
                    <td> 标题</td>
                    <td>
                        <FormItem prop="notificationTitle">
                            <Input v-model="tableData.notificationTitle" placeholder="请输入标题" />
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>内容：</td>
                    <td>
                        <FormItem prop="notificationContent">
                            <Input type="textarea" v-model="tableData.notificationContent" :maxlength="200"/>
                        </FormItem>
                    </td>
                </tr>
                <tr>
                    <td>通知对象：</td>
                    <td>
                        <FormItem>
                            <div style="float:left;width:100px;">指定城市</div>
                            <div style="float:left;">
                                <Tag v-for="(item,index) in tagList" :key="index" :name="item.label" closable style="float:left;"
                                     @on-close="handleClose(item.value,item.label)">{{item.label}}</Tag>
                                <!--所在城市-->
                                <Select v-model="tableData.provinceId " style="clear:both;float:left;width:200px;margin-right:10px;"
                                        @on-change="provinceChange" :label-in-value="true">
                                    <Option v-for="item in provinceList" :value="item.provinceId" :key="item.provinceId">{{item.provinceName}}</Option>
                                </Select>

                                <Select v-model="tableData.cityId" style="float:left;width:220px;margin-right:10px;"
                                        @on-change="cityChange" :label-in-value="true" ref="cityList"  placeholder="不选择城市通知对象为全部城市">
                                    <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{item.cityName}}</Option>
                                </Select>
                            </div>
                        </FormItem>

                        <FormItem>
                            <div style="float:left;width:100px;">指定用户对象</div>
                            <div style="float:left;">
                               <Tag v-for="(item,index) in chaList" :key="index" :name="item.label" closable style="float:left;"
                                    @on-close="chaClose(item.value,item.label)"> {{item.label}}
                               </Tag>
                               <Select v-model.trim="tableData.id" style="clear:both;float:left;margin-right:10px;"
                                       @on-change="userChange" :label-in-value="true" placeholder="不选择用户对象通知对象为全部通知对象">
                                   <Option v-for="item in cusList" :value="item.value" :key="item.label">{{ item.label }}
                                   </Option>
                               </Select>
                            </div>
                        </FormItem>
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
    export default {
        name: "informListAdd",
        data() {
            return {
                tagList: [],
                chaList: [],
                provinceList: [],
                cityList: [],
                tableData:
                    {
                        ids: [],
                        notificationContent: "",
                        notificationTitle:"",
                        userLevels: []
                    },
                cusList: [
                    {label: '普通会员', value: 'normal'},
                    {label: '城市合伙人', value: 'partner'},
                    {label: '认证名厨', value: 'famous'},
                    {label: '全部会员', value: ''},
                ],
                searchData: {},
                ruleCustom: {
                    notificationContent: [{validator: '', trigger: 'blur', message: '输入内容不能为空'}]
                }
            }
        },
        mounted() {
            this.$get('/area/province').then(data => {
                this.provinceList = data.data;
            });
        },
        methods: {
            handleSubmit() {
                if(this.tableData.notificationTitle === ''){
                    this.$Modal.confirm({
                        title:'提示',
                        content:'<p>请输入标题</p>',
                    })
                }else if (this.tableData.notificationContent === '') {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>请输入新增的内容</p>',
                    })
                } else {
                    this.$refs.formCustom.validate((valid) => {
                        if (valid) {
                            this.tableData.ids = Array.from(new Set(this.tableData.ids));
                            this.tableData.userLevels = Array.from(new Set(this.tableData.userLevels));

                            this.$post('/systemNotification/admin/add', this.tableData).then((data) => {
                                this.$router.push({
                                    name: 'informList'
                                })
                            })
                        }
                    })
                }
            },
            handleDateChange(date){
                this.tableData.publishTime = date;
            },
            // 省市的删除
            handleClose(id, label) {
                // console.log(id,label);
                const index = this.tagList.indexOf(label);
                this.tagList.splice(index, 1);
                const index1 = this.tableData.ids.indexOf(id);
                this.tableData.ids.splice(index1, 1);
            },

            // 用户对象的删除
            chaClose(id, label) {
                const index = this.chaList.indexOf(id);
                this.chaList.splice(index, 1);
                const index1 = this.tableData.userLevels.indexOf(id);
                this.tableData.userLevels.splice(index1, 1);
            },

            turnBack() {
                this.$router.push({
                    name: "informList"
                })
            },
            // 省份变化
            provinceChange(params) {
                //筛选直辖市、港澳台地区,后面的城市不用选
                switch (params.value) {
                    case 30 :
                        this.tagList.push({value: params.value, label: params.label});
                        // this.cityList.splice(0, this.cityList.length);
                        this.tableData.ids.push(`p${params.value}`);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    case  9 :
                        this.tagList.push({value: params.value, label: params.label});
                        this.tableData.ids.push(`p${params.value}`);
                        // this.cityList.splice(0, this.cityList.length);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    case  7 :
                        this.tagList.push({value: params.value, label: params.label});
                        this.tableData.ids.push(`p${params.value}`);
                        // this.cityList.splice(0, this.cityList.length);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    case  5 :
                        this.tagList.push({value: params.value, label: params.label});
                        this.tableData.ids.push(`p${params.value}`);
                        // this.cityList.splice(0, this.cityList.length);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    case 27:
                        this.tagList.push({value: params.value, label: params.label});
                        this.tableData.ids.push(`p${params.value}`);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    case 16:
                        this.tagList.push({value: params.value, label: params.label});
                        this.tableData.ids.push(`p${params.value}`);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    case 11:
                        this.tagList.push({value: params.value, label: params.label});
                        this.tableData.ids.push(`p${params.value}`);
                        this.$refs.cityList.$el.style.display = 'none';
                        break;
                    default:
                        this.$refs.cityList.$el.style.display = 'inline-block';
                        this.$get('/area/city', {provinceId: params.value}).then(data => {
                            this.cityList = data.data;
                        });
                }
            },
            // 城市改变
            cityChange(params) {
                this.tableData.ids.push(`c${params.value}`);
                this.tagList.push({value: params.value, label: params.label});
                //数组对象去重
                let hash = {};
                const newArr = this.tagList.reduceRight((item, next) => {
                    hash[next.value] ? '' : hash[next.value] = true && item.push(next);
                    return item
                }, []);
                this.tagList = newArr;

            },
            // 用户改变
            userChange(params){
                this.tableData.userLevels.push(`${params.value}`);
                this.chaList.push({value: params.value, label: params.label});
                //数组去重
                let hash={};
                const newArr=this.chaList.reduceRight((item,next)=>{
                    hash[next.value]?'':hash[next.value] = true && item.push(next);
                    return item
                },[])
                this.chaList=newArr;
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
        border-collapse: collapse;
        border: 1px solid #e8eaec;
        tr {
            border: 1px solid #e8eaec;
            td{
                padding: 10px 0;
                text-align: left;
                padding-left: 10px;
                border: 1px solid #e8eaec;
                .ivu-form-item{
                    width:100%;
                    .ivu-form-item-content{
                        margin-left: 0!important;
                        float:left;
                        textarea {
                            width: 570px;
                            height: 138px;
                            border: 1px solid #e8eaec;
                        }
                    }
                }
            }
        }
        tr:nth-child(1) {
            background: #f8f8f9;
            font-size: 16px;
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
    .ivu-form-item-content{margin-left: 0!important;}
</style>