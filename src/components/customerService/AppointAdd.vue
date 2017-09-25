 <template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <h2 style="text-align:center;margin-top:0">新建预约单</h2>

    <div style='margin-top:2%;display:inline-block;width:100%;text-align:center'>
      <span style='float:left;padding-top:0.7%;width:5%'>日期：</span>
      <span style='float:left;padding-top:0.9%;width:13%'>{{timeNow}}</span>
      <span style='width:100px;float: left;padding-top: 0.7%;margin-left: 2%'>始发站：</span>
      <div style="width: 150px; float: left">
          <el-cascader
            expand-trigger="hover"
            :options="initForm.stationOptions"
            @change="handleChange1">
          </el-cascader>
      </div>
      <span style='width:100px;float: left;padding-top: 0.7%;margin-left: 2%'>目的站：</span>
      <div style="width: 150px; float: left">
          <el-cascader
            expand-trigger="hover"
            :options="initForm.stationOptions"
            @change="handleChange2">
          </el-cascader>
      </div>
      <span style='float:left;padding:0.7% 0 0 2%;width:100px'>预约单号：</span>
      <span style='float:left;padding-top:0.9%;width:100px'>{{initForm.id}}</span>
    </div>
    <div style='margin-top:2%;clear:both'/>
    <div class='div-form'>
      <el-form :model="appointForm" :rules="appointRules" ref="appointForm" >       
        <el-form-item label="发货方：" style="clear:both;width:100%" label-width="100px" prop="shipNam">
          <div class='dropdown_fahuo' style='width:80%'>
              <el-input type="text"  style='width:100%' v-model='appointForm.shipNam' @keyup.native="getSearchFahuo()" @keyup.enter.native="setBlur(1)" placeholder="请输入发货方名称" ></el-input>
              <div class="dropdown-content" v-show="fahuoShow" style='width:85%;height:140px'> 
                <div class='dropdown-select'>
                  <ul class='dropdown-fahuo'>
                    <li v-bind:key="data" v-for="(data,i) in this.fahuoList" v-on:dblclick="clickFahuo(data)">{{data}}</li>
                  </ul>
                </div>
              </div>
          </div>
        </el-form-item>
        <el-form-item label="手机：" style="clear:both;width:60%" label-width="100px" prop="shipTel">
          <el-input v-model="appointForm.shipTel" style="width:100%" placeholder="输入发货方手机"></el-input>
        </el-form-item>
        <el-form-item label="提货地址：" style="float:left;width:50%" label-width="100px" prop="baseAddressFa">
          <div id='focus1' class="dropdown2" style='outline:none' contenteditable="false" tabindex="0" @click="getFocus(1)" @blur="addressVisible=false">
            <el-input v-model="appointForm.baseAddressFa" placeholder="请选择提货地址"  readonly="readonly"style="width:73%" ></el-input>
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
      
        <el-form-item label="收货方：" style="clear:both;width:100%" label-width="100px" prop="receNam" >
          <div class='dropdown_shouhuo' id='focus_shouhuo' style='width:80%;outline:none' @click="getFocus(3)">
              <el-input type="text"  id="focus_shouhuo_input" style='width:100%' v-model='appointForm.receNam' @keyup.native="getSearchShouhuo()" @keyup.enter.native="setBlur(2)" placeholder="请输入收货方名称" ></el-input>
              <div class="dropdown-content"  v-show="shouhuoShow" style='width:85%;height:140px;margin-top:1px'> 
                <div class='dropdown-select' id="focus_shouhuo_dropdown">
                  <ul class='dropdown-fahuo' >
                    <li v-bind:key="data" v-for="(data,i) in this.shouhuoList" v-on:dblclick="clickShouhuo(data)">{{data}}</li>
                  </ul>
                </div>
              </div>
          </div>
        </el-form-item>
        <el-form-item label="手机：" style="clear:both;width:60%" label-width="100px" prop="receTel">
          <el-input id='phonefocus2'  ref="phonefocus2" v-model="appointForm.receTel" style="width:100%"  placeholder="输入收货方手机"></el-input>
        </el-form-item>
        <!-- <el-form-item label="收货地址：" style="clear:both;width:100%" label-width="90px" prop="receAdr"> -->
        <el-form-item label="收货地址：" style="float:left;width:50%" label-width='100px' prop="baseAddressShou">
          <div id='focus2' class='dropdown2' style='outline:none' contenteditable="false" tabindex="0" readonly="true"  @click="getFocus(2)" @blur="addressVisible2 = false">
            <el-input id="inputfocus2" ref="inputfocus2" v-model="appointForm.baseAddressShou" placeholder="请选择收货地址"  style="width:73%"></el-input>
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
          <el-select placeholder="" style="width:60%" v-model="appointForm.package">
            <el-option key="zhixiang" label="纸箱" value="zhixiang"></el-option>
            <el-option key="muxiang" label="木箱" value="muxiang"></el-option>
            <el-option key="mukuang" label="木框" value="mukuang"></el-option>
            <el-option key="bianzhidai" label="编织袋" value="bianzhidai"></el-option>
            <el-option key="dai" label="袋" value="dai"></el-option>
            <el-option key="mo" label="膜" value="mo"></el-option>
            <el-option key="tong" label="桶" value="tong"></el-option>
            <el-option key="no" label="无" value="no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物备注：" style="clear:both;width:100%" label-width="100px">
          <el-input v-model="appointForm.note" style="width:78%"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style='text-align:center'>
      <el-button style='margin-top:2%' type="primary" @click="submitAppoint('appointForm')">保存</el-button>
      <el-button style='margin-left:10%' @click="cancleVisable=true">取消</el-button>
    </div>
    <!--提交弹窗-->
    <el-dialog title="" :visible.sync="submitVisable" size="" tiny>
      <h2 style="text-align:center;padding: 30px 0 30px 0px">新建预约单成功！</h2>
    </el-dialog>
    <!--取消弹窗-->
    <el-dialog title="" :visible.sync="cancleVisable" size="" tiny>
      <h2 style="text-align:center;padding: 30px 0 30px 0px">确定取消吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle_cancle">取 消</el-button>
        <el-button @click="cancle_ok">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 错误输入提示弹窗 -->
    <el-dialog title="错误：" :visible.sync="wrongNoteVisable" size="tiny">
      <h2 style="text-align:center;padding: 30px 0 30px 0px">{{wrongNote}}</h2>
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
        wrongNote: '',
        wrongNoteVisable: false, // 错误提示弹窗
        fahuoList: [],
        shouhuoList: [],
        fahuoShow: false, // 发货方列表
        shouhuoShow: false, // 收货方列表
        labelWidth: '90px',
        formLabelWidth: '15%',
        /** 地址内容 */
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
        initForm: {
          id: '1234567',
          stationOptions: [{
            value: '北京',
            label: '北京',
            children: [{
              value: '北京',
              label: '北京'
            }]
          },
          {
            value: '江苏',
            label: '江苏',
            children: [{
              value: '南京',
              label: '南京'
            }, {
              value: '苏州',
              label: '苏州'
            }, {
              value: '无锡',
              label: '无锡'
            }]
          }]
        },
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
        appointForm: {
          shenfenSelected: '',
          shiSelected: '',
          quSelected: '',
          shenfenSelected2: '',
          shiSelected2: '',
          quSelected2: '',
          /** 发货人信息 */
          startStation: '',
          shipNam: '',
          shipTel: '',
          pickUpAdr: '123',
          baseAddressFa: '',
          /** 货物信息 */
          goodsNam: '',
          goodsNums: '',
          goodsWeight: '',
          goodsVolumn: '',
          package: '',
          note: '',
          /** 收货人信息 */
          arrStation: '',
          receNam: '',
          receTel: '',
          receAdr: '',
          baseAddressShou: ''
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
            {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确货物重量')) }}
          ],
          goodsVolumn: [
            {required: true, message: '请填写货物体积', trigger: 'blur'},
            {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确数字')) }}
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
          baseAddressShou: [
            {
              validator (r, v, b) {
                let splitAddress = v.split('/')
                if (splitAddress[0] === '') {
                  b(new Error('请选择收货地址'))
                } else if (splitAddress[1] === '') {
                  b(new Error('请选择市'))
                } else if (splitAddress[2] === '') {
                  b(new Error('请选择区'))
                } else {
                  b()
                }
              }
            }
          ],
          baseAddressFa: [
            {
              validator (r, v, b) {
                let splitAddress2 = v.split('/')
                if (splitAddress2[0] === '') {
                  b(new Error('请选择发货地址'))
                } else if (splitAddress2[1] === '') {
                  b(new Error('请选择市'))
                } else if (splitAddress2[2] === '') {
                  b(new Error('请选择区'))
                } else {
                  b()
                }
              }
            }
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
     // 根据表单上方始发站选择提货地址
      handleChange1 (value) {
        let data = (value.toString()).split(',')
        /* startStation: '', // 始发站
          arrStation: */
        this.appointForm.startStation = data[1]
        // alert(this.appointForm.startStation)
        this.appointForm.shenfenSelected = data[0]
        this.appointForm.shiSelected = data[1]
        this.appointForm.quSelected = ''
        this.appointForm.baseAddressFa = this.appointForm.shenfenSelected + this.appointForm.shiSelected + this.appointForm.quSelected
        this.setShi(1)
        this.setQuyu(1)
      },
      // 根据表单上方目的站选择设置收货地址
      handleChange2 (value) {
        let data = (value.toString()).split(',')
        this.appointForm.arrStation = data[1]
        this.appointForm.shenfenSelected2 = data[0]
        this.appointForm.shiSelected2 = data[1]
        this.appointForm.quSelected2 = ''
        this.appointForm.baseAddressShou = this.appointForm.shenfenSelected2 + this.appointForm.shiSelected2 + this.appointForm.quSelected2
        this.setShi(2)
        this.setQuyu(2)
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
      // 补全发货列表
      clickFahuo (data) {
        this.fahuoShow = false
        this.appointForm.shipNam = data
        let list = ['shipTel', 'pickUpAdr', 'shenfenSelected', 'shiSelected', 'quSelected', 'baseAddressFa']
        for (let i = 0; i < list.length; i++) {
          this.appointForm[list[i]] = this.fahuoRelated[list[i]]
        }
        this.appointForm.baseAddressFa = this.appointForm.shenfenSelected + '/' + this.appointForm.shiSelected + '/' + this.appointForm.quSelected
        this.setShi(1)
        this.setQuyu(1)
      },
      // 补全收货列表
      clickShouhuo (data) {
        this.shouhuoShow = false
        this.appointForm.receNam = data
        let list = ['receTel', 'receAdr', 'shenfenSelected2', 'shiSelected2', 'quSelected2', 'baseAddressShou']
        for (let i = 0; i < list.length; i++) {
          this.appointForm[list[i]] = this.shouhuoRelated[list[i]]
        }
        this.appointForm.baseAddressShou = this.appointForm.shenfenSelected2 + '/' + this.appointForm.shiSelected2 + '/' + this.appointForm.quSelected2
        this.setShi(2)
        this.setQuyu(2)
      },
      // 根据所选发货方获取好搜伙房列表
      getSearchShouhuo () {
        if (this.appointForm.receNam !== '') {
          this.shouhuoShow = true
          this.shouhuoList = ['收货方1', '收货方2', '收货方3', '收货方4']
        } else {
          this.shouhuoShow = false
        }
      },
      // 实时搜索发货方列表
      getSearchFahuo () {
        if (this.appointForm.shipNam !== '') {
          this.fahuoShow = true
          this.fahuoList = ['发货方1', '发货方2', '发货方3', '发货方4']
          console.log(this.fahuoList[0])
        } else if (this.appointForm.shipNam === '') {
          this.fahuoShow = false
        }
      },
      getFocus (num) {
        if (num === 1) {
          this.addressVisible = true
          document.getElementById('focus1').focus()
        } else if (num === 2) {
          this.addressVisible2 = true
          document.getElementById('focus2').focus()
        } else if (num === 3) {
          // document.getElementById('focus_shouhuo').focus()
        }
      },
      selectShenfen (num, name) {
        if (num === 1) {
          this.appointForm.shenfenSelected = name
          this.appointForm.shiSelected = ''
          this.appointForm.quSelected = ''
          this.quList = []
          this.shiList = []
        } else {
          this.appointForm.shenfenSelected2 = name
          this.appointForm.shiSelected2 = ''
          this.appointForm.quSelected2 = ''
          this.quList2 = []
          this.shiList2 = []
        }
        if (num === 2) {
          this.appointForm.baseAddressShou = this.appointForm.shenfenSelected2 + '/' + this.appointForm.shiSelected2 + '/' + this.appointForm.quSelected2
        } else {
          this.appointForm.baseAddressFa = this.appointForm.shenfenSelected + '/' + this.appointForm.shiSelected + '/' + this.appointForm.quSelected
        }
        console.log(this.appointForm.baseAddressFa)
      },
      selectShi (num, name) {
        if (num === 1) {
          this.appointForm.shiSelected = name
          this.appointForm.quSelected = ''
          this.quList = []
        } else {
          this.appointForm.shiSelected2 = name
          this.appointForm.quSelected2 = ''
          this.quList2 = []
        }
        if (num === 2) {
          this.appointForm.baseAddressShou = this.appointForm.shenfenSelected2 + '/' + this.appointForm.shiSelected2 + '/' + this.appointForm.quSelected2
        } else {
          this.appointForm.baseAddressFa = this.appointForm.shenfenSelected + '/' + this.appointForm.shiSelected + '/' + this.appointForm.quSelected
        }
      },
      selectQu (num, name) {
        if (num === 1) {
          this.appointForm.quSelected = name
          this.addressVisible = false
          this.isFocus = true
          this.detailVisible = true
          this.isReadOnly = true
        } else {
          this.appointForm.quSelected2 = name
          this.addressVisible2 = false
          this.isFocus2 = true
          this.detailVisible2 = true
          this.isReadOnly2 = true
        }
        if (num === 2) {
          this.appointForm.baseAddressShou = this.appointForm.shenfenSelected2 + '/' + this.appointForm.shiSelected2 + '/' + this.appointForm.quSelected2
        } else {
          this.appointForm.baseAddressFa = this.appointForm.shenfenSelected + '/' + this.appointForm.shiSelected + '/' + this.appointForm.quSelected
        }
        /* document.getElementById('focus2').focus()
        document.getElementById('focus2').blur()
        this.addressVisible2 = false
        document.getElementById('inputfocus2').focus() */
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
          if (this.appointForm.shenfenSelected) {
            regionJson.filter(item => {
              if (item.name === this.appointForm.shenfenSelected) {
                this.shiList = item
                return true
              }
            })
          }
        } else {
          this.shenfen2 = false
          this.shi2 = true
          this.quyu2 = false
          if (this.appointForm.shenfenSelected2) {
            regionJson.filter(item => {
              if (item.name === this.appointForm.shenfenSelected2) {
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
          if (this.appointForm.shiSelected && this.appointForm.shenfenSelected) {
            this.shiList.sub.filter(item => {
              if (item.name === this.appointForm.shiSelected) {
                this.quList = item.sub
                return true
              }
            })
          }
        } else {
          this.shenfen2 = false
          this.shi2 = false
          this.quyu2 = true
          if (this.appointForm.shiSelected2 && this.appointForm.shenfenSelected2) {
            this.shiList2.sub.filter(item => {
              if (item.name === this.appointForm.shiSelected2) {
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

    // 判断站点与表单区域是否一致
      isAttSta () {
        if ((this.appointForm.startStation !== this.appointForm.shiSelected) || (this.appointForm.arrStation !== this.appointForm.shiSelected2)) {
          return false
        } else {
          return true
        }
      },
    // 提交新建预约单
      submitAppoint (formName) {
        const self = this
        self.$refs['appointForm'].validate((valid) => {
          if (valid) {
            if (this.isAttSta()) {
              this.submitVisable = true
              setTimeout(() => { this.submitVisable = false }, 800)
            } else {
              this.wrongNote = '地址与所选站点不匹配'
              this.wrongNoteVisable = true
              setTimeout(() => { this.wrongNoteVisable = false }, 800)
            }
          } else {
            return false
          }
        })
        // setTimeout(() => { this.submitVisable = false }, 500)
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
    }
  }
</script>
<style scoped>
  .dropdown {
    width: 100%;
    margin-left: 15%
  }

  .dropdown_fahuo{
    display: inline-block;
  }
  .dropdown_shouhuo{
    display: inline-block;
  }

  .dropdown-fahuo li:hover{
    cursor: pointer;
    background-color: #D1E5E5
  }

  .dropdown-fahuo li {
    text-align:center;
    font-size:100%;
    padding:0.1% 0 0.1% 0
  }

  .dropdown2 {
    display: inline-block;
    width: 100%;
    float: left
  }

  .dropdown-content {
    height: 180px;
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
    height: 140px;
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


