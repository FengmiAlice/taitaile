<template>
    <Card>
        <Form :model="form" :rules="ruleValidate" ref="form" :label-width="80" >
            <div class="card">
                <Card dis-hover>
                   <div class="ivu-card-head">
                       <p slot="title">角色信息</p>
                   </div>
                    <div class="card_form_input">
                        <FormItem label="角色名" prop="roleName">
                            <Input v-model.trim="form.roleName" placeholder="请输入角色名" clearable />
                        </FormItem>
                        <FormItem label="角色说明">
                            <Input v-model.trim="form.roleInfo" placeholder="请输入角色说明" clearable />
                        </FormItem>
                    </div>
                </Card>
            </div>

            <div class="card" style="margin-top:30px;">
                <Card dis-hover>
                    <div class="ivu-card-head">
                        <p slot="title">权限配置</p>
                    </div>

                    <FormItem prop="privilegeIds">
                        <CheckboxGroup    v-model="checkAllGroup" >
                            <table width="100%"  border="1" >
                                <tbody>
                                <tr v-for="(items,index) in options" >
                                    <td width="30%" class="genre">
                                        <div >
                                            {{items[0].genre}}
                                        </div>
                                    </td>
                                    <td width="30%" class="name" >
                                        <div   v-if="items.length !==1" v-for="(item,index) in items">
                                        {{item.name}}
                                        </div>
                                    </td>
                                    <td width="40%" >
                                        <div v-for="(item,id) in items" :key="id" >
                                        <Checkbox :label="item.id" class="vcheck">
                                            <Icon ></Icon>
                                            <span></span>
                                        </Checkbox>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </CheckboxGroup>
                    </FormItem>
                </Card>
            </div>

            <div class="action_row">
                <Button type="primary" @click="handleSubmit('form')" style="margin:30px;">确定</Button>
                <Button @click="() => {this.$router.go(-1)}">取消</Button>
            </div>
        </Form>

    </Card>


</template>
<script>
    export default{
        data(){
            return{
                form:{
                   roleName:'',
                    roleInfo:'',
                    privilegeIds:'',
                    // id:''
                },
                options:{},
                ruleValidate:{
                    roleName:[{required:true,message:'角色名不能为空',trigger:'blur'}],
                },
                checkAllGroup:[],
            }
        },
        methods:{
            initData(){
                //角色信息详情列表
                this.$get(`/Role/admin/${this.$route.query.id}/detail`).then((data)=>{
                    if(data.data.privilegeIds !==''){
                        let arr = data.data.privilegeIds.split(",");//分隔字符串
                        this.checkAllGroup = arr.map(i=>{
                            return parseInt(i)//string类型转换为int类型
                        })
                    }
                    this.form=data.data;
                });

                //角色权限列表
                this.$get('/Role/admin/privilegesList').then( (data) => {
                    const groupList = this.groupBy(data.data,function (item) {
                        return [item.genre];
                    });
                    this.options =  groupList;


                })
            },
            handleSubmit(name){
                this.form.privilegeIds = this.checkAllGroup.toString();

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$put(`/Role/admin/txUpdate`,this.form).then((data)=>{
                                this.$router.push({
                                    name:'roleDesign'
                                })
                        })
                    }
                })
            },
            //分组
            groupBy(array, f) {
                const groups = {};
                array.forEach(function (o){
                    //过滤相同的字段名
                    const group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);

                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];

                });
            },

        },
        mounted(){
            this.initData()
            this.form.privilegeIds=this.$route.query.id;
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
            text-align:center;
        }
        td {
            padding: 10px 0;
            text-align: left;
            padding-left: 10px;
            border: 1px solid #e8eaec;
            text-align:center;
        }
        td:nth-child(2n+1) {
            width: 20%;
        }
        textarea{
            border: 1px solid #e8eaec;
        }
    }
    .ivu-form-item{margin:26px 0!important;}
    .ivu-card-head{background-color:#e8eaec!important;text-align:left!important;}
</style>
<style>
    .vcheck .ivu-checkbox-inner{border: 1px solid gray;}
    .card_form_input{width:600px;margin:0 auto;}
</style>