<template>
  <div>
    <div>
      <h2 style="text-align: center">价格梯度信息管理</h2>

      <div style="float: right">
        <el-button>设置</el-button>
        <el-button>添加</el-button>
      </div>
      <div style="clear: both"></div>
    </div>

    <div>
      <ag-grid-vue style="width: 100%;height:350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :rowHeight=40
                   :headerHeight=30>
      </ag-grid-vue>
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
        vehicleVisible: false,
        vehicleDelVisable: false,
        vehicleForm: {
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
              headerName: '车牌号码', width: 150, field: 'licePlateNum', filter: 'text', hide: false
            },
            {
              headerName: '司机姓名', width: 150, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '联系电话', width: 150, field: 'tel', filter: 'text', hide: false
            },
            {
              headerName: '合同号', width: 150, field: 'contractID', filter: 'text', hide: false
            },
            {
              headerName: '合同价格', width: 150, field: 'contractPrice', filter: 'text', hide: false
            },
            {
              headerName: '车容量', width: 150, field: 'capacity', filter: 'text', hide: false
            },
            {
              headerName: '吨位', width: 150, field: 'tonnage', filter: 'text', hide: false
            },
            {
              headerName: '车辆类型', width: 150, field: 'carType', filter: 'text', hide: false
            },
            {
              headerName: '车辆接送区域', width: 150, field: 'pickUpArea', filter: 'text', hide: false
            },
            {
              headerName: '司机状态', width: 150, field: 'receState', filter: 'text', hide: false
            },
            {
              headerName: '车辆状态', width: 150, field: 'carState', filter: 'text', hide: false
            },
            {
              headerName: '车辆位置', width: 150, field: 'carPosition', filter: 'text', hide: false
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
            this.params.context.componentParent.vehicleDelVisable = true
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
            vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.vehicleVisable = true
            this.params.context.componentParent.vehicleForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.vehicleInfo.list
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
