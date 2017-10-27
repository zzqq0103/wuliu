/*
 * author: zhangqiang
 * date: 2017/9/29
 * description: This file is used to test api data set
 * */

// 引入axios插件
import axios from 'axios'
// axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
const baseUrl = ''
const baseWeiUrl = 'http://10.107.8.46:8080/logistics/'
//  **************************  已 送 货 订 单 列 表 开 始  (deliveredInfo.vue) **************************

// // token值，登陆时获取，保存在本地，
// const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMzgzNTM1NjY2NiIsImlhdCI6MTUwODQ2NzEzOSwic3ViIjoie1wic2l0ZVwiOlwi5YyX5LqsXCIsXCJpZFwiOlwiMTM4MzUzNTY2NjZcIixcInJvbGVcIjpcIui0ouWKoeWuoeaguFwiLFwidHlwZVwiOlwiM1wifSIsImV4cCI6MTUwODQ3MDczOX0.-wQMhGEUytSzRbo46lg1s19-L0dDn4MyfqkLnDRhe9w'
// // 发送axios前拦截
// axios.interceptors.request.use((config) => {
//   config.headers.Authorization = `${token}`
//   return config
// }, (error) => {
//   return Promise.reject(error)
// })

// 实际调用axios的地方，传递url与params获取数据
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {

// 已送货 （订单）
  getCurrentDeliveredList (params) {
    return axios.post(`${baseUrl}/interface/short_delivered_management/query_delivered_order`, params)
  },

// 已送货（子件订单）
  getCurrentDeliveredSubOrderList (params) {
    return axios.post(`${baseUrl}/interface/short_delivered_management/query_delivered_sub`, params)
  },

//  **************************   已 送 货 订 单 列 表 结 束  (deliveredInfo.vue) **************************

//  **************************   待 送 货 订 单 列 表 开 始    (deliveringInfo.vue) **************************

// 待送货（订单）
  getCurrentDeliveringList (params) {
    // return axios.post(`${baseUrl}/deliveredOrder/getLoadedlist`, params) // mock.js 假数据的接口
    return axios.post(`${baseUrl}/interface/short_delivering_management/query_delivering_order`, params)
  },

// 待送货（子件）
  getCurrentDeliveringSubOrderList (params) {
    return axios.post(`${baseUrl}/interface/short_delivering_management/query_delivering_sub`, params)
  },

// **************************    待 送 货 订 单 列 表 结 束   (deliveringInfo.vue)  **************************

// **************************    送 货 手 动 调 度 页 面 接 口 开 始 (manualDeliverlingInfo.vue)  **************************

// 送货手动调度 (订单列表）
  queryDeliveringReservation (params) {
    return axios.post(`${baseUrl}/interface/short_delivering_dispatch/query_delivering_order`, params)
  },

// 点击手动调度
  manualDeliveringDispatch (params) {
    return axios.post(`${baseUrl}/interface/short_delivering_dispatch/manual_dispatch`, params)
  },

// 点击编辑
  queryManualDeliveringDispatch (params) {
    return axios.post(`${baseUrl}/interface/short_delivering_dispatch/query_manual_dispatch`, params)
  },

// **************************    送 货 手 动 调 度 页 面 接 口 结 束 (manualDeliverlingInfo.vue) **************************

// **************************    待 确 认 送 货 调 度 页 面 接 口 开 始 (deliveringAffirm.vue)   **************************

// 送货司机列表显示
  queryDeliveringCar (params) {
    return axios.post(`${baseUrl}/interface/short_dispatch_confirm/query_delivering_car`, params)
  },

// 双击后查看司机送货订单和子件列表及仓库中的订单和子件列表
  queryDeliveringDispatch (params) {
    return axios.post(`${baseUrl}/interface/short_dispatch_confirm/query_delivering_dispatch`, params)
  },

// 调整后点击确认
  updateDeliveringDispatch (params) {
    return axios.post(`${baseUrl}/interface/short_dispatch_confirm/update_delivering_dispatch`, params)
  },

// 调整完，点击司机列表后边的确认
  updateDeliveringSuccess (params) {
    return axios.post(`${baseUrl}/interface/short_dispatch_confirm/update_delivering_success`, params)
  },

// **************************   待 确 认 送 货 调 度 页 面 接 口 结 束 (deliveringAffirm.vue) **************************

// **************************   已 接 货 订 单 列 表     (receivedInfo.vue)   **************************

// 已接货 （订单）
  getCurrentReceivedList (params) {
    // return axios.post(`${baseUrl}/receivedOrder/getlist`, params) // mock.js 假数据的接口
    return axios.post(`${baseUrl}/interface/short_received_management/query_received_order`, params)
  },

// 已接货 （预约单）
  getCurrentReceivedReservationList (params) {
    return axios.post(`${baseUrl}/interface/short_received_management/query_received_reservation`, params)
  },

// 已接货（子件）
  getCurrentReceivedSubOrderList (params) {
    return axios.post(`${baseUrl}/interface/short_received_management/query_received_sub`, params)
  },

// **************************   已 接 货 订 单 结 束      (receivedInfo.vue)   **************************

// **************************   待 接 货 订 单 开 始      (receiveingInfo.vue) **************************

// 待接货 （订单）
  getCurrentReceivingList (params) {
    return axios.post(`${baseUrl}/interface/short_receiving_management/query_receiving_order`, params)
  },

// 待接货 （预约单）
  getCurrentReceivingReservationList (params) {
    return axios.post(`${baseUrl}/interface/short_receiving_management/query_receiving_reservation`, params)
  },

// 待接货 （子件）
  getCurrentReceivingSubOrderList (params) {
    return axios.post(`${baseUrl}/interface/short_receiving_management/query_receiving_sub`, params)
  },

// **************************  待 接 货 订 单 结 束       (receiveingInfo.vue) **************************

// **************************  接 货 手 动 调 度 页 面 接 口 开 始 (manualDeliverlingInfo.vue) **************************

// 接货手动调度
  queryReceivingReservation (params) {
    return axios.post(`${baseUrl}/interface/short_receiving_dispatch/query_receiving_dispatch`, params)
  },

// 点击手动调度
  manualReceivingDispatch (params) {
    return axios.post(`${baseUrl}/interface/short_receiving_dispatch/manual_dispatch`, params)
  },

// 点击编辑
  queryManualReceivingDispatch (params) {
    return axios.post(`${baseUrl}/interface/short_receiving_dispatch/query_manual_dispatch`, params)
  },

// **************************  接 货 手 动 调 度 页 面 接 口 结 束 (manualDeliverlingInfo.vue) **************************

// **************************  已 长 途 运 输 订 单 开 始 (transportedInfo.vue) **************************

// 已长途运输装载单
  queryCurrentTransportedData (params) {
    // return axios.post(`${baseUrl}/logistics/interface/long_transported_management/query_loading_info`, params)
    return axios.post(`${baseUrl}/transportedOrder/getlist`, params)
  },

// 长途装载单中的订单列表
  queryOrderListInTransport (params) {
    return axios.post(`${baseUrl}/Loader/getOrderList`, params)
  },

// **************************  已 长 途 运 输 订 单 结 束 (transportedInfo.vue)  **************************

// **************************  待 长 途 运 输 订 单 开 始 (transportingInfo.vue) **************************

// 待长途运输装载单
  queryCurrentTransportingList (params) {
    return axios.post(`${baseUrl}/interface/long_transporting_management/query_loading_info`, params)
  },

// 修改装载单状态
  updateTransportListInfo (params) {
    return axios.post(`${baseUrl}/interface/long_transporting_management/update_loading_state`, params)
  },

// 查询装载单中订单信息
  QueryOrderInfo (params) {
    return axios.post(`${baseUrl}/interface/long_transporting_management/query_order_info`, params)
  },

// **************************  待 长 途 运 输 订 单 结 束  (transportingInfo.vue) **************************
// **************************  待 长 途 直 送 订 单 开 始 (transportingInfo.vue) **************************

// 查询长途直送装载单列表
  queryCurrentTransportDirectList (params) {
    return axios.post(`${baseUrl}/interface/long_transporting_management/query_loading_info`, params)
  },

// 修改长途直送装载单信息
  updateTransportDirectListInfo (params) {
    return axios.post(`${baseUrl}/interface/long_transporting_management/update_loading_state`, params)
  },

// **************************  待 长 途 直 送 订 单 结 束  (transportingInfo.vue) **************************

// **************************  已 中 转 订 单 开 始 (epobolyedInfo.vue)      **************************

// 已中转 （订单）
  queryCurrentEpiboliedList (params) {
    return axios.post(`${baseUrl}/interface/changed_management/query_order_info`, params)
  },

// 查看订单详情
  queryOrderDetail (params) {
    return axios.post(`${baseUrl}/interface/changed_management/query_order_info`, params)
  },

// **************************  已 中 转 订 单 结 束 (epobolyedInfo.vue)  **************************

// **************************  待 中 转 订 单 开 始 (epobolingInfo.vue)  **************************

// 待运输 （订单）
  queryCurrentEpibolingList (params) {
    console.log(`传进来的参数值：${params}`)
    return axios.post(`${baseUrl}/interface/changing_management/query_order_info`, params)
  },

// 编辑
  setCurrentEpibolingEdit (params) {
    return axios.post(`${baseUrl}/interface/changing_management/edit_order`, params)
  },

// 确认中转
  setCurrentEpibolingTransfer (params) {
    return axios.post(`${baseUrl}/interface/changing_management/transfer_order`, params)
  },

// **************************  待 中 转 订 单 结 束 (epobolingInfo.vue)  ******************************
// **************************  库 存 管 理 页 面 开 始  ************************************************
// **************************  库 存 管 理 页 面 结 束  *************************************************

// **************************  魏祎 的接口 ****************************
  getAreaList (params) {
    console.log(`params: ${params}`)
    return fetch(`${baseWeiUrl}/interface/level_two_hubManagement/query_hub`, params)
  }
// **************************  魏祎 的接口 ****************************

}
