<template>
  <div>
    <div>
      <h2 style="text-align:center">查看预约单信息</h2>
      <p style="margin-top:1%;float:left" class="appointment">
        <el-h5 class="appointmenttime">预约时间</el-h5>
        <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                        :picker-options="pickerOptions" range-separator='/' style="width: 200px">
        </el-date-picker>
        <!--<el-date-picker type="datetime" class="appointmenttimes" placeholder="开始时间" v-model="filterForm.startTime"-->
        <!--style="width: 120px"></el-date-picker>-->
        <!--<el-h5 class="appointmenttimes">到</el-h5>-->
        <!--<el-date-picker type="datetime" class="appointmenttimes" placeholder="结束时间" v-model="filterForm.endTime"-->
        <!--style="width: 120px"></el-date-picker>-->
        <el-h5 class="appointmenttimes">始发站：</el-h5>
        <el-select v-model="appointlnfoForm.Selectsite" placeholder="选择" class="appointmentoption col-1"
                   style='width:80px'>
          <el-option key="yes" label="北 京" value="yes"></el-option>
          <el-option key="no" label="南 京" value="no"></el-option>
        </el-select>
        <el-h5 class="appointmenttimesman">发货方：</el-h5>
        <el-input class="appointmenttimeman"></el-input>
        <el-h5 class="appointmenttimes">预约单号：</el-h5>
        <el-input class="appointmenttimeman"></el-input>
        <el-h5 class="appointmenttimes">预约单状态：</el-h5>
        <el-select v-model="appointlnfoForm.state" placeholder="选择" class="appointmentoption" style='width:100px'>
          <el-option key="yes" label="待生成" value="yes"></el-option>
          <el-option key="no" label="已生成" value="no"></el-option>
        </el-select>
        <el-button style="margin-right:5%">查找</el-button>
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
      </p>
      <p style="margin-top:1%;float:right;margin-right:5%">
        <!--<el-button>查找</el-button>-->
        <!--<el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="200" trigger="hover">-->
        <!--<template v-for="(collist,i) in gridOptions.columnDefs">-->
        <!--<div class="colVisible">-->
        <!--<el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">-->
        <!--{{collist.headerName}}-->
        <!--</el-checkbox>-->
        <!--</div>-->
        <!--</template>-->
        <!--<template>-->
        <!--<div class="colVisible">-->
        <!--<el-button @click="visibleChoice(1)" size="small">全选</el-button>-->
        <!--<el-button @click="visibleChoice(2)" size="small">全不选</el-button>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-popover>-->
        <!--<el-button v-popover:popover1>设置</el-button>-->
        <!--<el-button>导出</el-button>-->
      </p>
    </div>
    <el-dialog title="预约单状态:" :visible.sync="appointlnfoVisable">
      <el-form :model="appointlnfoForm" :rules="rules" ref="appointlnfoForm">
        <el-form-item label="是否预约单:" :label-width="formLabelWidth">
          <!--<el-input v-model="orderformerForm.licePlateNum"></el-input>-->
          <el-select v-model="appointlnfoForm.Selectsites" placeholder="选择" class="appointmentoption col-1"
                     style="width:150px;heght:60px">
            <el-option key="yes" label="是" value="yes"></el-option>
            <el-option key="no" label="否" value=""></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="物流:" :label-width="formLabelWidth">-->
        <!--<el-input v-model="orderformerForm.logistics" style="width:150px;heght:60px"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appointlnfoVisable = false">取 消</el-button>
        <el-button type="primary" @click="appointlnfoVisable = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="detailsVisable" size="full" :closeOnClickModal="false" top="30%">
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
    </el-dialog>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue" :gridOptions="gridOptions"
                   :suppressMovableColumns="true" :enableColResize="true" :enableSorting="true" :enableFilter="true"
                   :groupHeaders="true" :rowHeight="40" :headerHeight="40">
      </ag-grid-vue>
    </div>
    <div style="text-align: center;margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrnetChange"
        :current-page="currentPage"
        :page-sizes="[10,20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount">
      </el-pagination>
      <p style="margin-top:1%;float:right;margin-right:5%">
        <!--<el-button>查找</el-button>-->
        <el-button>导出</el-button>
      </p>
    </div>

    <!--<div>-->
    <!--<p style="margin-top:1%;float:right;margin-right:5%;width:50%">-->
    <!--<el-button style="margin-right:6%">提 交 更 改</el-button>-->
    <!--</p>-->
    <!--</div>-->
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
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'

  export default {
    data () {
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
        },
        filterForm: {
          startTime: '',
          endTime: ''
        },
        detailsVisable: false,
        colVisible: false,
        appointlnfoVisable: false,
        appointlnfoDelVisable: false,
        appointlnfoForm: {
          Selectsite: '',
          state: '',
          Selectsites: '',
          'Reservationnumber': '',
          'ordertime': '',
          'forwardingunit': '',
          'consignershipper': '',
          'deliveryphone': '',
          'consignee': '',
          'consigneeman': '',
          'Receivingphone': '',
          'driverreceiving': '',
          'receivingstate': '',
          'Cancelreservations': ''
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
              headerName: '预约单号',
              width: 100,
              field: 'Reservationnumber',
              suppressMenu: true,
              hide: false,
              visible: true
            },
            {
              headerName: '下单时间',
              width: 120,
              field: 'ordertime',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '发货单位',
              width: 120,
              field: 'forwardingunit',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '发货人',
              width: 80,
              field: 'consignershipper',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '发货电话',
              width: 150,
              field: 'deliveryphone',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货单位',
              width: 150,
              field: 'consignee',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货人',
              width: 80,
              field: 'consigneeman',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货电话',
              width: 100,
              field: 'Receivingphone',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '接货司机',
              width: 100,
              field: 'driverreceiving',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '接货状态',
              width: 100,
              field: 'receivingstate',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '取消预约单',
              field: 'abrogate',
              width: 100,
              suppressMenu: true,
              cellRendererFramework: 'receivingstate',
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 160,
              suppressMenu: true,
              cellRendererFramework: 'operateComponent',
              hide: false,
              visible: true
            }
          ]
        },
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
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
//        template: '<el-span><el-button class="del-but" @click="vehicleDel">删 除</el-button><el-button class="del-but" @click="vehicleEdit">编 辑</el-button></el-span>',
        template: '<el-span><el-button  class="del-but" @click="particulars()" type="info"> 详 情 </el-button>' +
        '<el-button  class="del-but" @click="createorder()" type="success">生成订单</el-button></el-span>',
        methods: {
          particulars () {
            this.params.context.componentParent.detailsVisable = true
          },
          createorder () {
          }
//          vehicleEdit () {
//            /* var vehicleform = this.params.context.componentParent.vehicleForm
//            vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
//            this.params.context.componentParent.enterpriseVisable = true
//            this.params.context.componentParent.enterpriseForm = this.params.data
//          }
        }
      },
      receivingstate: {
        template: '<el-span><el-button class="del-but" @click="edit" type="info">编 辑</el-button></el-span>',
        methods: {
          edit () {
            this.params.context.componentParent.appointlnfoVisable = true
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.appointInfo.list
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
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
//      setting () {
//        this.colVisible = true
//      },
//      updataColumnDefs (collist) {
//        for (let i = 0; i < collist.length; i++) {
//          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
//        }
//      },
      // 增加
      enterpriseAdd () {
        this.enterpriseVisable = true
        this.enterpriseForm.licePlateNum = ''
        this.enterpriseForm.driverName = ''
        this.enterpriseForm.tel = ''
        this.enterpriseForm.capacity = ''
        this.enterpriseForm.carType = ''
        this.enterpriseForm.pickUpArea = ''
        this.enterpriseForm.carPosition = ''
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
  /*.del-but {*/
  /*cursor: pointer;*/
  /*float: right;*/
  /*margin-right: 10px;*/
  /*margin: 3px;*/
  /*border-radius: 4px;*/
  /*background:#ff4949;*/
  /*border: 1px solid rgb(191, 217, 216);*/
  /*color: #f9f9f9;*/
  /*font-size: 0.6em;*/
  /*}*/

  .appointmenttime {
    float: left;
    margin: 1%;
  }

  .appointment {
    padding-top: 5%;
    width: 100%;
    font-size: 0.6em;
  }

  .appointmenttimes {
    width: 100px;
    margin-left: 1%;
  }

  .appointmenttimeman {
    width: 100px;
  }

  .appointmentoption {
    height: 30px;
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

  .ag-blue .ag-cell-focus {
    border: 0px solid #217346;
  }

  .el-dialog--small {
    width: 30%;
  }
</style>
