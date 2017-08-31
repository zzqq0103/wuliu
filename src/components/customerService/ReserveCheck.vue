<template>
  <div>
    <h2 style="text-align: center">库存信息</h2>
    <p style="margin-top: 2%"></p>
    <div style="width: 100%">
      <el-row>
        <div style="float: left;margin-right: 20px">
          <lable class="demonstration">入库时间：</lable>
          <el-date-picker
            v-model="filterForm.inDepotTim"
            type="datetime"
            style="width: 150px"
          >
          </el-date-picker>
        </div>
        <div style="float: left;margin-right: 20px">
          <lable class="demonstration">出库时间：</lable>
          <el-date-picker
            v-model="filterForm.outDepotTim"
            type="datetime"
            style="width: 150px"
          >
          </el-date-picker>
        </div>
        <div style="float: left">
          <label>入库类型：</label>
          <el-select v-model="filterForm.depotType" placeholder="请选择入库方式" @change="drawGrid()" style="width: 100px">
            <el-option label="新货入库" value="newDepot"></el-option>
            <el-option label="长途入库" value="longDepot"></el-option>
          </el-select>
        </div>

        <div style="float: right">
          <label>仓库站点：</label>
          <el-select v-model="value1" placeholder="请选择送货方式" style="width:100px">
            <el-option
              style="width: 100px"
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float: right;margin-right: 20px">
          <label>转载单号：</label>
          <el-input type="text" placeholder="请输入搜索内容" style="width: 150px"></el-input>
        </div>
        <div style="float: right;margin-right: 20px">
          <label>订单号：</label>
          <el-input type="text" placeholder="请输入搜索内容" style="width: 150px"></el-input>
          </label>
        </div>
      </el-row>
      <el-row>
        <div style="float: right;display: block;margin-top: 1%">
          <el-button @click="setting">设置</el-button>
          <el-button>查找</el-button>
          <el-button>打印</el-button>
        </div>
      </el-row>
    </div>
    <div style="width: 100%; margin-top: 2%">
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
      ></ag-grid-vue>
    </div>
    <!--列表切换显示-->
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false" top="30%">
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
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  export default {
    data () {
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
            {}
          ],
          context: {
            componentParent: this
          }
        },
        NewGridOptions: {
          columnDefs: [
            {
              headerName: '订单编号', width: 150, field: 'orderId', filter: 'text', hide: false
            },
            {
              headerName: '装载编号', width: 150, field: 'transId', filter: 'text', hide: false
            },
            {
              headerName: '入库时间', width: 150, field: 'inDepotTim', filter: 'text', hide: false
            },
            {
              headerName: '出库时间', width: 150, field: 'outDepotTim', filter: 'text', hide: false
            },
            {
              headerName: '发货方电话', width: 150, field: 'shipTel', filter: 'text', hide: false
            },
            {
              headerName: '收货方电话', width: 150, field: 'receTel', filter: 'text', hide: false
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filter: 'text', hide: false
            },
            {
              headerName: '重量', width: 150, field: 'cargoWeight', filter: 'text', hide: false
            },
            {
              headerName: '体积', width: 150, field: 'cargoVolume', filter: 'text', hide: false
            }
          ]
        },
        LongGridOptions: {
          columnDefs: [
            {
              headerName: '装载单号', width: 150, field: 'loadingId', filter: 'text', hide: false
            },
            {
              headerName: '是否已分配', width: 150, field: 'isAllocat', filter: 'text', hide: false
            },
            {
              headerName: '是否已确认', width: 150, field: 'isConfirm', filter: 'text', hide: false
            },
            {
              headerName: '起始站', width: 150, field: 'startStation', filter: 'text', hide: false
            },
            {
              headerName: '到达站', width: 150, field: 'arrStation', filter: 'text', hide: false
            },
            {
              headerName: '司机姓名', width: 150, field: 'driverNam', filter: 'text', hide: false
            },
            {
              headerName: '司机电话', width: 150, field: 'driverTel', filter: 'text', hide: false
            }
          ]
        },
        rules: {},
        colVisible: false,
        selectFormVisible: false,
        formLabelWidth: '150px',
//      //时间选择及地点选择
        options1: [{
          value: '南京',
          lable: 'nanjing'
        }, {
          value: '北京',
          lable: 'beijing'
        }],
        value1: '',
        //    定义筛选条件
        filterForm: {
          inDepotTim: '', // 开始时间
          outDepotTim: '', // 截止时间
          depotType: 'newDepot' // 入库类型
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue
    },
    methods: {
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
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
      // 更新列数据
      updateGrid () {
        const depotType = this.filterForm.depotType
//        const lenth = (this.gridOptions.columnDefs.length - 1)
        if (depotType === 'newDepot') {
          this.gridOptions.columnDefs = this.NewGridOptions.columnDefs
        } else if (depotType === 'longDepot') {
          this.gridOptions.columnDefs = this.LongGridOptions.columnDefs
        }
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
        console.log(this.gridOptions.columnDefs)
      },
      drawGrid () {
        this.updateGrid()
        this.createRowData()
      },
      createRowData () {
        this.gridOptions.rowData = testJson.freight.list
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
      }
    },
    beforeMount () {
//      this.createRowData()
      this.updateGrid()
    },
    mounted () {
      this.changeColumnDefsBoolen()
    }
  }
</script>
