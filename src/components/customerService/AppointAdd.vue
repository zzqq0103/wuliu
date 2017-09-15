<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <h2 style="text-align:center;margin-top:0">新建预约单</h2>
    <div class='div-form'>
      <el-form :model="appointForm" :rules="appointRules" ref="appointForm" >       
        <!-- <span style='float:left;padding:0.6% 1% 0% 0%;width:10%;text-align:left'>发货方：</span> -->
        <el-form-item label="发货方：" style="float:left;width:50%;" label-width="100px" prop="shipComp">
          <input type="text" list="shipComp" v-model="appointForm.shipComp" class='input-tishi' style="float:left"/>
          <datalist id="shipComp">
            <option v-for="item in shipTipList" :value="item" :key="item"/>
          </datalist>
        </el-form-item>
        <el-form-item label="联系人：" style="float:left;width:50%" label-width="100px" prop="shipNam">
          <el-input v-model="appointForm.shipNam" style="width:60%" placeholder="输入发货方联系人"></el-input>
        </el-form-item>
        <el-form-item label="手机：" style="clear:both;width:50%" label-width="100px" prop="shipTel">
          <el-input v-model="appointForm.shipTel" style="width:60%" placeholder="输入发货方手机"></el-input>
        </el-form-item>
        <el-form-item label="提货地址：" style="float:left;width:50%" label-width="100px" prop="pickUpAdr">
          <div id='focus1' class="dropdown2" style='outline:none' contenteditable="true" tabindex="0" @click="getFocus(1)" @blur="addressVisible=false">
            <el-input v-model="appointForm.pickUpAdr" placeholder="请选择提货地址"  readonly="readonly"style="width:73%" ></el-input>
            <div class="dropdown-content" style='width:80%' v-show="addressVisible"> 
              <ul class='dropdown-content-select'>
                <li @click="setShenfen(1)" class='dropdown-li' v-bind:class="{'selectOn':shenfen}">省份</li>
                <li @click="setShi(1)" class='dropdown-li' v-bind:class="{'selectOn':shi}">城市</li>
                <li @click="setQuyu(1)" class='dropdown-li' v-bind:class="{'selectOn':quyu}">区县</li>
              </ul>
              <div class='dropdown-select'>
                <ul class='dropdown-shenfen' v-show="shenfen">
                  <li v-for="(data,i) in this.regionList" @click="selectShenfen(1,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
                <ul class='dropdown-shi' v-show="shi">
                  <li v-for="(data,i) in this.shiList.sub" @click="selectShi(1,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
                <ul v-show="quyu">
                  <li v-for="(data,i) in this.quList" @click="selectQu(1,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item style="float:left;width:50%"  prop="pickUpAdrDe">
          <el-input style='width:78%' v-model="appointForm.pickUpAdrDe" placeholder="输入详细提货地址" ></el-input>
        </el-form-item>
        <el-form-item label="货物名称：" style="float:left;width:50%" label-width="100px" prop="goodsNam">
          <el-input v-model="appointForm.goodsNam" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="件数：" style="float:left;width:50%" label-width="100px" prop="goodsNums">
          <el-input v-model="appointForm.goodsNums" style="width:60%" type="number"></el-input>
        </el-form-item>
        <el-form-item label="重量：" style="float:left;width:50%" label-width="100px" prop="goodsWeight">
          <el-input v-model="appointForm.goodsWeight" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="体积：" style="float:left;width:50%" label-width="100px" prop="goodsVolumn">
          <el-input v-model="appointForm.goodsVolumn" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="包装：" style="float:left;width:50%" label-width="100px" prop="package">
          <el-input v-model="appointForm.package" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="货物备注：" style="clear:both;width:100%" label-width="100px">
          <el-input v-model="appointForm.note" style="width:78%"></el-input>
        </el-form-item>
        <el-form-item label="收货方：" style="float:left;width:50%;" label-width="100px" prop="receComp">
          <input type="text" list="receComp" v-model="appointForm.receComp" class='input-tishi' style="float:left;width:50%"/>
          <datalist id="receComp">
            <option v-for="item in receTipList" :value="item" :key="item"/>
          </datalist>
        </el-form-item>
        <el-form-item label="联系人：" style="float:left;width:50%" label-width="100px" prop="receNam">
          <el-input v-model="appointForm.receNam" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机：" style="clear:both;width:50%" label-width="100px" prop="receTel">
          <el-input v-model="appointForm.receTel" style="width:60%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="收货地址：" style="clear:both;width:100%" label-width="90px" prop="receAdr"> -->
        <el-form-item label="收货地址：" style="float:left;width:50%" label-width='100px' prop="receAdr">
          <div id='focus2' class='dropdown2' style='outline:none' contenteditable="true" tabindex="0"  @click="getFocus(2)" @blur="addressVisible2=false">
            <el-input v-model="appointForm.receAdr" placeholder="请选择收货地址" readonly="readonly" style="width:73%"></el-input>
            <div class="dropdown-content" style='width:80%' v-show="addressVisible2">
              <ul class='dropdown-content-select'>
                <li @click="setShenfen(2)" class='dropdown-li' v-bind:class="{'selectOn':shenfen2}">省份</li>
                <li @click="setShi(2)" class='dropdown-li' v-bind:class="{'selectOn':shi2}">城市</li>
                <li @click="setQuyu(2)" class='dropdown-li' v-bind:class="{'selectOn':quyu2}">区县</li>
              </ul>
              <div class='dropdown-select'>
                <ul class='dropdown-shenfen' v-show="shenfen2">
                  <li v-for="(data,i) in this.regionList" @click="selectShenfen(2,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
                <ul class='dropdown-shi' v-show="shi2">
                  <li v-for="(data,i) in this.shiList2.sub" @click="selectShi(2,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
                <ul v-show="quyu2">
                  <li v-for="(data,i) in this.quList2" @click="selectQu(2,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="详细地址：" style="clear:both;width:100%" label-width="90px" prop="receAdrDe">
          <el-input style='width:78%' v-model="appointForm.receAdrDe" placeholder="输入详细收货地址" ></el-input>
        </el-form-item> -->
        <el-form-item style="float:left;width:50%"  prop="receAdrDe">
          <el-input style='width:78%' v-model="appointForm.receAdrDe" placeholder="输入详细收货地址" ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style='text-align:center'>
      <el-button style='margin-top:2%' @click="submitAppoint('appointForm')">保存</el-button>
      <el-button style='margin-left:10%' @click="cancleVisable=true">取消</el-button>
    </div>
    <!--提交弹窗-->
    <el-dialog title="" :visible.sync="submitVisable" size="" tiny>
      <h2 style="padding:30px">新建预约单成功！</h2>
    </el-dialog>
    <!--取消弹窗-->
    <el-dialog title="" :visible.sync="cancleVisable" size="" tiny>
      <h2 style="padding:30px">确定取消吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle_cancle">取 消</el-button>
        <el-button @click="cancle_ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import regionJson from '../../../static/region.json'
  export default {
    created () {
      this.regionList = regionJson
    },
    data () {
      return {
        labelWidth: '90px',
        formLabelWidth: '15%',
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
        shenfen: false,
        shi: false,
        quyu: false,
        shenfen2: false,
        shi2: false,
        quyu2: false,
        isFocus: false,
        isFocus2: false,
        detailVisible: false,
        detailVisible2: false,
        isReadOnly: false,
        isReadOnly2: false,
        shipTipList: ['单位1', '单位2', '单位33333'],
        receTipList: ['单位111111111', '单位2', '单位3'],
        appointForm: {
          /** 发货人信息 */
          shipComp: '',
          shipNam: '3',
          shipTel: '',
          pickUpAdr: '123',
          pickUpAdrDe: '',
          /** 货物信息 */
          goodsNam: '',
          goodsNums: '',
          goodsWeight: '',
          goodsVolumn: '',
          package: '',
          note: '',
          /** 收货人信息 */
          receComp: '',
          receNam: '',
          receTel: '',
          receAdr: '',
          receAdrDe: ''
        },
        appointRules: {
          goodsNam: [
            {required: true, message: '请填写货物名称', trigger: 'blur'}
          ],
          goodsNums: [
            {required: true, message: '请填写货物数量', trigger: 'blur'},
            {validator (r, v, b) { (/^[0-9]*[1-9][0-9]*$/).test(v) ? b() : b(new Error('请填写正整数')) }}
          ],
          goodsWeight: [
            {required: true, message: '请填写货物重量', trigger: 'blur'},
            {validator (r, v, b) { (/^\\d+(\\.\\d+)?$/).test(v) ? b() : b(new Error('请填写正确数字')) }}
          ],
          goodsVolumn: [
            {required: true, message: '请填写货物体积', trigger: 'blur'},
            {validator (r, v, b) { (/^\\d+(\\.\\d+)?$/).test(v) ? b() : b(new Error('请填写正确数字')) }}
          ],
          package: [
            {required: true, message: '请选择货物包装'}
          ],
          shipComp: [
            {required: true, message: '请输入发货方', trigger: 'blur'}
          ],
          shipNam: [
            {required: true, message: '请输入发货人', trigger: 'blur'}
          ],
          shipTel: [
            {required: true, message: '请输入发货方电话', trigger: 'blur'},
            {validator (r, v, b) { (/^1[3|4|5|8]\d{9}$/).test(v) ? b() : b(new Error('请填写正确的电话号码')) }}
          ],
          receComp: [
            {required: true, message: '请输入收货方', trigger: 'blur'}
          ],
          receNam: [
            {required: true, message: '请输入收货人', trigger: 'blur'}
          ],
          receTel: [
            {required: true, message: '请输入收货方电话', trigger: 'blur'},
            {validator (r, v, b) { (/^1[3|4|5|8]\d{9}$/).test(v) ? b() : b(new Error('请填写正确的电话号码')) }}
          ],
          receAdr: [
            {required: true, message: '请选择收货地址'}
          ],
          receAdrDe: [
            {required: true, message: '请输入收货详细地址', trigger: 'blur'}
          ],
          pickUpAdr: [
            {required: true, message: '请选择提货地址'}
          ],
          pickUpAdrDe: [
            {required: true, message: '请输入提货详细地址', trigger: 'blur'}
          ]
        },
        /** 其它 */
        cancleVisable: false,
        submitVisable: false
      }
    },
    methods: {
      getFocus (num) {
        if (num === 1) {
          this.addressVisible = true
          document.getElementById('focus1').focus()
        } else {
          this.addressVisible2 = true
          document.getElementById('focus2').focus()
        }
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
        this.appointForm.receAdr = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
        this.appointForm.pickUpAdr = this.shenfenSelected + this.shiSelected + this.quSelected
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
        this.appointForm.receAdr = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
        this.appointForm.pickUpAdr = this.shenfenSelected + this.shiSelected + this.quSelected
      },
      selectQu (num, name) {
        if (num === 1) {
          this.quSelected = name
          this.addressVisible = false
          this.isFocus = true
          this.detailVisible = true
          this.isReadOnly = true
        } else {
          this.quSelected2 = name
          this.addressVisible2 = false
          this.isFocus2 = true
          this.detailVisible2 = true
          this.isReadOnly2 = true
        }
        this.appointForm.receAdr = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
        this.appointForm.pickUpAdr = this.shenfenSelected + this.shiSelected + this.quSelected
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
      },
      getShipComp () {
        console.log('testtesttesttesttest')
      },
      cancle_cancle () {
        this.cancleVisable = false
      },
      cancle_ok () {
        this.cancleVisable = false
      },

    // 提交新建预约单
      submitAppoint (formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitVisable = true
          } else {
            return false
          }
        })
        // setTimeout(() => { this.submitVisable = false }, 500)
      }
    }
  }
</script>
<style scoped>
  .dropdown {
    width: 100%;
    margin-left: 15%
  }

  .dropdown2 {
    display: inline-block;
    width: 100%;
    float: left
  }

  .dropdown-content {
    height: 200px;
    position: absolute;
    background-color: #fff;
    margin-left: -1%;
    padding: 0;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
    z-index: 1;
    width: 78%
  }

  .dropdown-select {
    clear: both;
    height: 160px;
    overflow-y: scroll
  }

  .dropdown-select ul {
    clear: both;
    list-style-type: none
  }

  .dropdown-select ul li:hover {
    cursor: pointer;
    background-color: #D1E5E5
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-content-select {
    list-style-type: none;
  }

  .dropdown-li {
    cursor: pointer;
    border-right: 1px solid #C0C0C0;
    width: 33.33%;
    margin: 0;
    float: left;
    box-sizing: border-box;
    background-color: #D1E5E5;
    text-align: center
  }

  .dropdown-shenfen li:hover {
    cursor: pointer;
    background-color: #D1E5E5
  }

  .addressDetail {
    width: 45%;
    float: left;
    margin-left: -5%
  }

  .selectOn {
    background-color: #00d1b2;
  }

  .selectNo {
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
</style>


