import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {searchByIndexOf, getListDataBySize} from '../filter/util'
import {deliveredLoadedList, transportedList, receivedList, epibolyList} from './data/orderlist'
let _Orderlist = deliveredLoadedList
let _transportedList = transportedList
let _receivedList = receivedList
let _epibolyList = epibolyList
console.log(typeof _Orderlist[0].orderId)

export default {
  bootstrap () {
    let mock = new MockAdapter(axios)
    // 获取到已送货订单列表
    mock.onGet('/deliveredOrder/getLoadedlist').reply(config => {
      let { page, pageSize } = config.params
      let mockList = getListDataBySize(_Orderlist, pageSize, page)
      let pages = _Orderlist.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { orderlists: mockList, totalPages: pages }])
        }, 1000)
      })
    })

    // 获取已送货订单的查询接口
    mock.onGet('/deliveredOrder/getQueryOrderList').reply(config => {
      let { queryName, queryClass } = config.params
      let parseclass = parseInt(queryClass)
      let queryData
      // 装载单查询
      if (parseclass === 1) {
        let mockOrderLists = searchByIndexOf(_Orderlist, queryName, 'deliverOrderId')
        queryData = mockOrderLists
        // 司机姓名查询
      } else if (parseclass === 3) {
        let mockOrderLists = searchByIndexOf(_Orderlist, queryName, 'driverName')
        queryData = mockOrderLists
        // 订单号查询
      } else {
        let mockOrderLists = searchByIndexOf(_Orderlist, queryName, 'orderId')
        queryData = mockOrderLists
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            200,
            { querylists: queryData, totalpages: queryData.length }
          ])
        }, 1000)
      })
    })

    // 获取到已长途运输订单列表
    mock.onGet('/transportedOrder/getlist').reply(config => {
      let { page, pageSize } = config.params
      let mockList = getListDataBySize(_transportedList, pageSize, page)
      let pages = mockList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { orderlists: mockList, totalPages: pages }])
        }, 1000)
      })
    })

    // 获取已长途订单的查询接口
    mock.onGet('/transportedOrder/getQueryOrderList').reply(config => {
      let { queryName, queryClass } = config.params
      let parseclass = parseInt(queryClass)
      let queryData
      // 装载单查询
      if (parseclass === 1) {
        let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'deliverOrderId')
        queryData = mockOrderLists
        // 司机姓名查询
      } else if (parseclass === 3) {
        let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'driverName')
        queryData = mockOrderLists
        // 订单号查询
      } else if (parseclass === 2) {
        let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'orderId')
        queryData = mockOrderLists
      } else {
        // 按到站地点名称查询
        let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'destination')
        queryData = mockOrderLists
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            200,
            { querylists: queryData, totalpages: queryData.length }
          ])
        }, 1000)
      })
    })

     // 获取到已接货订单列表
    mock.onGet('/receivedOrder/getlist').reply(config => {
      let { page, pageSize } = config.params
      let mockList = getListDataBySize(_receivedList, pageSize, page)
      let pages = _receivedList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { orderlists: mockList, totalPages: pages }])
        }, 1000)
      })
    })

    // 获取已接货订单的查询接口
    mock.onGet('/receivedOrder/getQueryOrderList').reply(config => {
      let { queryName, queryClass } = config.params
      let parseclass = parseInt(queryClass)
      let queryData
      // 单号查询
      if (parseclass === 1) {
        let mockOrderLists = searchByIndexOf(_receivedList, queryName, 'orderId')
        queryData = mockOrderLists
        // 发货人姓名查询
      } else if (parseclass === 2) {
        let mockOrderLists = searchByIndexOf(_receivedList, queryName, 'shipper')
        queryData = mockOrderLists
        // 司机姓名查询
      } else {
        let mockOrderLists = searchByIndexOf(_receivedList, queryName, 'driverName')
        queryData = mockOrderLists
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            200,
            { querylists: queryData, totalpages: queryData.length }
          ])
        }, 1000)
      })
    })

     // 获取到已中转订单列表
    mock.onGet('/epiboliedListOrder/getlist').reply(config => {
      let { page, pageSize } = config.params
      let mockList = getListDataBySize(_epibolyList, pageSize, page)
      let pages = _epibolyList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { orderlists: mockList, totalPages: pages }])
        }, 1000)
      })
    })

    // 获取已中转订单的查询接口
    mock.onGet('/epiboliedListOrder/getQueryOrderList').reply(config => {
      let { queryName, queryClass } = config.params
      let parseclass = parseInt(queryClass)
      let queryData
      // 外包企业查询(此处采用模糊搜素)
      if (parseclass === 1) {
        let mockOrderLists = searchByIndexOf(_epibolyList, queryName, 'transitCompany')
        queryData = mockOrderLists
        // 订单查询
      } else {
        let mockOrderLists = searchByIndexOf(_epibolyList, queryName, 'orderId')
        queryData = mockOrderLists
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            200,
            { querylists: queryData, totalpages: queryData.length }
          ])
        }, 1000)
      })
    })
  }
}
