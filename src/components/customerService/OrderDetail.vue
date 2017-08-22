<template>
  <div>
    <h2 style="text-align:center;margin-top:-2%">订 单 详 情</h2>
    <el-form ref="form" :model="form">
      <div style='margin-top:0.5%;display:inline-block;width:100%'>
        <span style='float:left;padding-top:0.7%' class='col-1'>订单号：</span>
        <span style='float:left;padding-top:0.5%' class='col-1'>{{form.id}}</span>
        <span class='col-1 order-title-base'>经办客服：</span>
        <span style='float:left;padding-top:0.7%' class='col-1'>{{form.serviceNam}}</span>
      </div>
      <div style='margin-top:2%;clear:both' class='test'>
        <span class='col-11 label-title'>基本信息</span>
        <span class='col-1'>订单号</span>
        <span class='col-1 label-content' style='color:#00d1b2'>{{form.id}}</span>
        <span class='col-1'>订单时间</span>
        <span class='col-2 label-content'>{{form.orderTim}}</span>
        <span class='col-1'>订单状态</span>
        <span class='col-1 label-content'>{{form.state}}</span>
        <span class='col-1'>开单网点</span>
        <span class='col-1 label-content'>{{form.billBranch}}</span>
        <span class='col-1'>目的网点</span>
        <span class='col-1 label-content'>{{form.arrBranch}}</span>
        <span class='col-1'>发货单位</span>
        <span class='col-2 label-content'>{{form.shipComp}}</span>
        <span class='col-1'>发货人</span>
        <span class='col-1 label-content'>{{form.shipNam}}</span>
        <span class='col-1'>联系电话</span>
        <span class='col-1 label-content'>{{form.shipTel}}</span>
        <span class='col-1'>提货地址</span>
        <span class='col-3 label-content'>{{form.pickUpAdr}}</span>
        <span class='col-1'>收货单位</span>
        <span class='col-2 label-content'>{{form.receComp}}</span>
        <span class='col-1'>收货人</span>
        <span class='col-1 label-content'>{{form.receNam}}</span>
        <span class='col-1'>联系电话</span>
        <span class='col-1 label-content'>{{form.receTel}}</span>
        <span class='col-1'>收货地址</span>
        <span class='col-3 label-content'>{{form.receAdr}}</span>
        <span class='col-1' v-for="(data,i) in datalist1" :key='data'>{{data}}</span>
        <span class='col-1 label-content' v-for="(value, key, i) in form" :key='key' v-if="i>4&&i<16">{{value}}</span>
        <span class='col-1'>订单类型</span>
        <span class='col-1 label-content'>{{form.orderType}}</span>
        <span class='col-1'>送货方式</span>
        <span class='col-1 label-content'>{{form.sendMode}}</span>
        <span class='col-2'>听通知放货(无</span>
        <span class='col-1 label-content'>{{form.isListenToRele}}</span>
        <span class='col-1'>可放货(无</span>
        <span class='col-1 label-content'>{{form.isRelease}}</span>
        <span class='col-1'>订单物流状态</span>
        <span class='col-1 label-content'>{{form.orderLogiState}}</span>
        <span class='col-11 label-title'>费用信息</span>
        <!--<span v-for="(data,i) in datalist2" :key='data' :class="i==1? 'col-2':'col-1'">{{data}}</span> -->
        <span class='col-1' v-for="(data,i) in datalist2" :key='data'>{{data}}</span>
        <span class='col-1 label-content' v-for="(value, key, i) in form" :key='key' v-if="i>59&&i<71">{{key}}</span>
        <span class='col-1' v-for="(data,i) in datalist3" :key='data' :class="i==3?'col-2':'col-1'">{{data}}</span>
        <span class='label-content' v-for="(value, key, i) in form" :key='key' v-if="i>70&&i<76" :class="i==74?'col-2':'col-1'">{{key}}</span>
        <span class='col-1 label-content'>{{form.feeMoney[0]+form.feeMoney[1]+form.feeMoney[2]+form.feeMoney[3]}}</span>
        <span class='col-1 label-content' v-for="(data,i) in form.feeMoney" :key="data">{{data}}</span>
        <span class='col-11 label-title'>运输信息</span>
        <span class='col-1 label-title'>接货</span>
        <span class='col-1'>接货司机</span>
        <span class='col-2 label-content'>{{form.receDriverNam}}</span>
        <span class='col-1'>联系电话</span>
        <span class='col-2 label-content'>{{form.receDriverTel}}</span>
        <span class='col-2'>接货时间</span>
        <span class='col-2 label-content'>{{form.receTim}}</span>
        <span class='col-1 label-title'>送货</span>
        <span class='col-1'>送货司机</span>
        <span class='col-2 label-content'>{{form.sendDriverNam}}</span>
        <span class='col-1'>联系电话</span>
        <span class='col-2 label-content'>{{form.sendDriverTel}}</span>
        <span class='col-2'>送货时间</span>
        <span class='col-2 label-content'>{{form.sendTim}}</span>
        <span class='col-1 label-title' v-bind:style="{height:(form.transfor.length+1)*38+'px',paddingTop: form.transfor.length*2.25 + '%' }">长途运输</span>
        <span class='col-1'>装载单号</span>
        <span class='col-1'>运输司机</span>
        <span class='col-1_5'>联系电话</span>
        <span class='col-1'>子件号</span>
        <span class='col-2_5'>货物物流信息</span>
        <span class='col-1_5'>发车时间</span>
        <span class='col-1_5'>到达时间</span>
        <template v-for="(data,i) in form.transfor">
          <span class='col-1 label-content' :key='data.sendLoadId'>{{data.sendLoadId}}</span>
          <span class='col-1 label-content' :key='data.longDriverNam'>{{data.longDriverNam}}</span>
          <span class='col-1_5 label-content' :key='data.longDriverTel'>{{data.longDriverTel}}</span>
          <span class='col-1 label-content' :key='data.subID'>{{data.subID}}</span>
          <span class='col-2_5 label-content' :key='data.goodsLogiInfo'>{{data.goodsLogiInfo}}</span>
          <span class='col-1_5 label-content' :key='data.departTim'>{{data.departTim}}</span>
          <span class='col-1_5 label-content' :key='data.arrTim'>{{data.arrTim}}</span>
        </template>
        <span class='col-11 label-title'>中转信息</span>
        <span class='col-1'>线路选择</span>
        <span class='col-1 label-content'>{{form.rouSelection}}</span>
        <span class='col-1'>起始地点</span>
        <span class='col-1 label-content'>{{form.changeStart}}</span>
        <span class='col-1'>目的地点</span>
        <span class='col-1 label-content'>{{form.changeEnd}}</span>
        <span class='col-1'>调度员</span>
        <span class='col-1 label-content'>{{form.dispatNam}}</span>
        <span class='col-1'>中转时间</span>
        <span class='col-2 label-content'>{{form.changeTim}}</span>
        <span class='col-11 label-title'>三方信息</span>
        <span class='col-1'>是否三方</span>
        <span class='col-1 label-content'>{{form.isTril}}</span>
        <span class='col-1'>三方收入</span>
        <span class='col-1 label-content'>{{form.trilIncome}}</span>
        <span class='col-1'>业务员</span>
        <span class='col-1 label-content'>{{form.salesmanNam}}</span>
        <span class='col-1'>三方备注</span>
        <span class='col-4 label-content'>{{form.trilNote}}</span>
        <span class='col-11 label-title'>异动信息</span>
        <span class='col-1'>异动收入</span>
        <span class='col-1 label-content'>{{form.unActIncome}}</span>
        <span class='col-1'>异动支出</span>
        <span class='col-1 label-content'>{{form.unActExpense}}</span>
        <span class='col-1'>异动时间</span>
        <span class='col-2 label-content'>{{form.unActTim}}</span>
        <span class='col-1'>异动说明</span>
        <span class='col-3 label-content'>{{form.unActDes}}</span>
        <span class='col-11 label-title'>其它信息</span>
        <span class='col-1'>审核状态</span>
        <span class='col-1 label-content'>{{form.auditState}}</span>
        <span class='col-1'>审核人</span>
        <span class='col-1 label-content'>{{form.auditor}}</span>
        <span class='col-1'>审核时间</span>
        <span class='col-2 label-content'>{{form.unActTim}}</span>
        <span class='col-1'>订单备注</span>
        <span class='col-3 label-content'>{{form.orderNote}}</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      paddingTop: 3,
      cancleVisable: false,
      datalist1: ['始发站', '到站', '当前位置', '货物名称', '件数', '重量', '体积', '包装', '长', '宽', '高'],
      datalist2: ['总运费', '基础运费', '包装费', '提货费', '送货费', '卸货费', '实提货费', '实送货费', '中转费', '货款', '手续费'],
      datalist3: ['保险费', '保额', '回单份数', '回单押款金额', '返款金额', '总付金额', '现付金额', '到付金额', '欠付金额', '月结金额'],
      datalist4: ['装载单号', '运输司机', '联系电话', '子件号', '货物物流信息', '发车时间', '到达时间'],
      formlist: {
        a: 100,
        b: 200,
        c: 300
      },
      form: {
        /** 其它信息 */
        auditState: '',
        auditor: '',
        auditTim: '',
        orderNote: '',
        /** 异动信息 */
        unActIncome: '',
        unActExpense: '',
        unActTim: '',
        unActDes: '',
        /** 三方信息 */
        isTril: '',
        trilIncome: '',
        salesmanNam: '',
        trilNote: '',
        /* 中转信息 */
        rouSelection: '',
        changeStart: '',
        changeEnd: '',
        dispatNam: '',
        changeTim: '',
        /* 运输信息 */
        receDriverNam: '',
        receDriverTel: '',
        receTim: '',
        sendDriverNam: '',
        sendDriverTel: '',
        sendTim: '',
        transfor: [
          {
            sendLoadId: '001',
            longDriverNam: '',
            longDriverTel: '',
            subID: '123',
            goodsLogiInfo: '',
            departTim: '',
            arrTim: ''
          },
          {
            sendLoadId: '002',
            longDriverNam: '',
            longDriverTel: '',
            subID: '123',
            goodsLogiInfo: '',
            departTim: '',
            arrTim: ''
          }
        ],
        /** 基本信息 */
        id: 4.5,
        orderTim: '17-09-08 10:02',
        state: '',
        billBranch: '',
        arrBranch: '',
        startStation: '',
        arrStation: '',
        currPosition: '',
        goodsNam: '沙发',
        goodsNums: '5',
        goodsWeight: '120',
        goodsVolumn: '120',
        package: '',
        goodsLen: '',
        goodsWid: '',
        goodsHeight: '',
        serviceNam: '李四',
        shipComp: '',
        shipNam: '张三',
        shipTel: '12345',
        pickUpAdr: '北京市XXX',
        receNam: '李四',
        receComp: '',
        receTel: '12345',
        receAdr: '北京市XXX',
        isFang: '',
        orderType: '',
        sendMode: '',
        isReceipt: '',
        xianfu: '',
        daofu: '',
        qianfu: '',
        yuejie: '',
        orderLogiState: '',
        isRelease: '',
        isListenToRele: '',
        /** 费用信息 */
        totalFreight: '111',
        baseFee: '100',
        packFee: '',
        pickUpFee: '',
        sendFee: '',
        landingFee: '',
        realPickUpFee: '',
        realSendFee: '',
        changeFee: '',
        goodsPayment: '',
        procedureFee: '3333',
        insurance: '222',
        coverage: '',
        receNums: '',
        receMoney: '',
        refuMoney: '',
        feeMoney: [100, 200, 300, 400]
      },
      selectItem: [
        { desc: '泡沫', id: 'pm' },
        { desc: '塑料', id: 'sl' },
        { desc: '纸箱', id: 'zx' }
      ]
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

.col-11 {
  width: 100%
}


.order-title-base {
  float: left;
  padding-top: 0.7%;
  margin-left: 5%
}

.label-title {
  background-color: #E0E0E0
}

.label-content {
  color: #00d1b2;
}

.input {
  background-color: #fff;
  box-sizing: border-box;
  color: rgb(31, 61, 60);
  float: left;
  font-size: inherit;
  height: 38px;
  line-height: 1;
  outline: 0;
  padding: 0.5% 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  color: #00d1b2
}

.select {
  float: left;
  border: 1px solid;
  box-sizing: border-box;
  height: 38px;
  margin-bottom: -12px;
  font-size: inherit;
  text-align: center
}

.label-title {
  background-color: #E0E0E0
}

.test span {
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