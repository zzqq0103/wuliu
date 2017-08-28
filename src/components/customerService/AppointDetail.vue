<template>
  <div>
    <h2 style="text-align:center">预约单详情</h2>
    <el-form ref="appointForm" :model="appointForm">
      <div style='margin-top:2%;clear:both' class='form-div'>
        <span class='col-1'>预约单号</span>
        <span class='col-2 label-content'></span>
        <span class='col-1'>预约单时间</span>
        <span class='col-2 label-content'></span>
        <span class='col-2'>预约单状态</span>
        <span class='col-1 label-content'></span>
        <span class='col-1'>客服姓名</span>
        <span class='col-1 label-content'></span>
        <span class='col-1'>发货单位</span>
        <span class='col-2 label-content'></span>
        <span class='col-1'>发货人</span>
        <span class='col-1 label-content'></span>
        <span class='col-1'>联系电话</span>
        <span class='col-1 label-content'></span>
        <span class='col-1'>提货地址</span>
        <span class='col-3 label-content'></span>
        <span class='col-1'>收货单位</span>
        <span class='col-2 label-content'></span>
        <span class='col-1'>收货人</span>
        <span class='col-1 label-content'></span>
        <span class='col-1'>联系电话</span>
        <span class='col-1 label-content'></span>
        <span class='col-1'>收货地址</span>
        <span class='col-3 label-content'></span>
        <span class='col-1' v-for="(data,i) in datalist1" :key='data'>{{data}}</span>
        <span class='col-1 label-content' v-for="(value, key, i) in appointForm" :key='key' v-if="i>11&&i<23">{{key}}</span>
        <span class='col-2'>预约单备注</span>
        <span class='col-9 label-content'></span>
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
        reserveId: '',
        reserveTim: '',
        reseState: '',
        serviceNam: '',
        /** 发货方信息 */
        shipComp: '',
        shipNam: '',
        shipTel: '',
        pickUpAdr: '',
        /** 收货方信息 */
        receComp: '',
        receNam: '',
        receTel: '',
        receAdr: '',
        /** 货物信息 */
        goodsNam: '沙发',
        goodsNums: '5',
        goodsWeight: '120',
        goodsVolumn: '120',
        package: '',
        goodsLen: '',
        goodsWid: '',
        goodsHeight: '',
        /** 其它信息 */
        receDriverNam: '',
        receState: '',
        startStation: '',
        appointNote: ''
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped>

.col-1 {
  width: 9.09%
}

.col-1_5 {
  width: 13.635%
}

.col-2 {
  width: 18.18%
}

.col-2_5 {
  width: 22.725%
}

.col-3 {
  width: 27.27%
}

.col-4 {
  width: 36.36%
}

.col-6 {
  width: 54.54%
}

.col-7 {
  width: 63.63%
}

.col-9 {
  width: 81.81%
}

.col-11 {
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