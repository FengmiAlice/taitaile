import { forEach,hasOneOf } from '@/libs/tools'
import {Spin} from 'iview';


export const hasChild = (item) => {
    return item.children && item.children.length !== 0
};

const showThisMenuEle = (item, access) => {

    if (item.meta && item.meta.access && item.meta.access.length) {
        if (hasOneOf(item.meta.access, access)) return true;
        else return false
    } else return true
}

/**
 * @param {Array} routeMatched 当前路由matched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
    let routeMatched = route.matched;
    let res = routeMatched.filter(item => {
        return item.meta === undefined || !item.meta.hide
    }).map(item => {
        let meta = {...item.meta}
        if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
        let obj = {
            icon: (item.meta && item.meta.icon) || '',
            name: item.name,
            meta: meta
        };
        return obj
    });
    // res = res.filter(item => {
    //     return !item.meta.hideInMenu
    // });

    let arr = [Object.assign(homeRoute, { to: homeRoute.path }), ...res];

    // return [Object.assign(homeRoute, { to: homeRoute.path }), ...res]
  return arr.slice(1)

};


export const getHomeRoute = routers => {
    let i = -1;
    let len = routers.length
    let homeRoute = {};
    while (++i < len) {
        let item = routers[i]
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children)
            if (res.name) return res
        } else {
            if (item.name === 'home') homeRoute = item
        }
    }
    return homeRoute
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    let res = [];
    forEach(list, item => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            let obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta
            };
            if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
                obj.children = getMenuByRouter(item.children, access)
            }
            if (item.meta && item.meta.href) obj.href = item.meta.href
            if (showThisMenuEle(item, access)) res.push(obj)
        }
    });
    return res
};

let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        Spin.show();
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        Spin.hide();
    }
}