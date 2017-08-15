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
        // 营运管理员
        {
          path: '/cargoprice',
          component: resolve => require(['../components/operationAdministrator/CargoPrice.vue'], resolve)
        },
        {
          path: '/enterprise',
          component: resolve => require(['../components/operationAdministrator/Enterprise.vue'], resolve)
        },
        {
          path: '/personnel',
          component: resolve => require(['../components/operationAdministrator/PersonnelInfo.vue'], resolve)
        },
        {
          path: '/vehicle',
          component: resolve => require(['../components/operationAdministrator/VehicleInfo.vue'], resolve)
        },
        // 财务管理员
        // 应收
        {
          path: '/freight',
          component: resolve => require(['../components/FinancialAdministrator/accountsReceivable/Freight.vue'], resolve)
        },
        {
          path: '/receipt',
          component: resolve => require(['../components/FinancialAdministrator/accountsReceivable/Receipt.vue'], resolve)
        },
        {
          path: '/additional',
          component: resolve => require(['../components/FinancialAdministrator/accountsReceivable/Additional.vue'], resolve)
        },
        {
          path: '/tripartiteIncome',
          component: resolve => require(['../components/FinancialAdministrator/accountsReceivable/TripartiteIncome.vue'], resolve)
        },
        {
          path: '/otherIncome',
          component: resolve => require(['../components/FinancialAdministrator/accountsReceivable/OtherIncome.vue'], resolve)
        },
        // 应付
        {
          path: '/transferFee',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/TransferFee.vue'], resolve)
        },
        {
          path: '/trunkTransport',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/TrunkTransport.vue'], resolve)
        },
        {
          path: '/shortTransport',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/ShortTransport.vue'], resolve)
        },
        {
          path: '/tripartitePayment',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/TripartitePayment.vue'], resolve)
        },
        {
          path: '/rebate',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/Rebate.vue'], resolve)
        },
        {
          path: '/otherPayment',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/OtherPayment.vue'], resolve)
        },
        {
          path: '/staffSalary',
          component: resolve => require(['../components/FinancialAdministrator/accountsPayable/StaffSalary.vue'], resolve)
        },
        // 货款中心
        {
          path: '/paymentCollection',
          component: resolve => require(['../components/FinancialAdministrator/paymentCenter/PaymentCollection.vue'], resolve)
        },
        {
          path: '/paymentReturn',
          component: resolve => require(['../components/FinancialAdministrator/paymentCenter/PaymentReturn.vue'], resolve)
        },
        // 财务总账
        {
          path: '/paymentCenter',
          component: resolve => require(['../components/FinancialAdministrator/financialDirector/PaymentCenter.vue'], resolve)
        },
        {
          path: '/tripartiteSettlement',
          component: resolve => require(['../components/FinancialAdministrator/financialDirector/TripartiteSettlement.vue'], resolve)
        },
        {
          path: '/financialLedger',
          component: resolve => require(['../components/FinancialAdministrator/financialDirector/FinancialLedger.vue'], resolve)
        },
        {
          path: '/grossProfit',
          component: resolve => require(['../components/FinancialAdministrator/financialDirector/GrossProfit.vue'], resolve)
        }
      ]

    },
    {
      path: '/login',
      component: resolve => require(['../components/login/Login.vue'], resolve)
    }
  ]
})
// export const asyncRouterMap = [
//   {
//     path: '/operation',
//     children: [
//       {
//         path: '/cargo',
//         component: resolve => require(['../components/operationAdministrator/CargoPrice.vue'], resolve)
//       },
//       {
//         path: '/enterprise',
//         component: resolve => require(['../components/operationAdministrator/Enterprise.vue'], resolve)
//       },
//       {
//         path: '/personnel',
//         component: resolve => require(['../components/operationAdministrator/PersonnelInfo.vue'], resolve)
//       },
//       {
//         path: '/vehicle',
//         component: resolve => require(['../components/operationAdministrator/VehicleInfo.vue'], resolve)
//       }
//     ]
//
//   }
// ]
