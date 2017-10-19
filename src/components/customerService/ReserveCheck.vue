<template>
  <div>
    <h2 style="text-align: center">库存信息</h2>
    <p style="margin-top: 2%"></p>
    <div style="width: 100%">
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <div>
            <el-form-item label="开单时间：">
              <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                              :picker-options="pickerOptions" style='width:200px' range-separator='/'>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单号：">
              <el-input  v-model="filterForm.orderId" placeholder="输入订单号" style='width:150px'></el-input>
            </el-form-item>
            <el-form-item label="开单网点：">
              <el-select v-model="filterForm.depotSite" placeholder="请选择仓库站点" style="width: 100px">
                <el-option label="南京" value="南京"></el-option>
                <el-option label="北京" value="北京"></el-option>
                <el-option label="南京" value="苏州"></el-option>
              </el-select>
            </el-form-item>
          </div>
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
            <el-button @click="visibleChoice(1,'grid1')" size="small">全选</el-button>
            <el-button @click="visibleChoice(2,'grid1')" size="small">全不选</el-button>
          </div>
        </template>
      </el-popover>
      <el-button style="top: 140px;position: absolute;right: 270px;" @click="changeVer()">入 库</el-button>
      <el-button @click="drawGrid(1)" style="position: absolute;right: 190px;top: 140px">提 取</el-button>
      <el-button style="top: 140px;position: absolute;right: 30px;">导 出</el-button>
      <el-button v-popover:popover1 style="position: absolute; right: 110px;top:140px">设 置</el-button>
    </div>
    <div style="clear: both"></div>
    <div style="width: 100%; margin-top: 50px;top: 200px">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

                   :rowDoubleClicked="leftDoubleClick"
                   :animateRows="true"
                   rowSelection="multiple"
      ></ag-grid-vue>
    </div>

    <!--入库界面-->
    <el-dialog title="订单长途入库" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="filterForm2" ref="filterForm" :inline="true">
            <div>
              <el-form-item label="开单时间：">
                <el-date-picker v-model="filterForm2.startTime" type="daterange" placeholder="选择日期范围"
                                :picker-options="pickerOptions" style='width:200px' range-separator='/'>
                </el-date-picker>
              </el-form-item>
              <el-form-item label="订单号：">
                <el-input  v-model="filterForm2.orderId" placeholder="输入订单号" style='width:150px'></el-input>
              </el-form-item>
              <el-form-item label="开单网点：" style="position: absolute;z-index:99999;">
                <el-select v-model="filterForm2.depotSite" placeholder="请选择仓库站点" style="width: 100px">
                  <el-option label="南京" value="南京"></el-option>
                  <el-option label="北京" value="北京"></el-option>
                  <el-option label="南京" value="苏州"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <div style="float: right">
                <el-button @click="drawGrid(2)">提取库存</el-button>
                <!--<el-button @click="colVisible2 = true">设置</el-button>-->
                <el-popover ref="popover2" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                  <template v-for="(collist,i) in gridOptions2.columnDefs">
                    <div class="colVisible">
                      <el-checkbox v-model="collist.visible"
                                   @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)"
                                   style="float: left;width: 180px">
                        {{collist.headerName}}
                      </el-checkbox>
                    </div>
                  </template>
                  <template>
                    <div class="colVisible">
                      <el-button @click="visibleChoice(1,'grid2')" size="small">全选</el-button>
                      <el-button @click="visibleChoice(2,'grid2')" size="small">全不选</el-button>
                    </div>
                  </template>
                </el-popover>
                <el-button v-popover:popover2>设置</el-button>
              </div>
              <el-form-item>
                <el-button style="visibility: hidden"></el-button>
              </el-form-item>
            </div>
          </el-form>
          <div style="float: right">
            <el-button @click="leftSelect"> > </el-button>
            <el-button @click="leftSelectAll"> >> </el-button>
          </div>
          <el-input style="visibility: hidden;width: 200px"></el-input>
          <!--未核销处表格-->
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 550px" class="ag-blue"
                         :gridOptions="gridOptions2"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
                         :headerHeight=40

                         :rowDoubleClicked="leftDoubleClick"
                         :animateRows="true"
                         rowSelection="multiple"
            ></ag-grid-vue>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form>
            <el-form-item>
              <el-button style="visibility: hidden"></el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="confirmSubmit(1)">确认入库</el-button>
              <el-button @click="confirmSubmit(0)">入库异常</el-button>
              <!--<el-button @click="colVisible3 = true">设置</el-button>-->
              <el-popover ref="popover3" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                <template v-for="(collist,i) in gridOptions3.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)"
                                 style="float: left;width: 180px">
                      {{collist.headerName}}
                    </el-checkbox>
                  </div>
                </template>
                <template>
                  <div class="colVisible">
                    <el-button @click="visibleChoice(1,'grid3')" size="small">全选</el-button>
                    <el-button @click="visibleChoice(2,'grid3')" size="small">全不选</el-button>
                  </div>
                </template>
              </el-popover>
              <el-button v-popover:popover3>设置</el-button>
            </el-form-item>
          </el-form>
          <el-button @click="rightSelect"> < </el-button>
          <el-button @click="rightSelectAll"> << </el-button>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged3" style="width: 200px"></el-input>
          <!--待核销处表格-->
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 550px" class="ag-blue"
                         :gridOptions="gridOptions3"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
                         :headerHeight=40

                         :rowDoubleClicked="rightDoubleClick"
                         :animateRows="true"
                         rowSelection="multiple"
            ></ag-grid-vue>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="verVisible = false">取 消</el-button>
      </div>
    </el-dialog>

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
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  export default {
    data () {
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单编号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '子键号', width: 150, field: 'subId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货方电话', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货方电话', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '重量', width: 150, field: 'cargoWeight', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '体积', width: 150, field: 'cargoVolume', filter: 'text', hide: false, visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        gridOptions2: {
          rowData: [],
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单编号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '子键号', width: 150, field: 'subId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货方电话', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货方电话', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '重量', width: 150, field: 'cargoWeight', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '体积', width: 150, field: 'cargoVolume', filter: 'text', hide: false, visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        gridOptions3: {
          rowData: [],
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单编号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '子键号', width: 150, field: 'subId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货方电话', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货方电话', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '重量', width: 150, field: 'cargoWeight', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '体积', width: 150, field: 'cargoVolume', filter: 'text', hide: false, visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        rules: {},
        verVisible: true,
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
          orderId: '', // 订单号
          startTime: [], // 下单时间区域 startTime[0]为起，startTime[1]终
          depotSite: ''
        },
        filterForm2: {
          orderId: '', // 订单号
          startTime: [], // 下单时间区域 startTime[0]为起，startTime[1]终
          depotSite: ''
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
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<el-button class="del-but" type="info" style="margin-left:20px" size="small" @click="addError">编辑大车异常</el-button>',
        methods: {
          addError () {
            let self = this.params.context.componentParent
            self.errorEditVisable = true
            self.errorForm = {
              'licePlateNum': '',
              'loadingId': '',
              'unActExpense': '',
              'unActTim': new Date(),
              'unActDes': '',
              'serviceNam': '弓莉'
            }
            self.errorForm.loadingId = this.params.data.loadingId
            self.errorForm.licePlateNum = this.params.data.licePlateNum
          }
        }
      }

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
      setting () {
        this.colVisible = true
      },
      // 更新列数据
      updateGrid () {
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
      },
      // 绘制表格，包括更新列信息与行信息
      drawGrid (i) {
        if (i === 2) {
          this.gridOptions3.api.selectAll()
          this.delChoose(this.gridOptions3.api.getSelectedRows())
        }
        this.createRowData(i)
        this.calculateGrid()
      },
      // 获取行数据
      createRowData (i) {
        if (i === 1) {
          console.log(this.filterForm1)
          this.gridOptions.rowData = testJson.freight.list
          this.gridOptions.api.setRowData(this.gridOptions.rowData)
        } else if (i === 2) {
          console.log(this.filterForm2)
          this.gridOptions2.rowData = testJson.freight.list
          this.gridOptions2.api.setRowData(this.gridOptions2.rowData)
        }
      },
      // 切换列的可见性，三个表格，三个参数j
      updateColumnDefsVisible (j, collist) {
        if (j === 1) {
          for (let i = 0; i < collist.length; i++) {
            this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
          }
        } else if (j === 2) {
          for (let i = 0; i < collist.length; i++) {
            this.gridOptions2.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
          }
        } else if (j === 3) {
          for (let i = 0; i < collist.length; i++) {
            this.gridOptions3.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
          }
        }
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
      visibleChoice (i, gridnum) {
        let gridCol
        let num
        if (gridnum === 'grid1') {
          gridCol = this.gridOptions
          num = 1
        } else if (gridnum === 'grid2') {
          gridCol = this.gridOptions2
          num = 2
        } else if (gridnum === 'grid3') {
          gridCol = this.gridOptions3
          num = 3
        }
        if (i === 1) {
          for (let j = 0; j < gridCol.columnDefs.length; j++) {
            gridCol.columnDefs[j].visible = true
          }
        } else if (i === 2) {
          for (let j = 0; j < gridCol.columnDefs.length; j++) {
            gridCol.columnDefs[j].visible = false
          }
        }
        this.updateColumnDefsVisible(num, gridCol.columnDefs)
      },
      onQuickFilterChanged3 (input) {
        this.gridOptions3.api.setQuickFilter(input)
      },
//      入库表格操作
      // 核销界面左侧表格双击时间
      leftDoubleClick (event) {
        // this.leftSelect(event.data)
        this.filterForm2.orderId = event.data.orderId
        this.detailVisible = true
      },
      // 核销界面右侧表格双击时间
      rightDoubleClick (event) {
        this.rightSelect(event.data)
      },
      // 核销界面左侧表格多选切换至右侧
      leftSelect () {
        const selectedData = this.gridOptions2.api.getSelectedRows()
        this.addChoose(selectedData)
      },
      // 核销界面左侧表格全选切换至右侧
      leftSelectAll () {
        this.gridOptions2.api.selectAllFiltered()
        const selectedData = this.gridOptions2.api.getSelectedRows()
        this.addChoose(selectedData)
      },
      // 核销界面右侧表格多选切换至左侧
      rightSelect () {
        const selectedData = this.gridOptions3.api.getSelectedRows()
        this.delChoose(selectedData)
      },
      // 核销界面右侧表格全选切换至左侧
      rightSelectAll () {
        this.gridOptions3.api.selectAllFiltered()
        const selectedData = this.gridOptions3.api.getSelectedRows()
        this.delChoose(selectedData)
      },
      // 核销界面右侧添加行数据，左侧删除行数据
      addChoose (newItems) {
        this.gridOptions3.api.updateRowData({add: newItems})
        this.gridOptions2.api.updateRowData({remove: newItems})
      },
      // 核销界面左侧添加行数据，右侧删除行数据
      delChoose (newItems) {
        this.gridOptions2.api.updateRowData({add: newItems})
        this.gridOptions3.api.updateRowData({remove: newItems})
      },
      changeVer () {
        this.verVisible = true
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
