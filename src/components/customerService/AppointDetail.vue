<template>
  <div>

    <h2 style="text-align:center">预约单详情</h2>
    <el-form ref="appointForm" :model="appointForm">
      <div style='margin:20px;clear:both' class='form-div'>
        <span class='col-1'>预约单号</span>
        <span class='col-2 label-content'>{{appointForm.reserveId}}</span>
        <span class='col-1'>预约时间</span>
        <span class='col-2 label-content'>{{appointForm.reserveTim}}</span>
        <span class='col-1'>预约单状态</span>
        <span class='col-1 label-content'>{{appointForm.reseState}}</span>
        <span class='col-1'>处理客服</span>
        <span class='col-1 label-content'>{{appointForm.serviceNam}}</span>
        <span class='col-1'>发货方</span>
        <span class='col-4 label-content'>{{appointForm.shipNam}}</span>
        <span class='col-1'>收货方</span>
        <span class='col-4 label-content'>{{appointForm.receNam}}</span>
        <span class='col-1'>联系方式</span>
        <span class='col-4 label-content'>{{appointForm.shipTel}}</span>
        <span class='col-1'>联系方式</span>
        <span class='col-4 label-content'>{{appointForm.receTel}}</span>
        <span class='col-1'>发货地址</span>
        <span class='col-4 label-content'>{{appointForm.pickUpAdr}}</span>
        <span class='col-1'>收货地址</span>
        <span class='col-4 label-content'>{{appointForm.receAdr}}</span>
        <span class='col-1'>所属区域</span>
        <span class='col-4 label-content'>{{appointForm.shipArea}}</span>
        <span class='col-1'>所属区域</span>
        <span class='col-4 label-content'>{{appointForm.receArea}}</span>
        <span class='col-1'>货物名称</span>
        <span class='col-1'>件数</span>
        <span class='col-1'>总重量</span>
        <span class='col-1'>总体积</span>
        <span class='col-1'>包装</span>
        <span class='col-1'>长</span>
        <span class='col-1'>宽</span>
        <span class='col-1'>高</span>
        <span class='col-1'>重泡比</span>
        <span class='col-1'>是否敞车</span>
        <span class='col-1 label-content'>{{appointForm.goodsNam}}</span>
        <span class='col-1 label-content'>{{appointForm.goodsNums}}</span>
        <span class='col-1 label-content'>{{appointForm.goodsWeight}}</span>
        <span class='col-1 label-content'>{{appointForm.goodsVolumn}}</span>
        <span class='col-1 label-content'>{{appointForm.package}}</span>
        <span class='col-1 label-content'>{{appointForm.goodsLen}}</span>
        <span class='col-1 label-content'>{{appointForm.goodsWid}}</span>
        <span class='col-1 label-content'>{{appointForm.goodsHeight}}</span>
        <span class='col-1 label-content'>{{appointForm.weigVolRation}}</span>
        <span class='col-1 label-content'>{{appointForm.isTruck}}</span>
        <span class='col-1'>接货司机</span>
        <span class='col-1 label-content'>{{appointForm.receDriver}}</span>
        <span class='col-1'>司机电话</span>
        <span class='col-2 label-content'>{{appointForm.driverTel}}</span>
        <span class='col-1'>接货状态</span>
        <span class='col-1 label-content'>{{appointForm.receState}}</span>
        <span class='col-2'>是否货物原因</span>
        <span class='col-1 label-content'>{{appointForm.shifouhuowu}}</span>
        <span class='col-1'>是否手动调度</span>
        <span class='col-1 label-content'>{{appointForm.shifoushoudong}}</span>
        <span class='col-1'>调度状态</span>
        <span class='col-1 label-content'>{{appointForm.dispatState}}</span>
        <span class='col-1'>调度备注</span>
        <span class='col-5 label-content'>{{appointForm.dispatNote}}</span>
        <span class='col-1'>预约单备注</span>
        <span class='col-9 label-content'>{{appointForm.appointNote}}</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      datalist1: ['货物名称', '件数', '重量', '体积', '包装', '长', '宽', '高', '接货司机', '接货状态', '始发站'],
      appointForm: {
        /** 基本信息 */
        reserveId: '', // 预约单号
        reserveTim: '', // 预约时间
        reseState: '', // 预约单状态
        serviceNam: '', // 处理客服
        /** 发货方信息 */
        shipNam: '发货方', // 发货方
        shipTel: '123456', // 联系电话
        pickUpAdr: '', // 发货地址
        shipArea: '', // 发货方所属区域
        /** 收货方信息 */
        receNam: '',
        receTel: '',
        receAdr: '',
        receArea: '',
        /** 货物信息 */
        goodsNam: '沙发',
        goodsNums: '5',
        goodsWeight: '120',
        goodsVolumn: '120',
        package: '',
        goodsLen: '',
        goodsWid: '',
        goodsHeight: '',
        weigVolRation: '', // 重泡比
        isTruck: '', // 是否敞车
        /** 司机信息 */
        receDriver: '', // 接货司机
        driverTel: '',
        /** 其它信息 */
        receState: '', // 接货状态
        shifouhuowu: '', // 是否货物原因'
        shifoushoudong: '', // 是否手动调度
        dispatState: '', // 调度状态
        dispatNote: '调度备注', // 调度备注
        appointNote: '预约单备注' // 预约单备注
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped>

.col-1 {
  width: 10%
}

.col-2 {
  width: 20%
}

.col-3 {
  width: 30%
}

.col-4 {
  width: 40%
}

.col-5 {
  width: 50%
}

.col-6 {
  width: 60%
}

.col-8 {
  width: 80%
}

.col-9 {
  width: 90%
}

.col-10 {
  width: 100%
}

.label-content {
  color: #00d1b2;
}

.form-div span {
  border: 1px solid #000000;
  box-sizing: border-box;
  float: left;
  font-size: 95%;
  padding: 0.8% 0;
  height: 38px;
  outline: 0;
  text-align: center;
  overflow: hidden;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>