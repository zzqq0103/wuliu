import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {searchByIndexOf, getListDataBySize} from '../filter/util'
import {deliveredLoadedList, transportedList, receivedList, epibolyList, orderList} from './data/orderlist'
let _deliveredLoadedList = deliveredLoadedList
let _transportedList = transportedList
let _receivedList = receivedList
let _epibolyList = epibolyList
let _orderList = orderList
// console.log(typeof _deliveredLoadedList[0].orderId)

export default {
  bootstrap () {
    let mock = new MockAdapter(axios)

    // 获取到已送货订单列表,Get请求
    mock.onPost('/deliveredOrder/getLoadedlist').reply(config => {
      console.log(config)
      let {page, pageSize} = JSON.parse(config.data)
      let mockList = getListDataBySize(_deliveredLoadedList, pageSize, page)
      let pages = _deliveredLoadedList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: pages}])
        }, 1000)
      })
    })

    // 获取已送货订单的查询接口，post请求
    mock.onPost('/deliveredOrder/getQueryOrderList').reply(config => {
      let {queryName, queryClass} = JSON.parse(config.data)
      let parseclass = parseInt(queryClass)
      let queryData
      // 装载单查询
      if (parseclass === 1) {
        let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'deliverOrderId')
        queryData = mockOrderLists
        // 司机姓名查询
      } else if (parseclass === 3) {
        let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'driverName')
        queryData = mockOrderLists
        // 订单号查询
      } else {
        let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'orderId')
        queryData = mockOrderLists
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            200,
            {querylists: queryData, totalpages: queryData.length}
          ])
        }, 1000)
      })
    })

    // 获取到已长途运输订单列表
    mock.onPost('/transportedOrder/getlist').reply(config => {
      let {page, pageSize} = JSON.parse(config.data)
      let mockList = getListDataBySize(_transportedList, pageSize, page)
      let pages = mockList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: pages}])
        }, 1000)
      })
    })

    // 获取已长途订单的查询接口
    mock.onPost('/transportedOrder/getQueryOrderList').reply(config => {
      let {queryName, queryClass} = JSON.parse(config.data)
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
            {querylists: queryData, totalpages: queryData.length}
          ])
        }, 1000)
      })
    })

    // 获取到已接货订单列表
    mock.onPost('/receivedOrder/getlist').reply(config => {
      let {page, pageSize} = JSON.parse(config.data)
      let mockList = getListDataBySize(_receivedList, pageSize, page)
      let pages = _receivedList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: pages}])
        }, 1000)
      })
    })

    // 获取已接货订单的查询接口
    mock.onPost('/receivedOrder/getQueryOrderList').reply(config => {
      let {queryName, queryClass} = JSON.parse(config.data)
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
            {querylists: queryData, totalpages: queryData.length}
          ])
        }, 1000)
      })
    })

    // 获取到已中转订单列表
    mock.onPost('/epiboliedListOrder/getlist').reply(config => {
      let {page, pageSize} = JSON.parse(config.data)
      let mockList = getListDataBySize(_epibolyList, pageSize, page)
      let pages = _epibolyList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: pages}])
        }, 1000)
      })
    })

    // 获取已中转订单的查询接口
    mock.onPost('/epiboliedListOrder/getQueryOrderList').reply(config => {
      let {queryName, queryClass} = JSON.parse(config.data)
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
            {querylists: queryData, totalpages: queryData.length}
          ])
        }, 1000)
      })
    })

    // 获取装载单订单列表
    mock.onPost('/Loader/getOrderList').reply(config => {
      let pages = _orderList.length
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: _orderList, totalPages: pages}])
        }, 1000)
      })
    })
  }
}
