<template>
  <div>
    <div>
      <h2 style="text-align:center">运费异常</h2>
        <el-form v-model="filterForm" ref="filterForm1" style='margin-top:20px' :inline="true">
          <el-form-item label="发车时间：">
            <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input v-model="filterForm.orderId" placeholder="输入订单号" style="width: 150px"></el-input>
          </el-form-item>
          <!-- 设置列 -->
          <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
            <template v-for="(collist,i) in gridOptions.columnDefs">
              <div class="colVisible">
                <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)"
                              style="float: left;width: 180px">
                  {{collist.headerName}}
                </el-checkbox>
              </div>
            </template>
            <template>
              <div class="colVisible">
                <el-button @click="visibleChoice(1,'grid1')" size="small">全选</el-button>
                <el-button @click="visibleChoice(2,'grid1')" size="small">全不选</el-button>
              </div>
            </template>
          </el-popover>
          <el-button v-popover:popover1 style='margin-left:10px;float:right'>设 置</el-button>
          <el-button style='float:right'>导 出</el-button>
          <el-button @click="drawGrid(1)" style='float:right'>提 取</el-button>
       </el-form>
    </div>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

                   :rowDoubleClicked="detailDoubleClick"
                   :pagination="true"
                   :paginationPageSize="20"
                   :suppressPaginationPanel="true">
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

    <!-- 增加/编辑成功弹窗 -->
    <el-dialog title="" :visible.sync="successVisable" size="" tiny>
      <h2 style="padding:30px">异动信息提交成功！</h2>
    </el-dialog>

  </div>
</template>
<script>
  import { AgGridVue } from 'ag-grid-vue'
  export default {
    created () {
      for (var i = 0; i < 50; i++) {
        this.unActList.push({
          'orderID': i,
          'orderTim': '开单时间' + i,
          'unActExpense': '异动支出' + i,
          'unActIncome': '异动收入' + i,
          'unActTim': '异动时间' + i,
          'unActDes': '异动说明' + i,
          'serviceNam': '处理客服' + i
        })
      }
    },
    data () {
      return {
        unActList: [],
        colVisible: false,
        addEditVisable: false,
        delVisable: false,
        successVisable: false,
        filterForm: {
          orderId: '',
          startTime: '',
          endTime: ''
        },
        unActForm: {
          'orderID': '',
          'unActExpense': '',
          'unActIncome': '',
          'unActTim': '',
          'unActDes': '',
          'serviceNam': '',
          'orderTim': ''
        },
        rules: {},
        rowCount: 0,
        pageSize: 10,
        formLabelWidth: '20%',
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
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '订单ID', width: 150, field: 'orderID', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单时间', width: 150, field: 'orderTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动支出', width: 150, field: 'unActExpense', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动收入', width: 150, field: 'unActIncome', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动时间', width: 150, field: 'unActTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动描述', width: 150, field: 'unActDes', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '客服名称', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue
    },
    methods: {
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
      },
      createRowData () {
        this.gridOptions.rowData = this.unActList
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
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
      },
      // 绘制表格
      drawGrid () {
        this.updateGrid()
        this.createRowData()
        this.calculateGrid()
      },
      updateGrid () {
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
      }
    },
    beforeMount () {
      // this.createRowData()
    },
    mounted () {
      // this.changeColumnDefsBoolen()
      this.calculateGrid()
    }
  }
</script>
<style>
  .el-select-css {
    width: 50%;
  }
</style>
