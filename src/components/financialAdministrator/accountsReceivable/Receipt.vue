<template>
  <div>
    <div style="text-align: center;margin:10px">
      <h2>回单押款详情</h2>
    </div>
    <!--表格筛选区域-->
    <div>
      <!--第一行右侧按钮-->
      <div style="float: right">
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
        <el-button v-popover:popover1>设置</el-button>
        <el-button>导出</el-button>
      </div>
      <!--第一行左侧按钮-->
      <div>
        <el-form :model="filterForm" ref="filterForm" :inline="true">
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
          <el-form-item label="核销状态:">
            <el-select v-model="filterForm.veriState" style="width: 100px">
              <el-option label="未核销" value="uncompleted"></el-option>
              <el-option label="已核销" value="completed"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="drawGrid(1)">提取</el-button>
        </el-form>
      </div>
      <!--第二行开始-->
      <div style="float: right">
        <el-button @click="verification">开始核销</el-button>
      </div>
      <!--回单押款合计-->
      <el-form :model="totalForm" ref="totalForm" :inline="true">
        <el-form-item label="回单押款合计:">
          <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
        </el-form-item>
      </el-form>

    </div>

    <div style="clear: both;"></div>
    <!--表格-->
    <div style="margin-top: 1%">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
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
    <div style="text-align: center;margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrnetChange"
        :current-page="currentPage"
        :page-sizes="[20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount"></el-pagination>
    </div>
    <!-- 回单核销界面 -->


    <!--
    --核销界面
    -->
    <el-dialog :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <h2 style='text-align:center;margin-top:-2%'>回单押款核销</h2>
      <el-row :gutter="20" style="margin-top: 2%">
        <el-col :span="12">
          <el-form :model="filterForm" ref="filterForm" :inline="true">
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
              <el-form-item label="运单号:">
                <el-input v-model="filterForm.orderId" style="width: 150px"></el-input>
              </el-form-item>
              <el-form-item label="发货方:">
                <el-input v-model="filterForm.shipNam" style="width: 100px"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <el-button style="visibility: hidden">不可见的按钮（用于添加一个空行）</el-button>
          <div style="float: right">
            <el-button @click="leftSelect"> > </el-button>
            <el-button @click="leftSelectAll"> >> </el-button>
          </div>
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
              <el-button @click="confirmSubmit">确认核销</el-button>
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

                         :gridReady="grid3Ready"
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

    <!--确认核销弹框，选择支付方式与填写摘要-->
    <el-dialog title="确认核销" :visible.sync="confirmSubVisible" size="tiny" :closeOnClickModal="false">
      <el-form :model="confirmSubForm" ref="confirmSubForm" labelWidth="20%">
        <el-form-item label="支付方式">
          <el-select v-model="confirmSubForm.payMode" placeholder="支付方式" style="width: 110px">
            <el-option label="微信" value="WeChat"></el-option>
            <el-option label="支付宝" value="Alipay"></el-option>
            <el-option label="转账" value="transfer "></el-option>
            <el-option label="现金" value="cash"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="confirmSubForm.digest" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmSubVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!--警告弹窗-->
    <el-dialog title="错误" :visible.sync="errorVisible" size="tiny">
      <p>未发现需要核销的内容</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--订单详情弹框-->
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="filterForm.orderId"></order-details>
    </el-dialog>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import OrderDetails from '../ShowOrderDetails'
  import PartialMatchFilterComponent from '../../common/PartialMatchFilterComponent'
  export default {
    created () {
      for (let i = 0; i < 100; i++) {
        this.testData1.push({
          'orderId': '运单号' + i,
          'orderState': '运单状态' + i,
          'billBranch': '开单网点' + i,
          'orderTim': '开单日期' + i,
          'startStation': '发站' + i,
          'arrStation': '到站' + i,
          'shipNam': '发货人' + i,
          'shipTel': '发货人联系方式' + i,
          'receNam': '收货人' + i,
          'receTel': '收货人联系方式' + i,
          'serviceNam': '开单客服' + i,
          'changeFee': i,
          'receMoney': i,
          'veriNam': '核销人' + i,
          'veriTim': '核销日期' + i,
          'veriSite': '核销网点' + i,
          'payMode': '支付方式' + i,
          'receState': '回单状态' + i,
          'receNums': '回单份数' + i
        })
        this.testData2.push({
          'orderId': '运单号' + i,
          'orderState': '运单状态' + i,
          'shipNam': '发货人' + i,
          'receNam': '收货人' + i,
          'serviceNam': '开单客服' + i,
          'receMoney': i,
          'receState': '回单状态' + i,
          'receNums': '回单份数' + i
        })
      }
    },
    data () {
      return {
        // 表格1数据
        testData1: [],
        // 表格2数据
        testData2: [],
        // 定义三个表格数据
        gridOptions: {
          rowData: [],
          columnDefs: [
            {
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单网点', width: 150, field: 'billBranch', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单日期', width: 150, field: 'orderTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '到站', width: 150, field: 'arrStation', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发货方', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发货方联系方式', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '收货方', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '收货方联系方式', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单客服', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '中转费', width: 150, field: 'changeFee', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '回单押款', width: 150, field: 'receMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '备注',
              width: 150,
              field: 'trilNote',
              filter: 'text',
              hide: false,
              visible: true
            },
            {
              headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '回单状态', width: 150, field: 'receState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '回单份数', width: 150, field: 'receNums', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
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
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货方', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货方', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单客服', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '回单押款', width: 150, field: 'receMoney', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '回单状态', width: 150, field: 'receState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '回单份数', width: 150, field: 'receNums', filter: 'text', hide: false, visible: true
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
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货方', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货方', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单客服', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '回单押款', width: 150, field: 'receMoney', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '回单状态', width: 150, field: 'receState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '回单份数', width: 150, field: 'receNums', filter: 'text', hide: false, visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        // 定义筛选条件
        filterForm: {
          dateInterval: '', // 时间间隔
          startPoint: '', //  区间起点
          endPoint: '', //  区间终点
          shipNam: '', //  发货方
          orderId: '', // 运单号
          veriState: '', // 核销状态
          pageNum: 1, // 当前页码数
          pageSize: 20 // 分页大小
        },
        // 各种费用合计
        totalForm: {
          totalMoney: 0 // 回单押款合计
        },
        // 核销完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          payMode: 'WeChat',
          digest: ''
        },
        //  表单验证规则
        rules: {},
        // dialog的可见性
        colVisible: false, // 切换列可见性的弹窗
        colVisible2: false,
        colVisible3: false,
        verVisible: false, // 进入核销页面的弹框
        confirmSubVisible: false, // 提交核销信息的弹框
        errorVisible: false, // 错误信息弹框
        detailVisible: false, // 订单详情弹框
        currentPage: 1, // 分页当前页面
        pageSize: 20, // 每页显示的数据
        rowCount: 0, // 总数据量（如果有筛选，则是筛选后的）
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
      // 切换列可见性，i=1或者2，1全选或者2全不选，gridnum表示三个表格
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
      // 绘制表格，包括更新列信息与行信息
      drawGrid (i) {
        if (i === 2) {
          this.gridOptions3.api.selectAll()
          const selectedData = this.gridOptions3.api.getSelectedRows()
          this.delChoose(selectedData)
        }
        this.createRowData(i)
        this.calculateGrid()
      },
      // 获取行数据
      createRowData (i) {
        if (i === 1) {
          this.gridOptions.rowData = this.testData1
          this.gridOptions.api.setRowData(this.gridOptions.rowData)
        } else if (i === 2) {
          this.gridOptions2.rowData = this.testData2
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
      // 三个表格的快速匹配
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      onQuickFilterChanged2 (input) {
        this.gridOptions2.api.setQuickFilter(input)
      },
      onQuickFilterChanged3 (input) {
        this.gridOptions3.api.setQuickFilter(input)
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
        this.rowCount = processedRows
      },
      // 显示切换列可见的弹框
      setting () {
        this.colVisible = true
      },
      // 显示切换核销界面的弹框
      verification () {
        this.filterForm = {
          startTime: '', // 开始时间
          endTime: '', // 截止时间
          startPoint: '', //  区间起点
          endPoint: '' //  区间终点
        }
        this.verVisible = true
        this.gridOptions2.api.selectAll()
        this.gridOptions3.api.selectAll()
        let data2 = this.gridOptions2.api.getSelectedRows()
        let data3 = this.gridOptions3.api.getSelectedRows()
        this.gridOptions2.api.updateRowData({remove: data2})
        this.gridOptions3.api.updateRowData({remove: data3})
      },
      // 订单详情弹框
      detailDoubleClick (event) {
        this.filterForm.orderId = event.data.orderId
        this.detailVisible = true
      },
      // 核销界面左侧表格双击事件
      leftDoubleClick (event) {
        this.leftSelect(event.data)
      },
      // 核销界面右侧表格双击事件
      rightDoubleClick (event) {
        this.rightSelect(event.data)
      },
      // 核销界面左侧表格多选切换至右侧
      leftSelect () {
        const selectedData = this.gridOptions2.api.getSelectedRows()
        this.addChoose(selectedData)
//        console.log(this.gridOptions3.api.getAllRows())
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
      // 打开提交核销结果的窗口
      confirmSubmit () {
        this.gridOptions3.api.selectAllFiltered()
        const confirmData = this.gridOptions3.api.getSelectedRows()
        if (confirmData.length < 1) {
          this.errorVisible = true
        } else {
          for (let i = 0; i < confirmData.length; i++) {
            this.confirmSubForm.orderId[i] = confirmData[i].orderId
          }
          this.confirmSubVisible = true
        }
        console.log(confirmData)
      },
      // 提交后台
      submit () {
        this.confirmSubVisible = false
        this.drawGrid(2)
      }
    },
    computed: {
      // 计算合计金额
      calculateMoney: function () {
        if (this.verVisible === false) {
          this.totalForm.transferFeeTotal = 0
          this.totalForm.totalMoney = 0
          let model = this.gridOptions.api.getModel()
          let arr = model.rootNode.childrenAfterFilter
          for (let i = 0; i < arr.length; i++) {
            this.totalForm.transferFeeTotal += arr[i].data.changeFee
            this.totalForm.totalMoney += arr[i].data.receMoney
          }
        }
      }
    },
    // 数据发生更新时
    updated () {
      this.calculateMoney
    }
  }
</script>
