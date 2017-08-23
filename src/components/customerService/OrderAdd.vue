<template>
  <div>
    <h2 style="text-align:center">网点开单</h2>
    <el-form ref="form" :model="form">
      <div style='margin-top:2%;display:inline-block'>
        <span style='float:left;padding-top:0.7%' class='col-1'>订单号：</span>
        <span style='float:left;padding-top:1%' class='col-1'>{{form.id}}</span>
        <span class='order-title-base'>开单网点：</span>
        <el-select v-model="form.billBranch" placeholder="请选择" class='col-1' style='float:left'>
          <el-option key="yes" label="是" value="yes"></el-option>
          <el-option key="no" label="否" value="no"></el-option>
        </el-select>
        <span class='order-title-base'>始发站：</span>
        <el-select v-model="form.startStation" placeholder="请选择" class='col-1' style='float:left'>
          <el-option key="yes" label="是" value="yes"></el-option>
          <el-option key="no" label="否" value="no"></el-option>
        </el-select>
        <span class='order-title-base'>目的站：</span>
        <el-select v-model="form.arrStation" placeholder="请选择" class='col-1' style='float:left'>
          <el-option key="yes" label="是" value="yes"></el-option>
          <el-option key="no" label="否" value="no"></el-option>
        </el-select>
        <span class='col-1 order-title-base'>经办人：</span>
        <span style='float:left;padding-top:0.7%' class='col-1'>{{form.serviceNam}}</span>
      </div>
      <div style='margin-top:2%;clear:both'>
        <span class='label col-1'>发货方:</span>
        <input v-model="form.shipNam" class='input col-2'></input>
        <div class='label col-1'>联系方式:</div>
        <input v-model="form.shipTel" class='input col-2'></input>
        <div class='label col-1'>发货地址:</div>
        <input v-model="form.pickUpAdr" class='input col-6'></input>
        <div class='label col-1'>发货方:</div>
        <input v-model="form.receNam" class='input col-2'></input>
        <div class='label col-1'>联系方式:</div>
        <input v-model="form.recetel" class='input col-2'></input>
        <div class='label col-1'>发货地址:</div>
        <input v-model="form.receAdr" class='input col-6'></input>
        <div class='label col-1'>货物名称</div>
        <div class='label col-1'>件 数</div>
        <div class='label col-1'>重 量</div>
        <div class='label col-1'>体 积</div>
        <div class='label col-1'>包 装</div>
        <div class='label col-2'>是否等通知放货</div>
        <div class='label col-2'>订单类型：</div>
        <div class='label col-4'>
          <el-radio-group v-model="form.orderType">
            <el-radio label="普件"></el-radio>
            <el-radio label="加急件"></el-radio>
          </el-radio-group>
        </div>
        <input v-model="form.goodsNam" class='input col-1'></input>
        <input v-model="form.goodsNums" class='input col-1'></input>
        <input v-model="form.goodsWeight" class='input col-1'></input>
        <input v-model="form.goodsVolumn" class='input col-1'></input>
        <el-select v-model="form.package" placeholder="请选择" class='col-1 select'>
          <el-option v-for="item in selectItem" :label="item.desc" :value="item.id" :key="item.id">
          </el-option>
        </el-select>
        <el-select v-model="form.isFang" placeholder="请选择" class='col-2 select'>
          <el-option key="yes" label="是" value="yes"></el-option>
          <el-option key="no" label="否" value="no"></el-option>
        </el-select>
        <div class='label col-2'>送货方式</div>
        <div class='label col-4'>
          <el-radio-group v-model="form.sendMode">
            <el-radio label="自提"></el-radio>
            <el-radio label="送货上门"></el-radio>
          </el-radio-group>
        </div>
        <div class='label col-1 label-title'>运费</div>
        <div class='label col-1'>基础运费</div>
        <input class='input col-1' v-model="form.baseFee"></input>
        <div class='label col-1'>包装费</div>
        <input class='input col-1' v-model="form.packFee"></input>
        <div class='label col-1'>送货费</div>
        <input class='input col-1' v-model="form.sendFee"></input>
        <div class='label col-1'>卸货费</div>
        <input class='input col-1' v-model="form.landingFee"></input>
        <div class='label col-1'>提货费</div>
        <input class='input col-1' v-model="form.pickUpFee"></input>
        <div class='label col-1'>合计</div>
        <input class='input col-1' v-model="form.totalFee"></input>
        <div class='label col-1 label-title'>附加费</div>
        <div class='label col-1'>货款金额</div>
        <input class='input col-1' v-model="form.goodsPayment"></input>
        <div class='label col-2'>货款代收手续费</div>
        <input class='input col-2' v-model="form.procedureFee"></input>
        <div class='label col-1'>保额</div>
        <input class='input col-2' v-model="form.coverage"></input>
        <div class='label col-1'>保险费</div>
        <input class='input col-2' v-model="form.insurance"></input>
        <div class='label col-1 label-title'>回单押款</div>
        <div class='label col-1'>回单份数</div>
        <input class='input col-2' v-model="form.receNums"></input>
        <div class='label col-1'>回单押款</div>
        <input class='input col-2' v-model="form.receMoney"></input>
        <div class='label col-1 label-title'>返款</div>
        <div class='label col-1'>返款方式</div>
        <div class='label col-2'>
          <el-radio-group v-model="form.orderType">
            <el-radio label="现 返"></el-radio>
            <el-radio label="欠 返"></el-radio>
          </el-radio-group>
        </div>
        <div class='label col-1'>返款金额</div>
        <input class='input col-1' v-model="form.refuMoney"></input>
        <div class='label col-1 label-title'>总付金额</div>
        <input class='input col-4' v-model="form.totalFreight"></input>
        <div class='label col-1'>现付金额</div>
        <input class='input col-1' v-model="form.feeMoney[0]"></input>
        <div class='label col-1'>到付金额</div>
        <input class='input col-1' v-model="form.feeMoney[1]"></input>
        <div class='label col-1'>欠付金额</div>
        <input class='input col-1' v-model="form.feeMoney[2]"></input>
        <div class='label col-1'>月结金额</div>
        <input class='input col-1' v-model="form.feeMoney[3]"></input>
        <div class='label col-1'>备注：</div>
        <input class='input col-12' v-model="form.orderNote"></input>
      </div>
    </el-form>
    <div style='text-align:center'>
      <el-button style='margin-top:2%'>保存</el-button>
      <el-button style='margin-left:10%' @click="cancleVisable=true">取消</el-button>
    </div>
    <el-dialog title="" :visible.sync="cancleVisable" size="" tiny>
      <h2 style="padding:30px">确定取消吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleOrder">取 消</el-button>
        <el-button @click="submitOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      cancleVisable: false,
      form: {
        id: '12345',
        billBranch: '',
        startStation: '',
        arrStation: '',
        serviceNam: '李四',
        shipNam: '张三',
        shipTel: '12345',
        pickUpAdr: '北京市XXX',
        receNam: '李四',
        receTel: '12345',
        receAdr: '北京市XXX',
        goodsNam: '沙发',
        goodsNums: '5',
        goodsWeight: '120',
        goodsVolumn: '120',
        package: '',
        isFang: '',
        orderType: '',
        sendMode: '',
        baseFee: '100',
        packFee: '',
        sendFee: '',
        pickUpFee: '',
        landingFee: '',
        totalFee: '',
        goodsPayment: '',
        procedureFee: '',
        coverage: '',
        insurance: '',
        isReceipt: '',
        receNums: '',
        receMoney: '',
        refuMoney: '',
        totalFreight: '',
        feeMoney: [100.2, 200.3, 333.2, 100.00],
        orderNote: ''
      },
      selectItem: [
        { desc: '泡沫', id: 'pm' },
        { desc: '塑料', id: 'sl' },
        { desc: '纸箱', id: 'zx' }
      ]
    }
  },
  methods: {
    cancleOrder () {
      this.cancleVisable = false
    },
    submitOrder () {
      this.cancleVisable = false
    }
  }
}
</script>
<style scoped>
.col-1 {
  width: 7.69%
}

.col-2 {
  width: 15.38%
}

.col-3 {
  width: 23.07%
}

.col-4 {
  width: 30.76%
}

.col-6 {
  width: 46.14%
}

.col-12 {
  width: 92.28%
}

.order-title-base {
  float: left;
  padding-top: 0.7%;
  margin-left: 5%
}

.label {
  background-color: #fff;
  border: 1px solid;
  box-sizing: border-box;
  color: rgb(31, 61, 60);
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

.input {
  background-color: #fff;
  border: 1px solid #000000;
  box-sizing: border-box;
  float: left;
  font-size: inherit;
  height: 38px;
  line-height: 1;
  outline: 0;
  padding: 0.5% 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
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
</style>