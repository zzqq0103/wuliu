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

// 所有“已完成”页面的数据
for (let i = 0; i < 100; i++) {
  // “已送货”装载单数据
  deliveredLoadedList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment(1)'),
    // 装载单号
    loadId: Mock.mock('@string("number",5)'),
    // 装载单状态
    loadStatus: Mock.mock({
      'object|1': {
        'checkFail': '已分配 已确认'
      }
    }),
    // // 调整状态
    // adjustment: Mock.mock({
    //   'object|1': {
    //     'adjusted': ' 已调整',
    //     'unAdjust': '未调整'
    //   }
    // }),
    // 所属仓库
    warehouse: Mock.mock('@string("number",5)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货时间
    deliverTime: Mock.mock('@date()'),
    // 发货备注
    deliverRemark: Mock.mock('@csentence(10,20)'),
    // 总重量
    allWeight: Mock.mock('@integer(1,100)'),
    // 总体积
    allVolume: Mock.mock('@integer(1,100)'),
    // 总件数
    allNumber: Mock.mock('@integer(1,50)'),
    // 调度管理员ID
    adminId: Mock.mock('@string("number",5)'),
    // 调度管理员姓名
    adminName: Mock.mock('@cname()')
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
    waybillId: Mock.mock('@string("number",5)'),
    // 装载单状态
    waybillStatus: Mock.mock({
      'object|1': {
        'checkFail': '已分配 已确认'
      }
    }),
    // // 调整状态
    // adjustment: Mock.mock({
    //   'object|1': {
    //     'adjusted': ' 已调整',
    //     'unAdjust': '未调整'
    //   }
    // }),
    // 起始站
    origin: Mock.mock('@county(true)'),
    // 到达站
    destination: Mock.mock('@county(true)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发车时间
    deliveryTime: Mock.mock('@date()'),
    // 预计到达时间
    arriveTime: Mock.mock('@date()'),
    // 大车总；毛利
    gross: Mock.mock('@integer(10000,30000)'),
    // 总运费
    freight: Mock.mock('@integer(8000,20000)'),
    // 总中转费
    transhipment: Mock.mock('@integer(1000,6000)'),
    // 总返款
    cashBack: Mock.mock('@integer(1000,5000)'),
    // 总提送费
    sendCost: Mock.mock('@integer(1000,3000)'),
    // 总重量
    'allWeight|1-50': 50,
    // 总体积
    'allVolume|1-50': 50,
    // 总件数
    'allNumbers|1-100': 100,
    // 调度管理员姓名
    adminName: Mock.mock('@cname()'),
    // 调度管理员账号
    adminId: Mock.mock({
      'object|1': {
        'admin001': '安特调度管理员001',
        'admin002': '安特调度管理员002'
      }
    })
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
    loadId: Mock.mock('@string("number",5)'),
    // 装载单状态
    loadStatus: Mock.mock({
      'object|1': {
        'checkFail': '已分配 确认失败',
        'unCheck': '已分配 未确认'
      }
    }),
    // 调整状态
    adjustment: Mock.mock({
      'object|1': {
        'adjusted': ' 已调整',
        'unAdjust': '未调整'
      }
    }),
    // 所属仓库
    warehouse: Mock.mock('@string("number",5)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发货时间
    deliverTime: Mock.mock('@date()'),
    // 发货备注
    deliverRemark: Mock.mock('@csentence(10,20)'),
    // 总重量
    allWeight: Mock.mock('@integer(1,100)'),
    // 总体积
    allVolume: Mock.mock('@integer(1,100)'),
    // 总件数
    allNumber: Mock.mock('@integer(1,50)'),
    // 调度管理员ID
    adminId: Mock.mock('@string("number",5)'),
    // 调度管理员姓名
    adminName: Mock.mock('@cname()')
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
    waybillId: Mock.mock('@string("number",5)'),
    // 装载单状态
    waybillStatus: Mock.mock({
      'object|1': {
        'checkFail': '已分配 已确认'
      }
    }),
    // 调整状态
    adjustment: Mock.mock({
      'object|1': {
        'adjusted': ' 已调整',
        'unAdjust': '未调整'
      }
    }),
    // 起始站
    origin: Mock.mock('@county(true)'),
    // 到达站
    destination: Mock.mock('@county(true)'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 发车时间
    deliveryTime: Mock.mock('@date()'),
    // 预计到达时间
    arriveTime: Mock.mock('@date()'),
    // 大车总；毛利
    gross: Mock.mock('@integer(10000,30000)'),
    // 总运费
    freight: Mock.mock('@integer(8000,20000)'),
    // 总中转费
    transhipment: Mock.mock('@integer(1000,6000)'),
    // 总返款
    cashBack: Mock.mock('@integer(1000,5000)'),
    // 总提送费
    sendCost: Mock.mock('@integer(1000,3000)'),
    // 总重量
    'allWeight|1-50': 50,
    // 总体积
    'allVolume|1-50': 50,
    // 总件数
    'allNumbers|1-100': 100,
    // 调度管理员姓名
    adminName: Mock.mock('@cname()'),
    // 调度管理员账号
    adminId: Mock.mock({
      'object|1': {
        'admin001': '安特调度管理员001',
        'admin002': '安特调度管理员002'
      }
    })
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

export {deliveredLoadedList, transportedList, receivedList, epibolyList, deliveringLoadingList, receivingList, transportingList, epibolingList}
