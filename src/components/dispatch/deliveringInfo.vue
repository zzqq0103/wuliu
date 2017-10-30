<template>
  <!-- 组件必须头元素被一个div容器包括 -->
  <div>
    <div id="top">

      <!-- 标题 -->
      <h2 style="text-align:center">待 送 货 订 单 信 息 页</h2>

      <!-- 操作栏 -->
      <div style="margin-top:2%">

        <!-- 查询菜单 -->
        <div style=" margin-top:2%; float:left; ">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="订单时间:">
              <el-date-picker v-model="formQuery.dateInterval" type="daterange" placeholder="选择日期范围"
                              :picker-options="pickerOptions" range-separator='/' style="width: 150px">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formQuery.selectClass" placeholder="订单" style="width: 90px">
                <el-option label="订单" value='1'></el-option>
                <el-option label="子件" value='2'></el-option>
              </el-select>
              <el-input v-model="formQuery.queryOrderId" placeholder="请输入单号"
                        style="width:150px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="司机姓名:">
              <el-input v-model="formQuery.driverNam" placeholder="请输入司机姓名"
                        style="width:165px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="发货人姓名:">
              <el-input v-model="formQuery.shipNam" placeholder="请输入发货人姓名"
                        style="width:140px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="收货人姓名:">
              <el-input v-model="formQuery.receNam" placeholder="请输入收货人姓名" style="width:140px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 导出Excel表格 -->
        <div style="float:right;margin-top:2%;">
          <el-button style="float:right; margin-right:10px;">导出</el-button>

          <!-- 设置div -->
          <div style="float:right;margin-right:10px;">

            <!-- 鼠标移动上“设置”按钮，浮动出属性列表弹窗 -->
            <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
              <template v-for="(collist,i) in this.gridOptions.columnDefs">
                <div class="colVisible">
                  <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"
                               style="float: left;width: 180px">
                    {{collist.headerName}}
                  </el-checkbox>
                </div>
              </template>
              <template>
                <div class="colVisible" style="width:200px; clear:both; float:right; margin-top:10px;">
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
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="detailDoubleClick"
      ></ag-grid-vue>
    </div>

    <!-- 分页 -->
    <div id="bottom" class="block" style="float:right; margin-top:30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formQuery.currentpage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalpages">
      </el-pagination>
    </div>

    <!--订单详情弹框  默认隐藏，引用订单详情外部组件-->
    <el-dialog title="订单详情" :visible.sync="detailVisible" size="small" :closeOnClickModal="false" top="10%">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>
  </div>
</template>

<script>
  // 引入表格组件
  import {AgGridVue} from 'ag-grid-vue'

  // 引入真实后端接口
  //  import {getCurrentDeliveredList, getCurrentDeliveredSubOrderList} from '../../api/dispatch/api'

  // 引入axios中的mock_api.js 后台数据
  import api from '../../api/dispatch/mock_api'

  // 引入外部 “订单详情" 页面
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'

  // 引入装载单页面的 （dispatched.vue）页面
  import Dispatched from './dispatched'

  // 引入装载单订单页面 （deliverOrderList.vue） 页面
  import DeliverOrderList from './deliverOrderList'

  export default {
    data () {
      return {
        formQuery: {
          dateInterval: '', // 时间间隔
          queryOrderId: '', // 单号
          driverNam: '', // 中转外包公司名
          shipNam: '', // 发货人姓名
          receNam: '', // 收货人姓名
          currentpage: 1, // 当前页数
          selectClass: '1' // 订单、子件、预约单的分类
        },
        orderId: '', // 订单号
        selectClass: '',
        value_Search: [],
        list: [],
        options: [],
        loading: false,
        titleText: '送货成功订单列表',
        status: 1,
        deliveringVisible: false,
        listLoading: false, // 加载圆圈（默认不显示）
        colVisible: false, // 设置弹窗的显示boolean值
        tableForm: {
          'id': '',
          'orderId': '',
          'subId': '',
          'orderTim': '',
          'receNam': '',
          'receTel': '',
          'receAdr': '',
          'receArea': '',
          'goodsNam': '',
          'driverNam': '',
          'driverTel': '',
          'licePlateNum': '',
          'goodsPackage': '',
          'goodsNums': '',
          'goodsWeight': '',
          'goodsVolumn': '',
          'tonnage': '',
          'capacity': '',
          'clieOrderNote': '',
          'inteOrderNote': ''
        },
        rules: {}, //
        formLabelWidth: '120px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          rowSelection: 'single',
          columnDefs: [
            {
              headerName: '序号',
              width: 80,
              field: 'id',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '订单单号',
              width: 120,
              field: 'orderId',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '子件号',
              width: 120,
              field: 'subId',
              filter: 'text',
              hide: true,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '开单时间',
              width: 120,
              field: 'orderTim',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '收货人姓名',
              width: 120,
              field: 'receNam',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '收货人联系方式',
              width: 120,
              field: 'receTel',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '收货地址',
              width: 200,
              field: 'receAdr',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '收货货物区域',
              width: 200,
              field: 'receArea',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '货物名称',
              width: 120,
              field: 'goodsNam',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '接货司机姓名',
              width: 120,
              field: 'driverNam',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '接货司机电话',
              width: 120,
              field: 'driverTel',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '接货司机车辆',
              width: 120,
              field: 'licePlateNum',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '包装',
              width: 120,
              field: 'goodsPackage',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '件数',
              field: 'goodsNums',
              width: 120,
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '重量',
              field: 'goodsWeight',
              width: 120,
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '体积',
              width: 120,
              field: 'goodsVolumn',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '车辆吨位',
              width: 120,
              field: 'tonnage',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '车辆容量',
              width: 120,
              field: 'capacity',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '客户订单备注',
              width: 150,
              field: 'clieOrderNote',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
            },
            {
              headerName: '内部订单备注',
              width: 150,
              field: 'inteOrderNote',
              filter: 'text',
              hide: false,
              visible: true,
              suppressMenu: true,
              cellStyle: {textAlign: 'center'}
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
        detailVisible: false // 订单详情弹框
      }
    },
    watch: {
      'formQuery.selectClass': function (newValue) {
        let tempGridColumns = this.gridOptions.columnDefs
        if (newValue === '1') { // 订单查询
          let that = this
          tempGridColumns.forEach(function (ele, index, arr) {
            if (ele.field === 'clieOrderNote') {
              that.gridOptions.columnDefs[index].visible = true
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            } else if (ele.field === 'inteOrderNote') {
              that.gridOptions.columnDefs[index].visible = true
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            } else if (ele.field === 'subId') {
              that.gridOptions.columnDefs[index].visible = false
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            } else {
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            }
          })
        } else {
          let that = this
          tempGridColumns.forEach(function (ele, index, arr) {
            if (ele.field === 'clieOrderNote') {
              that.gridOptions.columnDefs[index].visible = false
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            } else if (ele.field === 'inteOrderNote') {
              that.gridOptions.columnDefs[index].visible = false
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            } else if (ele.field === 'subId') {
              that.gridOptions.columnDefs[index].visible = true
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            } else {
              that.gridOptions.columnApi.setColumnVisible(that.gridOptions.columnDefs[index].field, that.gridOptions.columnDefs[index].visible)
            }
          })
        }
      }
    },
    // 计算属性
    computed: {
    },
    // 实例组件
    components: {
      'ag-grid-vue': AgGridVue,
      OrderDetails,
      Dispatched,
      DeliverOrderList
    },

    methods: {
      // 查询按钮点击
      submitQuery () {
        console.log('click submitQuery function')
      },

      // 司机多选搜索框中调用的方法
      remoteGetDriverList (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.lading = false
            this.options = this.list.filter(item => {
              return item.label.indexOf(query) > -1
            })
          }, 200)
        } else {
          this.options = []
        }
      },

      // 订单详情弹框
      detailDoubleClick (event) {
        this.orderId = event.data.orderId
        this.detailVisible = true
      },

      // 改变每页显示的个数
      handleSizeChange (val) {
        if (this.formQuery.selectClass === '1') {
          this.pageSize = val
          this.formQuery.currentpage = 1
          this.queryCurrentDeliveredList()
        } else {
          this.pageSize = val
          this.formQuery.currentpage = 1
          this.queryCurrentDeliveredSubOrderList()
        }
      },

      // 点击当前选中的第几页
      handleCurrentChange (val) {
        if (this.formQuery.selectClass === '1') {
          this.formQuery.currentpage = val
          this.queryCurrentDeliveredList()
        } else {
          this.formQuery.currentpage = val
          this.queryCurrentDeliveredSubOrderList()
        }
      },

      // 设置显示表格的哪些列
      changeColumnDefsBoolen () {
        var columnlist = this.gridOptions.columnDefs
        for (let i = 0; i < columnlist.length; i++) {
          columnlist[i].hide = !columnlist[i].hide
        }
      },

      // 设置按钮的启动
      setting () {
        this.colVisible = true
      },

      // 点击设置按钮之后，显示需要弹出的属性名列表，选择checkbox属性
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          // 调用ag-grid
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

      // 当前正在送货的订单列表接口
      queryCurrentDeliveredList () {
        let para = {
          // 页码
          pageNum: this.formQuery.currentpage, // required
          // 每页记录数
          recordNum: this.pageSize, // required
          // 开始时间
          startTime: this.formQuery.dateInterval, // required
          // 结束时间
          endTime: this.formQuery.dateInterval, // required
          // 需要查询的订单Id
          orderId: this.formQuery.queryOrderId, // optional
          // 查询的司机姓名
          driverName: this.formQuery.driverNam, // optional
          // 查询的发货方姓名
          shipNam: this.formQuery.shipNam, // optional
          // 查询的收货方姓名
          receNam: this.formQuery.receNam // optional
        }
        this.listLoading = true
        if (this.formQuery.selectClass === '1') {
          api.getCurrentDeliveringList(para).then((res) => {
            console.log(res)
            this.gridOptions.rowData = res.data.orderlists
            this.gridOptions.api.setRowData(res.data.orderlists)
            this.orderlist = res.data.orderlists
            this.totalpages = res.data.totalPages
            this.listLoading = false
          })
        } else {
          api.getCurrentDeliveringSubOrderList(para).then((res) => {
            console.log(res)
            this.gridOptions.rowData = res.data.orderlists
            this.gridOptions.api.setRowData(res.data.orderlists)
            this.orderlist = res.data.orderlists
            this.totalpages = res.data.totalPages
            this.listLoading = false
          })
        }
        return null
      },

      // 查询正在送货的子件列表
      queryCurrentDeliveredSubOrderList () {
        let para = {
          // 页码
          pageNum: this.formQuery.currentpage, // required
          // 每页记录数
          recordNum: this.pageSize, // required
          // 开始时间
          startTime: this.formQuery.dateInterval, // required
          // 结束时间
          endTime: this.formQuery.dateInterval, // required
          // 需要查询的订单Id
          orderId: this.formQuery.queryOrderId, // optional
          // 查询的司机姓名
          driverName: this.formQuery.driverNam, // optional
          // 查询的发货方姓名
          shipNam: this.formQuery.shipNam, // optional
          // 查询的收货方姓名
          receNam: this.formQuery.receNam // optional
        }
        this.listLoading = true
        if (this.formQuery.selectClass === '1') {
          api.getCurrentDeliveringList(para).then((res) => {
            console.log(res)
            this.gridOptions.rowData = res.data.orderlists
            this.gridOptions.api.setRowData(res.data.orderlists)
            this.orderlist = res.data.orderlists
            this.totalpages = res.data.totalPages
            this.listLoading = false
          })
        } else {
          api.getCurrentDeliveringSubOrderList(para).then((res) => {
            console.log(res)
            this.gridOptions.rowData = res.data.orderlists
            this.gridOptions.api.setRowData(res.data.orderlists)
            this.orderlist = res.data.orderlists
            this.totalpages = res.data.totalPages
            this.listLoading = false
          })
        }
      }
    },

    // 挂载元素完毕，自执行函数
    mounted () {
      this.queryCurrentDeliveredList() // 进入页面的时刻，需要加载已送货的订单列表
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
