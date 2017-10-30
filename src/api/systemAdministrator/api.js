import axios from 'axios'

export function fetch(url, params) {
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
   * 账号注册：获取列表
   * */
  getStationList (params) {
    return fetch('', params)
  },
  /**
   * 账号注册：更新列表
   * */
  updateStationList (params) {
    return fetch('', params)
  }
}
