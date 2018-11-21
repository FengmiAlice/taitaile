<template>
    <Card>
        <table border="1" cellspacing="0">
            <tr>
                <td colspan="2" class="title">厨艺秀详情</td>
            </tr>
            <tr>
                <td>封面图片：</td>
                <td>
                    <img-magnifying :imgSrc="tableData.coverImage|imgSrc"></img-magnifying>
                </td>
            </tr>
            <tr>
                <td>食谱名：</td>
                <td>
                    {{tableData.title}}
                </td>
            </tr>
            <tr>
                <td>食谱描述：</td>
                <td>{{tableData.describe}}</td>
            </tr>
            <tr v-if="pageType === 'video'">
                <td> 步骤视频：</td>
                <td>
                    <video :src="tableData.video|imgSrc" controls="controls" style="width: 300px;height: 200px">
                    </video>
                </td>
            </tr>
            <tr v-if="pageType === 'video'">
                <td>详细描述：</td>
                <td>{{tableData.makeStep}}</td>
            </tr>
            <tr>
                <td> 发布人：</td>
                <td>{{tableData3.userName}}</td>
            </tr>
            <tr>
                <td>发布时间：</td>
                <td>{{tableData.publishDate|formatWithhour}}</td>
            </tr>
            <tr>
                <td>转发数：</td>
                <td>{{tableData.shareCount}}</td>
            </tr>
            <tr>
                <td>评论数：</td>
                <td>{{tableData.commentCount}}</td>
            </tr>
            <tr>
                <td>点赞数：</td>
                <td>{{tableData.agreeCount}}</td>
            </tr>
            <tr>
                <td>是否置顶：</td>
                <td>{{tableData.topBlog === 1? '是':'否'}}</td>
            </tr>
        </table>

        <table border="1" cellspacing="0" v-if="pageType === 'image'">
            <tr>
                <td colspan="4">食材</td>
            </tr>
            <tr v-for="(item,index) in tableData1" :key="index">

                <td>食材{{index+1}}：</td>
                <td>{{item.food }}</td>
                <td>用量{{index+1}}：</td>
                <td>{{item.quantity}}</td>
            </tr>
        </table>

        <table border="1" cellspacing="0" v-if="pageType === 'image'">
            <tr>
                <td colspan="4">调料</td>
            </tr>
            <tr v-for="(item,index) in tableData2">
                <td>食材{{index+1}}：</td>
                <td>{{item.food }}</td>
                <td>用量{{index+1}}：</td>
                <td>{{item.quantity}}</td>
            </tr>
        </table>


        <table border="1" cellspacing="0" v-if="pageType === 'image'">
            <tr>
                <td colspan="2">烹饪步骤</td>
            </tr>
            <tr>
                <td> 烹饪步骤：</td>
                <td>{{tableData.makeStep}}</td>
            </tr>
        </table>
        <div class="button-group">
            <Button type="primary" @click="approval('pass')" v-if="status === 1">审核通过</Button>
            <Button type="error" @click="approval('unpass')" v-if="status === 1">审核拒绝</Button>
            <Button type="primary" @click="turnBack">返回</Button>
        </div>
    </Card>
</template>

<script>
  import imgMagnifying from '@/components/imgMagnifying'

  export default {
    name: "details",
    components: {
      imgMagnifying,
    },
    data() {

      return {
        status: null,
        pageType: null,
        tableData: {
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
          publishDate: '',
          publisher: '',
          shareCount: '',
          title: '',
          topBlog: '',
          topDate: '',
          updateTime: '',
          video: '',
        },
        tableData1: [{
          createTime: '',
          food: '',
          id: '',
          materialType: '',
          quantity: '',
          recipesId: '',
          updateTime: ''

        }],

        tableData2: [{
          createTime: '',
          food: '',
          id: '',
          materialType: '',
          quantity: '',
          recipesId: '',
          updateTime: ''
        }],

        tableData3: [{
            customerType: '',
            hubWeixinHead: '',
            restaurantName: '',
            userName: '',

        }],

      }
    },
    mounted() {
      this.status = this.$route.query.status;
      this.pageType = this.$route.query.pageType;
        this.$get(`/blog/admin/detail/${this.$route.query.id}`).then(data => {
          this.tableData = data.data.blog;
          this.tableData1 = data.data.ingredient;
          this.tableData2 = data.data.seasoning;
          this.tableData3 = data.data.restaurantVo;
        })


    },
    methods: {
      approval(param) {
          this.$Modal.confirm({
              title: '提示',
              content: '<p>确认执行此操作吗?</p>',
              onOk: () => {
                  this.$put(`/blog/admin/${param}/${this.$route.query.id}`).then(data=>{
                      if(data.code === 0){
                          this.$router.push({
                              name: 'cookingList'
                          })
                      }
                  })

              },
          })

      },
        turnBack() {
        this.$router.push({
          name: 'cookingList'
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

        }
        td {
            padding: 10px 0;
            text-align: left;
            padding-left: 10px;
            border: 1px solid #e8eaec;
        }
        td:nth-child(2n+1) {
            width: 10%;
        }
        td:nth-child(2n){
            width: 40%;
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
