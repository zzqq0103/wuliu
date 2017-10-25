<template>
  <div>
    <div>
      <h2 style="text-align:center">外包企业订单信息</h2>
      <p style="margin-top:1%">
        <!--<div style="float: right">-->
        <!--<el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>-->
        <!--</div>-->
      <div>
        <el-form :model="orderformerForm" ref="orderformerForm" :inline="true">
          <el-form-item label="下单时间:">
            <el-date-picker v-model="orderformerForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单物流状态:">
            <el-select v-model="orderformerForm.deliverStatus" style="width:80px;heght:60px" placeholder="请选择"
                       class="appointmentoption col-1">
              <el-option label="待转" value="1"></el-option>
              <el-option label="已转" value="2"></el-option>
              <el-option label="已派" value="3"></el-option>
              <el-option label="已签" value="4"></el-option>
            </el-select>
            <!--<el-input v-model="orderformerForm.deliverStatus" style="width: 80px"></el-input>-->
          </el-form-item>
          <el-form-item label="中转目的地:">
            <el-input v-model="orderformerForm.bourn" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="订单号:">
            <el-input v-model="orderformerForm.transactioncode" style="width: 150px"></el-input>
          </el-form-item>
          <el-button style="margin-right:2%" @click="drawGrid()">查询</el-button>
        </el-form>
      </div>
      <div style="float:left; margin-top:1%">
        <el-button @click="">导出</el-button>
        <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="200" trigger="hover">
          <template v-for="(collist,i) in gridOptions.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">
                {{collist.headerName}}
              </el-checkbox>
            </div>
          </template>
          <template>
            <div class="colVisible">
              <el-button @click="visibleChoice(1)" size="small">全选</el-button>
              <el-button @click="visibleChoice(2)" size="small">全不选</el-button>
            </div>
          </template>
        </el-popover>
        <el-button v-popover:popover1>设置</el-button>
      </div>
      </p>
    </div>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :rowHeight=40
                   :headerHeight=40
      ></ag-grid-vue>
    </div>
    <el-dialog title="外包企业信息:" :visible.sync="orderformerVisable">
      <el-form :model="orderformerForm" :rules="rules" ref="orderformerForm">
        <el-form-item label="物流状态:" :label-width="formLabelWidth">
          <!--<el-input v-model="orderformerForm.licePlateNum"></el-input>-->
          <el-select v-model="orderformerForm.Selectsites" placeholder="选择" class="appointmentoption col-1"
                     style="width:80%;heght:60px">
            <el-option key="yes" label="派送" value="delivery"></el-option>
            <el-option key="no" label="签收" value="sign"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="this.orderformerForm.Selectsites === 'delivery'">
          <el-form-item label="派送员:" :label-width="formLabelWidth">
            <el-input style='width:80%' v-model='orderformerForm.deliverer'></el-input>
          </el-form-item>
          <el-form-item label="电话:" :label-width="formLabelWidth">
            <el-input style='width:80%' v-model='orderformerForm.tel'></el-input>
          </el-form-item>
        </div>
        <div v-else-if="this.orderformerForm.Selectsites === 'sign'">

        </div>
        <!--<el-form-item label="物流:" :label-width="formLabelWidth">-->
        <!--<el-input v-model="orderformerForm.logistics" style="width:150px;heght:60px"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderformerVisable = false">取 消</el-button>
        <el-button type="primary" @click="orderformerVisable = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--<div>-->
    <!--<p style="margin-top:1%;float:right;margin-right:5%;width:50%">-->
    <!--<el-button style="margin-right:6%">提 交 更 改</el-button>-->
    <!--</p>-->
    <!--</div>-->
    <el-dialog title="外包企业订单列表:" :visible.sync="orderFormVisable">
      <el-form :model="orderForm" :rules="rules" ref="orderForm">
        <el-form-item label="序号:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.number"></el-input>
        </el-form-item>
        <el-form-item label="订单号:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.orderId"></el-input>
        </el-form-item>
        <el-form-item label="订单物流状态:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.orderLogiState"></el-input>
        </el-form-item>
        <el-form-item label="下单时间:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.orderTim"></el-input>
        </el-form-item>
        <el-form-item label="中转起始地:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.changeStart"></el-input>
        </el-form-item>
        <el-form-item label="中转目的地:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.changeEnd"></el-input>
        </el-form-item>
        <el-form-item label="发货方:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.shipNam"></el-input>
        </el-form-item>
        <el-form-item label="发货方联系方式:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.shipTel"></el-input>
        </el-form-item>
        <el-form-item label="收货方:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.receNam"></el-input>
        </el-form-item>
        <el-form-item label="收货方联系电话:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.receTel"></el-input>
        </el-form-item>
        <el-form-item label="收货地址:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.receAdr"></el-input>
        </el-form-item>
        <el-form-item label="货物名称:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.goodsNam"></el-input>
        </el-form-item>
        <el-form-item label="件数:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.goodsNums"></el-input>
        </el-form-item>
        <el-form-item label="重量:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.goodsWeight"></el-input>
        </el-form-item>
        <el-form-item label="体积:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.goodsVolume"></el-input>
        </el-form-item>
        <el-form-item label="包装:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.goodsPackage"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderFormVisable = false">取 消</el-button>
        <el-button type="primary" @click="orderFormVisable = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--<el-dialog title="" :visible.sync="verVisible" size="full" :closeOnClickModal="false">-->
    <!--<h2 style="text-align:center;margin-top:-2%">订 单 详 情</h2>-->
    <!--<el-form ref="form" :model="form">-->
    <!--<div style='margin-top:0.5%;display:inline-block;width:100%'>-->
    <!--<span style='float:left;padding-top:0.7%' class='col-1'>订单号：</span>-->
    <!--<span style='float:left;padding-top:0.9%;width:auto'>{{form.id}}</span>-->
    <!--</div>-->
    <!--<div style='margin-top:2%;clear:both' class='test'>-->
    <!--<span class='col-11 label-title'>基本信息</span>-->
    <!--<span class='col-1'>订单号</span>-->
    <!--<span class='col-1 label-content' style='color:#00d1b2'>{{form.id}}</span>-->
    <!--<span class='col-1'>订单时间</span>-->
    <!--<span class='col-2 label-content'>{{form.orderTim}}</span>-->
    <!--<span class='col-1'>订单状态</span>-->
    <!--<span class='col-1 label-content'>{{form.state}}</span>-->
    <!--<span class='col-1'>开单网点</span>-->
    <!--<span class='col-1 label-content'>{{form.billBranch}}</span>-->
    <!--<span class='col-1'>目的网点</span>-->
    <!--<span class='col-1 label-content'>{{form.arrBranch}}</span>-->
    <!--<span class='col-1'>发货单位</span>-->
    <!--<span class='col-2 label-content'>{{form.shipComp}}</span>-->
    <!--<span class='col-1'>发货人</span>-->
    <!--<span class='col-1 label-content'>{{form.shipNam}}</span>-->
    <!--<span class='col-1'>联系电话</span>-->
    <!--<span class='col-1 label-content'>{{form.shipTel}}</span>-->
    <!--<span class='col-1'>提货地址</span>-->
    <!--<span class='col-3 label-content'>{{form.pickUpAdr}}</span>-->
    <!--<span class='col-1'>收货单位</span>-->
    <!--<span class='col-2 label-content'>{{form.receComp}}</span>-->
    <!--<span class='col-1'>收货人</span>-->
    <!--<span class='col-1 label-content'>{{form.receNam}}</span>-->
    <!--<span class='col-1'>联系电话</span>-->
    <!--<span class='col-1 label-content'>{{form.receTel}}</span>-->
    <!--<span class='col-1'>收货地址</span>-->
    <!--<span class='col-3 label-content'>{{form.receAdr}}</span>-->
    <!--<span class='col-1' v-for="(data,i) in datalist1" :key='data'>{{data}}</span>-->
    <!--<span class='col-1 label-content' v-for="(value, key, i) in form" :key='key' v-if="i>4&&i<16">{{value}}</span>-->
    <!--<span class='col-1'>订单类型</span>-->
    <!--<span class='col-1 label-content'>{{form.orderType}}</span>-->
    <!--<span class='col-1'>送货方式</span>-->
    <!--<span class='col-1 label-content'>{{form.sendMode}}</span>-->
    <!--<span class='col-2'>听通知放货(无</span>-->
    <!--<span class='col-1 label-content'>{{form.isListenToRele}}</span>-->
    <!--<span class='col-1'>可放货(无</span>-->
    <!--<span class='col-1 label-content'>{{form.isRelease}}</span>-->
    <!--<span class='col-1'>订单物流状态</span>-->
    <!--<span class='col-1 label-content'>{{form.orderLogiState}}</span>-->
    <!--<span class='col-11 label-title'>运输信息</span>-->
    <!--<span class='col-1 label-title'>送货</span>-->
    <!--<span class='col-1'>送货司机</span>-->
    <!--<span class='col-2 label-content'>{{form.sendDriverNam}}</span>-->
    <!--<span class='col-1'>联系电话</span>-->
    <!--<span class='col-2 label-content'>{{form.sendDriverTel}}</span>-->
    <!--<span class='col-2'>送货时间</span>-->
    <!--<span class='col-2 label-content'>{{form.sendTim}}</span>-->
    <!--<span class='col-2 label-title'>中转信息</span>-->
    <!--<span class='col-1'>起始地点</span>-->
    <!--<span class='col-2 label-content'>{{form.changeStart}}</span>-->
    <!--<span class='col-1'>目的地点</span>-->
    <!--<span class='col-2 label-content'>{{form.changeEnd}}</span>-->
    <!--<span class='col-1'>中转时间</span>-->
    <!--<span class='col-2 label-content'>{{form.changeTim}}</span>-->
    <!--<span class='col-2 label-title'>其它信息</span>-->
    <!--<span class='col-1'>审核状态</span>-->
    <!--<span class='col-1 label-content'>{{form.auditState}}</span>-->
    <!--<span class='col-1'>审核人</span>-->
    <!--<span class='col-1 label-content'>{{form.auditor}}</span>-->
    <!--<span class='col-1'>审核时间</span>-->
    <!--<span class='col-2 label-content'>{{form.unActTim}}</span>-->
    <!--<span class='col-1'>订单备注</span>-->
    <!--<span class='col-1 label-content'>{{form.orderNote}}</span>-->
    <!--</div>-->
    <!--</el-form>-->
    <!--</el-dialog>-->

    <el-dialog title="" :visible.sync="orderFormDelVisable" size="tiny">
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderFormDelVisable = false">取 消</el-button>
        <el-button @click="orderFormDelVisable = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false">
      <template v-for="(collist,i) in gridOptions.columnDefs">
        <div>
          <el-checkbox v-model="collist.hide" @change="updataColumnDefs(gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { AgGridVue } from 'ag-grid-vue'
//  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  import api from '../../api/orderFormer/api.js'
  //  import api from '../../../api/financialAdministrator/api.js'

  export default {
    data: function () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '上周',
            onClick (picker) {
              const now = new Date()
              const start = new Date()
              const end = new Date()
              const nowDayOfWeek = now.getDay()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek + 6))
              end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfWeek)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '上个月',
            onClick (picker) {
              const now = new Date()
              const start = new Date()
              const end = new Date()
              const nowDayOfMonth = now.getDate()
              const nowMonth = now.getMonth()
              start.setDate(1)
              start.setMonth(nowMonth - 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfMonth)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '去年',
            onClick (picker) {
              const now = new Date()
              const start = new Date()
              const end = new Date()
              const nowYear = now.getFullYear()
              start.setYear(nowYear - 1)
              start.setMonth(0)
              start.setDate(1)
              end.setYear(nowYear - 1)
              end.setMonth(11)
              end.setDate(31)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今年',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setMonth(0)
              start.setDate(1)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            const now = new Date()
            const timeYear = time.getFullYear()
            const nowYear = now.getFullYear()
            return timeYear < (nowYear - 1)
          }
        },
        orderformerVisable: false,
        orderformerForm: {
          'Selectsites': '',
          'startTime': '',
          'deliverStatus': '',
          'bourn': '',
          'transactioncode': '',
          'deliverer': '',
          'tel': ''
        },
        colVisible: false,
        orderFormVisable: false,
        orderFormDelVisable: false,
        verVisible: false,
        paddingTop: 3,
        cancleVisable: false,
        datalist1: ['始发站', '到站', '当前位置', '货物名称', '件数', '重量', '体积', '包装', '长', '宽', '高'],
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
          id: 'asdfghjzkxlmhn',
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
          isRelease: '',
          isListenToRele: '',
          tranMode: '',
          reserveId: '',
          orderLogiState: '',
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
        // selectItem: [
        //   { desc: '泡沫', id: 'pm' },
        //   { desc: '塑料', id: 'sl' },
        //   { desc: '纸箱', id: 'zx' }
        // ],
        orderForm: {
          number: '1',
          'transactioncode': '',
          'deliverStatus': '',
          'ordertime': '',
          'home': '',
          'bourn': '',
          'shipper': '',
          'shippertel': '',
          'recipient': '',
          'recipienttel': '',
          'receiveraddr': '',
          'commodityname': '',
          'totalpackages': '',
          'weight': '',
          'volume': '',
          'pack': ''
        },
        rules: {},
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '序号',
              width: 60,
              field: 'number',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '订单号',
              width: 120,
              field: 'orderId',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '订单物流状态',
              width: 150,
              field: 'orderLogiState',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '下单时间',
              width: 120,
              field: 'orderTim',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转起始地',
              width: 150,
              field: 'changeStart',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转目的地',
              width: 150,
              field: 'changeEnd',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '发货方',
              width: 80,
              field: 'shipNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '发货方联系方式',
              width: 150,
              field: 'shipTel',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货方',
              width: 80,
              field: 'receNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货方联系电话',
              width: 150,
              field: 'receTel',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货地址',
              width: 150,
              field: 'receAdr',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '货物名称',
              width: 120,
              field: 'goodsNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '件数',
              width: 80,
              field: 'goodsNums',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '重量',
              width: 80,
              field: 'goodsWeight',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '体积',
              width: 80,
              field: 'goodsVolume',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '包装',
              width: 80,
              field: 'goodsPackage',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '状态',
              field: 'value',
              width: 80,
              cellRendererFramework: 'condition',
              suppressMenu: true,
              hide: false,
              visible: true
            }
//            {
//              headerName: ' ',
//              field: 'values',
//              width: 80,
//              cellRendererFramework: 'operateComponent',
//              suppressMenu: true,
//              hide: false,
//              visible: true
//            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
//      operateComponent: {
//        // template:'<span></span><select><option  @click="vehicleDel" value="派送">派送</option><option  @click="vehicleDel" value="签收">签收</option></select></span>',
//        template: '<span><el-button class="del-but" @click="orderdetails(liceNum)" type="info">详 情</el-button></span>',
//        methods: {
//          orderdetails (liceNum) {
//            this.params.context.componentParent.verVisible = true
//          }
//        }
//      },
      condition: {
        template: '<span><el-button class="del-but" @click="edit" type="info">编 辑</el-button></span>',
//        template: '<el-select v-model="appointlnfoForm.Selectsites"  placeholder="选择" class="appointmentoption col-1" style="width:80px"> <el-option key="yes" label=" 已签 " value="yes"></el-option><el-option key="yes" label=" 在途 " value="no"></el-option></el-select>',
        // '<select placeholder="选择" class="appointmentoption" style="width:150px;heght:60px"><option key="yes" label="回单已签" value="yes"></option><option key="no" label="回单在途" value="no"></option><option key="no" label="回单已反" value="no"></option> </select>'//          return {
//            appointlnfoForm: {
//              Selectsites: ''
//            }
//          }
//        }
        methods: {
          edit () {
            this.params.context.componentParent.orderformerVisable = true
          }
        }
      }
    },
    methods: {
      drawGrid () {
//        this.onQuickFilterChanged ()
//        this.changeColumnDefsBoolen ()
        this.createRowData()
      },
      createRowData () {
        this.orderformerForm.startTime = '2017-08-1/2017-09-10'
        this.orderformerForm.deliverStatus = ''
        this.orderformerForm.transactioncode = ''
        console.log(this.orderformerForm)
        api.getTransferFee(this.orderformerForm)
          .then(res => {
            console.log('成功')
//            console.log(res)
//            console.log(res.data.content)
            let allLen = res.data.content.length
            console.log(allLen)
            this.gridOptions.rowData = res.data.content
            console.log(res.data.content)
            this.gridOptions.api.setRowData(this.gridOptions.rowData)
//            if (allLen > 0) {
//              for (var i = 0; i < allLen; i++) {
//                let transactioncode = res.data.content[i].orderId
//                console.log(transactioncode)
//                this.orderformerForm.transactioncode = transactioncode
//              }
//            }
//            console.log(res.data.content())
          })
          .catch(error => {
            console.log('失败')
            console.log(error)
          })
//        this.gridOptions.rowData = testJson.orderformInfo.list
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      changeColumnDefsBoolen () {
        var columnlist = this.gridOptions.columnDefs
        for (let i = 0; i < columnlist.length; i++) {
          columnlist[i].hide = !columnlist[i].hide
        }
      },
      setting () {
        this.colVisible = true
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
//      updataColumnDefs (collist) {
//        for (let i = 0; i < collist.length; i++) {
//          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
//        }
//      },
      // 增加
      ordeformerAdd () {
        this.orderFormVisable = true
        this.orderForm.licePlateNum = ''
        this.orderForm.driverName = ''
        this.orderForm.tel = ''
        this.orderForm.capacity = ''
        this.orderForm.carType = ''
        this.orderForm.pickUpArea = ''
        this.orderForm.carPosition = ''
      },
      visibleChoice (i) {
        if (i === 1) {
          for (let j = 0; j < this.gridOptions.columnDefs.length; j++) {
            this.gridOptions.columnDefs[j].visible = true
          }
        } else if (i === 2) {
          for (let j = 0; j < this.gridOptions.columnDefs.length; j++) {
            this.gridOptions.columnDefs[j].visible = false
          }
        }
        this.updataColumnDefs(this.gridOptions.columnDefs)
      }
    },
    beforeMount () {
      this.createRowData()
    },
    mounted () {
      this.changeColumnDefsBoolen()
    }
  }
</script>
<style>
  .el-select-css {
    width: 50%;
  }

  /*.del-but {*/
  /*cursor: pointer;*/
  /*float: right;*/
  /*margin-right: 10px;*/
  /*border-radius: 4px;*/
  /*background: #fff;*/
  /*border: 1px solid rgb(191, 217, 216);*/
  /*color: rgb(31, 61, 60);*/
  /*padding: 5px 10px;*/
  /*font-size: 10px*/
  /*}*/

  .appointmenttime {
    /* float: left; */
    margin: 1%;
  }

  .appointment {
    padding-top: 5%;
    width: 100%;
    font-size: 0.6em;
  }

  .appointmenttimes {
    width: 145px;
    margin-left: 1%;
  }

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

  .el-dialog--small {
    width: 30%;
  }

  .ag-blue .ag-cell-focus {
    border: 0px solid #217346;
  }
</style>
