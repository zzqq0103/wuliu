import Mock from 'mockjs'
const DiaoduloginUser = [
  {
    id: 1,
    username: 'diaodu',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '调度管理员'
  }
]

const Orderlist = []

for (let i = 0; i < 100; i++) {
  Orderlist.push(Mock.mock({
    //  序号
    id: Mock.mock('@increment'),
    // 装载单号
    deliverOrderId: Mock.mock('@id'),
    // 订单号
    orderId: Mock.mock('@guid'),
    // 开单时间
    OrderDate: Mock.mock('@datatime'),
    // 收货人姓名
    consignee: Mock.mock('@cname'),
    // 联系电话
    phone: /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/,
    // 收货人地址
    address: Mock.mock('@county(true)'),
    // 货物名称
    goodsName: Mock.mock('@csentence(10,20)'),
    // 件数
    'numbers|1-100': 100,
    // 重量
    'weight|1-100': 100,
    // 体积
    'volume|1-150': 150,
    // 订单备注
    remarks: Mock.mock('@csentence(10,20)')
  }))
}

export { DiaoduloginUser, Orderlist }
