/*
* author: zhangqiang
* date: 2017/9/29
* description: This file is used to transfer query params which get back the result at .vue file
* */

// 引入axios插件
import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
const baseUrl = 'http://10.107.9.102:8080/'

// -------  已 送 货 装 载 单 开 始 --------

// 获得当前已经运送的装载单接口
export const getCurrentDelivered = params => {
  return axios.post(`${baseUrl}/deliveredOrder/getLoadedlist`, params)
}

// 获取查询的订单接口
export const getQueryOrderList = params => {
  return axios.post(`${baseUrl}/deliveredOrder/getQueryOrderList`, params)
}

// -------  已 接 货 订 单 开 始 --------

// 获得当前已经接收的订单接
export const getCurrentReceived = params => {
  return axios.post(`${baseUrl}/receivedOrder/getlist`, params)
}

// 获取查询的接收订单接口
export const getQueryReceiveList = params => {
  return axios.post(`${baseUrl}/receivedOrder/getQueryOrderList`, params)
}
// -------  已 接 货 订 单 结 束 --------

// -------  已 中 转 订 单 开 始 --------

// 获得当前已经中转的订单接口
export const getCurrentEpiboliedList = params => {
  return axios.post(`${baseUrl}/interface/dispat_changed_management`, params)
}
// 获取查询的中转订单接口
export const getQueryEpiboliedList = params => {
  return axios.post(`${baseUrl}/epiboliedListOrder/getQueryOrderList`, params)
}

// -------  已 中 转 订 单 结 束 --------

// -------  已 长 途 运 输 订 单 开 始 --------

// 获得当前已经运送的订单接口
export const getCurrentTransportedData = params => {
  return axios.post(`${baseUrl}/logistics/interface/long_transported_management/query_loading_info 
`, params)
}

// 获取查询的订单接口
export const getQueryTransOrderList = params => {
  return axios.post(`${baseUrl}/transportedOrder/getQueryOrderList`, params)
}

// -------  已 长 途 运 输 订 单 结 束 --------

// 获取装载单中的订单列表
export const getOrderList = params => {
  return axios.post(`${baseUrl}/Loader/getOrderList`, params)
}

