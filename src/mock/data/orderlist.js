import Mock from 'mockjs'

// 已送货装载单列表
const deliveredLoadedList = []

// 待送货装载单列表
const deliveringLoadingList = []

// 已长途运输完成装载单列表
const transportedList = []

// 待长途运输完成装载单列表
const transportingList = []

// 已接货完成订单列表
const receivedList = []

// 待接货完成订单列表
const receivingList = []

// 已中转完成订单列表
const epibolyList = []

// 待中转订单列表
const epibolingList = []

// 装载单中的订单列表
const orderList = []

// 所有“已完成”页面的数据
for (let i = 0; i < 100; i++) {
  // “已送货”装载单数据
  deliveredLoadedList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 装载单号
    loadOrderId: Mock.mock('@string("number",5)'),
    // 装载单状态
    // loadOrderStatus: Mock.mock({
    //   'object|1': {
    //     'checkFail': '已分配 已确认'
    //   }
    // }),
    // 装载单状态
    loadOrderStatus: '已分配 已确认',
    // // 调整状态
    // adjustmentStatus: Mock.mock({
    //   'object|1': {
    //     'adjusted': ' 已调整',
    //     'unAdjust': '未调整'
    //   }
    // }),
    // 调整状态
    adjustmentStatus: '已调整',
    // 所属仓库
    warehouse: Mock.mock('@string("number",5)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货时间
    deliverTime: Mock.mock('@date()'),
    // 发货备注
    // deliverRemark: Mock.mock('@csentence(10,20)'),
    deliveRemarks: '货物A 巴啦啦巴啦啦巴啦啦巴啦啦',
    // 总重量
    allWeights: Mock.mock('@integer(1,100)'),
    // 总体积
    allVolumes: Mock.mock('@integer(1,100)'),
    // 总件数
    allNumbers: Mock.mock('@integer(1,50)'),
    // 调度管理员ID
    dispatcherId: Mock.mock('@string("number",5)'),
    // 调度管理员姓名
    dispatcherName: Mock.mock('@cname()'),
    // 备注
    remarks: Mock.mock('@csentence()')
  }))
  // “已收货”订单数据
  receivedList.push(Mock.mock({
    //  序号
    id: Mock.mock('@increment(1)'),
    // 单号
    orderId: Mock.mock('@string("number",5)'),
    // 开单时间
    orderDate: Mock.mock('@datetime'),
    // 发货单位
    forwarding: Mock.mock('@county(true)'),
    // 发货人姓名
    shipper: Mock.mock('@cname'),
    // 发货人联系电话
    phone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 取货地址
    receivedAddr: Mock.mock('@county(true)'),
    // 取货货物区域
    receivedArea: Mock.mock('@character("upper")'),
    // 货物名称
    goodsName: Mock.mock('@ctitle(5)'),
    // 包装
    pack: Mock.mock('@ctitle(5)'),
    // 货物件数
    'numbers|1-50': 50,
    // 重量
    'weight|1-50': 50,
    // 体积
    'volume|1-50': 50,
    // 接货司机姓名
    driverName: Mock.mock('@cname'),
    // 接货司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 接货司机车牌号
    carLicence: Mock.mock('@province') + '--' + Mock.mock('@character("lower")') + /\d{5}/,
    // 车载吨位
    'carTon|10-30': 30,
    // 车载容量
    'carVolume|5-100': 100,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))
  // “已长途装载”装载单数据
  transportedList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 装载单号
    loadOrderId: Mock.mock('@string("number",5)'),
    // 装载单状态
    loadOrderStatus: '已分配 已确认',
    // // 调整状态
    // adjustment: Mock.mock({
    //   'object|1': {
    //     'adjusted': ' 已调整',
    //     'unAdjust': '未调整'
    //   }
    // }),
    // 调整状态
    adjustmentStatus: '已调整',
    // 起始站
    startStation: Mock.mock('@county(true)'),
    // 到达站
    endStation: Mock.mock('@county(true)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发车时间
    departTime: Mock.mock('@date()'),
    // 预计到达时间
    arriveTime: Mock.mock('@date()'),
    // 大车总；毛利
    gross: Mock.mock('@integer(10000,30000)'),
    // 总运费
    freight: Mock.mock('@integer(8000,20000)'),
    // 总中转费
    transhipment: Mock.mock('@integer(1000,6000)'),
    // 总返款
    refund: Mock.mock('@integer(1000,5000)'),
    // 总提送费
    sendFee: Mock.mock('@integer(1000,3000)'),
    // 总重量
    'allWeights|1-50': 50,
    // 总体积
    'allVolumes|1-50': 50,
    // 总件数
    'allNumbers|1-100': 100,
    // 调度管理员姓名
    dispatcherName: Mock.mock('@cname()'),
    // 调度管理员账号
    dispatcherId: Mock.mock('@string("number",5)'),
    // 备注
    remarks: Mock.mock('@csentence()')
  }))
  // “已中转”订单数据
  epibolyList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 订单号
    orderId: Mock.mock('@string("number",5)'),
    // 开单日期
    orderDate: Mock.mock('@datetime'),
    // 到站点
    destinaiton: Mock.mock('@county(true)'),
    // 中转起始站
    transitOpen: Mock.mock('@city()'),
    // 中转外包公司
    transitCompany: Mock.mock('@csentence'),
    // 中转花费
    contractSpend: Mock.mock('@integer(100,2000)'),
    // 合同价格
    contractPrice: Mock.mock('@integer(100,2000)'),
    // 外包企业联系人
    ectocyster: Mock.mock('@cname'),
    // 外包企业联系电话
    ectocystPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货人姓名
    senderName: Mock.mock('@cname'),
    // 收货人姓名
    receiverName: Mock.mock('@cname'),
    // 货物名称
    goodsName: Mock.mock('@cname'),
    // 包装
    pack: Mock.mock('@ctitle(5)'),
    // 件数
    'numbers|1-50': 50,
    // 重量
    'weight|1-50': 50,
    // 体积
    'volume|1-50': 50,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))
}

// 所有“待完成”的页面的数据
for (let i = 0; i < 100; i++) {
  // “待送货”装载单数据
  deliveringLoadingList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 装载单号
    loadOrderId: Mock.mock('@string("number",5)'),
    // 装载单状态
    // loadOrderStatus: Mock.mock({
    //   'object|1': {
    //     'checkFail': '已分配 已确认'
    //   }
    // }),
    // 装载单状态
    loadOrderStatus: '已分配 已确认',
    // // 调整状态
    // adjustmentStatus: Mock.mock({
    //   'object|1': {
    //     'adjusted': ' 已调整',
    //     'unAdjust': '未调整'
    //   }
    // }),
    // 调整状态
    adjustmentStatus: '已调整',
    // 所属仓库
    warehouse: Mock.mock('@string("number",5)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货时间
    deliverTime: Mock.mock('@date()'),
    // 发货备注
    // deliverRemark: Mock.mock('@csentence(10,20)'),
    deliveRemarks: '货物A 巴啦啦巴啦啦巴啦啦巴啦啦',
    // 总重量
    allWeights: Mock.mock('@integer(1,100)'),
    // 总体积
    allVolumes: Mock.mock('@integer(1,100)'),
    // 总件数
    allNumbers: Mock.mock('@integer(1,50)'),
    // 调度管理员ID
    dispatcherId: Mock.mock('@string("number",5)'),
    // 调度管理员姓名
    dispatcherName: Mock.mock('@cname()'),
    // 备注
    remarks: Mock.mock('@csentence()')
  }))

  // “待接货”订单数据
  receivingList.push(Mock.mock({
    //  序号
    id: Mock.mock('@increment(1)'),
    // 单号
    orderId: Mock.mock('@string("number",5)'),
    // 开单时间
    orderDate: Mock.mock('@datetime'),
    // 发货单位
    forwarding: Mock.mock('@county(true)'),
    // 发货人姓名
    shipper: Mock.mock('@cname'),
    // 发货人联系电话
    phone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 取货地址
    receivedAddr: Mock.mock('@county(true)'),
    // 取货货物区域
    receivedArea: Mock.mock('@character("upper")'),
    // 货物名称
    goodsName: Mock.mock('@ctitle(5)'),
    // 包装
    pack: Mock.mock('@ctitle(5)'),
    // 货物件数
    'numbers|1-50': 50,
    // 重量
    'weight|1-50': 50,
    // 体积
    'volume|1-50': 50,
    // 接货司机姓名
    driverName: Mock.mock('@cname'),
    // 接货司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 接货司机车牌号
    carLicence: Mock.mock('@province') + '--' + Mock.mock('@character("lower")') + /\d{5}/,
    // 车载吨位
    'carTon|10-30': 30,
    // 车载容量
    'carVolume|5-100': 100,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))

  // “待长途装载”装载单数据
  transportingList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 装载单号
    loadOrderId: Mock.mock('@string("number",5)'),
    // 装载单状态
    loadOrderStatus: '已分配 已确认',
    // // 调整状态
    // adjustment: Mock.mock({
    //   'object|1': {
    //     'adjusted': ' 已调整',
    //     'unAdjust': '未调整'
    //   }
    // }),
    // 调整状态
    adjustmentStatus: '已调整',
    // 起始站
    startStation: Mock.mock('@county(true)'),
    // 到达站
    endStation: Mock.mock('@county(true)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发车时间
    departTime: Mock.mock('@date()'),
    // 预计到达时间
    arriveTime: Mock.mock('@date()'),
    // 大车总；毛利
    gross: Mock.mock('@integer(10000,30000)'),
    // 总运费
    freight: Mock.mock('@integer(8000,20000)'),
    // 总中转费
    transhipment: Mock.mock('@integer(1000,6000)'),
    // 总返款
    refund: Mock.mock('@integer(1000,5000)'),
    // 总提送费
    sendFee: Mock.mock('@integer(1000,3000)'),
    // 总重量
    'allWeights|1-50': 50,
    // 总体积
    'allVolumes|1-50': 50,
    // 总件数
    'allNumbers|1-100': 100,
    // 调度管理员姓名
    dispatcherName: Mock.mock('@cname()'),
    // 调度管理员账号
    dispatcherId: Mock.mock('@string("number",5)'),
    // 备注
    remarks: Mock.mock('@csentence()')
  }))

  // “待中转”订单数据
  epibolingList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 订单号
    orderId: Mock.mock('@string("number",5)'),
    // 开单日期
    orderDate: Mock.mock('@datetime'),
    // 到站点
    destinaiton: Mock.mock('@county(true)'),
    // 中转起始站
    transitOpen: Mock.mock('@city()'),
    // 中转外包公司
    transitCompany: Mock.mock('@csentence'),
    // 中转花费
    contractSpend: Mock.mock('@integer(100,2000)'),
    // 合同价格
    contractPrice: Mock.mock('@integer(100,2000)'),
    // 外包企业联系人
    ectocyster: Mock.mock('@cname'),
    // 外包企业联系电话
    ectocystPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货人姓名
    senderName: Mock.mock('@cname'),
    // 收货人姓名
    receiverName: Mock.mock('@cname'),
    // 货物名称
    goodsName: Mock.mock('@cname'),
    // 包装
    pack: Mock.mock('@ctitle(5)'),
    // 件数
    'numbers|1-50': 50,
    // 重量
    'weight|1-50': 50,
    // 体积
    'volume|1-50': 50,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))
}

// 装载单中的订单列表
for (let i = 0; i < 20; i++) {
  orderList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 订单号
    orderId: Mock.mock('@string("number",5)'),
    // 开单日期
    orderDate: Mock.mock('@datetime'),
    // 预约单号
    reservationId: Mock.mock('@string("number",5)'),
    // 始发站
    departure: Mock.mock('@city()'),
    // 到站点
    arrive: Mock.mock('@city()'),
    // 订单属性
    orderStatus: '已完成',
    // 所属仓库
    warehouse: '北京',
    // 发货人单位
    deliverSite: Mock.mock('@ctitle(5)'),
    // 发货人姓名
    deliverName: Mock.mock('@cname'),
    // 发货人电话
    deliverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货人地址
    deliverAddress: Mock.mock('@county(true)'),
    // 收货人单位
    consignee: Mock.mock('@ctitle(5)'),
    // 收货人名称
    consigneeName: Mock.mock('@cname'),
    // 收货人电话
    consigneePhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 收货地址
    consigneeAddress: Mock.mock('@county(true)'),
    // 货物名称
    goodsName: Mock.mock('@ctitle(5)'),
    // 件数
    'allNumbers|1-50': 50,
    // 重量
    'allWeights|1-50': 50,
    // 体积
    'allVolumes|1-50': 50,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)'),
    // 操作
    operation: ''
  }))
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
  orderList
}
