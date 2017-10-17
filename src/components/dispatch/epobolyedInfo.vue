<template>
<!-- 组件必须头元素被一个div容器包括 -->
  <div>
    <div id="top">
      <!-- 标题 -->
      <h2 style="text-align:center">已 中 转 订 单 信 息 页</h2>

      <!-- 查询菜单 -->
      <div style="margin-top:2%;float:left;">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="订单时间:">
              <el-date-picker v-model="formQuery.dateInterval" type="daterange" placeholder="选择日期范围" :picker-options="pickerOptions" range-separator='/' style="width: 150px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单号:">
              <el-input v-model="formQuery.orderId" placeholder="请输入订单号" style="width:124px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="中转外包公司">
              <el-input v-model="formQuery.rouSelection" placeholder="请输入中转外包公司名" style="width:165px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="发货人姓名:">
              <el-input v-model="formQuery.shipNam" placeholder="请输入发货人姓名" style="width:140px;margin-right:5px;"></el-input>
            </el-form-item>
            <el-form-item label="收货人姓名:">
              <el-input v-model="formQuery.receNam" placeholder="请输入收货人姓名" style="width:140px;"></el-input>
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
        :current-page="currentpage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalpages">
      </el-pagination>
    </div>

    <!--订单详情弹框  默认隐藏，引用订单详情外部组件-->
    <el-dialog id="shuangji" title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>

  </div>
</template>

<script>
  // 引入表格组件
  import {AgGridVue} from 'ag-grid-vue'
  // 引入axios后台接口
  import {getCurrentEpiboliedList, getQueryEpiboliedList} from '../../api/dispatch/api'
  // 引入外部 “订单详情接口"
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  // 引入外部筛选函数组件系统
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  export default {
    data () {
      return {
        formQuery: {
          dateInterval: '', // 时间间隔
          orderId: '', // 订单号
          rouSelection: '', // 中转外包公司名
          shipNam: '', // 发货人姓名
          receNam: '' // 收货人姓名
        },
        listLoading: false, // 加载圆圈（默认不显示）
        queryName: '', // 查询参数值
        currentpage: 1, // 当前页数
        colVisible: false, // 设置弹窗的显示boolean值
        tableForm: {
          'id': '', // 序号
          'orderId': '', // 订单号
          'orderTim': '', // 订单时间
          'shipNam': '', // 发货人姓名
          'receNam': '', // 收货人姓名
          'arrStation': '', // 到站
          'goodsNam': '', // 货物名称
          'goodsNums': '', // 件数
          'goodsWeight': '', // 重量
          'goodsVolumn': '', // 体积
          'package': '', // 包装
          'rouSelection': '', // 线路选择
          'changeStart': '', // 中转起始地
          'changeFee': '', // 中转费
          'orderNote': '', // 订单备注
          'lineTel': '', // 外包企业线路账号（联系方式）
          'lineNam': '', // 联系人
          'contractPrice': '' // 合同价格
        },
        rules: {},
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
              headerName: '订单号', width: 120, field: 'orderId', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '开单时间', width: 120, field: 'orderTim', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '到站点', width: 120, field: 'arrStation', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '中转起始点', width: 120, field: 'changeStart', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '中转外包公司', width: 120, field: 'rouSelection', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '中转花费', width: 120, field: 'changeFee', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '合同价格', width: 120, field: 'contractPrice', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '外包企业联系人', width: 140, field: 'lineNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '外包企业联系电话', width: 150, field: 'lineTel', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '发货人姓名', width: 120, field: 'shipNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '收货人姓名', width: 120, field: 'receNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 120, field: 'goodsNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '包装', field: 'package', width: 120, filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '件数', field: 'goodsNums', width: 120, filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '重量', field: 'goodsWeight', width: 120, filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '体积', field: 'goodsVolumn', width: 120, filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '备注', field: 'orderNote', width: 120, filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            }
          ]
        },
        // 查询的参数
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
      ElButton,
      'ag-grid-vue': AgGridVue,
      OrderDetails
    },
// 实例方法
    methods: {
      // 查询按钮点击
      submitQuery () {
        console.log('click submitQuery function')
      },
      // 订单详情弹框
      detailDoubleClick (event) {
        console.log(event.data.orderId)
        this.orderId = event.data.orderId
        this.detailVisible = true
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
      // 获取订单列表
      getOrderList () {
        let para = {
          page: this.currentpage,
          orderId: this.orderId,
          driverName: this.driverName,
          deliverOrderId: this.deliverOrderId,
          selectvalue: this.selectvalue,
          pageSize: this.pageSize
        }
        this.listLoading = true
        getCurrentEpiboliedList(para).then((res) => {
          this.gridOptions.api.setRowData(res.data.orderlists)
          this.orderlist = res.data.orderlists
          this.totalpages = res.data.totalPages
          this.listLoading = false
        })
        return null
      },
      // 获取查询数据
      getQueryData () {
        let para = {
          queryName: this.queryName,
          queryClass: this.selectvalue,
          pageSize: this.pageSize
        }
        this.listLoading = true
        getQueryEpiboliedList(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          this.listLoading = false
        })
      }
    },
    // 挂载元素完毕，自执行函数
    mounted () {
      this.$nextTick(function () {
        this.getOrderList()
      })
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
    font-size: 10px;

  }
</style>
