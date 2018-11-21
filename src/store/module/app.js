import {getBreadCrumbList,  getHomeRoute,  getMenuByRouter,} from '@/libs/util'
// import router from '@/router'
import routers from '@/router/routers'

export default {
    state: {
        breadCrumbList: [],
        homeRoute: getHomeRoute(routers),
    },
    getters: {
        menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)

    },
    mutations: {
        setBreadCrumb (state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
        },

    }
}
