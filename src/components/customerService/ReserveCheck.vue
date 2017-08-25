<template>
  <div>
    <h2 style="text-align: center">库存信息git</h2>
    <p style="margin-top: 2%"></p>
    <div style="width: 100%">
      <el-row>
        <div style="float: left;margin-right: 20px">
          <lable class="demonstration">入库时间：</lable>
          <el-date-picker id="inTime" @change="getTimein"
            v-model="inTime"
            type="datetime"
          >
          </el-date-picker>
        </div>
        <div style="float: left">
          <lable class="demonstration">出库时间：</lable>
          <el-date-picker
            v-model="outTime"
            type="datetime"
          >
          </el-date-picker>
        </div>
        <div style="float: right">
          <label>仓库站点：</label>
          <el-select v-model="value1" placeholder="请选择送货方式">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float: right;margin-right: 20px">
          <label>转载单号：</label>
          <el-input type="text" placeholder="请输入搜索内容" style="width: auto"></el-input>
        </div>
        <div style="float: right;margin-right: 20px">
          <label>订单号：</label>
          <el-input type="text" placeholder="请输入搜索内容" style="width: auto"></el-input>
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
            {
              headerName: '订单编号', width: 150, field: 'orderId', filter: 'text', hide: false
            },
            {
              headerName: '装载编号', width: 150, field: 'transId', filter: 'text', hide: false
            },
            {
              headerName: '入库时间', width: 150, field: 'inTime', filter: 'text', hide: false
            },
            {
              headerName: '出库时间', width: 150, field: 'outTime', filter: 'text', hide: false
            },
            {
              headerName: '发货方电话', width: 150, field: 'telDeparture', filter: 'text', hide: false
            },
            {
              headerName: '收货方电话', width: 150, field: 'telReceiving', filter: 'text', hide: false
            },
            {
              headerName: '货物名称', width: 150, field: 'cargoName', filter: 'text', hide: false
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
          ],
          context: {
            componentParent: this
          }
        },
        rules: {},
        colVisible: false,
        selectFormVisible: false,
        formLabelWidth: '150px',
//      //时间选择及地点选择
        inTime: '',
        outTime: '',
        options1: [{
          value: '南京',
          lable: 'nanjing'
        }, {
          value: '北京',
          lable: 'beijing'
        }],
        value1: ''
      }
    },
    components: {
      'ag-grid-vue': AgGridVue
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.stockInfo.list
      },
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
      getTimein () {
        console.log(this.inTime)
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
