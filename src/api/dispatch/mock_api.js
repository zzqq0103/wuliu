/*
 * author: zhangqiang
 * date: 2017/9/29
 * description: This file is used to test api data set
 * */

// 引入axios插件
import axios from 'axios'
const baseUrl = ''
//  **************************  已 送 货 订 单 列 表 开 始  (deliveredInfo.vue) **************************

// 已送货 （订单）
export const getCurrentDeliveredList = params => {
  return axios.post(`${baseUrl}/interface/short_delivered_management/query_delivered_order`, params)
}

// 已送货（子件订单）
export const getCurrentDeliveredSubOrderList = params => {
  return axios.post(`${baseUrl}/interface/short_delivered_management/query_delivered_sub`, params)
}

//  **************************   已 送 货 订 单 列 表 结 束  (deliveredInfo.vue) **************************

//  **************************   待 送 货 订 单 列 表 开 始    (deliveringInfo.vue) **************************

// 待送货（订单）
export const getCurrentDeliveringList = params => {
  // return axios.post(`${baseUrl}/deliveredOrder/getLoadedlist`, params) // mock.js 假数据的接口
  return axios.post(`${baseUrl}/interface/short_delivering_management/query_delivering_order`, params)
}

// 待送货（子件）
export const getCurrentDeliveringSubOrderList = params => {
  return axios.post(`${baseUrl}/interface/short_delivering_management/query_delivering_sub`, params)
}

// **************************    待 送 货 订 单 列 表 结 束   (deliveringInfo.vue)  **************************

// **************************    送 货 手 动 调 度 页 面 接 口 开 始 (manualDeliverlingInfo.vue)  **************************

// 送货手动调度 (订单列表）
export const queryDeliveringReservation = params => {
  return axios.post(`${baseUrl}/interface/short_delivering_dispatch/query_delivering_order`, params)
}

// 点击手动调度
export const manualDeliveringDispatch = params => {
  return axios.post(`${baseUrl}/interface/short_delivering_dispatch/manual_dispatch`, params)
}

// 点击编辑
export const queryManualDeliveringDispatch = params => {
  return axios.post(`${baseUrl}/interface/short_delivering_dispatch/query_manual_dispatch`, params)
}

// **************************    送 货 手 动 调 度 页 面 接 口 结 束 (manualDeliverlingInfo.vue) **************************

// **************************    待 确 认 送 货 调 度 页 面 接 口 开 始 (deliveringAffirm.vue)   **************************

// 送货司机列表显示
export const queryDeliveringCar = params => {
  return axios.post(`${baseUrl}/interface/short_dispatch_confirm/query_delivering_car`, params)
}

// 双击后查看司机送货订单和子件列表及仓库中的订单和子件列表
export const queryDeliveringDispatch = params => {
  return axios.post(`${baseUrl}/interface/short_dispatch_confirm/query_delivering_dispatch`, params)
}

// 调整后点击确认
export const updateDeliveringDispatch = params => {
  return axios.post(`${baseUrl}/interface/short_dispatch_confirm/update_delivering_dispatch`, params)
}

// 调整完，点击司机列表后边的确认
export const updateDeliveringSuccess = params => {
  return axios.post(`${baseUrl}/interface/short_dispatch_confirm/update_delivering_success`, params)
}

// **************************   待 确 认 送 货 调 度 页 面 接 口 结 束 (deliveringAffirm.vue) **************************

// **************************   已 接 货 订 单 列 表     (receivedInfo.vue)   **************************

// 已接货 （订单）
export const getCurrentReceivedList = params => {
  // return axios.post(`${baseUrl}/receivedOrder/getlist`, params) // mock.js 假数据的接口
  return axios.post(`${baseUrl}/interface/short_received_management/query_received_order`, params)
}

// 已接货 （预约单）
export const getCurrentReceivedReservationList = params => {
  return axios.post(`${baseUrl}/interface/short_received_management/query_received_reservation`, params)
}

// 已接货（子件）
export const getCurrentReceivedSubOrderList = params => {
  return axios.post(`${baseUrl}/interface/short_received_management/query_received_sub`, params)
}

// **************************   已 接 货 订 单 结 束      (receivedInfo.vue)   **************************

// **************************   待 接 货 订 单 开 始      (receiveingInfo.vue) **************************

// 待接货 （订单）
export const getCurrentReceivingList = params => {
  return axios.post(`${baseUrl}/interface/short_receiving_management/query_receiving_order`, params)
}

// 待接货 （预约单）
export const getCurrentReceivingReservationList = params => {
  return axios.post(`${baseUrl}/interface/short_receiving_management/query_receiving_reservation`, params)
}

// 待接货 （子件）
export const getCurrentReceivingSubOrderList = params => {
  return axios.post(`${baseUrl}/interface/short_receiving_management/query_receiving_sub`, params)
}

// **************************  待 接 货 订 单 结 束       (receiveingInfo.vue) **************************

// **************************  接 货 手 动 调 度 页 面 接 口 开 始 (manualDeliverlingInfo.vue) **************************

// 接货手动调度
export const queryReceivingReservation = params => {
  return axios.post(`${baseUrl}/interface/short_receiving_dispatch/query_receiving_dispatch`, params)
}

// 点击手动调度
export const manualReceivingDispatch = params => {
  return axios.post(`${baseUrl}/interface/short_receiving_dispatch/manual_dispatch`, params)
}

// 点击编辑
export const queryManualReceivingDispatch = params => {
  return axios.post(`${baseUrl}/interface/short_receiving_dispatch/query_manual_dispatch`, params)
}

// **************************  接 货 手 动 调 度 页 面 接 口 结 束 (manualDeliverlingInfo.vue) **************************

// **************************  已 长 途 运 输 订 单 开 始 (transportedInfo.vue) **************************

// 已长途运输装载单
export const queryCurrentTransportedData = params => {
  // return axios.post(`${baseUrl}/logistics/interface/long_transported_management/query_loading_info`, params)
  return axios.post(`${baseUrl}/transportedOrder/getlist`, params)
}

// 长途装载单中的订单列表
export const queryOrderListInTransport = params => {
  return axios.post(`${baseUrl}/Loader/getOrderList`, params)
}

// **************************  已 长 途 运 输 订 单 结 束 (transportedInfo.vue)  **************************

// **************************  待 长 途 运 输 订 单 开 始 (transportingInfo.vue) **************************

// 待长途运输装载单
export const queryCurrentTransportingList = params => {
  return axios.post(`${baseUrl}/interface/long_transporting_management/query_loading_info`, params)
}

// 修改装载单状态
export const updateTransportListInfo = params => {
  return axios.post(`${baseUrl}/interface/long_transporting_management/update_loading_state`, params)
}

// 查询装载单中订单信息
export const QueryOrderInfo = params => {
  return axios.post(`${baseUrl}/interface/long_transporting_management/query_order_info`, params)
}

// **************************  待 长 途 运 输 订 单 结 束  (transportingInfo.vue) **************************
// **************************  待 长 途 直 送 订 单 开 始 (transportingInfo.vue) **************************

// 查询长途直送装载单列表
export const queryCurrentTransportDirectList = params => {
  return axios.post(`${baseUrl}/interface/long_transporting_management/query_loading_info`, params)
}

// 修改长途直送装载单信息
export const updateTransportDirectListInfo = params => {
  return axios.post(`${baseUrl}/interface/long_transporting_management/update_loading_state`, params)
}

// **************************  待 长 途 直 送 订 单 结 束  (transportingInfo.vue) **************************

// **************************  已 中 转 订 单 开 始 (epobolyedInfo.vue)      **************************

// 已中转 （订单）
export const queryCurrentEpiboliedList = params => {
  return axios.post(`${baseUrl}/interface/changed_management/query_order_info`, params)
}

// 查看订单详情
export const queryOrderDetail = params => {
  return axios.post(`${baseUrl}/interface/changed_management/query_order_info`, params)
}

// **************************  已 中 转 订 单 结 束 (epobolyedInfo.vue)  **************************

// **************************  待 中 转 订 单 开 始 (epobolingInfo.vue)  **************************

// 待运输 （订单）
export const queryCurrentEpibolingList = params => {
  console.log(`传进来的参数值：${params}`)
  return axios.post(`${baseUrl}/interface/changing_management/query_order_info`, params)
}

// 编辑
export const setCurrentEpibolingEdit = params => {
  return axios.post(`${baseUrl}/interface/changing_management/edit_order`, params)
}

// 确认中转
export const setCurrentEpibolingTransfer = params => {
  return axios.post(`${baseUrl}/interface/changing_management/transfer_order`, params)
}

// **************************  待 中 转 订 单 结 束 (epobolingInfo.vue)  ******************************
// **************************  库 存 管 理 页 面 开 始  ************************************************
// **************************  库 存 管 理 页 面 结 束  *************************************************
