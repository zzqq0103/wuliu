<template>
  <div>
    <h2 style="text-align: center">库存信息</h2>
    <p style="margin-top: 2%"></p>
    <div style="width: 100%">
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="出入库时间:">
            <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入库类型:">
            <el-select v-model="filterForm.depotType" style="width: 100px">
              <el-option label="新货入库" value="newDepot"></el-option>
              <el-option label="长途入库" value="longDepot"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库站点:">
            <el-select v-model="filterForm.depotSite" placeholder="请选择仓库站点" style="width: 100px">
              <el-option label="南京" value="南京"></el-option>
              <el-option label="北京" value="北京"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装载单号:" style="position: absolute;top: 140px;left: 0px">
            <el-input v-model="filterForm.orderId" type="text" placeholder="请输入查找的订单号" style="width: 150px" @input="onQuickFilterChanged"></el-input>
          </el-form-item>
          <el-form-item label="订单号:" style="position: absolute;top: 140px;left: 244px">
            <el-input v-model="filterForm.loadingId" type="text" placeholder="请输入查找的装载单号" style="width: 150px" @input="onQuickFilterChanged"></el-input>
          </el-form-item>
        </el-form>
      </div>
    <div style="">
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
      <el-button @click="drawGrid()" style="position: absolute;left: 480px;top: 140px">提取</el-button>
      <el-button style="top: 140px;position: absolute;right: 30px;">导出</el-button>
      <el-button v-popover:popover1 style="position: absolute; right: 110px;top:140px">设置</el-button>
    </div>
    <div style="clear: both"></div>
    <div style="width: 100%; margin-top: 50px;top: 200px">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

                   :rowDoubleClicked="detailDoubleClick"
                   :pagination="true"
                   :paginationPageSize="10"
                   :suppressPaginationPanel="true"
                   :filterChanged="gridfilterChange"
      ></ag-grid-vue>
    </div>

    <!--分页-->
    <div style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrnetChange"
        :current-page="currentPage"
        :page-sizes="[20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount"></el-pagination>
    </div>
    <!--订单详情弹框-->
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="filterForm.orderId"></order-details>
    </el-dialog>
    </div>
</template>
<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  export default {
    data () {
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
          ],
          context: {
            componentParent: this
          }
        },
        NewGridOptions: {
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单编号', width: 150, field: 'orderId', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '装载编号', width: 150, field: 'transId', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '入库时间', width: 150, field: 'inDepotTim', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '出库时间', width: 150, field: 'outDepotTim', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '发货方电话', width: 150, field: 'shipTel', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '收货方电话', width: 150, field: 'receTel', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '重量', width: 150, field: 'cargoWeight', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '体积', width: 150, field: 'cargoVolume', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            }
          ]
        },
        LongGridOptions: {
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '装载单号', width: 150, field: 'loadingId', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '是否已分配', width: 150, field: 'isAllocat', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '是否已确认', width: 150, field: 'isConfirm', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '起始站', width: 150, field: 'startStation', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '到达站', width: 150, field: 'arrStation', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '司机姓名', width: 150, field: 'driverNam', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '司机电话', width: 150, field: 'driverTel', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            }
          ]
        },
        rules: {},
        colVisible: false,
        selectFormVisible: false,
        formLabelWidth: '150px',
        currentPage: 1,
        pageSize: 20,
        rowCount: 0,
        allChangeType: '',
        detailVisible: false, // 订单详情弹框
        visible: true,
        //    定义筛选条件
        filterForm: {
          startTime: '', // 开始时间
          endTime: '', // 截止时间
          depotType: 'newDepot', // 入库类型
          orderId: '', // 运单号
          loadingId: '', // 装载单号
          depotSite: '' // 仓库站点
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
      OrderDetails,
      'ag-grid-vue': AgGridVue
    },
    methods: {
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
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
      },
      drawGrid () {
        this.updateGrid()
        this.createRowData()
        this.calculateGrid()
//        this.changeColumnDefsBoolen()
//        console.log(this.gridOptions.columnDefs)
      },
      createRowData () {
        this.gridOptions.rowData = testJson.freight.list
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
      },
      // 分页的操作
      // 每页显示数量改变时
      handleSizeChange (val) {
        this.gridOptions.api.paginationSetPageSize(Number(val))
      },
      // 切换不同分页时
      handleCurrnetChange (val) {
        this.gridOptions.api.paginationGoToPage(val - 1)
      },
      // 发生筛选时，重新计算分页数量
      gridfilterChange () {
        this.calculateGrid()
      },
      // 计算总数据量
      calculateGrid () {
        this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
        let model = this.gridOptions.api.getModel()
        let processedRows = model.getRowCount()
//        let totalRows = this.gridOptions.rowData.length
//        console.log(totalRows, processedRows)
        this.rowCount = processedRows
//        console.log(model.getRowCount())
      },
      detailDoubleClick (event) {
        this.filterForm.orderId = event.data.orderId
        this.detailVisible = true
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
//      this.createRowData()
//      this.updateGrid()
    },
    mounted () {
      this.updateGrid()
      this.gridfilterChange()
    }
  }
</script>

 <!--//用户请求-->
<!--filterForm: {-->
<!--startTime: '', // 开始时间-->
<!--endTime: '', // 截止时间-->
<!--depotType: '', // 入库类型-->
<!--orderId: '', // 运单号-->
<!--loadingId: '', // 装载单号-->
<!--depotSite: '' // 仓库站点-->
<!--}-->
<!--//用户获得响应-->
<!--表1(新货入库)-->
<!--{-->
 <!--'订单编号' 'orderId'-->
<!--},-->
<!--{-->
 <!--'装载编号' 'transId'-->
<!--},-->
<!--{-->
<!--'入库时间' 'inDepotTim'-->
<!--},-->
<!--{-->
 <!--'出库时间' 'outDepotTim'-->
<!--},-->
<!--{-->
 <!--'发货方电话'  'shipTel'-->
<!--},-->
<!--{-->
<!--'收货方电话' 'receTel'-->
<!--},-->
<!--{-->
<!--'货物名称' 'goodsNam'-->
<!--},-->
<!--{-->
 <!--'件数 ''cargoPieces'-->
<!--},-->
<!--{-->
<!--'重量'  'cargoWeight',-->
<!--},-->
<!--{-->
 <!--'体积'  'cargoVolume'-->
<!--}-->
<!--表2(长途入库)-->
<!--{-->
<!--'装载单号' 'loadingId'-->
<!--},-->
<!--{-->
<!--'是否已分配' 'isAllocat'-->
<!--},-->
<!--{-->
<!--'是否已确认' 'isConfirm'-->
<!--},-->
<!--{-->
 <!--'起始站' 'startStation'-->
<!--},-->
<!--{-->
<!--'到达站' 'arrStation'-->
<!--},-->
<!--{-->
<!--'司机姓名' 'driverNam'-->
<!--},-->
<!--{-->
 <!--'司机电话' 'driverTel'-->
<!--}-->
