import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Orderlist } from './data/orderlist'
let _Orderlist = Orderlist

export default {
  bootstarp () {
    let mock = new MockAdapter(axios)
    // 获取到已送货订单列表
    mock.onGet('/deliveredOrder/getlist').reply(config => {
      let {deliverOrderId, driverName, orderId, selectvalue} = config.params
      var mockList = []
      if (selectvalue === 1) {
        let mockOrderLists = _Orderlist.fliter(order => {
          if (deliverOrderId && order.deliverOrderId.indexOf(deliverOrderId) === -1) return false
          return true
        })
        mockList = mockOrderLists
      } else if (selectvalue === 2) {
        let mockOrderLists = _Orderlist.fliter(order => {
          if (driverName && order.driverName.indexOf(driverName) === -1) return false
          return true
        })
        mockList = mockOrderLists
      } else {
        let mockOrderLists = _Orderlist.fliter(order => {
          if (orderId && order.orderId.indexOf(orderId) === -1) return false
          return true
        })
        mockList = mockOrderLists
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { orderlists: mockList }])
        }, 1000)
      })
    })
  }
}
