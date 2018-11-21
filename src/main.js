import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './index.less'
import 'babel-polyfill'
import {get, post,put,DELETE} from '@/api/index'
import moment from 'moment'
import BASE_URL from '@/api/url'



Vue.use(iView);

Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$DELETE = DELETE;
Vue.prototype.$put = put;

Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Vue.config.productionTip = false;

Vue.filter('imgSrc',value=>{
    if(value){
        return `${BASE_URL}/${value}`
    }
});

Vue.filter('formatWithhour',value=>{
    if(value){
        return moment(value).format('YYYY-MM-DD HH:mm')
    }
});


Vue.filter('moneyFilter',function (value) {
if(value){
        return `${value}积分`
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
