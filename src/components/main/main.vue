<template>
    <Layout class="main">
        <Sider hide-trigger collapsible :width="220" :collapsed-width="64" v-model="collapsed" class="left-sider"
               :style="{overflow: 'hidden'}">
            <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed"
                       @on-select="turnToPage" :menu-list="menuList">
                <div class="logo-con">
                    <img src="../../assets/images/logo.png" alt="">
                </div>
            </side-menu>
        </Sider>
        <Layout style="height: 100%">
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="md-person"/>
                            {{userName}}
                        </MenuItem>
                        <MenuItem name="2" @click.native="logout">
                            <Icon type="md-power"/>
                            退出
                        </MenuItem>
                    </div>
                </Menu>
            </Header>


            <Layout>

                <Content class="main-content-con">

                    <Layout class="main-layout-con">

                        <Content class="content-wrapper">
                            <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange"
                                        style="height: 10px;">
                            </header-bar>
                            <keep-alive :include="keepAliveList">
                                <router-view/>
                            </keep-alive>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    </Layout>
</template>

<script>
    // import {getMenuByRouter,} from '@/libs/util'
    import {forEach} from '@/libs/tools'
    // import router from '@/router'
    import routers from '@/router/routers'
    import SideMenu from './components/side-menu'
    import HeaderBar from './components/header-bar'
    // import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
    import {mapMutations, mapActions} from 'vuex'
    import './main.less'

    export default {
        name: "Main",
        components: {
            SideMenu,
            HeaderBar,
        },
        data() {
            return {
                collapsed: false,
                userName: null,
                // menuList:null
                keepAliveList: []
            }
        },

        mounted() {
            this.keepAliveList =this.getKeepAliveList(routers);
            this.setAccess(window.sessionStorage.getItem('access').split(','));
            this.setBreadCrumb(this.$route);
            this.userName = window.sessionStorage.getItem('currentUser');
        },
        methods: {
            ...mapMutations([
                'setBreadCrumb',
                'setAccess',
                'setTagNavList',
                // 'addTag',
                // 'setLocal'
            ]),
            ...mapActions([
                'handleLogin'
            ]),
            turnToPage(route) {
                let {name, params, query} = {};
                if (typeof route === 'string') name = route;
                else {
                    name = route.name;
                    params = route.params;
                    query = route.query
                }
                if (name.indexOf('isTurnByHref_') > -1) {
                    window.open(name.split('_')[1]);
                    return
                }
                this.$router.push({
                    name,
                    params,
                    query
                })
            },
            handleCollapsedChange(state) {
                this.collapsed = state
            },
            logout() {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('access');
                this.$router.push({
                    name: 'login'
                })
            },
            getKeepAliveList(params) {
                let arr = [];
                for(let i=0; i<params.length;i++){
                    if(params[i].children){
                        for( let j=0;j<params[i].children.length;j++){
                            if(params[i].children[j].meta.notCache){
                                arr.push(params[i].children[j].name)
                            }
                        }
                    }
                }
             return arr
            }
        },
        computed: {
            menuList() {
                return this.$store.getters.menuList
            },
        },
        watch: {
            '$route'(newRoute) {
                this.setBreadCrumb(newRoute);
                this.$refs.sideMenu.updateOpenName(newRoute.name)
            }
        },
    }
</script>

