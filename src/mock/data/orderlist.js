import Mock from 'mockjs'
// const DiaoduloginUser = [
//   {
//     id: 1,
//     username: 'diaodu',
//     password: '123456',
//     avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
//     name: '调度管理员'
//   }
// ]
const Orderlist = []
const transportedList = []
const receivedList = []

for (let i = 0; i < 100; i++) {
  Orderlist.push(Mock.mock({
    //  序号
    id: Mock.mock('@increment'),
    // 装载单号
    deliverOrderId: Mock.mock('@integer(10,100)'),
    // 订单号
    orderId: Mock.mock('@integer(10,100)'),
    // 开单时间
    OrderDate: Mock.mock('@datetime'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 收货人姓名
    consignee: Mock.mock('@cname'),
    // 收货单位
    consigneeAddr: Mock.mock('@county(true)'),
    // 联系电话
    phone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 收货人地址
    address: Mock.mock('@county(true)'),
    // 货物名称
    goodsName: Mock.mock('@ctitle(5)'),
    // 包装
    pack: Mock.mock('@ctitle(5)'),
    // 件数
    'numbers|1-100': 100,
    // 重量
    'weight|1-100': 100,
    // 体积
    'volume|1-150': 150,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))

  receivedList.push(Mock.mock({
    //  序号
    id: Mock.mock('@increment'),
    // 单号
    orderId: Mock.mock('@integer(10,100)'),
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

  transportedList.push(Mock.mock({
    // 序号
    id: Mock.mock('@increment'),
    // 装载单号
    deliverOrderId: Mock.mock('@integer(10,100)'),
    // 订单号
    orderId: Mock.mock('@integer(10,100)'),
    // 子件号
    compOrder: Mock.mock('@integer(10,100)'),
    // 开单时间
    OrderDate: Mock.mock('@datetime'),
    // 司机姓名
    driverName: Mock.mock('@cname'),
    // 司机电话
    driverPhone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 站点
    destination: Mock.mock('@county(true)'),
    // 收货人姓名
    consignee: Mock.mock('@cname'),
    // 收货单位
    consigneeAddr: Mock.mock('@county(true)'),
    // 联系电话
    phone: /^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 收货人地址
    address: Mock.mock('@county(true)'),
    // 货物名称
    goodsName: Mock.mock('@ctitle(5)'),
    // 包装
    pack: Mock.mock('@ctitle(5)'),
    // 件数
    'numbers|1-50': 50,
    // 重量
    'weight|1-50': 50,
    // 体积
    'volume|1-50': 50,
    // 总件数
    'allNumbers|1-100': 100,
    // 总重量
    'allWeight|1-100': 100,
    // 总体积
    'allVolume|1-150': 150,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))
}

export { Orderlist, transportedList, receivedList }
