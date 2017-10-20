/*
* author: zhangqiang
* date: 2017/9/29
* description: This file is used to transfer query params which get back the result at .vue file
* */

// 引入axios插件
import axios from 'axios'

axios.defaults.headers['Content*Type'] = 'application/json;charset=UTF*8'
const baseUrlJucai = 'http://10.107.8.131:8080/logistics' // 聚才的电脑接口
// const baseUrlNull = ''
const baseUrlXiaohui = 'http://10.107.8.206:8080/logistics' // 晓辉的后端接口地址

// token值，登陆时获取，保存在本地，
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMzIyMjA4OTkxNyIsImlhdCI6MTUwODQ3MDE1NSwic3ViIjoie1wic2l0ZVwiOlwi5YyX5LqsXCIsXCJyb2xlXCI6XCJcIixcImlkXCI6XCIxMzIyMjA4OTkxN1wiLFwidHlwZVwiOlwiMVwifSIsImV4cCI6MTUwODUwNjE1NX0.H0MqexMezd_OyHSSAVBVoot*iWOaHPZOve7ivhD6EVc'
// 发送axios前拦截

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `${token}`
  return config
}, (error) => {
  return Promise.reject(error)
})

//  **************************  已 送 货 订 单 列 表 开 始  (deliveredInfo.vue) **************************

// 当前已送货的订单列表接口
export const getCurrentDeliveredList = params => {
  // return axios.post(`${baseUrlXiaohui}/deliveredOrder/getLoadedlist`, params) // mock.js 假数据的接口
  return axios.post(`${baseUrlXiaohui}/interface/short_delivered_management/query_delivered_order`, params)
}

// 查询已送货的子件列表
export const getCurrentDeliveredSubOrderList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_delivered_management/query_delivered_sub`, params)
}

//  **************************   已 送 货 订 单 列 表 结 束  (deliveredInfo.vue) **************************

//  **************************   待 送 货 订 单 列 表 开 始    (deliveringInfo.vue) **************************

// 查询待送货订单列表
export const getCurrentDeliveringList = params => {
  // return axios.post(`${baseUrlXiaohui}/deliveredOrder/getLoadedlist`, params) // mock.js 假数据的接口
  return axios.post(`${baseUrlXiaohui}/interface/short_delivering_management/query_delivered_order`, params)
}

// 查询待送货的子件列表
export const getCurrentDeliveringSubOrderList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_delivering_management/query_delivering_sub`, params)
}

// **************************    待 送 货 订 单 列 表 结 束   (deliveringInfo.vue)  **************************

// **************************    送 货 手 动 调 度 页 面 接 口 开 始 (manualDeliverlingInfo.vue)  **************************

// 查询接货需要手动调度的预约单列表
export const queryDeliveringReservation = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_delivering_dispatch/query_delivering_reservation`)
}

// 点击手动调度
export const manualDispatch = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_delivering_dispatch/manual_dispatch`)
}

// 点击编辑
export const queryManualDispatch = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_delivering_dispatch/query_manual_dispatch`)
}

// **************************    送 货 手 动 调 度 页 面 接 口 结 束 (manualDeliverlingInfo.vue) **************************

// **************************    待 确 认 送 货 调 度 页 面 接 口 开 始 (deliveringAffirm.vue)   **************************

// 送货司机列表显示
export const queryDeliveringCar = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_dispatch_confirm/query_delivering_car`)
}

// 双击后查看司机送货订单和子件列表及仓库中的订单和子件列表
export const queryDeliveringDispatch = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_dispatch_confirm/query_delivering_dispatch`)
}

// 调整后点击确认
export const updateDeliveringDispatch = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_dispatch_confirm/update_delivering_dispatch`)
}

// 调整完，点击司机列表后边的确认
export const updateDeliveringSuccess = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_dispatch_confirm/update_delivering_success`)
}

// **************************   待 确 认 送 货 调 度 页 面 接 口 结 束 (deliveringAffirm.vue) **************************

// **************************   已 接 货 订 单 列 表     (receivedInfo.vue)   **************************

// 查询已接货订单列表
export const getCurrentReceivedList = params => {
  // return axios.post(`${baseUrlXiaohui}/receivedOrder/getlist`, params) // mock.js 假数据的接口
  return axios.post(`${baseUrlXiaohui}/interface/short_received_management/query_received_order`, params)
}

// 查询已接货的预约单列表
export const getCurrentReceivedReservationList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_received_management/query_received_reservation`, params)
}

// 查询已接货的子件列表
export const getCurrentReceivedSubOrderList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_received_management/query_received_sub`, params)
}

// **************************   已 接 货 订 单 结 束      (receivedInfo.vue)   **************************

// **************************   待 接 货 订 单 开 始      (receiveingInfo.vue) **************************

// 查询待接货订单列表
export const getCurrentReceivingList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_receiving_management/query_receiving_order`, params)
}

// 查询待接货的预约单列表
export const getCurrentReceivingReservationList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_receiving_management/query_receiving_reservation`, params)
}

// 查询待接货的子件列表
export const getCurrentReceivingSubOrderList = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_receiving_management/query_receiving_sub`, params)
}

// **************************  待 接 货 订 单 结 束       (receiveingInfo.vue) **************************

// **************************  接 货 手 动 调 度 页 面 接 口 开 始 (manualDeliverlingInfo.vue) **************************

// 查询接货需要手动调度的预约单列表
export const queryReceivingReservation = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_receiving_dispatch/query_receiving_dispatch`)
}

// 点击手动调度
export const manualReceivingDispatch = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_receiving_dispatch/manual_dispatch`)
}

// 点击编辑
export const queryManualReceivingDispatch = params => {
  return axios.post(`${baseUrlXiaohui}/interface/short_receiving_dispatch/query_manual_dispatch`)
}

// **************************  接 货 手 动 调 度 页 面 接 口 结 束 (manualDeliverlingInfo.vue) **************************

// **************************  已 长 途 运 输 订 单 开 始 (transportedInfo.vue) **************************

// 获得当前已运输的订单接口
export const getCurrentTransportedData = params => {
  // return axios.post(`${baseUrl}/logistics/interface/long_transported_management/query_loading_info`, params)
  return axios.post(`${baseUrlJucai}/transportedOrder/getlist`, params)
}

// 查询已运输订单接口
export const getQueryTransOrderList = params => {
  return axios.post(`${baseUrlJucai}/transportedOrder/getQueryOrderList`, params)
}

// 获取装载单中的订单列表
export const getOrderList = params => {
  return axios.post(`${baseUrlJucai}/Loader/getOrderList`, params)
}

// **************************  已 长 途 运 输 订 单 结 束 (transportedInfo.vue)  **************************

// **************************  待 长 途 运 输 订 单 开 始 (transportingInfo.vue) **************************

// 查询待运输装载单
export const getCurrentTransportingList = params => {
  return axios.post(`${baseUrlJucai}/interface/long_transporting_management/query_loading_info`)
}

// 修改装载单状态
export const updateTransportListInfo = params => {
  return axios.post(`${baseUrlJucai}/interface/long_transporting_management/update_loading_state`)
}

// 查询装载单中订单信息
export const getQueryOrderInfo = params => {
  return axios.post(`${baseUrlJucai}/interface/long_transporting_management/query_order_info`)
}

// **************************  待 长 途 运 输 订 单 结 束  (transportingInfo.vue) **************************

// **************************  已 中 转 订 单 开 始 (epobolyedInfo.vue)      **************************

// 获得当前已中转的订单列表
export const getCurrentEpiboliedList = params => {
  return axios.post(`${baseUrlJucai}/interface/changed_management/query_order_info`, params)
}

// 查看订单详情
export const getOrderDetail = params => {
  return axios.post(`${baseUrlJucai}/interface/changed_management/query_order_info`, params)
}

// **************************  已 中 转 订 单 结 束 (epobolyedInfo.vue)  **************************

// **************************  待 中 转 订 单 开 始 (epobolingInfo.vue)  **************************

// 查询待运输订单
export const getCurrentEpibolingList = params => {
  console.log(`传进来的参数值：${params}`)
  return axios.post(`${baseUrlJucai}/interface/changing_management/query_order_info`, params)
}

// 编辑
export const getCurrentEpibolingEdit = params => {
  return axios.post(`${baseUrlJucai}/interface/changing_management/edit_order`, params)
}

// 确认中转
export const getCurrentEpibolingTransfer = params => {
  return axios.post(`${baseUrlJucai}/interface/changing_management/transfer_order`, params)
}

// **************************  待 中 转 订 单 结 束 (epobolingInfo.vue)  **************************
