<template>
  <div>
    <div id="top">
      <h2 style="text-align:center">已 发 货 订 单 信 息 页</h2>
      <div style="margin-top:2%">

        <div class="block" style="float:right;">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>

        <div style="float:left;">
          <el-input placeholder="请输入查询数据" icon="search" v-model="queryName" :on-icon-click="handleIconClick" style="width:145px;"></el-input>
          <el-select v-model="selectvalue" :placeholder="queryItemOptions[0].label" style="width:105px;">
            <el-option v-for="item in queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="setting" style="padding: 10px 15px 9px 15px !important;">设置</el-button>
        </div>

        <div>
          <el-button style="float:right; margin-right:10px;">导出</el-button>
        </div>
      </div>
    </div>

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
                   :headerHeight="30"
                   :rowDoubleClicked="detailDoubleClick"
      ></ag-grid-vue>
    </div>

    <div id="bottom" class="block" style="float:right; margin-top:30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="25"
        layout="total, sizes, prev, pager, next"
        :total="totalpages">
      </el-pagination>
    </div>

    <el-dialog id="shezhi" title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false">
      <template v-for="(collist,i) in gridOptions.columnDefs ">
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

    <!--订单详情弹框-->
    <el-dialog id="shuangji" title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>

  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import {getCurrentDelivered, getQueryOrderList} from '../../api/api'
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  export default {
    data () {
      return {
        listLoading: false,
        queryName: '',
        currentpage: 1,
        colVisible: false,
        vehicleVisable: false,
        vehicleDelVisable: false,
        orderId: '', // 运单号
        tableForm: {
          'id': '',
          'deliverOrderId': '',
          'orderId': '',
          'driverName': '',
          'OrderDate': '',
          'consignee': '',
          'consigneeAddr': '',
          'phone': '',
          'address': '',
          'goodsName': '',
          'pack': '',
          'numbers': '',
          'weight': '',
          'volume': '',
          'remarks': ''
        },
        rules: {},
        formLabelWidth: '120px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 120, field: 'id', filter: 'text', hide: false
            },
            {
              headerName: '装载单号', width: 120, field: 'deliverOrderId', filter: 'text', hide: false
            },
            {
              headerName: '订单号', width: 120, field: 'orderId', filter: 'text', hide: false
            },
            {
              headerName: '开单时间', width: 120, field: 'OrderDate', filter: 'text', hide: false
            },
            {
              headerName: '司机姓名', width: 120, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '收货单位', width: 120, field: 'consigneeAddr', filter: 'text', hide: false
            },
            {
              headerName: '收货人姓名', width: 120, field: 'consignee', filter: 'text', hide: false
            },
            {
              headerName: '联系电话', width: 120, field: 'phone', filter: 'text', hide: false
            },
            {
              headerName: '收货地址', width: 120, field: 'address', filter: 'text', hide: false
            },
            {
              headerName: '货物名称', width: 120, field: 'goodsName', filter: 'text', hide: false
            },
            {
              headerName: '件数', width: 120, field: 'numbers', filter: 'text', hide: false
            },
            {
              headerName: '重量', width: 120, field: 'weight', filter: 'text', hide: false
            },
            {
              headerName: '体积', width: 120, field: 'volume', filter: 'text', hide: false
            },
            {
              headerName: '包装', field: 'pack', width: 120, filter: 'text', hide: false
            },
            {
              headerName: '备注', field: 'remarks', width: 120, filter: 'text', hide: false
            }
          ]
        },
        queryItemOptions: [{
          value: 1,
          label: '装载单号'
        }, {
          value: 2,
          label: '订单号'
        }, {
          value: 3,
          label: '司机姓名'
        }],
        selectvalue: 1,
        orderlist: [],
        totalpages: 1,
        pageSize: 25,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dateValue: '',
        detailVisible: false // 订单详情弹框
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      OrderDetails
    },
    methods: {
      // 订单详情弹框
      detailDoubleClick (event) {
        console.log(event.data.orderId)
        this.orderId = event.data.orderId
        this.detailVisible = true
      },
      handleSizeChange (val) {
        this.pageSize = val
      },
      handleCurrentChange (val) {
        this.currentpage = val
        this.getOrderList()
      },
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
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
      },
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
        getCurrentDelivered(para).then((res) => {
          // console.log('进入getCurrentDelivered')
          // this.gridOptions.rowData = res.data.orderlists
          // 使用gridOptions中的api方法设定RowData数据
          this.gridOptions.api.setRowData(res.data.orderlists)
          this.orderlist = res.data.orderlists
          this.totalpages = res.data.totalPages
          this.listLoading = false
        })
      },
      // 获取查询数据
      getQueryData () {
        let para = {
          queryName: this.queryName,
          queryClass: this.selectvalue,
          pageSize: this.pageSize
        }
        this.listLoading = true
        getQueryOrderList(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          this.listLoading = false
        })
      }
    },
    mounted () {
      this.getOrderList()
    }
  }
</script>
<style>
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
