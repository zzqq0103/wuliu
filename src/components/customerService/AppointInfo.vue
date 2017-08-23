<template>
    <div>
        <div>
            <h2 style="text-align:center">预约单详情</h2>
            <p style="margin-top:1%;float:left" class="appointment">
                <el-h5 class="appointmenttime">预约时间</el-h5>
                <el-input type="text" class="appointmenttimes" placeholder="开始时间"></el-input>
                <el-h5 class="appointmenttimes">到</el-h5>
                <el-input type="text" class="appointmenttimes" placeholder="结束时间"></el-input>
                <el-h5 class="appointmenttimes">始发站：</el-h5>
                <select class="appointmentoption">
                    <option>北 京</option>
                    <option>南 京</option>
                </select>
                <el-h5 class="appointmenttimes">发货方：</el-h5>
                <el-input class="appointmenttimes"></el-input>
                <el-h5 class="appointmenttimes">预约单号：</el-h5>
                <el-input class="appointmenttimes"></el-input>
                <el-h5 class="appointmenttimes">预约单状态：</el-h5>
                <select class="appointmentoption">
                    <option>待生成</option>
                    <option>已生成</option>
                </select>
            </p>
            <p style="margin-top:1%;float:right;margin-right:5%">
                <el-button>查找</el-button>
                <el-button>打印</el-button>
                <el-button>导出</el-button>
            </p>
        </div>
        <div style="clear: both;">
        </div>
        <div style="margin-top:2%">
            <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue" :gridOptions="gridOptions" :suppressMovableColumns="true" :enableColResize="true" :enableSorting="true" :enableFilter="true" :groupHeaders="true" :rowHeight="40" :headerHeight="30"></ag-grid-vue>
        </div>
    </div>
</template>
<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  export default {
    data () {
      return {
        colVisible: false,
        enterpriseVisable: false,
        enterpriseDelVisable: false,
        enterpriseForm: {
          'licePlateNum': '',
          'driverName': '',
          'tel': '',
          'capacity': '',
          'carType': '',
          'pickUpArea': '',
          'carPosition': ''
        },
        rules: {
        },
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '公司名称', width: 150, field: 'licePlateNum', filter: 'text', hide: false
            },
            {
              headerName: '中转起始点', width: 120, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '中转目的地', width: 120, field: 'tel', filter: 'text', hide: false
            },
            {
              headerName: '联系人', width: 150, field: 'contractID', filter: 'text', hide: false
            },
            {
              headerName: '联系方式', width: 150, field: 'contractPrice', filter: 'text', hide: false
            },
            {
              headerName: '合同号', width: 150, field: 'capacity', filter: 'text', hide: false
            },
            {
              headerName: '合同价格', width: 100, field: 'tonnage', filter: 'text', hide: false
            },
            {
              headerName: '操作', field: 'value', width: 150, cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><button class="del-but" @click="vehicleDel">删 除</button><button class="del-but" @click="vehicleEdit">编 辑</button></span>',
        methods: {
          vehicleDel () {
            this.params.context.componentParent.enterpriseDelVisable = true
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
            vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.enterpriseVisable = true
            this.params.context.componentParent.enterpriseForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.vehicleInfo.list
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

.appointmentoption {
    height: 30px;
}
</style>
