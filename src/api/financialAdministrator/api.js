import axios from 'axios'
// import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.baseURL = 'http://10.107.10.80:8080/'
// axios.defaults.withCredentials = true

// token值，登陆时获取，保存在本地，
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMzgzNTM1NjY2NiIsImlhdCI6MTUwNzc3NTMzMSwic3ViIjoie1wic2l0ZVwiOlwi5YyX5LqsXCIsXCJpZFwiOlwiMTM4MzUzNTY2NjZcIixcInJvbGVcIjpcIui0ouWKoeaguOmUgOS6uuWRmFwiLFwidHlwZVwiOlwiM1wifSIsImV4cCI6MTUwNzc3ODkzMX0.46iOEhEyeklexw2OUmOwT7Wc3C_P6dYdjba-I4HAq_k'
// 发送axios前拦截
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `${token}`
  return config
}, (error) => {
  return Promise.reject(error)
})

// // 返回状态判断
// axios.interceptors.response.use((res) => {
//   if (!res.data.success) {
//     console.log('success')
//     return Promise.reject(res)
//   }
//   if (res.data.result) {
//     console.log('success')
//     return Promise.reject(res)
//   }
//   return res
// }, (error) => {
//   console.log(error)
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
  /**
   *
   * 中转费
   *
   * **/
  // 获取中转费表格数据
  getTransferFee (params) {
    return fetch('/logistics/interface/orderFinanceViewManagement/list_change_fee', params)
  },
  // 核销界面，获取中转费表格数据
  getTransferFee_Ver (params) {
    return fetch('/logistics/interface/orderFinanceViewManagement/extract_stock', params)
  },
  // 核销界面，提交需要核销的订单号列表等。。。
  submitTransferFee (params) {
    return fetch('/logistics/interface/orderFinanceManagement/verify_change_fee', params)
  },

  /**
   *
   * 干线运输费
   *
   * **/
  getTrunkTransport (params) {
    return fetch('/logistics/interface/longViewManageMent/list_long_fee', params)
  },

  /**
   *
   * 三方运输费
   *
   * **/
  // 获取三方运输费表格数据
  getTripartitePayment (params) {
    return fetch('/logistics/interface/orderFinanceViewManagement/list_tril_transfee', params)
  },
  // 核销界面，获取三方运输费表格数据
  getTripartitePayment_Ver (params) {
    return fetch('/logistics/interface/orderFinanceViewManagement/extract_tril_transfee', params)
  },
  // 核销界面，提交需要核销的订单号列表等
  submitTripartitePayment (params) {
    return fetch('/logistics/interface/orderFinanceManagement/verify_tril_transfee', params)
  }

}
