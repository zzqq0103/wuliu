import axios from 'axios'
// import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.baseURL = 'http://10.107.10.80:8080/'
// axios.defaults.withCredentials = true

// // POST传参序列化
// axios.interceptors.request.use((config) => {
//   if (config.method === 'post') {
//     config.data = qs.parse(config.data)
//   }
//   return config
// }, (error) => {
//   return Promise.reject(error)
// })

// // 返回状态判断
// axios.interceptors.response.use((res) => {
//   // if (!res.data.success) {
//   //   console.log('success')
//   //   return Promise.reject(res)
//   // }
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
  getTransferFee (params) {
    return fetch('/logistics/interface/orderFinanceViewManagement/list_change_fee', params)
  }
}
