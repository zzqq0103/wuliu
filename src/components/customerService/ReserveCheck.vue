<template>
  <div>
    <h2 style="text-align: center">库存信息</h2>
    <p style="margin-top: 2%"></p>
    <div style="width: 100%">
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="出入库时间:">
            <el-form-item prop="startTime">
              <el-date-picker type="date" placeholder="选择开始日期" v-model="filterForm.startTime"
                              style="width: 150px"></el-date-picker>
            </el-form-item>
            <span>--&nbsp</span>
            <el-form-item prop="endTime">
              <el-date-picker type="date" placeholder="选择结束日期" v-model="filterForm.endTime"
                              style="width: 150px"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="入库类型:" style="float: right">
            <el-select v-model="filterForm.depotType" style="width: 100px">
              <el-option label="新货入库" value="newDepot"></el-option>
              <el-option label="长途入库" value="longDepot"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号:" style="float: right">
            <el-input v-model="filterForm.orderId" type="text" placeholder="请输入查找的订单号" style="width: 150px" @input="onQuickFilterChanged"></el-input>
          </el-form-item>
          <el-form-item label="订单号:" style="float: right">
            <el-input v-model="filterForm.loadingId" type="text" placeholder="请输入查找的装载单号" style="width: 150px" @input="onQuickFilterChanged"></el-input>
          </el-form-item>
          <el-form-item label="仓库站点:" style="float: right">
            <el-select v-model="filterForm.depotSite" placeholder="请选择仓库站点" style="width: 100px">
              <el-option label="南京" value="南京"></el-option>
              <el-option label="北京" value="北京"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    <div style="float: right">
      <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged()" style="width: 150px"></el-input>
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
      <el-button v-popover:popover1>设置</el-button>
      <el-button @click="drawGrid()">提取</el-button>
      <el-button>打印</el-button>
    </div>
    <div style="clear: both"></div>
    <div style="width: 100%; margin-top: 2%">
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
    </div>
</template>
<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
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
        visible: true,
        //    定义筛选条件
        filterForm: {
          startTime: '', // 开始时间
          endTime: '', // 截止时间
          depotType: 'newDepot', // 入库类型
          orderId: '', // 运单号
          loadingId: '', // 装载单号
          depotSite: '' // 仓库站点
        }
      }
    },
    components: {
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
