<template>
    <Card>
        <Form :model="form" :rules="ruleValidate" ref="form" :label-width="80" >
                <div class="card">
                    <Card dis-hover >
                        <div class="ivu-card-head">
                            <p slot="title">角色信息</p>
                        </div>

                        <div class="card_form_input">
                            <FormItem label="角色名" prop="roleName" >
                                <Input v-model.trim="form.roleName" placeholder="请输入角色名" clearable />
                            </FormItem>
                            <FormItem label="角色说明" prop="roleInfo">
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
                            <CheckboxGroup v-model="checkAllGroup" style="border-color:#000;">
                                <table width="100%">
                                    <tbody >
                                    <tr v-for="(items,index) in options"  >
                                        <td width="30%" class="genre" >
                                            <div >
                                                {{items[0].genre}}
                                            </div>
                                        </td>
                                        <td width="30%" class="name" >
                                            <div v-for="(item ,index) in items" v-if="items.length !==1">
                                                {{item.name}}
                                            </div>
                                        </td>
                                        <td width="40%" class="checkLabox" >
                                            <div v-for="(item,id) in items" :key="id" >
                                                <Checkbox :label="item.id" class="vcheck">
                                                    <Icon></Icon>
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
    export default {
        name:'addUser',
        data() {
            return {
                form: {
                    id:'',
                    roleName: '',
                    roleInfo:'',
                    privilegeIds:'',
                },
                roleList:{
                    page:1,
                    size:999
                },
                ruleValidate:{
                    roleName:[{required:true,message:'角色名不能为空',trigger:'blur'},],
                },
                options:[],
                checkAllGroup:[],
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData(){
                //角色权限列表
            this.$get('/Role/admin/privilegesList').then( (data) => {

                  if(data.data.id !== ''){
                      const groupList = this.groupBy(data.data,function (item) {
                          return [item.genre];
                      });
                      this.options =  groupList;

                  }
                })
            },
            //提交
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    this.form.privilegeIds = this.checkAllGroup.toString();
                        this.$post('/Role/admin/txAddRole',this.form).then(() => {
                           this.$router.push({
                               name:'roleDesign'
                           })
                        })
                    }
                })
            },
            // 分组
            groupBy(array, f) {
                const groups = {};
                array.forEach(function (o) {
                    const group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
<style scoped lang="less">
   .ivu-form-item{margin:26px 0!important;}
   .ivu-card-head{background-color:#e8eaec!important;text-align:left!important;}
    table {
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
</style>

<style>
    .vcheck .ivu-checkbox-inner{border: 1px solid gray;}
    .card_form_input{width:600px;margin:0 auto;}
</style>