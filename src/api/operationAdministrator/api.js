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
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODA0OTk1MzkwNSIsImlhdCI6MTUwNzY4NTg5Mywic3ViIjoie1wic2l0ZVwiOlwiXCIsXCJyb2xlXCI6XCIyXCIsXCJpZFwiOlwiMTgwNDk5NTM5MDVcIixcInR5cGVcIjpcIjNcIn0iLCJleHAiOjE1MDc2ODk0OTN9.LwpSQWIW5gGjU-QsAGYZ86h2wWp9KCJfBw-1XZwuWZ0'
axios.defaults.baseURL = 'http://10.107.8.131:8080/'
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  /**
   * 接送货车辆管理
   * **/
  getShortInfo (params) {
    return fetch('', params)
  },
  /**
   * 长途车辆信息管理
   * **/
  getLongInfo (params) {
    return fetch('', params)
  },
//  外包企业信息
  getEnterpriseInfo (params) {
    return fetch('/logistics/interface/change_logi_management/query_order_info', params)
  },
  getEnterpriseLineInfo (params) {
    return fetch('/logistics/interface/comp_line_management/query_order_info', params)
  }

}
