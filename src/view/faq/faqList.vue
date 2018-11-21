<template>
    <Card @keydown.enter.native="handleSearch">
        <div class="search-con search-con-top">
            <DatePicker type="daterange" split-panels placeholder="发布日期" class="search-input" @on-change="changeDate" :start-date="startDate"></DatePicker>

            <Input  clearable placeholder="问题" class="search-input"
                   v-model.trim="searchData.question"/>
            <Input  clearable placeholder="发布人" class="search-input"
                   v-model.trim="searchData.name"/>
            <Button  class="search-btn" type="primary" @click="handleSearch">
                搜索
            </Button>
            <Button @click="handleAdd" class="search-btn" type="primary">
                新增问题
            </Button>
            <Button @click="exportData" class="search-btn" type="primary">
                导出
            </Button>
        </div>
        <Table border :columns="columns" :data="tableData">
        </Table>
        <Page :total="total" show-sizer show-total style="margin-top: 20px" @on-change="pageChange" @on-page-size-change="sizeChange"/>
    </Card>
</template>

<script>
  import BASE_URL from '@/api/url'

  export default {
        name: "faqList",
        data() {
            return {
                startDate:null,
                searchData: {
                    page: 1,
                    size: 10,
                    start: null,
                    end: null,
                    name: null,
                    question: null
                },
                total: 0,
                tableData: [],
                columns: [
                    {
                        title: '问题',
                        key: 'question',
                        align:'center',
                    },


                    {
                        title: '回答数',
                        key: 'answerCount',
                        align:'center',
                    },
                    {
                        title: '发布人',
                        key: 'userName',
                        align:'center',
                    },
                    {
                        title: '是否热门',
                        key: 'hot',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    params.row.hot === 1 ? '是' : '否'
                                ]
                            )
                        }
                    },
                    {
                        title: '发布时间',
                        key: 'publishTime',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                    this.$moment(params.row.publishTime).format('YYYY-MM-DD HH:mm')
                                ]
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align:'center',
                        minWidth:120,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        display:'flex',
                                        margin:'5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {

                                            this.$router.push({
                                                name:'faqDetails',
                                                query:{id:params.row.id}
                                            })
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        display:'flex',
                                        margin:'5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name:'faqEdit',
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
                                        display:'flex',
                                        margin:'5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        display:'flex',
                                        margin:'5px  auto 5px auto'
                                    },
                                    on: {
                                        click: () => {
                                          this.$router.push({
                                            name:'faqManage',
                                            query:{id:params.row.id}
                                          })
                                        }
                                    }
                                }, '回答管理'),
                            ]);
                        }
                    }
                ]
            }

        },
      beforeMount(){
          this.startDate = this.$moment(new Date()).subtract(1, 'months').toDate();
      },
        mounted() {
            this.fetchData()
        },
      activated(){
          this.fetchData();
      },
        methods: {
            fetchData() {
                this.$post('/question/admin/backList', this.searchData,true).then(data => {
                    this.tableData = data.data.items;
                    this.total = data.data.totalNum
                })
            },
            changeDate(date){
                this.searchData.start = date[0];
                this.searchData.end = date[1];
            },
            handleSearch(){
                this.fetchData()
            },
            pageChange(page){
                this.searchData.page = page;
                this.fetchData();
            },
            sizeChange(size){
                this.searchData.size = size;
                this.fetchData();
            },
            remove(id){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除?</p>',
                    onOk: () => {
                        this.$put(`/question/admin/${id}/delete`);
                        this.fetchData()
                    },
                })
            },
            handleAdd(){
                this.$router.push({
                    name:'faqAdd',
                    query:{pageType:'add'}
                })
            },
          exportData(){
            this.$post('/question/admin/export',this.searchData).then((data)=>{
                window.location.href = `${BASE_URL}/${data.data}`
            })
          }
        }
    }
</script>

<style scoped lang="less">
    .search-con {
        padding: 10px 0;
        display: flex;
        justify-content: flex-start;
        .search {
            &-col {
                display: inline-block;
                width: 200px;
            }
            &-input {
                display: inline-block;
                width: 200px;
                margin-left: 2px;
            }
            &-btn {
                margin-left: 2px;
            }
        }
    }
</style>
