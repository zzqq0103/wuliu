<template>
  <div>
    <div>
      <h2 style="text-align:center">外包企业订单信息</h2>
      <p style="margin-top:1%">
      <div style="float: right">
        <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
      </div>
      <div>
        <el-h5 class="appointmenttime">预约时间</el-h5>
        <el-date-picker type="datetime" class="appointmenttimes" placeholder="开始时间"
                        v-model="orderForm.startTime"></el-date-picker>
        <el-h5 class="appointmenttimes">到</el-h5>
        <el-date-picker type="datetime" class="appointmenttimes" placeholder="结束时间"
                        v-model="orderForm.endTime"></el-date-picker>
        <el-button @click="vehicleVisable = true" style="float:right; margin-right:2%">查询</el-button>
      </div>
      <div style="float:right; margin-top:1%">
        <el-button @click="">导出</el-button>
        <el-button @click="setting">设置</el-button>
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
                   :rowHeight="40"
                   :headerHeight="30"
      ></ag-grid-vue>
    </div>
    <div>
      <p style="margin-top:1%;float:right;margin-right:5%;width:50%">
        <el-button style="margin-right:6%">提 交 更 改</el-button>
      </p>
    </div>
    <el-dialog title="外包企业订单列表:" :visible.sync="orderFormVisable">
      <el-form :model="orderForm" :rules="rules" ref="orderForm">
        <el-form-item label="序号:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.licePlateNum"></el-input>
        </el-form-item>
        <el-form-item label="订单号:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.driverName"></el-input>
        </el-form-item>
        <el-form-item label="订单状态:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="发货人:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.capacity"></el-input>
        </el-form-item>
        <el-form-item label="发站:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.carType"></el-input>
        </el-form-item>
        <el-form-item label="发货方联系方式:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.carPosition"></el-input>
        </el-form-item>
        <el-form-item label="收货人:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.carpenon"></el-input>
        </el-form-item>
        <el-form-item label="收货方联系方式:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.carpenoning"></el-input>
        </el-form-item>
        <el-form-item label="货物名称:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.description"></el-input>
        </el-form-item>
        <el-form-item label="数量:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.denumber"></el-input>
        </el-form-item>
        <el-form-item label="制单人:" :label-width="formLabelWidth">
          <el-input v-model="orderForm.prepared"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderFormVisable = false">取 消</el-button>
        <el-button type="primary" @click="orderFormVisable = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <h2 style="text-align:center;margin-top:-2%">订 单 详 情</h2>
      <el-form ref="form" :model="form">
        <div style='margin-top:0.5%;display:inline-block;width:100%'>
          <span style='float:left;padding-top:0.7%' class='col-1'>订单号：</span>
          <span style='float:left;padding-top:0.9%;width:auto'>{{form.id}}</span>
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
          <span class='col-11 label-title'>运输信息</span>
          <span class='col-1 label-title'>送货</span>
          <span class='col-1'>送货司机</span>
          <span class='col-2 label-content'>{{form.sendDriverNam}}</span>
          <span class='col-1'>联系电话</span>
          <span class='col-2 label-content'>{{form.sendDriverTel}}</span>
          <span class='col-2'>送货时间</span>
          <span class='col-2 label-content'>{{form.sendTim}}</span>
          <span class='col-2 label-title'>中转信息</span>
          <span class='col-1'>起始地点</span>
          <span class='col-2 label-content'>{{form.changeStart}}</span>
          <span class='col-1'>目的地点</span>
          <span class='col-2 label-content'>{{form.changeEnd}}</span>
          <span class='col-1'>中转时间</span>
          <span class='col-2 label-content'>{{form.changeTim}}</span>
          <span class='col-2 label-title'>其它信息</span>
          <span class='col-1'>审核状态</span>
          <span class='col-1 label-content'>{{form.auditState}}</span>
          <span class='col-1'>审核人</span>
          <span class='col-1 label-content'>{{form.auditor}}</span>
          <span class='col-1'>审核时间</span>
          <span class='col-2 label-content'>{{form.unActTim}}</span>
          <span class='col-1'>订单备注</span>
          <span class='col-1 label-content'>{{form.orderNote}}</span>
        </div>
      </el-form>
    </el-dialog>

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
  import testJson from '../../../static/test/testJSON.js'

  export default {
    data: function () {
      return {
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
          'liceNum': '',
          'ordernumber': '',
          'orderstatus': '',
          'consignor': '',
          'standing': '',
          'Shippercontactinformation': '',
          'consignee': '',
          'Receivingpartycontactinformation': '',
          'descriptionofgoods': '',
          'quantity': '',
          'preparedby': '',
          endTime: '',
          startTime: ''
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
              headerName: '序号', width: 60, field: 'liceNum', filter: 'text', hide: false
            },
            {
              headerName: '订单号', width: 120, field: 'ordernumber', filter: 'text', hide: false
            },
            {
              headerName: '订单状态', width: 100, field: 'orderstatus', filter: 'text', hide: false
            },
            {
              headerName: '发货人', width: 80, field: 'consignor', filter: 'text', hide: false
            },
            {
              headerName: '发站', width: 70, field: 'standing', filter: 'text', hide: false
            },
            {
              headerName: '发货方联系方式', width: 120, field: 'Shippercontactinformation', filter: 'text', hide: false
            },
            {
              headerName: '收货人', width: 80, field: 'consignee', filter: 'text', hide: false
            },
            {
              headerName: '收货方联系方式', width: 150, field: 'Receivingpartycontactinformation', filter: 'text', hide: false
            },
            {
              headerName: '货物名称', width: 120, field: 'descriptionofgoods', filter: 'text', hide: false
            },
            {
              headerName: '数量', width: 60, field: 'quantity', filter: 'text', hide: false
            },
            {
              headerName: '制单人', width: 80, field: 'preparedby', filter: 'text', hide: false
            },
            {
              headerName: '状态', field: 'value', width: 80, cellRendererFramework: 'condition', hide: false
            },
            {
              headerName: ' ', field: 'value', width: 80, cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        // template:'<span></span><select><option  @click="vehicleDel" value="派送">派送</option><option  @click="vehicleDel" value="签收">签收</option></select></span>',
        template: '<span><el-button class="del-but" @click="orderdetails(liceNum)">详 情</el-button></span>',
        methods: {
          orderdetails (liceNum) {
            this.params.context.componentParent.verVisible = true
          }
        }
      },
      condition: {
        template: '<el-select v-model="appointlnfoForm.Selectsites"  placeholder="选择" class="appointmentoption col-1" style="width:80px"> <el-option key="yes" label=" 已签 " value="yes"></el-option><el-option key="yes" label=" 在途 " value="no"></el-option></el-select>',
        // '<select placeholder="选择" class="appointmentoption" style="width:150px;heght:60px"><option key="yes" label="回单已签" value="yes"></option><option key="no" label="回单在途" value="no"></option><option key="no" label="回单已反" value="no"></option> </select>'
        data: function () {
          return {
            appointlnfoForm: {
              Selectsites: ''
            }
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.orderformInfo.list
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
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
      },
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

  .del-but {
    cursor: pointer;
    float: right;
    margin-right: 10px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid rgb(191, 217, 216);
    color: rgb(31, 61, 60);
    padding: 5px 10px;
    font-size: 10px
  }

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
</style>
