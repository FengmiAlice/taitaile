import axios from 'axios';
import router from '@/router'
import {Message, Spin} from 'iview';
import qs from 'qs'

import {showFullScreenLoading,tryHideFullScreenLoading} from '@/libs/util'
import BASE_URL from '@/api/url'
let timer,ajaxArr=[];
const instance = axios.create({
    baseURL: BASE_URL, // api的base_url
    // timeout: 3000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

//发送请求前
instance.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    const token = window.sessionStorage.getItem('token');
    if (token && config.url.indexOf('/area/province') !== 0 && config.url.indexOf('/area/city') !== 0 && config.url.indexOf('/area/getCity') !== 0) {
        config.headers.token = `${token}`;
    }

    if(ajaxArr.length===0){
        timer = setTimeout(function () {
            showFullScreenLoading()
        }, 500);
    }

    ajaxArr.push('ajax');
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//请求后
instance.interceptors.response.use((data) => {

    if (ajaxArr.length === 1) {
        if(timer){
                    clearTimeout(timer);
                    timer = null;
        } tryHideFullScreenLoading();


    }else{
            ajaxArr.splice(0,1);
    }


    if (data.data.code === 0) {
        return data;
    } else {
        // setTimeout(function () {
        Message.error(data.data.message);
        // }, 1000);
        return Promise.reject(data)
    }


}, (err) => {
    Spin.hide();
    // 数据异常统一处理 例如
    if (err.response.status === 504 || err.response.status === 404) {
        Message.error('服务器被吃了');
        // return Promise.reject(err);
    } else if (err.response.status === 403) {
        router.push({
            name: 'error_401'
        })
        // Message.error('权限不足,请联系管理员');
        // return Promise.reject(err);
    } else if (err.response.status === 401) {
        Message.error('登录超时，请重新登录');
        window.sessionStorage.removeItem("token");
        setTimeout(function () {
            router.push({
                name: 'login'
            })
        }, 1000)
    } else if (err.response.status === 400) {
        Message.error('参数错误');
        // return Promise.reject(err);

    } else {
        Message.error('未知错误');
        // return Promise.reject(err);
    }
    // return Promise.resolve(err);
    return Promise.reject(err);
});


export function get(url, params) {

    return new Promise((resolve, reject) => {

        const newUrl = `${url}?${qs.stringify(params)}`;
        instance.get(newUrl)
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/*
* @ishint 提示是否显示，true不显示
* */


export function post(url, params, ishint) {
    return new Promise((resolve, reject) => {
        instance.post(url, params)
            .then(response => {
                resolve(response.data);
                if (!ishint) {
                    // setTimeout(function () {
                    Message.success(response.data.message);
                    // }, 1000);

                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
        instance.put(url, params)
            .then(response => {
                resolve(response.data);
                // setTimeout(function () {
                Message.success(response.data.message);
                // }, 1000);
            })
            .catch(err => {
                reject(err);
            })
    })
}


export function DELETE(url, params) {
    return new Promise((resolve, reject) => {
        instance.delete(url, params)
            .then(response => {
                resolve(response.data);
                // setTimeout(function () {
                Message.success('删除成功');
                // }, 1000);
            })
            .catch(err => {
                reject(err)
            })
    })
}
