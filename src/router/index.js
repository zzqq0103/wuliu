import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: reslove => require(['../components/common/Home.vue'], reslove),
      children: [
        {
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
        }
      ]

    },
    {
      path: '/login',
      component: resolve => require(['../components/login/Login.vue'], resolve)
    }
  ]
})
export const asyncRouterMap = [
  {
    path: '/operation',
    children: [
      {
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

  }
]
