<template>
  <div>
    <div>
      <h2 style="text-align:center">大车毛利</h2>
      <p style="margin-top:3%">
        <el-form v-model="filterForm" ref="filterForm">

         <span style='float:left;padding:0.6% 1% 0% 0%'>到达时间：</span>
          <el-form-item  prop="startTime" style='float:left;width:13%'>
              <el-date-picker type="datetime" placeholder="选择开始日期" v-model="filterForm.startTim"
                              style="width:100%"></el-date-picker>
          </el-form-item>
          <span style='float:left;padding:0.8% 0.8%'>--</span>
          <el-form-item prop="endTime" style='float:left;width:13%'>
              <el-date-picker type="datetime" placeholder="选择结束日期" v-model="filterForm.endTim"
                              style="width:100%"></el-date-picker>
          </el-form-item>
        </el-form>
        <span style='float:left;width:10%;padding:0.5% 0.5% 0% 3%'>大车毛利合计：</span>
        <el-input readonly="readonly" v-model="totalGrossCarProfit" style='float:left;width:10%'></el-input>
        <el-button @click="search" style='float:right'>搜索</el-button>
        <el-button @click="setting" style='float:right;margin-right:3%'>设置</el-button>
        <el-input type="text" placeholder="请输入搜索内容" style='float:right;width:15%;margin-right:3%' @input="onQuickFilterChanged"></el-input>
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
        :filterChanged="gridfilterChange">
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
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.grossProfitList.push({
        'loadingId': '装载单' + i,
        'departTim': '发车时间' + i,
        'arrTim': '到达时间' + i,
        'driverNam': '司机姓名' + i,
        'driverTel': '司机联系方式' + i,
        'licePlateNum': '车牌号' + i,
        'startPoint': '起始站' + i,
        'endPoint': '终点站' + i,
        'dispatAdmiNam': '调度员' + i,
        'totalFreight': i, // 总运费
        'totalRefund': i, // 总返款
        'feeMoney': i, // 大车费
        'totalChanFee': i, // 总中转费
        'totalPickUpFee': i, // 总提送费
        'grossCarProfit': i // 大车总毛利
      })
    }
  },
  data () {
    return {
      filterForm: {
        startTim: '',
        endTim: ''
      },
      totalGrossCarProfit: 0,
      grossProfitList: [],
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
            headerName: '装载单ID', width: 150, field: 'loadingId', filter: 'text', hide: false
          },
          {
            headerName: '发车时间', width: 150, field: 'departTim', filter: 'text', hide: false
          },
          {
            headerName: '到达时间', width: 150, field: 'arrTim', filter: 'text', hide: false
          },
          {
            headerName: '司机姓名', width: 150, field: 'driverNam', filter: 'text', hide: false
          },
          {
            headerName: '司机联系方式', width: 150, field: 'driverTel', filter: 'text', hide: false
          },
          {
            headerName: '车牌号', field: 'licePlateNum', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '起始站', field: 'startPoint', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '终点站', field: 'endPoint', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '调度员', field: 'dispatAdmiNam', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '总运费', field: 'totalFreight', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '总返款', field: 'totalRefund', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '大车费', field: 'feeMoney', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '总中转费', field: 'totalChanFee', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '总提送费', field: 'totalPickUpFee', width: 150, filter: 'text', hide: false
          },
          {
            headerName: '大车总毛利', field: 'grossCarProfit', width: 150, filter: 'text', hide: false
          }
        ]
      }
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  methods: {
    search () {
    },
    createRowData () {
      this.gridOptions.rowData = this.grossProfitList
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
  computed: {
    // 计算合计金额
    calculateMoney () {
      this.totalGrossCarProfit = 0
      let model = this.gridOptions.api.getModel()
      let arr = model.rootNode.childrenAfterFilter
      console.log(arr[0].data)
      for (let i = 0; i < arr.length; i++) {
        this.totalGrossCarProfit += arr[i].data.grossCarProfit
      }
    }
  },
  beforeMount () {
    this.createRowData()
  },
  mounted () {
    this.changeColumnDefsBoolen()
    this.calculateGrid()
  },
   // 数据发生更新时
  updated () {
    console.log('update')
    this.calculateMoney
  }
}
</script>