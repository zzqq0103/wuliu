import axios from 'axios'
import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://10.107.10.102:8080/'
// axios.defaults.withCredentials = true

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.parse(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
  if (!res.data.success) {
    return Promise.reject(res)
  }
  return res
}, (error) => {
  return Promise.reject(error)
})

export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
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
    return fetch('/logistics/interface/orderFinanceViewManagement/list_change_fee', {params: params})
  }
}
