<template>
  <div>
    <div>
      <h2 style="text-align:center;margin: 10px">大车毛利</h2>
      <!--表格上方操作区域-->
      <div>
        <!--第一行-->
        <div>
          <el-form v-model="filterForm" ref="filterForm" :inline="true">
            <div style="float: right">
              <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                <template v-for="(collist,i) in gridOptions.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"
                                 style="float: left;width: 180px">
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
            </div>
            <el-form-item label="订单时间:">
              <el-date-picker v-model="filterForm.dateInterval" type="daterange" placeholder="选择日期范围"
                              :picker-options="pickerOptions" range-separator='/' style="width: 200px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="区间:">
              <el-select v-model="filterForm.startPoint" placeholder="起点" style="width: 80px">
                <el-option label="北京" value="beijing"></el-option>
                <el-option label="南京" value="nanjing"></el-option>
                <el-option label="全部" value="all"></el-option>
              </el-select>
              <span>--&nbsp</span>
              <el-select v-model="filterForm.endPoint" placeholder="终点" style="width: 80px">
                <el-option label="北京" value="beijing"></el-option>
                <el-option label="南京" value="nanjing"></el-option>
                <el-option label="全部" value="all"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="装载单ID:">
              <el-input v-model="filterForm.loadingId" style="width: 80px"></el-input>
            </el-form-item>
            <el-button @click="search">搜索</el-button>
            <!--<el-button @click="setting">设置</el-button>-->
          </el-form>

        </div>
        <!--第二行-->
        <div>
          <el-form style="float: left" :model="totalForm" ref="totalForm" :inline="true">
            <el-form-item label="大车毛利合计:">
              <el-input readonly="readonly" v-model="totalGrossCarProfit" style='width:100px'></el-input>

            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div style="clear: both;">
    </div>
    <div>
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

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
          <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">
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
  import PartialMatchFilterComponent from '../../common/PartialMatchFilterComponent'

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
          dateInterval: '', // 时间间隔
          startPoint: '', //  区间起点
          endPoint: '', //  区间终点
          loadingId: '', // 装载单ID
          pageNum: 1, // 当前页码数
          pageSize: 20 // 分页大小
        },
        totalGrossCarProfit: 0,
        grossProfitList: [],
        colVisible: false,
        detailVisible: false,
        currentPage: 1,
        rules: {},
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
              headerName: '装载单ID', width: 150, field: 'loadingId', suppressmenu: true, hide: false, visible: true
            },
            {
              headerName: '发车时间',
              width: 200,
              field: 'departTim',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '到达时间',
              width: 200,
              field: 'arrTim',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '司机姓名',
              width: 150,
              field: 'driverNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '司机联系方式',
              width: 150,
              field: 'driverTel',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '车牌号',
              field: 'licePlateNum',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '起始站',
              field: 'startPoint',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '终点站',
              field: 'endPoint',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '调度员',
              field: 'dispatAdmiNam',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总运费',
              field: 'totalFreight',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总返款',
              field: 'totalRefund',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '大车费',
              field: 'feeMoney',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总中转费',
              field: 'totalChanFee',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总提送费',
              field: 'totalPickUpFee',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '大车总毛利',
              field: 'grossCarProfit',
              width: 150,
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            }
          ]
        },
        // 设置日期选择器的条件
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
      'ag-grid-vue': AgGridVue
    },
    methods: {
      search () {
        this.createRowData()
        this.calculateMoney
      },
      createRowData () {
        this.gridOptions.rowData = this.grossProfitList
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
//    beforeMount () {
//      this.createRowData()
//    },
    mounted () {
//      this.changeColumnDefsBoolen()
      this.calculateGrid()
    },
    // 数据发生更新时
    updated () {
      console.log('update')
      this.calculateMoney
    }
  }
</script>
