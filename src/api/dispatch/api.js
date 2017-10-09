import axios from 'axios'

let baseUrl = ''

// -------  已 送 货 装 载 单 开 始 --------

// 获得当前已经运送的装载单接口
export const getCurrentDelivered = params => {
  return axios.get(`${baseUrl}/deliveredOrder/getLoadedlist`, {params: params})
}

// 获取查询的订单接口
export const getQueryOrderList = params => {
  return axios.get(`${baseUrl}/deliveredOrder/getQueryOrderList`, {params: params})
}

// -------  已 接 货 订 单 开 始 --------

// 获得当前已经接收的订单接
export const getCurrentReceived = params => {
  return axios.get(`${baseUrl}/receivedOrder/getlist`, {params: params})
}

// 获取查询的接收订单接口
export const getQueryReceiveList = params => {
  return axios.get(`${baseUrl}/receivedOrder/getQueryOrderList`, {params: params})
}
// -------  已 接 货 订 单 结 束 --------

// -------  已 中 转 订 单 开 始 --------

// 获得当前已经中转的订单接口
export const getCurrentEpiboliedList = params => {
  return axios.get(`${baseUrl}/epiboliedListOrder/getlist`, {params: params})
}

// 获取查询的中转订单接口
export const getQueryEpiboliedList = params => {
  return axios.get(`${baseUrl}/epiboliedListOrder/getQueryOrderList`, {params: params})
}

// -------  已 中 转 订 单 结 束 --------

// -------  已 长 途 运 输 订 单 开 始 --------

// 获得当前已经运送的订单接口
export const getCurrentTransportedData = params => {
  return axios.get(`${baseUrl}/transportedOrder/getlist`, {params: params})
}

// 获取查询的订单接口
export const getQueryTransOrderList = params => {
  return axios.get(`${baseUrl}/transportedOrder/getQueryOrderList`, {params: params})
}

// -------  已 长 途 运 输 订 单 结 束 --------

// 获取装载单中的订单列表

export const getOrderList = params => {
  return axios.get(`${baseUrl}/Loader/getOrderList`, {params: params})
}
