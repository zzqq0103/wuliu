import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODA0OTk1MzkwNSIsImlhdCI6MTUwNzY4Nzc0OCwic3ViIjoie1wic2l0ZVwiOlwiXCIsXCJyb2xlXCI6XCIyXCIsXCJpZFwiOlwiMTgwNDk5NTM5MDVcIixcInR5cGVcIjpcIjNcIn0iLCJleHAiOjE1MDc2OTEzNDh9.oBEscJ9GtDBdzA7IKOJijz6oNSwgT4p8qnFJ94nVPns'
axios.defaults.baseURL = 'http://10.107.8.131:8080/'
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODA0OTk1MzkwNSIsImlhdCI6MTUwNzcxMjY0Nywic3ViIjoie1wic2l0ZVwiOlwiXCIsXCJyb2xlXCI6XCIyXCIsXCJpZFwiOlwiMTgwNDk5NTM5MDVcIixcInR5cGVcIjpcIjNcIn0iLCJleHAiOjE1MDc3NDg2NDd9.XtVbx3PoMfwaN14F5r5HRgfWmtxEABkfxn-1Z4tcKi4'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `${token}`
  return config
}, (error) => {
  return Promise.reject(error)
})

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
  getTransferFee (params) {
    return fetch('/logistics/interface/change_logi_management/query_order_info', params)
  }
}
