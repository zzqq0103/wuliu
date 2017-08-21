import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Orderlist } from './data/orderlist'
let _Orderlist = Orderlist

export default {
  bootstrap () {
    let mock = new MockAdapter(axios)
    // 获取到已送货订单列表
    mock.onGet('/deliveredOrder/getlist').reply(config => {
      let {page} = config.params
      // if (selectvalue === 1) {
        // let mockOrderLists = _Orderlist.filter(order => {
        //   if (deliverOrderId && order.deliverOrderId.indexOf(deliverOrderId) === -1) return false
        //   return true
        // })
      let mockList = _Orderlist.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
      // } else if (selectvalue === 2) {
        // let mockOrderLists = _Orderlist.filter(order => {
        //   if (driverName && order.driverName.indexOf(driverName) === -1) return false
        //   return true
        // })
        // mockList = _Orderlist.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
      // } else {
        // let mockOrderLists = _Orderlist.filter(order => {
        //   if (orderId && order.orderId.indexOf(orderId) === -1) return false
        //   return true
        // })
        // mockList = _Orderlist.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
      // }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { orderlists: mockList }])
        }, 1000)
      })
    })
     // 获取分页的已送货的数据（分页）
    // mock.onGet('/deliveredOrder/listpage').reply(config => {
    //   let {page} = config.params
    //   let mockList = _Orderlist
    //   let total = mockList.length
    //   mockList = mockList.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {
    //         totallists: total,
    //         orderlists: mockList
    //       }])
    //     }, 1000)
    //   })
    // })
  }
}
