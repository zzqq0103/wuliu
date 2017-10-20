import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.baseURL = 'http://10.107.8.46:8080/'
axios.defaults.timeout = 6000
// http://10.107.8.46:8080/logistics/interface/hubManagement/queryHub
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
  /** 新建预约单页面 */

  // 获取预约单列表（测试）
  getAppoint (params) {
    return fetch('/logistics/interface/reservationManagement/queryReservationByOrderId', params)
  },

  // 根据关键词返回发货方列表
  getSearchFahuo (params) {
    return fetch('/logistics/interface/clientManagemnent/query_client_by_keywords', params)
  },

 // 根据关键词返回发货方列表
  getFahuoRelated (params) {
    return fetch('/logistics/interface/clientManagemnent/query_client_by_keywords', params)
  },

 // 根据关键词返回收货方列表
  getSearchShouhuo (params) {
    return fetch('/logistics/interface/clientManagemnent/query_client_by_keywords', params)
  },

 // 根据关键词返回收货方列表
  getShouhuoRelated (params) {
    return fetch('/logistics/interface/clientManagemnent/query_client_by_keywords', params)
  },

  // 获取始发站/到站列表
  getStationList () {
    return fetch('/logistics/interface/hubManagement/queryHub')
  },

  /** 网点开单页面 */

  // 查看订单列表
  getOrderList (params) {
    return fetch('/logistics/interface/reservationManagement/queryReservationByOrderId', params)
  },
  // 获取网点列表
  getBranch (params) {
    return fetch('/logistics/interface/netBranchesManagement/addBranch', params)
  },

  // 提交订单
  setOrder (params) {
    return fetch('/logistics/interface/netBranchesManagement/addOrder', params)
  },

  /** 长途入库页面 */

  // 获取长途入库列表（筛选，分页）
  getLongLoad (params) {
    return fetch('/logistics/interface/netBranchesManagement/addOrder', params)
  },
  // 编辑提交大车异常
  setDaError (params) {
    return fetch('/logistics/interface/netBranchesManagement/addOrder', params)
  },
  // 根据筛选条件获取某一装载单的所有订单（筛选，无分页）
  getLoadingOrder (params) {
    return fetch('/logistics/interface/netBranchesManagement/addOrder', params)
  },
  // 修改订单状态：正常入库/入库异常
  setOrderStatus (params) {
    return fetch('/logistics/interface/netBranchesManagement/addOrder', params)
  }
}
