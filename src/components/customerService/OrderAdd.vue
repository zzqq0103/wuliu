<template>
  <div>
    <h2 style="text-align:center">网点开单</h2>
    <el-form  :model="form" ref="form">
      <div style='margin-top:2%;display:inline-block;width:100%'>
        <!-- <span style='float:left;padding-top:0.7%;width:80px'>日期：</span>
        <span style='float:left;padding-top:0.9%;width:150px'>{{timeNow}}</span> -->
        <span style='float:left;padding:0.7% 0 0 2%;width:100px'>订单号：</span>
        <span style='float:left;padding-top:0.9%;width:150px'>{{initForm.orderId}}</span>
        <span class='order-title-base' style='width:80px'>始发站：</span>
        <el-form-item style="float:left;width:150px">
          <el-select placeholder="" v-model="form.startStation" @change="handleChange1">
            <el-option v-for="item in initForm.stationOptions" :value="item" :key="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- <div style="width: 150px; float: left">
            <el-cascader
              expand-trigger="hover"
              :options="initForm.stationOptions"
              @change="handleChange1">
            </el-cascader>
        </div> -->
        <span class='order-title-base' style='width:80px'>目的站：</span>
        <el-form-item style="float:left;width:150px">
          <el-select placeholder="" v-model="form.arrStation" @change="handleChange2">
            <el-option v-for="item in initForm.stationOptions" :value="item" :key="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- <div style="width: 150px; float: left">
            <el-cascader
              expand-trigger="hover"
              :options="initForm.stationOptions"
              @change="handleChange2">
            </el-cascader>
        </div> -->
      </div>
      <div style='margin-top:2%;clear:both'>
        <span class='label col-1'>发货方</span>
        <div class='dropdown_fahuo col-4'>
            <input type="text"  class='input' style='width:100%' v-model='form.shipNam' @keyup="getSearchFahuoFro()" @keyup.enter="setBlur(1)" v-bind:class="{'error':isshipNam}" placeholder="请输入发货方名称"  @blur="check(10, 'shipNam')"></input>
            <div class="dropdown-content" v-show="fahuoShow" style='width:39%'> 
              <div class='dropdown-select'>
                <ul class='dropdown-fahuo'>
                  <li v-bind:key="data" v-for="(data,i) in this.fahuoList"  v-on:dblclick="clickFahuo(data)">{{data}}</li>
                </ul>
              </div>
            </div>
        </div>
        <span class='label col-1'>收货方</span>
        <!-- <div id='focus_shouhuo' class='dropdown col-4' style='outline:none' contenteditable="false" tabindex="0" @click="getFocus(3)"  @blur="check(10, 'receNam')">
            <input type="text" id='focus_shouhuo_input' v-model="form.receNam" class='input' style='width:100%' @keyup="getSearchShouhuo()" placeholder="请选择发货地址" v-bind:class="{'error':isreceNam}"  prop="receNam"></input>
            <div class="dropdown-content" v-show="shouhuoShow" style='width:39%'>
              <div class='dropdown-select'>
                <ul class='dropdown-fahuo'>
                  <li v-for="(data,i) in this.shouhuoList" :key='data' v-on:dblclick="clickShouhuo(data)">{{data}}</li>
                </ul>
              </div>
            </div>
        </div> -->
        <div class='dropdown_fahuo col-4'>
            <input type="text"  class='input' style='width:100%' v-model='form.receNam' @keyup="getSearchShouhuo()" @keyup.enter="setBlur(2)" v-bind:class="{'error':isreceNam}" placeholder="请输入收货方名称"  @blur="check(10, 'receNam')"></input>
            <div class="dropdown-content" v-show="shouhuoShow" style='width:39%'> 
              <div class='dropdown-select'>
                <ul class='dropdown-fahuo'>
                  <li v-bind:key="data" v-for="(data,i) in this.shouhuoList"  v-on:dblclick="clickShouhuo(data)">{{data}}</li>
                </ul>
              </div>
            </div>
        </div>
        <span class='label col-1'>电话</span>
        <input class='input col-4' style='height:38px' placeholder="请填写发货方电话" v-bind:class="{ 'error': isshipTel}" v-model="form.shipTel"  @blur="check(3)"></input>
        <span class='label col-1'>电话</span>
        <input class='input col-4' style='height:38px' placeholder="请填写发货方电话" v-bind:class="{'error':isreceTel}" v-model="form.receTel"  @blur="check(4)"></input>
        <div class='label col-1'>提货地址:</div>
        <div id='focus_fahuoAd' class='dropdown col-2' style='outline:none' contenteditable="false" tabindex="0" @click="getFocus(1)" @blur="check(5)">
            <input type="text" v-model="getbaseAddressFa" v-bind:readonly="isReadOnly" class='input' v-bind:class="{'error':isbaseAddressFa}" style='width:100%' @focus="addressVisible=true" placeholder="请选择发货地址"></input>
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
        <input class='input col-2' v-model='form.pickUpAdr' v-bind:class="{'error':ispickUpAdr}" @blur="check(10, 'pickUpAdr')" placeholder="填写详细提货地址"></input>
        <span class='label col-1'>收货地址</span>
        <div id='focus_shouhuoAd' class="dropdown col-2" style='outline:none' contenteditable="false" tabindex="0" @click="getFocus(2)" @blur="check(7)">
            <input type="text" v-model="getbaseAddressShou" v-bind:readonly="isReadOnly" class='input' style="width:100%" v-bind:class="{'error':isbaseAddressShou}" @focus="addressVisible2=true" placeholder="请选择提货地址"></input>
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
        <input class='input col-2' placeholder="填写详细收货地址" v-bind:class="{'error':isreceAdr}" @blur="check(10, 'receAdr')" v-model="form.receAdr"></input>
        <span class='label label-mo col-1'>货物名称</span>
        <span class='label label-mo col-1'>包装</span>
        <span class='label col-1 label-mo'>件数</span>
        <span class='label col-1 label-mo'>总重量</span>
        <span class='label col-1 label-mo'>总体积</span>
        <span class='label col-1 label-mo'>送货方式</span>
        <span class='label col-1 label-mo'>交货方式</span>
        <label class='label col-1 label-mo'>提货网点</label>
        <label class='label2 col-2' style="height:29px">回单</label>
        <label class='label2 col-1' style="height:29px">回单份数</label>
        <label class='label2 col-1' style="height:29px">回单押款</label>
        <input class='input col-1 input-mid' v-model="form.goodsNam" v-bind:class="{'error':isgoodsNam}" @blur="check(10,'goodsNam')"></input>
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
        <input class='input col-1 input-mid' v-model="form.goodsNums" type="number" v-bind:class="{'error':isgoodsNums}" @blur="check(8)"></input>
        <input class='input col-1 input-mid' v-model="form.goodsWeight" type="number" v-bind:class="{'error':isgoodsWeight}" @blur="check(9,'goodsWeight')"></input>
        <input class='input col-1 input-mid' v-model="form.goodsVolumn" type="number" v-bind:class="{'error':isgoodsVolumn}" @blur="check(9,'goodsVolumn')"></input>
        <el-select placeholder="" class='col-1 select input-mid' v-model="form.orderType">
          <el-option key="zhixiang" label="普件" value="pujian"></el-option>
          <el-option key="muxiang" label="加急件" value="jiajijian"></el-option>
        </el-select>
        <el-select placeholder="" class='col-1 select input-mid' v-model="form.sendMode" @change="setsendMode()">
          <el-option key="ziti" label="自提" value="ziti"></el-option>
          <el-option key="songhuo" label="送货上门" value="songhuo"></el-option>
        </el-select>
        <div v-if="this.form.sendMode === 'ziti'">
          <el-select placeholder="" class='col-1 select input-mid' v-model="form.branch">
            <el-option v-for="item in branchList" :value="item" :key="item" :label="item"></el-option>
          </el-select>
        </div>
        <div v-else>
          <input class='input col-1 input-mid' v-bind:readonly="true"  v-model="form.branch"></input>
        </div>
        <input list="receList" v-model="form.receNums" v-bind:class="{'error':isreceNums}" @blur="check(9,'receNums')" type="number" @change="setReceMoney" class='input-tishi col-1 select input-mid'/>
        <datalist id="receList">
          <option v-for="item in receList" :value="item" :key="item" />
        </datalist>
        <input class='input input-mid col-1' v-model="form.receMoney" v-bind:class="{'error':isreceMoney}" @blur="check(9,'receMoney')"></input>
        <label class='label col-1 label-mo'>是否控货</label>
        <span class='label col-1 label-mo'>运费</span>
        <span class='label col-1 label-mo'>提货费</span>
        <span class='label col-1 label-mo'>送货费</span>
        <span class='label col-1 label-mo'>包装费</span>
        <span class='label col-1 label-mo'>卸货费</span>
        <span class='label col-1 label-mo'>保价费</span>
        <span class='label col-1 label-mo'>代收费</span>
        <label class='label2 col-2' style="height:29px">返款</label>
        <label class='label2 col-1' style="height:29px">金额</label>
        <label class='label2 col-1' style="height:29px">支付方式</label>
        <el-select placeholder="" class='col-1 select input-mid' v-model="form.isListenToRele">
          <el-option key="yes" label="是" value="yes"></el-option>
          <el-option key="no" label="否" value="no"></el-option>
        </el-select>
        <input class='input col-1 input-mid' @click="baseFeeVisible=true" v-model="form.baseFee" type="number" v-bind:class="{'error':isbaseFee}" @blur="check(9,'baseFee')"></input>
        <input class='input col-1 input-mid' v-model="form.pickUpFee" type="number" v-bind:class="{'error':ispickUpFee}" @blur="check(9,'pickUpFee')"></input>
        <input class='input col-1 input-mid' v-model="form.sendFee" type="number" v-bind:class="{'error':issendFee}" @blur="check(9,'sendFee')"></input>
        <input class='input col-1 input-mid' v-model="form.packFee" type="number" v-bind:class="{'error':ispackFee}" @blur="check(9,'packFee')"></input>
        <input class='input col-1 input-mid' v-model="form.landingFee" type="number" v-bind:class="{'error':islandingFee}" @blur="check(9,'landingFee')"></input>
        <input class='input col-1 input-mid' v-model="insurance" @click="coverageVisible = true" v-bind:readonly="true" type="number" v-bind:class="{'error':isinsurance}"></input>
        <input class='input col-1 input-mid' v-model="goodsPayment2" @click="goodsPaymentVisible = true" v-bind:readonly="true" type="number" v-bind:class="{'error':isgoodsPayment}"></input>
        <input class='input col-1 input-mid' v-model="form.refuMoney" @change="setRetuPayMode"  type="number" v-bind:class="{'error':isrefuMoney}" @blur="check(9,'refuMoney')"></input>
        <!-- <input class='input col-1 input-mid'></input> -->
        <el-select placeholder="请选择" class='col-1 select input-mid error' v-model="form.retuPayMode" v-bind:style="retuPayModeObject" @change="check(11,'retuPayMode')">
          <el-option v-for="item in initForm.retuPayModeList" :value="item" :label="item" :key="item"/>
        </el-select>
        <span class='label col-1 label-mo'>异动收入</span>
        <span class='label col-1 label-mo'>异动支出</span>
        <span class='label col-2 label-mo'>总运费</span>
        <span class='label col-2 label-mo'>代收金额</span>
        <label class='label2 col-4' style="height:29px">付款方式</label>
        <label class='label2 col-1' style="height:29px">现付</label>
        <label class='label2 col-1' style="height:29px">到付</label>
        <label class='label2 col-1' style="height:29px">欠付</label>
        <label class='label2 col-1' style="height:29px">月结</label>
        <input class='input col-1 input-mid' type="number" v-model="form.unActIncome" v-bind:class="{'error':isunActIncome}" @blur="check(9,'unActIncome')"></input>
        <input class='input col-1 input-mid' type="number" v-model="form.unActExpense" v-bind:class="{'error':isunActExpense}" @blur="check(9,'unActExpense')"></input>
        <input class='input col-2 input-mid' type="number" v-model="gettotalFreight"  v-bind:readonly="true" v-bind:class="{'error':istotalFreight}"></input>
        <input class='input col-2 input-mid' type="number" v-model="form.goodsPayment" @click="goodsPaymentVisible = true" v-bind:readonly="true"></input>
        <input class='input col-1 input-mid' type="number" v-model="form.feeMoney[0]" v-bind:class="{'error':isfeeMoney1}" @blur="check(6, 0)"></input>
        <input class='input col-1 input-mid' type="number" v-model="form.feeMoney[1]" v-bind:class="{'error':isfeeMoney2}" @blur="check(6, 1)"></input>
        <input class='input col-1 input-mid' type="number" v-model="form.feeMoney[2]" v-bind:class="{'error':isfeeMoney3}" @blur="check(6, 2)"></input>
        <input class='input col-1 input-mid' type="number" v-model="form.feeMoney[3]" v-bind:class="{'error':isfeeMoney4}" @blur="check(6, 3)"></input>
        <span class='label label-mo col-1'>备注</span>
        <label class='label2 col-1' style="height:29px">附属约定</label>
        <input class='input col-8' style="height:29px" placeholder="请填写客户附加要求"></input>
        <label class='label2 col-1' style="height:29px">情况说明</label>
        <input class='input col-8'style="height:29px" placeholder="请填写货物情况说明"></input>
      </div>
    </el-form>

    <div style='text-align:center;clear:both'>
      <el-button style='margin-top:2%' type="primary" @click="submitValidate(1)">生成运费</el-button>
      <el-button style='margin-top:2%' type="primary" @click="submitValidate(2)">提交订单</el-button>
    </div>
    
    <!-- 订单列表错误输入提示弹窗 -->
    <el-dialog title="错误：" :visible.sync="wrongNoteVisable" size="tiny">
      <h2 style="text-align:center;padding: 30px 0 30px 0px">{{wrongNote}}</h2>
    </el-dialog>

    <!-- 确认提交订单弹窗 -->
    <el-dialog :visible.sync="submitOrderVisible" size="tiny" :close-on-click-modal="false"
        :close-on-press-escape="false" 
        :show-close="false">
      <h2 style='text-align:center'>确认提交订单吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 输入保额弹窗 -->
    <el-dialog :visible.sync="coverageVisible" size="tiny" :close-on-click-modal="false"
        :close-on-press-escape="false" 
        :show-close="false">
      <el-form :model='form' ref="form" :rules="ruleDialog" >
        <!-- <span style='float:left;padding:2% 0% 0% 5%'>保额：</span> -->
        <el-form-item label="保额：" label-width="100px" prop="coverage">
          <el-input style='width:60%'  v-model='form.coverage' type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDialog(0, 'form', 'coverage')">取 消</el-button>
        <el-button type="primary" @click="submitDialog(1, 'form', 'coverage')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 输入代收货款金额弹窗 -->
    <el-dialog :visible.sync="goodsPaymentVisible" size="tiny"
        :close-on-click-modal="false"
        :close-on-press-escape="false" 
        :show-close="false">
      <el-form :rules="ruleDialog" :model='form' ref="form">
        <el-form-item label="代收货款金额：" label-width="120px" prop="goodsPayment">
          <el-input style='width:60%'  v-model='form.goodsPayment' type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDialog(0,'form', 'goodsPayment')">取 消</el-button>
        <el-button type="primary" @click="submitDialog(1, 'form', 'goodsPayment')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 请求数据提示弹窗 -->
    <el-dialog title="" :visible.sync="pointVisible" size="" tiny>
      <h2 style="text-align:center;padding: 30px 0 30px 0px">{{Note}}</h2>
    </el-dialog>

  </div>
</template>

<script>
import regionJson from '../../../static/region.json'
import api from '../../api/customerService/api.js'
export default {
  created () {
    this.regionList = regionJson
    this.regionList2 = regionJson
  },
  data: function () {
    return {
      allHave: false, // 表单内容是否全部填上
      feeHave: false, // 可生成基本费用的内容已全部填上
      wrongNote: '',
      receList: [1, 2, 3],
      pointVisible: false, // 向后台提交数据提示弹窗
      Note: '', // 向后台提交数据提示
      submitOrderVisible: false, // 确认提交订单弹窗
      wrongNoteVisable: false, // 错误提示弹窗
      coverageVisible: false, // 保额输入弹窗
      goodsPaymentVisible: false, // 代收货款金额输入弹窗
      insurance: 0,
      isbaseAddressFa: false, // 样式class是否选择
      isbaseAddressShou: false,
      isshipNam: false,
      isshipTel: false,
      ispickUpAdr: false,
      isreceNam: false,
      isreceTel: false,
      isreceAdr: false,
      isgoodsNam: false,
      isgoodsNums: false,
      isgoodsWeight: false,
      isgoodsVolumn: false,
      isreceNums: false,
      isreceMoney: false,
      isbaseFee: false,
      ispickUpFee: false,
      issendFee: false,
      ispackFee: false,
      islandingFee: false,
      isinsurance: false,
      iscoverage: false,
      isgoodsPayment: false,
      isrefuMoney: false,
      isretuPayMode: false,
      isunActIncome: false,
      isunActExpense: false,
      isfeeMoney1: false,
      isfeeMoney2: false,
      isfeeMoney3: false,
      isfeeMoney4: false,
      istotalFreight: false,
      baseAddressFaOk: false, // 是否验证无误
      baseAddressShouOk: false,
      shipNamOk: false,
      shipTelOk: false,
      pickUpAdrOk: false,
      receNamOk: false,
      receTelOk: false,
      receAdrOk: false,
      goodsNamOk: false,
      goodsNumsOk: false,
      goodsWeightOk: false,
      goodsVolumnOk: false,
      receNumsOk: false,
      receMoneyOk: false,
      baseFeeOk: false,
      pickUpFeeOk: false,
      sendFeeOk: false,
      packFeeOk: false,
      landingFeeOk: false,
      coverageOk: false,
      goodsPaymentOk: false,
      refuMoneyOk: false,
      retuPayModeOk: false,
      unActIncomeOk: false,
      unActExpenseOk: false,
      feeMoney1Ok: false,
      feeMoney2Ok: false,
      feeMoney3Ok: false,
      feeMoney4Ok: false,
      branchOk: false,
      StationSelected: false,
      goodsPayment2: 0, // 代收费
      branchList: [], // 选择自提后的网点列表
      retuPayModeObject: {}, // 支付方式下拉框样式
      fahuoRelated: {
        shenfenSelected: '北京',
        shiSelected: '北京',
        quSelected: '海淀区',
        baseAddressFa: '',
        shipNam: '张三发',
        shipTel: '15003582722',
        pickUpAdr: '提货地址',
        goodsNam: '1212',
        goodsWeight: 1,
        goodsVolumn: 2,
        receNums: 3
      },
      shouhuoRelated: {
        shenfenSelected2: '江苏',
        shiSelected2: '无锡',
        quSelected2: '惠山区',
        baseAddressShou: '',
        receNam: '李四收',
        receTel: '18810690061',
        receAdr: '收货方地址'
      },
      fahuoList: [],
      shouhuoList: [],
      fahuoShow: false,
      shouhuoShow: false,
      baseFeeinit: 1000,
      baseFeeVisible: false,
      /** 地址内容 */
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
      // 进入页面时从后台获取数据
      initForm: {
        retuPayModeList: ['无'], // 返款类型数组
        stationOptions: ['北京', '无锡', '苏州', '常州', '镇江'],
        orderId: '170815004'
      },
      form: {
        /** 订单基本信息 */
        id: '170815004', // 订单ID
        orderTim: new Date(), // 下单时间
        startStation: '', // 始发站
        arrStation: '', // 目的站
        serviceNam: '弓莉', // 客服名称
        /** 发货方信息 */
        shipNam: '',
        shipTel: '',
        pickUpAdr: '', // 详细提货地址
        shenfenSelected: '', // 提货地址-省
        shiSelected: '', // 提货地址-市
        quSelected: '', // 提货地址-区
        /** 收货方信息 */
        receNam: '',
        receTel: '',
        receAdr: '', // 详细收货地址
        shenfenSelected2: '', // 收货地址-省
        shiSelected2: '', // 收货地址-市
        quSelected2: '', // 收货地址-区
        /** 货物信息 */
        goodsNam: '', // 货物名称
        package: '纸箱', // 包装
        goodsNums: 1,
        goodsWeight: '',
        goodsVolumn: '',
        orderType: '普件', // 送货方式
        sendMode: '送货上门', // 交货方式
        branch: '无', // 提货网点
        isListenToRele: '否', // 是否听通知放货
        /** 回单信息 */
        receNums: 0, // 回单份数
        receMoney: 0, // 回单押款
        /** 费用信息 */
        baseFee: 0, // 基础运费
        pickUpFee: 0, // 提货费
        sendFee: 0, // 送货费
        packFee: 0, // 包装费
        landingFee: 0, // 卸货费
        coverage: 0.00, // 保额
        goodsPayment: 3, // 代收货款
        refuMoney: 0, // 返款金额
        retuPayMode: '无', // 返款支付方式
        /** 异动信息 */
        unActIncome: 0, // 异动收入
        unActExpense: 0, // 异动支出
        /** 总运费及支付信息 */
        totalFreight: 0, // 总运费
        feeMoney: [0, 0, 0, 0], // 现付，到付，欠付，月结
        /** 备注信息 */
        note1: '', // 附属约定
        note2: '', // 情况说明
        /** 后台无需处理 */
        baseAddressFa: '',
        baseAddressShou: ''
      },
      forminit: {},
      ruleDialog: {
        coverage: [
          {required: true, message: '请填写保额费'},
          {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确保额费用')) }}
        ],
        goodsPayment: [
          {required: true, message: '请填写代收货款金额'},
          {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确货款费用')) }}
        ]
      }
    }
  },
  computed: {
    // 总运费
    gettotalFreight: function () {
      this.form.totalFreight = Number(this.form.baseFee) + Number(this.form.pickUpFee) + Number(this.form.sendFee) +
      Number(this.form.packFee) + Number(this.form.landingFee) + (Number(this.form.coverage)) * 0.005 +
      Number(this.form.refuMoney) - Number(this.form.unActIncome) + Number(this.form.unActExpense)
      return (this.form.totalFreight).toFixed(2)
    },
    // 三级选择发货区域
    getbaseAddressFa: function () {
      this.form.baseAddressFa = this.form.shenfenSelected + this.form.shiSelected + this.form.quSelected
      return this.form.baseAddressFa
    },
    // 三级选择收货区域
    getbaseAddressShou: function () {
      this.form.baseAddressShou = this.form.shenfenSelected2 + this.form.shiSelected2 + this.form.quSelected2
      return this.form.baseAddressShou
    }
    /* timeNow: function () {
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
    } */
  },
  methods: {
    test () {
      alert('sds')
    },
    // 交货方式改变时设置相关列表
    setsendMode () {
      if (this.form.sendMode === 'ziti') {
        this.branchList = ['网点1', '网点2', '网点2']
        this.branchList.push('枢纽')
        this.form.branch = this.branchList[0]
      } else {
        this.branchList = []
        this.form.branch = '无'
      }
    },
    // 设置弹窗隐藏
    setBlur (num) {
      /*
      document.getElementById('focus2').blur()
      document.getElementById('inputfocus2').focus() */
      /* document.getElementById('focus_shouhuo').focus()
      document.getElementById('focus_shouhuo').blur() */
      if (num === 1) {
        this.fahuoShow = false
      } else {
        this.shouhuoShow = false
      }
    },
    // 取消,确认代收货款弹窗
    submitDialog (type, formName, data) {
      const self = this
      let visible = data + 'Visible'
      let Ok = data + 'Ok'
      this[Ok] = false
      if (type === 1) {
        if (data === 'coverage') {
          this.insurance = (this.form[data] * 0.005).toFixed(2)
          // this.insurance = Number(this.form.insurance)
          this.form.coverage = Number(this.form.coverage)
        }
        if (data === 'goodsPayment') {
          this.goodsPayment2 = (this.form[data] * 0.005).toFixed(2)
          this.form.goodsPayment = Number(this.form.goodsPayment)
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this[visible] = false
            this[Ok] = true
          } else {
            this[Ok] = false
            return false
          }
        })
      } else {
        if (data === 'coverage') {
          this.insurance = 0.00
        }
        if (data === 'goodsPayment') {
          this.goodsPayment2 = 0.00
        }
        this[visible] = false
      }
    },
    // 根据返款有无设置返款类型下拉框
    setRetuPayMode () {
      if (parseInt(this.form.refuMoney) === 0) {
        this.initForm.retuPayModeList = ['无']
        this.form.retuPayMode = '无'
      } else {
        this.initForm.retuPayModeList = ['现返', '欠返']
        this.form.retuPayMode = ''
      }
    },
    // 根据回单设置回单押款
    setReceMoney () {
      if (parseInt(this.form.receNums) === 0) {
        this.form.receMoney = 0
      } else {
        this.form.receMoney = 50
      }
    },
    // 根据表单上方始发站选择提货地址
    handleChange1 () {
      /* startStation: '', // 始发站
        arrStation: */
      this.form.shiSelected = this.form.startStation
      // 处理获得市对应县
      let regionList = regionJson
      let beijingList = regionList[0].sub
      let jiangsuList = regionList[6].sub
      beijingList.filter(item => {
        if (item.name === this.form.shiSelected) {
          this.form.shenfenSelected = '北京'
        }
      })
      jiangsuList.filter(item => {
        if (item.name === this.form.shiSelected) {
          this.form.shenfenSelected = '江苏'
        }
      })
      this.form.quSelected = ''
      this.form.baseAddressFa = this.form.shenfenSelected + this.form.shiSelected + this.form.quSelected
      this.setShi(1)
      this.setQuyu(1)
    },
    // 根据表单上方目的站选择设置收货地址
    handleChange2 (value) {
      this.form.shiSelected2 = this.form.arrStation
      // 处理获得市对应县
      let regionList = regionJson
      let beijingList = regionList[0].sub
      let jiangsuList = regionList[6].sub
      beijingList.filter(item => {
        if (item.name === this.form.shiSelected2) {
          this.form.shenfenSelected2 = '北京'
        }
      })
      jiangsuList.filter(item => {
        if (item.name === this.form.shiSelected2) {
          this.form.shenfenSelected2 = '江苏'
        }
      })
      this.form.quSelected2 = ''
      this.form.baseAddressShou = this.form.shenfenSelected2 + this.form.shiSelected2 + this.form.quSelected2
      this.setShi(2)
      this.setQuyu(2)
    },
    // 选择始发站，目的站后补全下方表单地址信息
    toShi (type, shiData, shenData) {
      alert('test')
      let shen = 'form.shenSelected' + type
      let shi = 'form.shiSelected' + type
      this[shen] = shenData
      this[shi] = shiData
    },
    // 验证规则
    check (num, data) {
      if (num === 2) {
        this.shouhuoShow = false
      } else if (num === 3) {
        let a = 'isshipTel'
        if (this.form.shipTel === '') {
          this[a] = true
          setTimeout(() => { this.isshipTel = false }, 800)
        } else if (!(/^1[3|4|5|8]\d{9}$/.test(this.form.shipTel))) {
          this[a] = true
          this.shipTelOk = false
          setTimeout(() => { this.isshipTel = false }, 800)
          this.wrongNote = '请输入正确电话号码'
          this.wrongNoteVisable = true
          setTimeout(() => { this.wrongNoteVisable = false }, 800)
        } else {
          this[a] = false
          this.shipTelOk = true
        }
      } else if (num === 4) {
        if (this.form.receTel === '') {
          this.isreceTel = true
          setTimeout(() => { this.isreceTel = false }, 800)
        } else if (!(/^1[3|4|5|8]\d{9}$/.test(this.form.receTel))) {
          this.isreceTel = true
          this.receTelOk = false
          setTimeout(() => { this.isreceTel = false }, 800)
          this.wrongNote = '请输入正确电话号码'
          this.wrongNoteVisable = true
          setTimeout(() => { this.wrongNoteVisable = false }, 800)
        } else {
          this.isreceTel = false
          this.receTelOk = true
        }
      } else if (num === 5) {
        this.addressVisible = false
        this.baseAddressFaOk = false
        if (this.form.shiSelected === '' && this.form.shenfenSelected === '' && this.form.quSelected === '') {
          this.isbaseAddressFa = true
          this.baseAddressFaOk = false
          setTimeout(() => { this.isbaseAddressFa = false }, 800)
        } else if (this.form.shiSelected === '' || this.form.shenfenSelected === '' || this.form.quSelected === '') {
          this.isbaseAddressFa = true
          this.baseAddressFaOk = false
          setTimeout(() => { this.isbaseAddressFa = false }, 800)
          setTimeout(() => { this.isbaseAddressFa = false }, 800)
          this.wrongNote = '请选择提货地址完整区域'
          this.wrongNoteVisable = true
          setTimeout(() => { this.wrongNoteVisable = false }, 800)
        } else {
          this.isbaseAddressFa = false
          this.baseAddressFaOk = true
        }
      } else if (num === 6) {
        let data0 = 'feeMoney' + (data + 1)
        let data1 = 'is' + data0
        let data2 = data0 + 'Ok'
        if (!(this.form.feeMoney[data]) && (this.form.feeMoney[data] !== 0)) {
          this[data1] = true
          setTimeout(() => { this[data1] = false }, 800)
        } else if (!(/^\d*?\.?\d*?$/.test(this.form.feeMoney[data]))) {
          this[data1] = true
          this[data2] = false
          setTimeout(() => { this[data1] = false }, 800)
          this.wrongNote = '请输入正确数字'
          this.wrongNoteVisable = true
          setTimeout(() => { this.wrongNoteVisable = false }, 800)
        } else {
          this[data1] = false
          this[data2] = true
        }
        for (let i = 0; i < 4; i++) {
          this.form.feeMoney[data] = Number(this.form.feeMoney[data])
        }
      } else if (num === 7) {
        this.addressVisible2 = false
        this.baseAddressShouOk = false
        if (this.form.shiSelected2 === '' && this.form.shenfenSelected2 === '' && this.form.quSelected2 === '') {
          this.isbaseAddressShou = true
          this.baseAddressShouOk = false
          setTimeout(() => { this.isbaseAddressShou = false }, 800)
        } else if (this.form.shiSelected2 === '' || this.form.shenfenSelected2 === '' || this.form.quSelected2 === '') {
          setTimeout(() => { this.isbaseAddressShou = false }, 800)
          this.wrongNote = '请选择收货货完整区域'
          this.wrongNoteVisable = true
          setTimeout(() => { this.wrongNoteVisable = false }, 800)
          this.isbaseAddressShou = true
          this.baseAddressShouOk = false
        } else {
          this.isbaseAddressShou = false
          this.baseAddressShouOk = true
        }
      } else if (num === 8) {
        let data = 'goodsNums'
        let data1 = 'is' + 'goodsNums'
        let data2 = 'goodsNums' + 'Ok'
        if (!this.form[data] && (Number(this.form[data]) !== 0)) {
          this[data1] = true
          setTimeout(() => { this[data1] = false }, 800)
        } else if (!(/^[0-9]*[1-9][0-9]*$/.test(this.form[data]))) {
          this[data1] = true
          this[data2] = false
          setTimeout(() => { this[data1] = false }, 800)
          this.wrongNote = '请输入正确件数'
          this.wrongNoteVisable = true
          setTimeout(() => { this.wrongNoteVisable = false }, 800)
        } else {
          this[data1] = false
          this[data2] = true
        }
        this.form.goodsNums = Number(this.form.goodsNums)
      } else if (num === 9 || num === 10) {
        let data1 = 'is' + data
        let data2 = data + 'Ok'
        if (!this.form[data]) {
          this[data1] = false
          this[data2] = true
          if (this.form[data] !== 0) {
            this[data1] = true
            this[data2] = false
            setTimeout(() => { this[data1] = false }, 800)
          }
        } else {
          if (num === 9) {
            if (!(/^\d*?\.?\d*?$/.test(Number(this.form[data])))) {
              this[data1] = true
              this[data2] = false
              setTimeout(() => { this[data1] = false }, 800)
              this.wrongNote = '请输入正确数字'
              this.wrongNoteVisable = true
              setTimeout(() => { this.wrongNoteVisable = false }, 800)
            } else {
              this[data1] = false
              this[data2] = true
            }
            this.form[data] = Number(this.form[data])
          } else {
            this[data1] = false
            this[data2] = true
          }
        }
      } else if (num === 11) {
        let style = data + 'Object'
        let data2 = data + 'Ok'
        if (this.form[data] === '') {
          this[data2] = false
          this[style] = {
            border: '2px solid red'
          }
          setTimeout(() => { this[style] = {} }, 800)
        } else {
          this[style] = {}
          this[data2] = true
        }
      }
    },
    // 向服务器提交订单数据
    submitOrder () {
      this.submitOrderVisible = false
      this.form.orderTim = new Date()
      console.log(this.form)
      this.setOrderFro()
    },
    // 从服务器获取基本运费
    getBaseFee () {
      this.form.baseFee = 1000
    },
    // 判断站点与表单区域是否一致
    isAttSta () {
      if ((this.form.startStation !== this.form.shiSelected) || (this.form.arrStation !== this.form.shiSelected2)) {
        this.wrongNote = '地址与所选站点不匹配'
        this.wrongNoteVisable = true
        setTimeout(() => { this.wrongNoteVisable = false }, 800)
        return false
      } else {
        return true
      }
    },

    // 判断支付费用总和与总运费是否相等
    isPayTotal () {
      let custotalFreight = (Number(this.form.feeMoney[0]) + Number(this.form.feeMoney[1]) +
      Number(this.form.feeMoney[2]) + Number(this.form.feeMoney[3])).toFixed(2)
      if (custotalFreight !== (this.form.totalFreight).toFixed(2)) {
        this.wrongNote = '费用不一致'
        this.wrongNoteVisable = true
        setTimeout(() => { this.wrongNoteVisable = false }, 800)
        return false
      } else {
        return true
      }
    },
    // 提交验证：订单2，生成运费1
    submitValidate (type) {
      let list1 = ['goodsWeight', 'goodsVolumn', 'receNums', 'receMoney', 'baseFee', 'pickUpFee', 'sendFee', 'packFee', 'landingFee', 'coverage', 'goodsPayment', 'refuMoney', 'unActIncome', 'unActExpense']
      // 'feeMoney1', 'feeMoney2', 'feeMoney3', 'feeMoney4'
      let list2 = ['goodsWeight', 'goodsVolumn']
      let list3 = ['shipNam', 'shipTel', 'pickUpAdr', 'goodsNam',
        'receNam', 'receTel', 'receAdr', 'goodsNam'] // 货物名称等验证
      let list4 = ['retuPayMode'] // 下拉验证：支返款付方式
      // let list5 = ['feeMoney1', 'feeMoney2', 'feeMoney3', 'feeMoney4'] // 支付费用：现，到，欠，月
      for (let i = 1; i < 9; i++) {
        this.check(i)
      }
      if (type === 1) {
        for (let i = 0; i < list2.length; i++) {
          this.check(9, list2[i])
        }
      } else {
        for (let i = 0; i < list1.length; i++) {
          this.check(9, list1[i])
        }
        for (let i = 0; i < list4.length; i++) {
          this.check(11, list4[i])
        }
        // 支付费用
        this.check(6, 0)
        this.check(6, 1)
        this.check(6, 2)
        this.check(6, 3)
      }
      for (let i = 0; i < list3.length; i++) {
        this.check(10, list3[i])
      }
      if (this.shipNamOk && this.shipTelOk && this.baseAddressFaOk && this.pickUpAdrOk && this.receNamOk &&
      this.receTelOk && this.baseAddressShouOk && this.receAdrOk && this.goodsNamOk &&
      this.goodsNumsOk && this.goodsWeightOk && this.goodsVolumnOk) {
        // this.isAttSta()
        if (type === 1) {
          if (this.isAttSta()) {
            this.getBaseFee()
          }
        }
        if (type === 2) {
          if (this.receNumsOk && this.receMoneyOk && this.baseFeeOk && this.pickUpFeeOk && this.sendFeeOk && this.packFeeOk &&
          this.landingFeeOk && this.coverageOk && this.goodsPaymentOk && this.refuMoneyOk &&
          this.retuPayModeOk && this.unActIncomeOk && this.unActExpenseOk && this.feeMoney1Ok && this.feeMoney2Ok &&
          this.feeMoney3Ok && this.feeMoney4Ok) {
            console.log('数据已经全部填上')
            this.isAttSta()
            // this.isPayTotal()
            if (this.isPayTotal()) {
              console.log('sds')
              this.submitOrderVisible = true
              console.log('可以提交订单')
              // this.submitOrder()
            }
          }
        }
      }
    },
    // 根据关键词获取发货方/收货方列表
    getSearchFahuoFro () {
      if (this.form.shipNam !== '') {
        this.fahuoShow = true
        console.log(this.form.shipNam)
        api.getSearchFahuo({'keywords': this.form.shipNam}).then(res => {
          console.log('成功')
          console.log(res.data.content)
          this.fahuoList = res.data.content
        })
        .catch(error => {
          this.errorVisable = true
          setTimeout(() => { this.errorVisable = false }, 800)
          this.errorNote = '网络异常，请求超时'
          console.log('失败')
          console.log(error)
        })
      } else if (this.form.shipNam === '') {
        this.fahuoShow = false
      }
    },

    // 获取对应收货方列表
    getSearchShouhuo () {
      if (this.form.receNam !== '') {
        this.shouhuoShow = true
        this.shouhuoList = ['收货方1', '收货方2', '收货方3', '收货方4']
      } else {
        this.shouhuoShow = false
      }
    },
    // 双击发货方列表补充数据
    clickFahuo (data) {
      let list = ['shipTel', 'pickUpAdr', 'shenfenSelected', 'shiSelected', 'quSelected', 'baseAddressFa',
        'goodsNam', 'goodsNums', 'goodsWeight', 'goodsVolumn', 'receNums']
      this.form.shipNam = data
      this.fahuoShow = false
      for (let i = 0; i < list.length; i++) {
        this.form[list[i]] = this.fahuoRelated[list[i]]
      }
      this.setShi(1)
      this.setQuyu(1)
    },
    // 双击收货方补充相关数据
    clickShouhuo (data) {
      let list = ['receNam', 'receTel', 'receAdr', 'shenfenSelected2', 'shiSelected2', 'quSelected2', 'baseAddressShou']
      this.shouhuoShow = false
      this.form.receNam = data
      for (let i = 0; i < list.length; i++) {
        this.form[list[i]] = this.shouhuoRelated[list[i]]
      }
      this.setShi(2)
      this.setQuyu(2)
    },
    getFocus (num) {
      if (num === 1) {
        this.addressVisible = true
        document.getElementById('focus_fahuoAd').focus()
      } else if (num === 2) {
        this.addressVisible2 = true
        document.getElementById('focus_shouhuoAd').focus()
      } else if (num === 3) {
        // document.getElementById('focus_shouhuo').focus()
        // this.fahuoShow = true
      }
    },
    cancleOrder () {
      this.cancleVisable = false
    },
    selectShenfen (num, name) {
      if (num === 1) {
        this.form.shenfenSelected = name
        this.form.shiSelected = ''
        this.form.quSelected = ''
        this.quList = []
        this.shiList = []
      } else {
        this.form.shenfenSelected2 = name
        this.form.shiSelected2 = ''
        this.form.quSelected2 = ''
        this.quList2 = []
        this.shiList2 = []
      }
      this.form.baseAddressShou = this.form.shenfenSelected2 + this.form.shiSelected2 + this.form.quSelected2
      this.form.baseAddressFa = this.form.shenfenSelected + this.form.shiSelected + this.form.quSelected
    },
    selectShi (num, name) {
      if (num === 1) {
        this.form.shiSelected = name
        this.form.quSelected = ''
        this.form.quList = []
      } else {
        this.form.shiSelected2 = name
        this.form.quSelected2 = ''
        this.form.quList2 = []
      }
      this.form.baseAddressShou = this.form.shenfenSelected2 + this.form.shiSelected2 + this.form.quSelected2
      this.form.baseAddressFa = this.form.shenfenSelected + this.form.shiSelected + this.form.quSelected
    },
    selectQu (num, name) {
      if (num === 1) {
        this.form.quSelected = name
        this.addressVisible = false
        this.isReadOnly = true
      } else {
        this.form.quSelected2 = name
        this.addressVisible2 = false
        this.isReadOnly2 = true
      }
      this.form.baseAddressShou = this.form.shenfenSelected2 + this.form.shiSelected2 + this.form.quSelected2
      this.form.baseAddressFa = this.form.shenfenSelected + this.form.shiSelected + this.form.quSelected
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
        if (this.form.shenfenSelected) {
          regionJson.filter(item => {
            if (item.name === this.form.shenfenSelected) {
              this.shiList = item
              return true
            }
          })
        }
      } else {
        this.shenfen2 = false
        this.shi2 = true
        this.quyu2 = false
        if (this.form.shenfenSelected2) {
          regionJson.filter(item => {
            if (item.name === this.form.shenfenSelected2) {
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
        if (this.form.shiSelected && this.form.shenfenSelected) {
          this.shiList.sub.filter(item => {
            if (item.name === this.form.shiSelected) {
              this.quList = item.sub
              return true
            }
          })
        }
      } else {
        this.shenfen2 = false
        this.shi2 = false
        this.quyu2 = true
        if (this.form.shiSelected2 && this.form.shenfenSelected2) {
          this.shiList2.sub.filter(item => {
            if (item.name === this.form.shiSelected2) {
              this.quList2 = item.sub
              return true
            }
          })
        }
      }
    },
    /** 提交后台相关函数 */
    // 查看订单列表
    setOrderFro () {
      // 入参：筛选条件，第几个页面（默认为0）
      // 回参：对应页面表格数据，对应筛选条件下的页数
      api.setOrder(this.form).then(res => {
        console.log('成功')
        console.log(res)
      })
      .catch(error => {
        this.pointVisible = true
        setTimeout(() => { this.pointVisible = false }, 800)
        this.Note = '提交失败，网络异常请检查'
        console.log('失败')
        console.log(error)
      })
    }
  },
  mounted () {
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

.dropdown-fahuo li {
  text-align:center;
  font-size:100%;
  padding:1% 0 1% 0
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

.col-8 {
  width: 80%
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
.error {
  border: 2px solid red;
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
  font-size: inherit
}

.label-title {
  background-color: #E0E0E0
}
</style>