<template>
<!-- 组件必须头元素被一个div容器包括 -->
  <div>
    <div id="top">
      <!-- 标题 -->
      <h2 style="text-align:center">短 途 直 送 订 单 信 息 页</h2>
      <!-- 操作栏 -->
      <div style="margin-top:2%">
      <!-- 查询菜单 -->
      <div style="margin-top:2%;float:left;">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="订单时间:">
              <el-date-picker v-model="formQuery.dateInterval" type="daterange" placeholder="选择日期范围" :picker-options="pickerOptions" range-separator='/' style="width: 150px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="单号:">
              <el-input v-model="formQuery.orderId" placeholder="请输入单号" style="width:124px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="司机姓名:">
              <el-input v-model="formQuery.driverNam" placeholder="请输入司机姓名" style="width:165px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- 导出 -->
      <div style="float:right;margin-top:2%;">
        <el-button style="float:right; margin-right:10px;">导出</el-button>
        <!-- 设置div -->
          <div style="float:right;margin-right:10px;">
            <!-- 鼠标移动上“设置”按钮，浮动出属性列表弹窗 -->
            <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
              <template v-for="(collist,i) in gridOptions.columnDefs">
                <div class="colVisible">
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
      </div>
    </div>
    <!-- 清除浮动 -->
    <div style="clear: both;">
    </div>
    <!-- 表格 -->
    <div id="middle" style="margin-top:2%" v-loading="listLoading">
      <ag-grid-vue style="width: 100%;height: 580px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="changeDialogVisible"
      ></ag-grid-vue>
    </div>
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
    <!-- 待长途装载单订单对话框  -->
    <el-dialog :title="titleText" :visible.sync="dialogVisible" size="full" :modal=false :modal-append-to-body=false>
      <deliver-order-list :loaderId="loadOrderId" :flag="flag"></deliver-order-list>
    </el-dialog>
    <!-- 装载单订单列表展示 -->
    <el-dialog :title="titleText" :visible.sync="deliveringVisible" size="full" :modal=false :modal-append-to-body=false>
      <deliver-order-list></deliver-order-list>
    </el-dialog>
  </div>
</template>

<script>
  // 引入表格组件
  import {AgGridVue} from 'ag-grid-vue'
  // 引入axios后台接口
  import {queryCurrentTransportDirectList, updateTransportDirectListInfo} from '../../api/dispatch/api'
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
        dialogVisible: false, // 装载单订单列表弹窗的显示真值
        deliveringVisible: false, // 装载单订单列表弹窗显示真值
        listLoading: false, // 加载圆圈（默认不显示）
        queryName: '', // 查询参数值
        flag: false, // flag = true 表示是新增装载单
        currentpage: 1, // 当前页数
        colVisible: false, // 设置弹窗的显示boolean值
        orderId: '', // 运单号
        tableForm: {
          'id': '',
          'orderId': '',
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
              headerName: '单号', width: 120, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '调整状态', width: 120, field: 'adjustmentStatus', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '起始站', width: 120, field: 'startStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '到达站', width: 120, field: 'endStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '大车司机姓名', width: 120, field: 'driverName', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '大车司机电话', width: 120, field: 'driverPhone', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发车时间', width: 120, field: 'departTime', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '到达时间', width: 120, field: 'arriveTime', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '大车总毛利', width: 120, field: 'gross', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总运费', width: 120, field: 'freight', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总中转费', width: 120, field: 'transhipment', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总返款', width: 120, field: 'refund', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总提送费', width: 120, field: 'sendFee', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总重量', width: 120, field: 'allWeights', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总体积', width: 120, field: 'allVolumes', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '总件数', width: 120, field: 'allNumbers', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '调度管理员编号', width: 120, field: 'dispatcherId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '调度管理员姓名', field: 'dispatcherName', width: 120, filter: 'text', hide: false, visible: true
            },
            {
              headerName: '备注', field: 'remarks', width: 120, filter: 'text', hide: false, visible: true
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
        dateValue: '', // 日期值
        detailVisible: false // 订单详情弹框
      }
    },
    // 实例组件
    components: {
      'ag-grid-vue': AgGridVue,
      DeliverOrderList,
      Dispatching
    },
    // 实例方法
    methods: {
      // 查询按钮点击
      submitQuery () {
        console.log('click submitQuery function')
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
      // 查询长途直送装载单列表
      getQueryCurrentTransportDirectList () {
        let para = {
          page: this.currentpage,
          orderId: this.orderId,
          driverName: this.driverName,
          deliverOrderId: this.deliverOrderId,
          selectvalue: this.selectvalue,
          pageSize: this.pageSize
        }
        // this.listLoading = true
        queryCurrentTransportDirectList(para).then((res) => {
          this.gridOptions.api.setRowData(res.data.orderlists)
          this.orderlist = res.data.orderlists
          this.totalpages = res.data.totalPages
          // this.listLoading = false
        })
        return null
      },
       // 修改长途直送装载单信息
      setTransportDirectListInfo () {
        let para = {
          queryName: this.queryName,
          queryClass: this.selectvalue,
          pageSize: this.pageSize
        }
        // this.listLoading = true
        updateTransportDirectListInfo(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          this.listLoading = false
        })
      }
    },
    // 挂载元素完毕，自执行函数
    mounted () {
      this.getQueryCurrentTransportDirectList()
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
