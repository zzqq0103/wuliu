<template>
  <div>
    <div>
      <h2 style="text-align:center">查看预约单信息</h2>
      <p style="margin-top:1%;float:left" class="appointment">
        <el-h5 class="appointmenttime">预约时间</el-h5>
        <el-date-picker type="datetime" class="appointmenttimes" placeholder="开始时间" v-model="filterForm.startTime"
                        style="width: 120px"></el-date-picker>
        <el-h5 class="appointmenttimes">到</el-h5>
        <el-date-picker type="datetime" class="appointmenttimes" placeholder="结束时间" v-model="filterForm.endTime"
                        style="width: 120px"></el-date-picker>
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
      </p>
      <p style="margin-top:1%;float:right;margin-right:5%">
        <el-button>查找</el-button>
        <el-button @click="setting">设置</el-button>
        <el-button>导出</el-button>
      </p>
    </div>
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
                   :groupHeaders="true" :rowHeight="40" :headerHeight="30">
      </ag-grid-vue>
    </div>
    <div>
      <p style="margin-top:1%;float:right;margin-right:5%;width:50%">
        <el-button style="margin-right:6%">提 交 更 改</el-button>
      </p>
    </div>
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
              headerName: '预约单号', width: 100, field: 'Reservationnumber', filter: 'text', hide: false
            },
            {
              headerName: '下单时间', width: 120, field: 'ordertime', filter: 'text', hide: false
            },
            {
              headerName: '发货单位', width: 120, field: 'forwardingunit', filter: 'text', hide: false
            },
            {
              headerName: '发货人', width: 80, field: 'consignershipper', filter: 'text', hide: false
            },
            {
              headerName: '发货电话', width: 150, field: 'deliveryphone', filter: 'text', hide: false
            },
            {
              headerName: '收货单位', width: 150, field: 'consignee', filter: 'text', hide: false
            },
            {
              headerName: '收货人', width: 80, field: 'consigneeman', filter: 'text', hide: false
            },
            {
              headerName: '收货电话', width: 100, field: 'Receivingphone', filter: 'text', hide: false
            },
            {
              headerName: '接货司机', width: 100, field: 'driverreceiving', filter: 'text', hide: false
            },
            {
              headerName: '接货状态', width: 100, field: 'receivingstate', filter: 'text', hide: false
            },
            {
              headerName: '取消预约单', field: 'value', width: 100, cellRendererFramework: 'receivingstate', hide: false
            },
            {
              headerName: '操作', field: 'value', width: 80, cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
//        template: '<el-span><el-button class="del-but" @click="vehicleDel">删 除</el-button><el-button class="del-but" @click="vehicleEdit">编 辑</el-button></el-span>',
        template: '<el-span><el-button  class="del-but" @click="particulars()"> 详 情 </el-button></el-span>',
        methods: {
          particulars () {
            this.params.context.componentParent.detailsVisable = true
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
        template: '<el-select v-model="appointlnfoForm.Selectsites"  placeholder="选择" class="appointmentoption col-1" style="width:110px"> <el-option key="yes" label=" 是 " value="yes"></el-option><el-option key="yes" label=" 否 " value="no"></el-option></el-select>',
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
      setting () {
        this.colVisible = true
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
      },
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
  .del-but {
    cursor: pointer;
    /*float: inherit;*/
    margin-right: 10px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid rgb(191, 217, 216);
    color: rgb(31, 61, 60);
    padding: 5px 10px;
    font-size: 10px;
    text-align: center;
  }

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
</style>
