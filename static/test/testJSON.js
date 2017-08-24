export default {
  "personnelInfo": {
    "list": [
      {
        "clientCompNam": "test1",
        "nam": "test1",
        "tel": "11111",
        "compAdr": "1111",
        "area": "1111",
        "salesmanId": "1111",
        "isTril": "1",
      },
      {
        "clientCompNam": "test2",
        "nam": "test2",
        "tel": "2222",
        "compAdr": "222",
        "area": "22",
        "salesmanId": "222",
        "isTril": "1",
      }
    ]
  },
  //车辆信息
  'vehicleInfo': {
    'list': [
      {
        'licePlateNum': '123456',
        'driverName': 'test',
        'tel': '12323',
        'contractID': '1234',
        'contractPrice': '1212',
        'capacity': '123',
        'tonnage': '123',
        'carType': '车辆类型',
        'pickUpArea': '区域',
        'receState': '司机状态',
        'carState': '1212',
        'carPosition': 'sdd'
      },
      {
        'licePlateNum': '654321',
        'driverName': 'test',
        'tel': '12323',
        'contractID': '1234',
        'contractPrice': '1212',
        'capacity': '123',
        'tonnage': '123',
        'carType': '车辆类型',
        'pickUpArea': '区域',
        'receState': '司机状态',
        'carState': '1212',
        'carPosition': 'sdd'
      }
    ]
  },
  //订单信息
  'oderInfo': {
    'list': [
      {
        "oderId": '1234',
        "departure": '北京',
        "telDeparture": '123456',
        "destination": '苏州',
        "telReceiving": '654321',
        "cargoName": '轮胎',
        "cargoPieces": '13',
        "cargoCondition": '运送中'
      },
      {
        "oderId": '5678',
        "departure": '南京',
        "telDeparture": '654321',
        "destination": '北京',
        "telReceiving": '123456',
        "cargoName": '货架',
        "cargoPieces": '21',
        "cargoCondition": '运送中'
      }
    ]
  },
  //库存信息
  'stockInfo': {
    'list': [
      {
        "orderId": '1234',
        "transId": '54321',
        "inTime": '2017-08-04 10:11:58',
        "outTime": '2017-08-26 10:12:09',
        "telDeparture": '87771777',
        "telReceiving": '99888811',
        "cargoName": '货架',
        "cargoPieces": '21',
        "cargoWeight": '5T',
        "cargoVolume": '90L'
      },
      {
        "orderId": '2234',
        "transId": '34321',
        "inTime": '2017-06-04 10:11:58',
        "outTime": '2017-10-26 10:12:09',
        "telDeparture": '66672377',
        "telReceiving": '09998811',
        "cargoName": '衣服',
        "cargoPieces": '101',
        "cargoWeight": '9T',
        "cargoVolume": '100L'
      }
    ]
  }
}
