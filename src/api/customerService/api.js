import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.baseURL = 'http://10.107.8.46:8080/'
// axios.defaults.transformReques = [function (data) {
//   data = Qs.stringify(data);
//   return data;
// }]
axios.default.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.baseURL = 'http://10.107.10.33:8080/' // xubo

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
  // 获取预约单列表（测试）
  getAppoint (params) {
    return fetch('/logistics/interface/reservationManagement/queryReservationByOrderId', params)
  },

  // 获取始发站/到站列表
  getStationList () {
    return fetch('/logistics/interface/hubManagement/queryHub')
  },

  // 获取网点列表
  getBranch (params) {
    return fetch('/logistics/interface/netBranchesManagement/addBranch', params)
  }
}
