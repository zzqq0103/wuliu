import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {getListDataBySize} from '../filter/util'
import * as mockData from './data/orderlist'
const host = ''

export default {
  bootstrap () {
    let mock = new MockAdapter(axios)

    // 订单列表数据
    // mock.onPost(`${host}/interface/short_delivered_management/orderList`).reply(config => {
    //   let mockList = mockData.orderList
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: mockList, totalPages: mockData.deliveredLoadedList.length}])
    //     }, 1000)
    //   })
    // })

    // 已送货 （订单）
    mock.onPost(`${host}/interface/short_delivered_management/query_delivered_order`).reply(config => {
      let {pageNum, recordNum} = JSON.parse(config.data)
      console.log(`pageNum : ${pageNum}`)
      let mockList = getListDataBySize(mockData.deliveredLoadedList, recordNum, pageNum)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: mockData.deliveredLoadedList.length}])
        }, 1000)
      })
    })

    // 已送货 （子件）
    mock.onPost(`${host}/interface/short_delivered_management/query_delivered_sub`).reply(config => {
      let {pageNum, recordNum} = JSON.parse(config.data)
      console.log(`pageNum : ${pageNum}`)
      let mockList = getListDataBySize(mockData.deliveredLoadedSubList, recordNum, pageNum)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: mockData.deliveredLoadedSubList.length}])
        }, 1000)
      })
    })

    // // 待送货 （订单）
    mock.onPost(`${host}/interface/short_delivering_management/query_delivering_order`).reply(config => {
      let {pageNum, recordNum} = JSON.parse(config.data)
      console.log(`pageNum : ${pageNum}`)
      let mockList = getListDataBySize(mockData.deliveringLoadingList, recordNum, pageNum)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: mockData.deliveringLoadingList.length}])
        }, 1000)
      })
    })

    // 待送货 （子件）
    mock.onPost(`${host}/interface/short_delivering_management/query_delivering_sub`).reply(config => {
      let {pageNum, recordNum} = JSON.parse(config.data)
      console.log(`pageNum : ${pageNum}`)
      let mockList = getListDataBySize(mockData.deliveringLoadingSubList, recordNum, pageNum)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: mockData.deliveringLoadingSubList.length}])
        }, 1000)
      })
    })

    // 待确认（ 司机--订单）数据接口
    mock.onPost(`${host}/interface/short_dispatch_confirm/query_delivering_car`).reply(config => {
      let {pageNum, recordNum} = JSON.parse(config.data)
      console.log(`pageNum : ${pageNum}`)
      let mockList = getListDataBySize(mockData.deliveringCarList, recordNum, pageNum)
      console.log(mockList)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockList, totalPages: mockData.deliveringCarList.length}])
        }, 1000)
      })
    })

    // 双击后查看司机送货订单和子件列表及仓库中的订单和子件列表
    mock.onPost(`${host}/interface/short_dispatch_confirm/query_delivering_dispatch`).reply(config => {
      console.log(JSON.parse(config.data))
      let mockListLeft = mockData.deliveringWarehouse
      let mockListRight = mockData.deliveringDriver
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {orderlists: mockListLeft, deliveringDriverList: mockListRight, totalPages: mockData.deliveringCarList.length}])
        }, 1000)
      })
    })

    // // 已接货 （订单）
    // mock.onPost(`${host}/interface/short_delivered_management/getCurrentDeliveredList`).reply(config => {
    //   console.log(config)
    //   let {page, pageSize} = JSON.parse(config.data)
    //   let mockList = getListDataBySize(_deliveredLoadedList, pageSize, page)
    //   let pages = _deliveredLoadedList.length
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: mockList, totalPages: pages}])
    //     }, 1000)
    //   })
    // })
    //
    // // 已接货 （子件）
    // mock.onPost('/deliveredOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 装载单查询
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'deliverOrderId')
    //     queryData = mockOrderLists
    //     // 司机姓名查询
    //   } else if (parseclass === 3) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'driverName')
    //     queryData = mockOrderLists
    //     // 订单号查询
    //   } else {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 已接货 （预约单）
    // mock.onPost('/deliveredOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 装载单查询
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'deliverOrderId')
    //     queryData = mockOrderLists
    //     // 司机姓名查询
    //   } else if (parseclass === 3) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'driverName')
    //     queryData = mockOrderLists
    //     // 订单号查询
    //   } else {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 待接货 （订单）
    // mock.onPost(`${host}/interface/short_delivered_management/getCurrentDeliveredList`).reply(config => {
    //   console.log(config)
    //   let {page, pageSize} = JSON.parse(config.data)
    //   let mockList = getListDataBySize(_deliveredLoadedList, pageSize, page)
    //   let pages = _deliveredLoadedList.length
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: mockList, totalPages: pages}])
    //     }, 1000)
    //   })
    // })
    //
    // // 待接货 （子件）
    // mock.onPost('/deliveredOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 装载单查询
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'deliverOrderId')
    //     queryData = mockOrderLists
    //     // 司机姓名查询
    //   } else if (parseclass === 3) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'driverName')
    //     queryData = mockOrderLists
    //     // 订单号查询
    //   } else {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 待接货 （预约单）
    // mock.onPost('/deliveredOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 装载单查询
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'deliverOrderId')
    //     queryData = mockOrderLists
    //     // 司机姓名查询
    //   } else if (parseclass === 3) {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'driverName')
    //     queryData = mockOrderLists
    //     // 订单号查询
    //   } else {
    //     let mockOrderLists = searchByIndexOf(_deliveredLoadedList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 已长途运输 （装载单）
    // mock.onPost('/transportedOrder/getlist').reply(config => {
    //   let {page, pageSize} = JSON.parse(config.data)
    //   let mockList = getListDataBySize(_transportedList, pageSize, page)
    //   let pages = mockList.length
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: mockList, totalPages: pages}])
    //     }, 1000)
    //   })
    // })
    //
    // // 待长途运输 （装载单）
    // mock.onPost('/transportedOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 装载单查询
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'deliverOrderId')
    //     queryData = mockOrderLists
    //     // 司机姓名查询
    //   } else if (parseclass === 3) {
    //     let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'driverName')
    //     queryData = mockOrderLists
    //     // 订单号查询
    //   } else if (parseclass === 2) {
    //     let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //   } else {
    //     // 按到站地点名称查询
    //     let mockOrderLists = searchByIndexOf(_transportedList, queryName, 'destination')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 长途直送 （装载单）
    // mock.onPost('/receivedOrder/getlist').reply(config => {
    //   let {page, pageSize} = JSON.parse(config.data)
    //   let mockList = getListDataBySize(_receivedList, pageSize, page)
    //   let pages = _receivedList.length
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: mockList, totalPages: pages}])
    //     }, 1000)
    //   })
    // })
    //
    // // 已中转 （订单）
    // mock.onPost('/receivedOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 单号查询
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_receivedList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //     // 发货人姓名查询
    //   } else if (parseclass === 2) {
    //     let mockOrderLists = searchByIndexOf(_receivedList, queryName, 'shipper')
    //     queryData = mockOrderLists
    //     // 司机姓名查询
    //   } else {
    //     let mockOrderLists = searchByIndexOf(_receivedList, queryName, 'driverName')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 待中转 （订单）
    // mock.onPost('/epiboliedListOrder/getlist').reply(config => {
    //   let {page, pageSize} = JSON.parse(config.data)
    //   let mockList = getListDataBySize(_epibolyList, pageSize, page)
    //   let pages = _epibolyList.length
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: mockList, totalPages: pages}])
    //     }, 1000)
    //   })
    // })
    //
    // // 订单详情
    // mock.onPost('/epiboliedListOrder/getQueryOrderList').reply(config => {
    //   let {queryName, queryClass} = JSON.parse(config.data)
    //   let parseclass = parseInt(queryClass)
    //   let queryData
    //   // 外包企业查询(此处采用模糊搜素)
    //   if (parseclass === 1) {
    //     let mockOrderLists = searchByIndexOf(_epibolyList, queryName, 'transitCompany')
    //     queryData = mockOrderLists
    //     // 订单查询
    //   } else {
    //     let mockOrderLists = searchByIndexOf(_epibolyList, queryName, 'orderId')
    //     queryData = mockOrderLists
    //   }
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([
    //         200,
    //         {querylists: queryData, totalpages: queryData.length}
    //       ])
    //     }, 1000)
    //   })
    // })
    //
    // // 库存仓库管理
    // mock.onPost('/Loader/getOrderList').reply(config => {
    //   let pages = _orderList.length
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve([200, {orderlists: _orderList, totalPages: pages}])
    //     }, 1000)
    //   })
    // })
  }
}
