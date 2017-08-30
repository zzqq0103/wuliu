<template>
  <div>
    <div>
      <h2 style="text-align:center">订单列表</h2>
      <p style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <el-button @click="toOrderAdd">添加</el-button>
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
        :suppressCellSelection="true"
        :rowHeight=40 
        :headerHeight=30
        :pagination="true"
        :paginationPageSize="10"
        :suppressPaginationPanel="true"
        :filterChanged="gridfilterChange"
        :rowDoubleClicked="detailDoubleClick">
      </ag-grid-vue>
    </div>

    <!--分页-->
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
    </div>

    <!-- 列表显示弹窗 -->
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

    <!-- 订单详情弹窗 -->
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="orderList.orderId"></order-details>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import OrderDetails from '../financialAdministrator/ShowOrderDetails.vue'
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.orderList.push({
        'orderId': 'asasas' + i,
        'shipComp': '发货单位' + i,
        'shipNam': '发货人' + i,
        'receComp': '收货单位' + i,
        'receNam': '收货人' + i,
        'goodsNam': '货物名称' + i,
        'goodsNums': i,
        'goodsVolume': '货物体积' + i,
        'goodsWeight': '货物重量' + i
      })
    }
  },
  data () {
    return {
      orderList: [],
      colVisible: false,
      detailVisible: false,
      currentPage: 1,
      rules: {
      },
      rowCount: 0,
      pageSize: 10,
      formLabelWidth: '20%',
      gridOptions: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '订单ID', width: 150, field: 'orderId', filter: 'text', hide: false
          },
          {
            headerName: '发货单位', width: 150, field: 'shipComp', filter: 'text', hide: false
          },
          {
            headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false
          },
          {
            headerName: '收货单位', width: 150, field: 'receComp', filter: 'text', hide: false
          },
          {
            headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false
          },
          {
            headerName: '货物名称', field: 'goodsNam', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '件数', field: 'goodsNums', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '体积', field: 'goodsVolume', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '重量', field: 'goodsWeight', width: 150, filter: 'text', hide: false
          }
        ]
      }
    }
  },
  components: {
    OrderDetails,
    'ag-grid-vue': AgGridVue
  },
  methods: {
    // 订单详情弹框
    detailDoubleClick (event) {
      this.orderList.orderId = event.data.orderId
      this.detailVisible = true
    },
    createRowData () {
      this.gridOptions.rowData = this.orderList
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
    // 跳转到网点开单页面
    toOrderAdd () {
      this.$router.push('/orderAdd')
    },
    handleSizeChange (val) {
      this.gridOptions.api.paginationSetPageSize(Number(val))
    },
    handleCurrnetChange (val) {
      this.gridOptions.api.paginationGoToPage(val - 1)
    },
    gridfilterChange () {
      this.calculateGrid()
    },
    // 设置分页组件数据总数
    calculateGrid () {
      this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
      this.rowCount = this.gridOptions.api.getModel().getRowCount()
    }
  },
  beforeMount () {
    this.createRowData()
  },
  mounted () {
    this.changeColumnDefsBoolen()
    this.calculateGrid()
  }
}
</script>