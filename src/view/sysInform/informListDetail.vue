<template>
    <Card>
            <table border="1" cellspacing="0">
                <tr>
                    <td colspan="2" class="title">通知详细</td>
                </tr>
               <tr>
                   <td>通知时间:</td>
                   <td>{{tableData.createTime|formatWithhour}}</td>
               </tr>
                <tr>
                    <td>标题:</td>
                    <td>{{tableData.title}}</td>
                </tr>
                <tr>
                    <td>内容:</td>
                    <td>{{tableData.content}}</td>
                </tr>
                <tr>
                    <td>通知对象:</td>
                    <td>
                        <span>指定城市：{{tableData.cityNames}}</span>
                        <span> 指定用户对象：{{tableData.userLevels}}</span>
                    </td>
                </tr>

            </table>
            <div class="button-group">
                <Button type="primary" @click="turnBack">返回</Button>
            </div>

    </Card>
</template>

<script>
    export default {
        name: "informListDetail",
        data(){
            return{
                tableData:{
                    createTime:'',
                    title:'',
                    content:'',
                    userLevels :'',
                    cityNames :''
                }
            }
        },
        mounted() {
            this.id=this.$route.query.id;
            this.fetchData();
        },
        methods:{
            fetchData(){
                this.$get(`/systemNotification/admin/${this.$route.query.id}/detail`).then((data) => {
                      this.tableData = data.data;
                        if(this.tableData.cityNames){
                            let newArr=this.tableData.cityNames.map(() =>{
                                 return this.tableData.cityNames.join(',');
                            })
                            this.tableData.cityNames=newArr.join(',');
                        }else{
                            this.tableData.cityNames='全国'
                        }

                      if(this.tableData.userLevelList){
                          let arr =  this.tableData.userLevelList.map( (item) => {
                              if(item.indexOf('normal')>-1) return '普通会员';
                              if(item.indexOf('partner')>-1) return '城市合伙人';
                              if(item.indexOf('famous')>-1) return '认证名厨';
                              // if(item.indexOf('official')>-1)return '全部会员';
                          });
                          this.tableData.userLevels = arr.join(',');
                      }else{
                          this.tableData.userLevels = '全部会员'
                      }
                })
            },
            turnBack() {
                this.$router.push({
                    name: 'informList'
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
        tr:nth-child(1) {
            background: #f8f8f9;
            font-size: 16px;
            border: 1px solid #e8eaec;
        }
        td {
            padding: 10px 0;
            text-align: left;
            padding-left: 10px;
            span{display:block;}
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