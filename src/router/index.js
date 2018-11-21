import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/views/Home.vue'
import iView from 'iview'
import routes from './routers'
// import { getToken} from '@/libs/util'

Vue.use(Router);

const router = new Router({
    routes,
});

const LOGIN_PAGE_NAME = 'login';
//
//
router.beforeEach((to, from, next) => {
//
//     iView.LoadingBar.start();
    const token = window.sessionStorage.getItem("token");
    if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })

    }else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: 'cookingList'
        })
    }
    else {
        next()
    }
});

router.afterEach(to => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0)
});

export default router


