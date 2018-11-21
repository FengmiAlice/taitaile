<template>
    <Card>
        <div class="button-group" >
            <Button class="add-btn" type="primary" @click="addRole" >添加角色</Button>
        </div>

        <Table border :columns="columns" :data="roleData">

        </Table>

        <Page :total="total" show-total show-sizer  @on-change="pageChange"  @on-page-size-change="sizeChange">

        </Page>
    </Card>
</template>
<script>

    export default{
        name:'userDesign',
        data(){
            return{
                roleData:[],
                pageMessage:{
                    page:1,
                    size:10
                },
                total:0,
                columns:[
                    {
                        title:'角色名',
                        key:'roleName',
                        align:'center',
                    },
                    {
                        title:'角色说明',
                        key:'roleInfo',
                        align:'center',
                    },
                    {
                        title:'操作',
                        key:'action',
                        align:'center',
                        render:( h,params)=>{
                            if(params.row.privilegeIds == "all") return
                            return h('div',[
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name:'roleEdit',
                                                query:{id:params.row.id}
                                            })
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
            }
        },
        mounted(){
            this.fetchRequest();

        },
        methods:{
            fetchRequest() {
                this.$get(`/Role/admin/list`,this.pageMessage).then((data) => {
                    this.roleData = data.data.items
                    this.total = data.data.totalNum
                })
            },
            remove(id){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$put(`/Role/admin/${id}/txDelete`).then(()=>{
                            this.fetchRequest()
                        }).catch(()=>{

                        })
                    },
                })
            },
            addRole(){
                this.$router.push({
                    name:'roleAdd'
                })
            },
            pageChange(page){
                this.pageMessage.page = page;
                this.fetchRequest()
            },
            sizeChange(size){
                this.pageMessage.size = size;
                this.fetchRequest();
            },

        }
    }
</script>
<style scoped lang="less">
    .ivu-page{text-align:right;margin-top:20px;}
    .button-group{
        padding: 20px;
        display: flex;
        justify-content: flex-start;
        background:#fff;
        .add-btn{
            display:block;
            margin-left:-18px;
        }
    }
</style>
