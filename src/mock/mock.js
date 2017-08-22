import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Orderlist } from './data/orderlist'
let _Orderlist = Orderlist
console.log(typeof _Orderlist[0].orderId)

export default {
  bootstrap () {
    let mock = new MockAdapter(axios)
    // 获取到已送货订单列表
    mock.onGet('/deliveredOrder/getlist').reply(config => {
      let {page, pageSize} = config.params
      let mockList = _Orderlist.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))
      let pages = _Orderlist.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: pages}])
        }, 1000)
      })
    })

    mock.onGet('/deliveredOrder/getQueryOrderList').reply(config => {
      let {queryName, queryClass} = config.params
      console.log(`queryName: ${queryName} ${typeof queryName} 和 queryClass: ${parseInt(queryClass)},  ${typeof parseInt(queryClass)}`)
      let parseclass = parseInt(queryClass)
      let queryData
      // 装载单查询
      if (parseclass === 1) {
        console.log(typeof parseInt(queryName))
        let mockOrderLists = _Orderlist.filter(order => {
          console.log(typeof order.deliverOrderId)
          if (queryName && !(order.deliverOrderId === parseInt(queryName))) return false
          return true
        })
        console.log(parseclass)
        queryData = mockOrderLists
        console.log(mockOrderLists)
        // 司机姓名查询
      } else if (parseclass === 3) {
        console.log(typeof parseInt(queryName))
        let mockOrderLists = _Orderlist.filter(order => {
          console.log(typeof order.driverName)
          if (queryName && order.driverName.indexOf(queryName) === -1) return false
          return true
        })
        queryData = mockOrderLists
        console.log(mockOrderLists)
        console.log(parseclass)
        // 订单号查询
      } else {
        console.log(typeof parseInt(queryName))
        let mockOrderLists = _Orderlist.filter(order => {
          console.log(typeof order.orderId)
          if (queryName && !(order.orderId === parseInt(queryName))) return false
          return true
        })
        queryData = mockOrderLists
        console.log(mockOrderLists)
        console.log(parseclass)
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {querylists: queryData, totalpages: queryData.length}])
        }, 1000)
      })
    })
  }
}
