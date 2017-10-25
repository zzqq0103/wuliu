import Mock from 'mockjs'

// 已送货订单列表
const deliveredLoadedList = []

// 已送货订单子件列表
const deliveredLoadedSubList = []

// 待送货订单列表
const deliveringLoadingList = []

// 待送货子件订单列表
const deliveringLoadingSubList = []

// 手动调度（送货）
const manualDeliverlingList = []

// 待确认订单列表
const deliveringAffirmList = []

// 已长途运输装载单列表
const transportedList = []

// 待长途运输装载单列表
const transportingList = []

// 已接货订单列表
const receivedList = []

// 待接货订单列表
const receivingList = []

// 已接货子件订单列表
const receivedSubList = []

// 待接货子件订单列表
const receivingSubList = []

// 已接货预约单订单列表
const receivedReservationList = []

// 待接货子件订单列表
const receivingReservationList = []

// 手动调度 （接货）
const manualreceivingList = []

// 已中转订单列表
const epibolyList = []

// 待中转订单列表
const epibolingList = []

// 装载单中的订单列表
const orderList = []

// 订单表、子件表、预约单表 的数据
for (let i = 0; i < 25; i++) {
  // 订单表
  // orderList.push(Mock.mock({
  //   orderId:
  // }))
}

// 所有“已完成”页面的数据
for (let i = 0; i < 100; i++) {
  // “已送货” 订单数据
  deliveredLoadedList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    orderTim: Mock.mock('@date()'),
    receNam: Mock.mock('@cname'),
    receTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    receAdr: Mock.mock('@county(true)'),
    receArea: Mock.mock('@county(true)'),
    goodsNam: '重货',
    driverNam: Mock.mock('@cname()'),
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 15,
    'tonnage|1-20': 20,
    'capacity|1-20': 25,
    clieOrderNote: '客户订单备注',
    inteOrderNote: '内部订单备注'
  }))

  // “已送货” 子件数据
  deliveredLoadedSubList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    subId: Mock.mock('@string("number",8)'),
    orderTim: Mock.mock('@date()'),
    receNam: Mock.mock('@cname'),
    receTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    receAdr: Mock.mock('@county(true)'),
    receArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25
  }))

  // “已收货” 订单数据
  receivedList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    orderTim: Mock.mock('@date()'),
    shipNam: Mock.mock('@cname'),
    shipTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    shipAdr: Mock.mock('@county(true)'),
    shipArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25,
    clieOrderNote: '客户订单备注',
    inteOrderNote: '内部订单备注'
  }))

  // “已收货” 子件数据
  receivedSubList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    subId: Mock.mock('@string("number"),10'),
    orderTim: Mock.mock('@date()'),
    shipNam: Mock.mock('@cname'),
    shipTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    shipAdr: Mock.mock('@county(true)'),
    shipArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25
  }))

  // “已收货” 预约单数据
  receivedReservationList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    reserveTim: Mock.mock('@date()'),
    shipNam: Mock.mock('@cname'),
    shipTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    pickUpAdr: Mock.mock('@county(true)'),
    shipArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25,
    note: '预约单备注'
  }))

  // “已长途装载”装载单数据
  transportedList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    loadOrderId: Mock.mock('@string("number",5)'),
    loadOrderStatus: '已分配 已确认',
    adjustmentStatus: '已调整',
    startStation: Mock.mock('@county(true)'),
    endStation: Mock.mock('@county(true)'),
    driverName: Mock.mock('@cname'),
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    departTime: Mock.mock('@date()'),
    arriveTime: Mock.mock('@date()'),
    gross: Mock.mock('@integer(10000,30000)'),
    freight: Mock.mock('@integer(8000,20000)'),
    transhipment: Mock.mock('@integer(1000,6000)'),
    refund: Mock.mock('@integer(1000,5000)'),
    sendFee: Mock.mock('@integer(1000,3000)'),
    'allWeights|1-50': 50,
    'allVolumes|1-50': 50,
    'allNumbers|1-100': 100,
    dispatcherName: Mock.mock('@cname()'),
    dispatcherId: Mock.mock('@string("number",5)'),
    remarks: Mock.mock('@csentence()')
  }))

  // “已中转”订单数据
  epibolyList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    orderTim: Mock.mock('@datetime'),
    arrStation: Mock.mock('@county(true)'),
    changeStart: Mock.mock('@city()'),
    rouSelection: Mock.mock('@csentence'),
    changeFee: Mock.mock('@integer(100,2000)'),
    contractPrice: Mock.mock('@integer(100,2000)'),
    lineNam: Mock.mock('@cname'),
    lineTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    shipNam: Mock.mock('@cname'),
    receNam: Mock.mock('@cname'),
    goodsNam: Mock.mock('@cname'),
    package: Mock.mock('@ctitle(5)'),
    'goodsNums|1-50': 50,
    'goodsWeight|1-50': 50,
    'goodsVolumn|1-50': 50,
    orderNote: Mock.mock('@csentence(10,20)')
  }))
}

// 所有“待完成”的页面的数据
for (let i = 0; i < 100; i++) {
  // “待送货” 订单数据
  deliveringLoadingList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    orderTim: Mock.mock('@date()'),
    receNam: Mock.mock('@cname'),
    receTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    receAdr: Mock.mock('@county(true)'),
    receArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25,
    clieOrderNote: '客户订单备注',
    inteOrderNote: '内部订单备注'
  }))

  // “待送货” 子件数据
  deliveringLoadingSubList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    subId: Mock.mock('@string("number"),10'),
    orderTim: Mock.mock('@date()'),
    receNam: Mock.mock('@cname'),
    receTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    receAdr: Mock.mock('@county(true)'),
    receArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25
  }))

  // “待接货” 订单数据
  receivingList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    orderTim: Mock.mock('@date()'),
    shipNam: Mock.mock('@cname'),
    shipTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    shipAdr: Mock.mock('@county(true)'),
    shipArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25,
    clieOrderNote: '客户订单备注',
    inteOrderNote: '内部订单备注'
  }))

  // “待接货” 子件数据
  receivingSubList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    subId: Mock.mock('@string("number"),10'),
    orderTim: Mock.mock('@date()'),
    shipNam: Mock.mock('@cname'),
    shipTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    shipAdr: Mock.mock('@county(true)'),
    shipArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25
  }))

  // “待接货” 预约单数据
  receivingReservationList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    reserveTim: Mock.mock('@date()'),
    shipNam: Mock.mock('@cname'),
    shipTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    pickUpAdr: Mock.mock('@county(true)'),
    shipArea: Mock.mock('@county(true)'),
    goodsNam: Mock.mock('@ctitle(5)'),
    driverNam: '货物',
    driverTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    licePlateNum: Mock.mock('@string("number",5)'),
    goodsPackage: '箱装',
    'goodsNums|1-20': 15,
    'goodsWeight|1-20': 16,
    'goodsVolumn|1-20': 17,
    'tonnage|1-20': 20,
    'capacity|1-20': 25,
    note: '预约单备注'
  }))

  // “待长途装载”装载单数据
  transportingList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    loadOrderId: Mock.mock('@string("number",5)'),
    loadOrderStatus: '已分配 已确认',
    adjustmentStatus: '已调整',
    startStation: Mock.mock('@county(true)'),
    endStation: Mock.mock('@county(true)'),
    driverName: Mock.mock('@cname'),
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    departTime: Mock.mock('@date()'),
    arriveTime: Mock.mock('@date()'),
    gross: Mock.mock('@integer(10000,30000)'),
    freight: Mock.mock('@integer(8000,20000)'),
    transhipment: Mock.mock('@integer(1000,6000)'),
    refund: Mock.mock('@integer(1000,5000)'),
    sendFee: Mock.mock('@integer(1000,3000)'),
    'allWeights|1-50': 50,
    'allVolumes|1-50': 50,
    'allNumbers|1-100': 100,
    dispatcherName: Mock.mock('@cname()'),
    dispatcherId: Mock.mock('@string("number",5)'),
    remarks: Mock.mock('@csentence()')
  }))

  // “待中转”订单数据
  epibolingList.push(Mock.mock({
    id: Mock.mock('@increment(1)'),
    orderId: Mock.mock('@string("number",5)'),
    orderTim: Mock.mock('@datetime'),
    arrStation: Mock.mock('@county(true)'),
    changeStart: Mock.mock('@city()'),
    rouSelection: Mock.mock('@csentence'),
    changeFee: Mock.mock('@integer(100,2000)'),
    contractPrice: Mock.mock('@integer(100,2000)'),
    lineNam: Mock.mock('@cname'),
    lineTel: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    shipNam: Mock.mock('@cname'),
    receNam: Mock.mock('@cname'),
    goodsNam: Mock.mock('@cname'),
    package: Mock.mock('@ctitle(5)'),
    'goodsNums|1-50': 50,
    'goodsWeight|1-50': 50,
    'goodsVolumn|1-50': 50,
    orderNote: Mock.mock('@csentence(10,20)')
  }))
}

// “手动调度” 部分页面的数据
for (let i = 0; i < 100; i++) {
  // 接货部分
  // 送货部分
}

// 库存部分
for (let i = 0; i < 100; i++) {
  // 库存部分
}

export {
  deliveredLoadedList,
  transportedList,
  receivedList,
  epibolyList,
  deliveringLoadingList,
  receivingList,
  transportingList,
  epibolingList,
  orderList,
  manualDeliverlingList,
  manualreceivingList,
  deliveringAffirmList,
  deliveredLoadedSubList,
  deliveringLoadingSubList,
  receivedSubList,
  receivingSubList,
  receivingReservationList,
  receivedReservationList
}
