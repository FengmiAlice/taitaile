import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/cooking',
        name: 'cooking',
        meta: {
            title: '厨艺秀管理',
            access:['all','1']
        },
        component: Main,
        children: [
            {
                path: 'cookingList',
                name: 'cookingList',
                meta: {
                    title: '厨艺秀列表',
                    notCache:true,
                },
                component: () => import('@/view/cookingManage/cookingList.vue'),
            },
            {
                path: 'details',
                name: 'details',
                meta: {
                    title: '厨艺秀详情',
                    hideInMenu: true,

                },
                component: () => import('@/view/cookingManage/details.vue')
            },
          {
                path: 'edit',
                name: 'edit',
                meta: {
                    title: '厨艺秀编辑',
                    hideInMenu: true,
                },
                component: () => import('@/view/cookingManage/edit.vue')
            },
            {
                path: 'add',
                name: 'add',
                meta: {
                    title: '厨艺秀新增',
                    hideInMenu: true,
                },
                component: () => import('@/view/cookingManage/add.vue')
            },

            {
                path: 'commentList',
                name: 'commentList',
                meta: {
                    title: '评论管理',
                    hideInMenu: true,
                },
                component: () => import('@/view/cookingManage/commentList.vue')
            },

            {
                path: 'commentAdd',
                name: 'commentAdd',
                meta: {
                    title: '评论新增',
                    hideInMenu: true,
                },
                component: () => import('@/view/cookingManage/commentAdd.vue')
            },
        ]
    },
    {
        path: '/activity',
        name: 'activity',
        meta: {
            title: '活动管理',
            access:['all','2']
        },
        component: Main,
        children: [
            {
                path: 'activityList',
                name: 'activityList',
                meta: {
                    title: '活动列表',
                    notCache:true,

                },
                component:()=> import('@/view/activity/activityList.vue')
            },
            {
                path: 'activityListDetails',
                name: 'activityListDetails',
                meta: {
                    title: '活动详情',
                    hideInMenu: true,


                },
                component:()=> import('@/view/activity/activityListDetails.vue')
            },

            {
                path: 'activityAdd',
                name: 'activityAdd',
                meta: {
                    title: '活动新增',
                    hideInMenu: true,
                },
                component:()=> import('@/view/activity/activityAdd.vue')
            },
            {
                path: 'activityEdit',
                name: 'activityEdit',
                meta: {
                    title: '活动编辑',
                    hideInMenu: true,
                },
                component:()=> import('@/view/activity/activityEdit.vue')
            },
            {
                path: 'order',
                name: 'order',
                meta: {
                    title: '订单管理',
                    hideInMenu: true,
                    notCache:true,
                },
                component:()=> import('@/view/activity/order.vue')
            },
            {
                path: 'participatorList',
                name: 'participatorList',
                meta: {
                    title: '名单管理',
                    hideInMenu: true,
                    notCache:true,
                },
                component:()=> import('@/view/activity/participatorList.vue')
            },

        ]
    },
    {
        path: '/faq',
        name: 'faq',
        meta: {
            title: '问答管理',
            access:['all','3']
        },
        component: Main,
        children: [
            {
                path: 'faqList',
                name: 'faqList',
                meta: {
                    title: '问答列表',
                    notCache:true,

                },
                component: () => import('@/view/faq/faqList.vue')
            },
            {
                path: 'faqDetails',
                name: 'faqDetails',
                meta: {
                    title: '问答详情',
                    hideInMenu: true,
                },
                component: () => import('@/view/faq/faqDetails.vue')
            },
          {
            path: 'faqManage',
            name: 'faqManage',
            meta: {
              title: '问答管理',
              hideInMenu: true,
            },
            component: () => import('@/view/faq/faqManage.vue')
          },
          {
            path: 'faqAdd',
            name: 'faqAdd',
            meta: {
              title: '问题新增',
              hideInMenu: true,
            },
            component: () => import('@/view/faq/faqAdd.vue')
          },
            {
                path: 'faqEdit',
                name: 'faqEdit',
                meta: {
                    title: '问题编辑',
                    hideInMenu: true,
                },
                component: () => import('@/view/faq/faqEdit.vue')
            },
            {
                path: 'askAdd',
                name: 'askAdd',
                meta: {
                    title: '回答新增',
                    hideInMenu: true,
                },
                component: () => import('@/view/faq/askAdd.vue')
            },
            {
                path: 'faqCommentList',
                name: 'faqCommentList',
                meta: {
                    title: '评论管理',
                    hideInMenu: true,
                    notCache:true,
                },
                component: () => import('@/view/faq/faqCommentList.vue')
            },

            {
                path: 'faqCommentAdd',
                name: 'faqCommentAdd',
                meta: {
                    title: '评论新增',
                    hideInMenu: true
                },
                component: () => import('@/view/faq/faqCommentAdd.vue')
            },
        ]
    },
    {
        path: '/userManage',
        name: 'userManage',
        meta: {
            title: '用户管理',
            access:['all','4','5'],
        },
        component: Main,
        children: [
            {
                path: 'userList',
                name: 'userList',
                meta: {
                    title: '用户列表',
                    notCache:true,
                    access:['all','4'],
                },
                component:()=> import('@/view/userManage/userList.vue')
            },
            {
                path: 'customerEdit',
                name: 'customerEdit',
                meta: {
                    title: '用户编辑',
                    hideInMenu:true,
                },
                component:()=> import('@/view/userManage/customerEdit.vue')
            },
            {
                path: 'customerNew',
                name: 'customerNew',
                meta: {
                    title: '用户新增',
                    hideInMenu:true,

                },
                component:()=> import('@/view/userManage/customerNew.vue')
            },
            {
                path: 'coreDetail',
                name: 'coreDetail',
                meta: {
                    title: '积分详情',
                    hideInMenu:true,
                },
                component:()=> import('@/view/userManage/coreDetail.vue')
            },
            {
                path: 'cityConfirm',
                name: 'cityConfirm',
                meta: {
                    title: '城市合伙人审核列表',
                    // hideInMenu:true,
                    access:['all','5'],
                    notCache:true,
                },
                component:()=> import('@/view/userManage/cityConfirm.vue')
            },
            {
                path: 'cityDeal',
                name: 'cityDeal',
                meta: {
                    title: '审核处理',
                    hideInMenu:true,
                },
                component:()=> import('@/view/userManage/cityDeal.vue')
            },
            {
                path: 'dealDetail',
                name: 'dealDetail',
                meta: {
                    title: '详情',
                    hideInMenu:true,

                },
                component:()=> import('@/view/userManage/dealDetail.vue')
            },
        ]
    },

    {
        path: '/comment',
        name: 'comment',
        meta: {
            title: '评论管理',
            access:['all','6'],
        },
        component: Main,
        children: [
            {
                path: 'allCommentList',
                name: 'allCommentList',
                meta: {
                    title: '评论列表',

                },
                component:()=> import('@/view/comment/allCommentList.vue')
            },

        ]
    },
    {
        path: '/sysInform',
        name: 'sysInform',
        meta: {
            title: '系统通知',
            access:['all','7'],
        },
        component: Main,
        children: [
            {
                path: 'informList',
                name: 'informList',
                meta: {
                    title: '系统通知列表',
                    hideInMenu:false,
                },
                component:()=> import('@/view/sysInform/informList.vue')
            },
            {
                path: 'informListAdd',
                name: 'informListAdd',
                meta: {
                    title: '通知新增',
                    hideInMenu:false,
                },
                component:()=> import('@/view/sysInform/informListAdd.vue')
            },
            {
                path: 'informListDetail',
                name: 'informListDetail',
                meta: {
                    title: '通知详情',
                    hideInMenu:true,
                },
                component:()=> import('@/view/sysInform/informListDetail.vue')
            },

        ]
    },
    {
        path: '/sysdesign',
        name: 'sysdesign',
        meta: {
            title: '系统设置',
        },
        component: Main,
        children: [
            {
                path: 'userDesign',
                name: 'userDesign',
                meta: {
                    title: '用户设置',
                    access:['all','8'],

                },
                component:()=> import('@/view/sysdesign/userDesign.vue')
            },
            {
                path: 'userAdd',
                name: 'userAdd',
                meta: {
                    title: '用户添加',
                    hideInMenu: true,
                },
                component:()=> import('@/view/sysdesign/userAdd.vue')
            },
            {
                path: 'userEdit',
                name: 'userEdit',
                meta: {
                    title: '用户编辑',
                    hideInMenu: true,
                },
                component:()=> import('@/view/sysdesign/userEdit.vue')
            },

            {
                path: 'roleDesign',
                name: 'roleDesign',
                meta: {
                    title: '角色设置',
                    access:['all','9'],
                },
                component:()=> import('@/view/sysdesign/roleDesign.vue')
            },
            {
                path: 'roleAdd',
                name: 'roleAdd',
                meta: {
                    title: '添加角色',
                    hideInMenu: true,
                },
                component:()=> import('@/view/sysdesign/roleAdd.vue')
            },
            {
                path: 'roleEdit',
                name: 'roleEdit',
                meta: {
                    title: '角色编辑',
                    hideInMenu: true,
                },
                component:()=> import('@/view/sysdesign/roleEdit.vue')
            },
            {
                path: 'pwdGai',
                name: 'pwdGai',
                meta: {
                    title: '密码修改',
                },
                component:()=> import('@/view/sysdesign/pwdGai.vue')
            },

        ]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    }
    ]

