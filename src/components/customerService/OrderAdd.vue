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
        <div class='dropdown'>
            <input type="text" v-model="baseAddress" v-bind:readonly="isReadOnly" class='input col-3' @focus="addressVisible=true" placeholder="请选择地址"></input>
            <div class="dropdown-content" v-show="addressVisible"> 
              <ul class='dropdown-content-select'>
                <li @click="setShenfen(1)" class='dropdown-li' v-bind:class="{'selectOn':shenfen}">省份</li>
                <li @click="setShi(1)" class='dropdown-li' v-bind:class="{'selectOn':shi}">城市</li>
                <li @click="setQuyu(1)" class='dropdown-li' v-bind:class="{'selectOn':quyu}">区县</li>
              </ul>
              <div class='dropdown-select'>
                <ul class='dropdown-shenfen' v-show="shenfen">
                  <li v-for="(data,i) in this.regionList" @click="selectShenfen(1,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
                <ul class='dropdown-shi' v-show="shi">
                  <li v-for="(data,i) in this.shiList.sub" @click="selectShi(1,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
                <ul v-show="quyu">
                  <li v-for="(data,i) in this.quList" @click="selectQu(1,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
              </div>
            </div>
        </div>
        <input class='input col-3' v-model='form.pickUpAdr' placeholder="详细地址"></input>
        <div class='label col-1'>发货方:</div>
        <input v-model="form.receNam" class='input col-2'></input>
        <div class='label col-1'>联系方式:</div>
        <input v-model="form.recetel" class='input col-2'></input>
        <div class='label col-1'>收货地址:</div>
        <div class='dropdown'>
            <input type="text" v-model="baseAddress2" v-bind:readonly="isReadOnly2" class='input col-3' @focus="addressVisible2=true" placeholder="请选择地址"></input>
            <div class="dropdown-content" style='margin-top:7%' v-show="addressVisible2"> 
              <ul class='dropdown-content-select'>
                <li @click="setShenfen(2)" class='dropdown-li' v-bind:class="{'selectOn':shenfen2}">省份</li>
                <li @click="setShi(2)" class='dropdown-li' v-bind:class="{'selectOn':shi2}">城市</li>
                <li @click="setQuyu(2)" class='dropdown-li' v-bind:class="{'selectOn':quyu2}">区县</li>
              </ul>
              <div class='dropdown-select'>
                <ul class='dropdown-shenfen' v-show="shenfen2">
                  <li v-for="(data,i) in this.regionList2" @click="selectShenfen(2,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
                <ul class='dropdown-shi' v-show="shi2">
                  <li v-for="(data,i) in this.shiList2.sub" @click="selectShi(2,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
                <ul v-show="quyu2">
                  <li v-for="(data,i) in this.quList2" @click="selectQu(2,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
              </div>
            </div>
        </div>
        <input class='input col-3' v-model='form.receAdr' placeholder="详细地址"></input>
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
import regionJson from '../../../static/region.json'
export default {
  created () {
    this.regionList = regionJson
    this.regionList2 = regionJson
  },
  data: function () {
    return {
      /** 地址内容 */
      shenfenSelected: '',
      shiSelected: '',
      quSelected: '',
      shenfenSelected2: '',
      shiSelected2: '',
      quSelected2: '',
      regionList: [],
      shiList: [],
      quList: [],
      shiList2: [],
      quList2: [],
      baseAddress: '',
      baseAddress2: '',
      /** 地址样式 */
      addressVisible: false,
      addressVisible2: false,
      shenfen: false,
      shi: false,
      quyu: false,
      shenfen2: false,
      shi2: false,
      quyu2: false,
      isFocus: false,
      isFocus2: false,
      idReadOnly: false,
      isReadOnly2: false,
      form: {
        id: '12345',
        billBranch: '',
        startStation: '',
        arrStation: '',
        serviceNam: '李四',
        shipNam: '张三',
        shipTel: '12345',
        pickUpAdr: '',
        receNam: '李四',
        receTel: '12345',
        receAdr: '',
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
    },
    selectShenfen (num, name) {
      if (num === 1) {
        this.shenfenSelected = name
        this.shiSelected = ''
        this.quSelected = ''
        this.quList = []
        this.shiList = []
      } else {
        this.shenfenSelected2 = name
        this.shiSelected2 = ''
        this.quSelected2 = ''
        this.quList2 = []
        this.shiList2 = []
      }
      this.baseAddress2 = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
      this.baseAddress = this.shenfenSelected + this.shiSelected + this.quSelected
    },
    selectShi (num, name) {
      if (num === 1) {
        this.shiSelected = name
        this.quSelected = ''
        this.quList = []
      } else {
        this.shiSelected2 = name
        this.quSelected2 = ''
        this.quList2 = []
      }
      this.baseAddress2 = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
      this.baseAddress = this.shenfenSelected + this.shiSelected + this.quSelected
    },
    selectQu (num, name) {
      if (num === 1) {
        this.quSelected = name
        this.addressVisible = false
        this.detailVisible = true
        this.isReadOnly = true
      } else {
        this.quSelected2 = name
        this.addressVisible2 = false
        this.detailVisible2 = true
        this.isReadOnly2 = true
      }
      this.baseAddress2 = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
      this.baseAddress = this.shenfenSelected + this.shiSelected + this.quSelected
    },
    setShenfen (num) {
      if (num === 1) {
        this.shenfen = true
        this.shi = false
        this.quyu = false
      } else {
        this.shenfen2 = true
        this.shi2 = false
        this.quyu2 = false
      }
    },
   /** 设置城市级 */
    setShi (num) {
      if (num === 1) {
        this.shenfen = false
        this.shi = true
        this.quyu = false
        if (this.shenfenSelected) {
          regionJson.filter(item => {
            if (item.name === this.shenfenSelected) {
              this.shiList = item
              return true
            }
          })
        }
      } else {
        this.shenfen2 = false
        this.shi2 = true
        this.quyu2 = false
        if (this.shenfenSelected2) {
          regionJson.filter(item => {
            if (item.name === this.shenfenSelected2) {
              this.shiList2 = item
              return true
            }
          })
        }
      }
    },
    /** 设置地区 */
    setQuyu (num) {
      if (num === 1) {
        this.shenfen = false
        this.shi = false
        this.quyu = true
        if (this.shiSelected && this.shenfenSelected) {
          this.shiList.sub.filter(item => {
            if (item.name === this.shiSelected) {
              this.quList = item.sub
              return true
            }
          })
        }
      } else {
        this.shenfen2 = false
        this.shi2 = false
        this.quyu2 = true
        if (this.shiSelected2 && this.shenfenSelected2) {
          this.shiList2.sub.filter(item => {
            if (item.name === this.shiSelected2) {
              this.quList2 = item.sub
              return true
            }
          })
        }
      }
    }
  }
}
</script>
<style scoped>
.dropdown{

}
.dropdown-content {
  height:200px;
  position: absolute;
  background-color: #fff;
  margin-left:-3%;
  padding: 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
  z-index: 1;
  width:22%;
  margin-left:52%;
  margin-top:3.5%
}

.dropdown-select{
  clear:both;
  height:160px;
  overflow-y:scroll
}

.dropdown-select ul{
  clear:both;
  list-style-type:none
}

.dropdown-select ul li:hover{
    cursor: pointer;
    background-color: #D1E5E5
}
.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-content-select {
  list-style-type:none;
}

.dropdown-li{
  cursor: pointer;
  font-size: 15px;
  padding: 3% 2%;
  border-right: 1px solid #C0C0C0;
  width: 33.33%;
  margin: 0;
  float:left;
  box-sizing: border-box;
  background-color: #D1E5E5;
  text-align: center
}

.dropdown-shenfen li:hover{
  cursor: pointer;
  background-color: #D1E5E5
}
.addressDetail{
  width:45%;
  float:left;
  margin-left:-5%
}
.selectOn{
  background-color:#00d1b2;
}

.selectNo{
  background-color: #EEF6F6
}

.div-form {
  border: 2px solid black;
  width: 60%;
  margin-left: 18%;
  display: inline-block;
  margin-top: 2%;
  padding: 2%;
  box-sizing: border-box
}

.input-tishi {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid rgb(191, 217, 216);
  box-sizing: border-box;
  color: rgb(31, 61, 60);
  display: block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}
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