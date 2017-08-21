import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
          component: resolve => require(['../components/financialAdministrator/accountsReceivable/Freight.vue'], resolve)
        },
        {
          path: '/receipt',
          component: resolve => require(['../components/financialAdministrator/accountsReceivable/Receipt.vue'], resolve)
        },
        {
          path: '/additional',
          component: resolve => require(['../components/financialAdministrator/accountsReceivable/Additional.vue'], resolve)
        },
        {
          path: '/tripartiteIncome',
          component: resolve => require(['../components/financialAdministrator/accountsReceivable/TripartiteIncome.vue'], resolve)
        },
        {
          path: '/otherIncome',
          component: resolve => require(['../components/financialAdministrator/accountsReceivable/OtherIncome.vue'], resolve)
        },
        // 应付
        {
          path: '/transferFee',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/TransferFee.vue'], resolve)
        },
        {
          path: '/trunkTransport',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/TrunkTransport.vue'], resolve)
        },
        {
          path: '/shortTransport',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/ShortTransport.vue'], resolve)
        },
        {
          path: '/tripartitePayment',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/TripartitePayment.vue'], resolve)
        },
        {
          path: '/rebate',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/Rebate.vue'], resolve)
        },
        {
          path: '/otherPayment',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/OtherPayment.vue'], resolve)
        },
        {
          path: '/staffSalary',
          component: resolve => require(['../components/financialAdministrator/accountsPayable/StaffSalary.vue'], resolve)
        },
        // 货款中心
        {
          path: '/paymentCollection',
          component: resolve => require(['../components/financialAdministrator/paymentCenter/PaymentCollection.vue'], resolve)
        },
        {
          path: '/paymentReturn',
          component: resolve => require(['../components/financialAdministrator/paymentCenter/PaymentReturn.vue'], resolve)
        },
        // 财务总账
        {
          path: '/paymentCenter',
          component: resolve => require(['../components/financialAdministrator/financialDirector/PaymentCenter.vue'], resolve)
        },
        {
          path: '/tripartiteSettlement',
          component: resolve => require(['../components/financialAdministrator/financialDirector/TripartiteSettlement.vue'], resolve)
        },
        {
          path: '/financialLedger',
          component: resolve => require(['../components/financialAdministrator/financialDirector/FinancialLedger.vue'], resolve)
        },
        {
          path: '/grossProfit',
          component: resolve => require(['../components/financialAdministrator/financialDirector/GrossProfit.vue'], resolve)
        },
        // 客服
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
        // 调度管理员的path路径开始

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
          path: '/transportedInfo',
          component: resolve => require(['../components/dispatch/transportedInfo.vue'], resolve)
        },
        // 6、待运输
        {
          path: '/transportingInfo',
          component: resolve => require(['../components/dispatch/transportingInfo.vue'], resolve)
        },
        // 7、已中转
        {
          path: '/epobolyedInfo',
          component: resolve => require(['../components/dispatch/epobolyedInfo.vue'], resolve)
        },
        // 8、待中转
        {
          path: '/epobolingInfo',
          component: resolve => require(['../components/dispatch/epobolingInfo.vue'], resolve)
        },
        // 系统管理员
        {
          path: '/register',
          component: resolve => require(['../components/systemAdministrator/Register.vue'], resolve)
        },
        {
          path: '/authorityManagement',
          component: resolve => require(['../components/systemAdministrator/AuthorityManagement.vue'], resolve)
        },
        {
          path: '/orderform',
          component: resolve => require(['../components/orderFormer/OrderFormer.vue'], resolve)
        }
      ]

    },
    {
      path: '/login',
      component: resolve => require(['../components/login/Login.vue'], resolve)
    }
  ]
})
