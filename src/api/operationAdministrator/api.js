import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000
axios.defaults.baseURL = ''

// POST传参序列化
axios.interceptors.request.use((config) => {
  console.log(config.data)
  if (config.method === 'post') {
    config.data = qs.parse(config.data)
  }
  console.log(config.data)
  return config
}, (error) => {
  console.log(error)
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
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  /**
   *
   * 接送货车辆管理
   *
   * **/
  getShortInfo (params) {
    return fetch('', params)
  }
}
