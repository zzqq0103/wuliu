<template>
  <div>
    <h2 style="text-align:center">网点开单</h2>
    <el-form ref="form" :model="form">
      <div style='margin-top:2%;display:inline-block;width:100%'>
        <span style='float:left;padding-top:0.7%;width:5%'>日期：</span>
        <span style='float:left;padding-top:0.9%;width:13%'>{{timeNow}}</span>
        <span class='order-title-base' style='width:7%'>始发站：</span>
        <el-select v-model="form.startStation" placeholder="请选择" class='col-1' style='float:left'>
          <el-option key="beijing" label="北京" value="beijing"></el-option>
          <el-option key="nanjing" label="南京" value="nanjing"></el-option>
        </el-select>
        <span class='order-title-base' style='width:7%'>目的地：</span>
        <el-form-item style="float:left;width:10%">
          <input type="text" list="arrStation" v-model="form.arrStation" class='input-tishi' style="float:left;width:100%" />
          <datalist id="arrStation">
            <option v-for="item in initForm.arrStationList" :value="item" :key="item" />
          </datalist>
        </el-form-item>
        <span style='float:left;padding:0.7% 0 0 2%;width:7%'>订单号：</span>
        <span style='float:left;padding-top:0.9%;width:15%'>{{initForm.orderId}}</span>
      </div>
      <div style='margin-top:2%;clear:both'>
        <span class='label col-1'>发货方</span>
        <!--
        <div id='focus_fahuo' class='dropdown' style='outline:none'  tabindex="0" @click="getFocus(3)" @blur="fahuoShow=false">
            <input type="text" 上  class='input col-4'  placeholder="请输入发货方名称"></input>
            <div class="dropdown-content" v-show="fahuoShow" style='width:38%'> 
              <div class='dropdown-select'>
                <ul class='dropdown-fahuo'>
                  <li v-bind:key="data" v-for="(data,i) in this.fahuoList"  v-on:dblclick="clickFahuo(data)"  style='text-align:center;font-size:100%;padding:1% 0 1% 0'>{{data}}</li>
                </ul>
              </div>
            </div>
        </div>
        -->
        <div class='dropdown_fahuo col-4'>
            <input type="text" 上  class='input' style='width:100%' v-model='fahuoKeyword' @keyup="getSearchFahuo()"  placeholder="请输入发货方名称"></input>
            <div class="dropdown-content" v-show="fahuoShow" style='width:39%'> 
              <div class='dropdown-select'>
                <ul class='dropdown-fahuo'>
                  <li v-bind:key="data" v-for="(data,i) in this.fahuoList"  v-on:dblclick="clickFahuo(data)"  style='text-align:center;font-size:100%;padding:1% 0 1% 0'>{{data}}</li>
                </ul>
              </div>
            </div>
        </div>
        <span class='label col-1'>收货方</span>
        <input class='input col-4' style='height:38px' v-model="form.receNam"></input>
        <span class='label col-1'>电话</span>
        <input class='input col-4' style='height:38px' v-model="form.shipTel"></input>
        <span class='label col-1'>电话</span>
        <input class='input col-4' style='height:38px' v-model="form.receTel"></input>
        <!-- <span class='label col-1'>地址</span>
        <input class='input col-4' style='height:38px'></input> -->
        <div class='label col-1'>提货地址:</div>
        <div id='focus_fahuoAd' class='dropdown col-2' style='outline:none' contenteditable="true" tabindex="0" @click="getFocus(1)" @blur="addressVisible=false">
            <input type="text" v-model="form.baseAddressFa" v-bind:readonly="isReadOnly" class='input' style='width:100%' @focus="addressVisible=true" placeholder="请选择发货地址"></input>
            <div class="dropdown-content2 col-2" v-show="addressVisible"> 
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
        <input class='input col-2' v-model='form.pickUpAdr' placeholder="输入详细提货地址"></input>
        <span class='label col-1'>收货地址</span>
        <div id='focus_shouhuoAd' class="dropdown col-2" style='outline:none' contenteditable="true" tabindex="0" @click="getFocus(2)" @blur="addressVisible2=false">
            <input type="text" v-model="form.baseAddressShou" v-bind:readonly="isReadOnly" class='input' style="width:100%" @focus="addressVisible2=true" placeholder="请选择提货地址"></input>
            <div class="dropdown-content2 col-2" style='margin-top:38px' v-show="addressVisible2"> 
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
        <input class='input col-2' placeholder="输入详细收货地址" v-model="form.receAdr"></input>
        <span class='label label-mo col-1'>货物名称</span>
        <span class='label label-mo col-1'>包装</span>
        <span class='label col-1 label-mo'>件数</span>
        <span class='label col-1 label-mo'>重量</span>
        <span class='label col-1 label-mo'>体积</span>
        <span class='label col-1 label-mo'>运输方式</span>
        <span class='label col-1 label-mo'>交货方式</span>
        <label class='label col-1 label-mo'>是否控货</label>
        <label class='label2 col-2' style="height:29px">回单</label>
        <label class='label2 col-1' style="height:29px">回单份数</label>
        <label class='label2 col-1' style="height:29px">回单押款</label>
        <input class='input col-1 input-mid' v-model="form.goodsNam"></input>
        <el-select placeholder="" class='col-1 select' v-model="form.package">
          <el-option key="zhixiang" label="纸箱" value="zhixiang"></el-option>
          <el-option key="muxiang" label="木箱" value="muxiang"></el-option>
          <el-option key="mukuang" label="木框" value="mukuang"></el-option>
          <el-option key="bianzhidai" label="编织袋" value="bianzhidai"></el-option>
          <el-option key="dai" label="袋" value="dai"></el-option>
          <el-option key="mo" label="膜" value="mo"></el-option>
          <el-option key="tong" label="桶" value="tong"></el-option>
          <el-option key="no" label="无" value="no"></el-option>
        </el-select>
        <input class='input col-1 input-mid' v-model="form.goodsNums"></input>
        <input class='input col-1 input-mid' v-model="form.goodsWeight"></input>
        <input class='input col-1 input-mid' v-model="form.goodsVolumn"></input>
        <el-select placeholder="" class='col-1 select input-mid' v-model="form.orderType">
          <el-option key="zhixiang" label="普件" value="pujian"></el-option>
          <el-option key="muxiang" label="加急件" value="jiajijian"></el-option>
        </el-select>
        <el-select placeholder="" class='col-1 select input-mid' v-model="form.sendMode">
          <el-option key="zhixiang" label="自提" value="ziti"></el-option>
          <el-option key="muxiang" label="送货上门" value="songhuo"></el-option>
        </el-select>
        <el-select placeholder="" class='col-1 select input-mid' v-model="form.isListenToRele">
          <el-option key="yes" label="是" value="yes"></el-option>
          <el-option key="no" label="否" value="no"></el-option>
        </el-select>
        <input type="text" list="receList" v-model="form.receNums" class='input-tishi col-1 select input-mid'/>
        <datalist id="receList">
          <option v-for="item in receList" :value="item" :key="item" />
        </datalist>
        <input class='input col-1' v-model="form.receMoney"></input>
        <span class='label col-1 label-mo'>运费</span>
        <span class='label col-1 label-mo'>提货费</span>
        <span class='label col-1 label-mo'>送货费</span>
        <span class='label col-1 label-mo'>包装费</span>
        <span class='label col-1 label-mo'>卸货费</span>
        <span class='label col-1 label-mo'>保价费</span>
        <span class='label col-1 label-mo'>代收费</span>
        <label class='label col-1 label-mo'>其它费用</label>
        <label class='label2 col-2' style="height:29px">返款</label>
        <label class='label2 col-1' style="height:29px">金额</label>
        <label class='label2 col-1' style="height:29px">支付方式</label>
        <input class='input col-1 input-mid' @click="baseFeeVisible=true" v-model="form.baseFee"></input>
        <input class='input col-1 input-mid' v-model="form.pickUpFee"></input>
        <input class='input col-1 input-mid' v-model="form.sendFee"></input>
        <input class='input col-1 input-mid' v-model="form.packFee"></input>
        <input class='input col-1 input-mid' v-model="form.landingFee"></input>
        <input class='input col-1 input-mid' v-model="form.insurance" @click="coverageVisible = true" v-bind:readonly="true"></input>
        <input class='input col-1 input-mid'></input>
        <input class='input col-1 input-mid'></input>
        <input class='input col-1 input-mid' v-model="form.refuMoney"></input>
        <input class='input col-1 input-mid'></input>
        <span class='label col-1 input-mid'>费用合计</span>
        <input class='input col-2'></input>
      </div>
    </el-form>
    <!-- 输入保额弹窗 -->
    <el-dialog :visible.sync="coverageVisible" size="tiny">
      <el-form :rules="rules" v-model='form' style='text-align:center;verticle-align:center'>
        <span style='float:left;padding:2% 0% 0% 5%'>保额：</span>
        <el-form-item>
          <el-input style='width:60%'  v-model='form.coverage'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="coverageVisible = false">取 消</el-button>
        <el-button type="primary" @click="setInsurance">确 定</el-button>
      </div>
    </el-dialog>
    <!--生成运费弹窗-->
    <el-dialog :visible.sync="baseFeeVisible" size="tiny">
      <el-button style='text-align:center;verticle-align:center' @click="getBaseFee">生成运费</el-button>
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
      receList: [1, 2, 3],
      coverageVisible: false, // 保额输入弹窗
      fahuoRelated: {
        baseAddressFa: '北京北京海淀区',
        baseAddressShou: '江苏无锡惠山区',
        shipNam: '张三发',
        shipTel: '发货方电话',
        pickUpAdr: '提货地址',
        receNam: '李四收',
        receTel: '收货方电话',
        receAdr: '收货方地址'
      },
      fahuoList: [],
      fahuoShow: false,
      baseFeeinit: 1000,
      baseFeeVisible: false,
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
      /** 地址样式 */
      addressVisible: false,
      addressVisible2: false,
      cancleVisable: false,
      shenfen: false,
      shi: false,
      quyu: false,
      shenfen2: false,
      shi2: false,
      quyu2: false,
      isFocus: false,
      isFocus2: false,
      isReadOnly: false,
      isReadOnly2: false,
      initForm: {
        arrStationList: ['目的站1', '目的站2', '目的站3', '目的站4', '目的站5', '目的站6'],
        orderId: '121212'
      },
      form: {
        id: '12345',
        billBranch: '',
        startStation: '',
        arrStation: '',
        serviceNam: '',
        shipNam: '',
        shipTel: '',
        pickUpAdr: '',
        receNam: '',
        receTel: '',
        receAdr: '',
        goodsNam: '',
        goodsNums: '',
        goodsWeight: '',
        goodsVolumn: '',
        package: '',
        isListenToRele: '',
        orderType: '',
        tranMode: '',
        sendMode: '',
        baseFee: '',
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
        orderNote: '',
        baseAddressFa: '',
        baseAddressShou: ''
      }
    }
  },
  computed: {
    timeNow: function () {
      let date = new Date()
      let seperator1 = '-'
      let seperator2 = ':'
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
              ' ' + date.getHours() + seperator2 + date.getMinutes() +
              seperator2 + date.getSeconds()
      return currentdate
    }
  },
  methods: {
    test () {
      alert('sds')
    },
    // 自动生成运费
    getBaseFee () {
      this.form.baseFee = 1000
      this.baseFeeVisible = false
    },
    // 实时搜索发货方列表
    getSearchFahuo () {
      if (this.fahuoKeyword !== '') {
        this.fahuoShow = true
        this.fahuoList = ['发货方1', '发货方2', '发货方3', '发货方4']
      } else if (this.fahuoKeyword === '') {
        this.fahuoShow = false
      }
    },
    // 根据保额设置保价费
    setInsurance () {
      this.form.insurance = this.form.coverage * 0.005
      this.coverageVisible = false
    },
    // 双击发货方列表补充数据
    clickFahuo (data) {
      this.form.shipNam = data
      this.fahuoShow = false
      this.form.shipNam = data
      this.form.shipTel = this.fahuoRelated.shipTel
      this.form.pickUpAdr = this.fahuoRelated.pickUpAdr
      this.form.receNam = this.fahuoRelated.receNam
      this.form.receTel = this.fahuoRelated.receTel
      this.form.receAdr = this.fahuoRelated.receAdr
      this.form.baseAddressFa = this.fahuoRelated.baseAddressFa
      this.form.baseAddressShou = this.fahuoRelated.baseAddressShou
    },
    getFocus (num) {
      if (num === 1) {
        this.addressVisible = true
        document.getElementById('focus_fahuoAd').focus()
      } else if (num === 2) {
        this.addressVisible2 = true
        document.getElementById('focus_shouhuoAd').focus()
      } else {
        /* document.getElementById('focus_fahuo').focus()
        this.fahuoShow = true */
      }
    },
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
      this.form.baseAddressShou = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
      this.form.baseAddressFa = this.shenfenSelected + this.shiSelected + this.quSelected
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
      this.form.baseAddressShou = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
      this.form.baseAddressFa = this.shenfenSelected + this.shiSelected + this.quSelected
    },
    selectQu (num, name) {
      if (num === 1) {
        this.quSelected = name
        this.addressVisible = false
        this.isReadOnly = true
      } else {
        this.quSelected2 = name
        this.addressVisible2 = false
        this.isReadOnly2 = true
      }
      this.form.baseAddressShou = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
      this.form.baseAddressFa = this.shenfenSelected + this.shiSelected + this.quSelected
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
.el-scrollbar__bar.is-vertical {
    width: 6px;
    top: 2px;
}
.el-scrollbar__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 120ms ease-out;
}
.el-scrollbar__bar.is-vertical > div {
    width: 100%;
}
.el-scrollbar__thumb {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: rgba(151, 168, 190, .3);
    transition: .3s background-color;
}
.dropdown_fahuo{
  display: inline-block;
  float: left
}
.dropdown{
  display: inline-block;
  float: left
}
.dropdown-content {
  /*
  height:200px;
  position: absolute;
  background-color: #fff;
  padding: 0;
  box-shadow: 10px 8px 16px 0px rgba(0, 0, 0, 0.5);
  z-index: 1;
  width:22%;
  margin-left:9.7%;
  margin-top:3.5% */
    position: absolute;
    margin-left:0%;
    margin-top:38px;
    width:20%;
    z-index: 1001;
    border: 1px solid rgb(209, 229, 229);
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    box-sizing: border-box;
}

.dropdown-content2 {
  height:200px;
  position: absolute;
  background-color: #fff;
  padding: 0;
  box-shadow: 10px 8px 16px 0px rgba(0, 0, 0, 0.5);
  z-index: 1;
  width:20%;
  margin-top:38px 
}

.dropdown-select{
  clear:both;
  max-height:160px;
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

.dropdown-fahuo li:hover{
  cursor: pointer;
  background-color: #D1E5E5
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

.input-mid {
  text-align: center
}
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

.col-6 {
  width: 60%
}

.col-10 {
  width: 100%
}

.order-title-base {
  float: left;
  padding-top: 0.7%;
  margin-left: 2%
}

.label {
  background-color: #fff;
  border: 1px solid;
  box-sizing: border-box;
  color: rgb(31, 61, 60);
  float: left;
  font-size: 105%;
  padding: 0.9% 0;
  height: 38px;
  outline: 0;
  text-align: center;
  overflow: hidden
}

.label-mo {
  height:58px;
  padding: 1.3% 0;
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

.label2 {
  background-color: #fff;
  border: 1px solid #000000;
  box-sizing: border-box;
  float: left;
  text-align: center;
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
  font: inherit;
  margin-bottom: -12px;
  font-size: inherit
}

.label-title {
  background-color: #E0E0E0
}
</style>