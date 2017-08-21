import axios from 'axios'

let baseUrl = ''

// -------  已 送 货 订 单 开 始 --------

// 获取第几页的分页的已送货订单接口
export const getListPage = params => {
  return axios.get(`${baseUrl}/deliveredOrder/listpage`, { params: params })
}

// 获得当前已经运送的订单接口
export const getCurrentDelivered = params => {
  return axios.get(`${baseUrl}/deliveredOrder/getlist`, { params: params })
}

// 获取查询的订单接口
export const getQueryDelivered = params => {
  return axios.get(`${baseUrl}/deliveredOrder/listpage`, { params: params })
}

// -------  已 送 货 订 单 开 始 --------

// -------  已 接 货 订 单 结 束 --------

// -------  已 中 转 订 单 开 始 --------

// -------  已 中 转 订 单 结 束 --------

// -------  已 长 途 运 输 订 单 开 始 --------

// -------  已 长 途 运 输 订 单 结 束 --------

