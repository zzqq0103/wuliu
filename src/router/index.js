import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: reslove => require(['../components/common/Home.vue'], reslove),
            children: [{
                    path: '/cargoprice',
                    component: resolve => require(['../components/OperationAdministrator/CargoPrice.vue'], resolve)
                },
                {
                    path: '/enterprise',
                    component: resolve => require(['../components/OperationAdministrator/Enterprise.vue'], resolve)
                },
                {
                    path: '/personnel',
                    component: resolve => require(['../components/OperationAdministrator/PersonnelInfo.vue'], resolve)
                },
                {
                    path: '/vehicle',
                    component: resolve => require(['../components/OperationAdministrator/VehicleInfo.vue'], resolve)
                },
                {
                    path: '/appointAdd',
                    component: resolve => require(['../components/customerService/AppointAdd.vue'], resolve)
                },
                {
                    path: '/appointDetail',
                    component: resolve => require(['../components/customerService/AppointDetail.vue'], resolve)
                },
                {
                    path: '/appointInfo',
                    component: resolve => require(['../components/customerService/AppointInfo.vue'], resolve)
                },
                {
                    path: '/appointToOrder',
                    component: resolve => require(['../components/customerService/AppointToOrder.vue'], resolve)
                },
                {
                    path: '/freighterror',
                    component: resolve => require(['../components/customerService/Freighterror.vue'], resolve)
                },
                {
                    path: '/logisticsDetail',
                    component: resolve => require(['../components/customerService/LogisticsDetail.vue'], resolve)
                },
                {
                    path: '/logisticsInfo',
                    component: resolve => require(['../components/customerService/LogisticsInfo.vue'], resolve)
                },
                {
                    path: '/orderAdd',
                    component: resolve => require(['../components/customerService/OrderAdd.vue'], resolve)
                },
                {
                    path: '/orderDetail',
                    component: resolve => require(['../components/customerService/OrderDetail.vue'], resolve)
                },
                {
                    path: '/orderInfo',
                    component: resolve => require(['../components/customerService/OrderInfo.vue'], resolve)
                },
                {
                    path: '/outsourceChange',
                    component: resolve => require(['../components/customerService/OutsourceChange.vue'], resolve)
                },
                {
                    path: '/reserveCheck',
                    component: resolve => require(['../components/customerService/ReserveCheck.vue'], resolve)
                },
                {
                    path: '/stockDetail',
                    component: resolve => require(['../components/customerService/StockDetail.vue'], resolve)
                },
                {
                    path: '/stockinChange',
                    component: resolve => require(['../components/customerService/StockinChange.vue'], resolve)
                },
                {
                    path: '/stockinInfo',
                    component: resolve => require(['../components/customerService/StockinInfo.vue'], resolve)
                },
                {
                    path: '/transfer',
                    component: resolve => require(['../components/customerService/Transfer.vue'], resolve)
                },
                //调度管理员的path路径开始

                // 1、已送货
                {
                    path: '/deliveredInfo',
                    component: resolve => require(['../components/dispatch/deliveredInfo.vue'], resolve)
                },
                // 2、待送货
                {
                    path: '/deliveringInfo',
                    component: resolve => require(['../components/dispatch/deliveringInfo.vue'], resolve)
                },
                // 3、已接货
                {
                    path: '/receivedInfo',
                    component: resolve => require(['../components/dispatch/receivedInfo.vue'], resolve)
                },
                // 4、待接货
                {
                    path: '/receiveingInfo',
                    component: resolve => require(['../components/dispatch/receiveingInfo.vue'], resolve)
                },
                // 5、已运输
                {
                    path: '/tranportedInfo',
                    component: resolve => require(['../components/dispatch/tranportedInfo.vue'], resolve)
                },
                // 6、待运输
                {
                    path: '/transportingInfo',
                    component: resolve => require(['../components/dispatch/transportingInfo.vue'], resolve)
                },
                // 7、已中转
                {
                    path: 'epobolyedInfo/',
                    component: resolve => require(['../components/dispatch/epobolyedInfo.vue'], resolve)
                },
                // 8、待中转
                {
                    path: '/epobolingInfo',
                    component: resolve => require(['../components/dispatch/epobolingInfo.vue'], resolve)
                }
                //调度管理员的path路径结束
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/login/Login.vue'], resolve)
        }
    ]
})
export const asyncRouterMap = [{
    path: '/operation',
    children: [{
            path: '/cargo',
            component: resolve => require(['../components/OperationAdministrator/CargoPrice.vue'], resolve)
        },
        {
            path: '/enterprise',
            component: resolve => require(['../components/OperationAdministrator/Enterprise.vue'], resolve)
        },
        {
            path: '/personnel',
            component: resolve => require(['../components/OperationAdministrator/PersonnelInfo.vue'], resolve)
        },
        {
            path: '/vehicle',
            component: resolve => require(['../components/OperationAdministrator/VehicleInfo.vue'], resolve)
        }
    ]

}]