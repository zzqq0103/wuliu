<template>
  <!-- 组件必须头元素被一个div容器包括 -->
  <div>
    <div>
      <!-- 标题 -->
      <h2 style="text-align:center">待 长 途 运 输 装 载 单 信 息 页</h2>
      <!-- 操作栏 -->
      <div style="margin-top:2%">
      <!-- 查询菜单 -->
      <div style="margin-top:2%;float:left;">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="订单时间:">
              <el-date-picker v-model="formQuery.dateInterval" type="daterange" placeholder="选择日期范围" :picker-options="pickerOptions" range-separator='/' style="width: 150px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="装载单号:">
              <el-input v-model="formQuery.orderId" placeholder="请输入订单号" style="width:124px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="司机姓名:">
              <el-input v-model="formQuery.driverNam" placeholder="请输入司机姓名" style="width:165px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

      <!-- 导出 & 设置 & 新增装载单 -->
      <div style="float:right;margin-top:2%;">
          <el-button style="float:right; margin-right:10px;" @click="createLoaderList">新增装载单</el-button>
          <el-button style="float:right; margin-right:10px;">导出</el-button>
          <!-- 设置div -->
          <div style="float:right;margin-right:10px;">
            <!-- 鼠标移动上“设置”按钮，浮动出属性列表弹窗 -->
            <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
              <template v-for="(collist,i) in gridOptions.columnDefs">
                <div v-bind:class="colVisible">
                  <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"  style="float: left;width: 180px">
                    {{collist.headerName}}
                  </el-checkbox>
                </div>
              </template>
              <template>
                <div class="colVisible" style="width:200px;clear:both;float:right;margin-top:10px;">
                  <el-button @click="visibleChoice(1)" size="small">全选</el-button>
                  <el-button @click="visibleChoice(2)" size="small">全不选</el-button>
                </div>
              </template>
            </el-popover>
            <el-button v-popover:popover1>设置</el-button>
          </div>
        </div>
        <!-- 是否发车对话框 -->
        <el-dialog title="" :visible.sync="departVisible" size="tiny" top="30%">
          <h2 style="padding:30px">确认发车吗？</h2>
          <div slot="footer" class="dialog-footer">
            <el-button @click="departVisible = false">取 消</el-button>
            <el-button @click="depart" type="danger">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div style="clear: both;">
    </div>

    <!-- 表格 -->
    <div id="middle" style="margin-top:2%;" v-loading="listLoading">
      <ag-grid-vue style="width: 100%;height: 580px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="changeDialogVisible"
      ></ag-grid-vue>
    </div>

    <!-- 待长途装载单订单对话框  -->
    <el-dialog :title="titleText" :visible.sync="dialogVisible" size="full" :modal=false :modal-append-to-body=false>
      <deliver-order-list :loaderId="loadOrderId" :flag="flag"></deliver-order-list>
    </el-dialog>

    <!-- 装载单订单列表展示 -->
    <el-dialog :title="titleText" :visible.sync="deliveringVisible" size="full" :modal=false :modal-append-to-body=false>
      <deliver-order-list></deliver-order-list>
    </el-dialog>

    <!-- 分页 -->
    <div id="bottom" class="block" style="float:right; margin-top:30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalpages">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  // 引入表格组件
  import {AgGridVue} from 'ag-grid-vue'
  // 引入axios后台接口
  import {queryCurrentTransportingList, updateTransportListInfo, QueryOrderInfo} from '../../api/dispatch/api'
  // 引入外部 “订单详情接口"
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  // 引入外部筛选函数组件系统
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  // 引入dispatchLoaderInfo 组件页面
  import DeliverOrderList from './deliverOrderList'
  // 引入装载单页面的 （dispatched.vue）页面
  import Dispatching from './dispatching'
  export default {
    data () {
      return {
        formQuery: {
          dateInterval: '', // 时间间隔
          loadingId: '', // 装载单号
          driverNam: '' // 司机姓名
        },
        titleText: '待长途装载单订单列表',
        dialogVisible: false, // 装载单订单列表弹窗的显示真值
        deliveringVisible: false, // 装载单订单列表弹窗显示真值
        listLoading: false, // 加载圆圈（默认不显示）
        queryName: '', // 查询参数值
        flag: false, // flag = true 表示是新增装载单
        currentpage: 1, // 当前页数
        colVisible: false, // 设置弹窗的显示boolean值
        tableForm: {
          'id': '',
          'loadOrderId': '',
          'loadOrderStatus': '',
          'adjustmentStatus': '',
          'startStation': '',
          'endStation': '',
          'driverName': '',
          'driverPhone': '',
          'departTime': '',
          'arriveTime': '',
          'gross': '',
          'freight': '',
          'transhipment': '',
          'refund': '',
          'sendFee': '',
          'allWeights': '',
          'allVolumes': '',
          'allNumbers': '',
          'dispatcherName': '',
          'dispatcherId': '',
          'remarks': ''
        },
        rules: {}, //
        formLabelWidth: '120px',
        departVisible: false, // 发车弹窗的真值属性
        // Ag-grid 表格组件的data
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          rowSelection: 'single',
          columnDefs: [
            {
              headerName: '序号', width: 120, field: 'id', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '装载单号',
              width: 120,
              field: 'loadOrderId',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '装载单状态',
              width: 120,
              field: 'loadOrderStatus',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '调整状态',
              width: 120,
              field: 'adjustmentStatus',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '起始站',
              width: 120,
              field: 'startStation',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '到达站',
              width: 120,
              field: 'endStation',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '大车司机姓名',
              width: 120,
              field: 'driverName',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '大车司机电话',
              width: 120,
              field: 'driverPhone',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '发车时间',
              width: 120,
              field: 'departTime',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '到达时间',
              width: 120,
              field: 'arriveTime',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '大车总毛利',
              width: 120,
              field: 'gross',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总运费',
              width: 120,
              field: 'freight',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总中转费',
              width: 120,
              field: 'transhipment',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总返款',
              width: 120,
              field: 'refund',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总提送费',
              width: 120,
              field: 'sendFee',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总重量',
              width: 120,
              field: 'allWeights',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总体积',
              width: 120,
              field: 'allVolumes',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '总件数',
              width: 120,
              field: 'allNumbers',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '调度管理员编号',
              width: 120,
              field: 'dispatcherId',
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '调度管理员姓名',
              field: 'dispatcherName',
              width: 120,
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '备注',
              field: 'remarks',
              width: 120,
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'operator',
              width: 60,
              filter: 'text',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true,
              cellRendererFramework: 'operateComponent',
              pinned: 'right'
            }
          ]
        },
        orderlist: [], // 订单列表
        totalpages: 1, // 总页数
        pageSize: 25, // 每页展示的个数
        // 日期控件data
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
        dateValue: '' // 日期值
      }
    },
    // 实例组件
    components: {
      'ag-grid-vue': AgGridVue,
      OrderDetails,
      DeliverOrderList,
      Dispatching,
      operateComponent: {
        template: '<span style="margin-left:5px;"><el-button  class="del-but" @click="depart" type="info" size="small">发车</el-button></span>',
        methods: {
          // 点击发车按钮，进行操作
          depart () {
            let self = this.params.context.componentParent
            console.log(self)
            self.departVisible = true
          }
        }
      }
    },
    // 实例方法
    methods: {
      // 点击发车按钮，显示确认弹框，之后在弹框中将该行数据转移至已中转的页面中显示。
      depart () {
        console.log(this)
        let self = this.params.context.componentParent
        self.departVisible = true
      },
      // 装载单订单列表弹框
      changeDialogVisible (event) {
        this.loadOrderId = event.data.loadOrderId
        console.log(this.deliveringVisible)
        this.deliveringVisible = true
//        this.dialogVisible = true
//        this.flag = false
      },
      // 新增装载单
      createLoaderList () {
        this.flag = true
        this.dialogVisible = true
      },
      // 改变每页显示的个数
      handleSizeChange (val) {
        this.pageSize = val
        this.getOrderList()
      },
      // 点击当前选中的第几页
      handleCurrentChange (val) {
        this.currentpage = val
        this.getOrderList()
      },
      // 点击查询的Icon，进行查询
      handleIconClick (input) {
        this.getQueryData()
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
      // 点击设置按钮之后，显示需要弹出的属性名列表，选择checkbox属性
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          // 调用ag-grid 表格中的api操作
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
      // 全选  与  全不选 执行函数
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
      // 查询待运输装载单
      getQueryCurrentTransportingList () {
        let para = {
          page: this.currentpage,
          orderId: this.orderId,
          driverName: this.driverName,
          deliverOrderId: this.deliverOrderId,
          selectvalue: this.selectvalue,
          pageSize: this.pageSize
        }
        // this.listLoading = true
        queryCurrentTransportingList(para).then((res) => {
          // console.log('进入getCurrentDelivered')
          // this.gridOptions.rowData = res.data.orderlists
          // 使用gridOptions中的api方法设定RowData数据
          this.gridOptions.api.setRowData(res.data.orderlists)
          this.orderlist = res.data.orderlists
          this.totalpages = res.data.totalPages
          // this.listLoading = false
        })
        return null
      },
      // 修改装载单状态
      setTransportListInfo () {
        let para = {
          queryName: this.queryName,
          queryClass: this.selectvalue,
          pageSize: this.pageSize
        }
        // this.listLoading = true
        updateTransportListInfo(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          // this.listLoading = false
        })
      }
    },
    // 查询装载单中订单信息
    getQueryOrderInfo () {
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      // this.listLoading = true
      QueryOrderInfo(para).then(res => {
        this.gridOptions.api.setRowData(res.data.querylists)
        this.orderlist = res.data.querylists
        this.totalpages = res.data.totalpages
        // this.listLoading = false
      })
    },
    // 挂载元素完毕，自执行函数
    mounted () {
      this.getQueryCurrentTransportingList()
    }
  }
</script>

<style scoped>
  .el-select-css {
    width: 50%;
  }
  .del-but {
    cursor: pointer;
    float: right;
    margin-right: 10px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid rgb(191, 217, 216);
    color: rgb(31, 61, 60);
    padding: 5px 10px;
    font-size: 10px
  }
</style>
