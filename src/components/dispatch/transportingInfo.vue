<template>
  <div>
    <div>
      <h2 style="text-align:center">待 长 途 运 输 订 单 信 息 页</h2>

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

        <div  style="float:left;">
          <el-input placeholder="请输入查询数据" icon="search"  v-model="queryName" :on-icon-click="handleIconClick" style="width:145px;"> </el-input>
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
    <div style="margin-top:2%" v-loading="listLoading">
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

    <div class="block" style="float:right; margin-top:30px;">
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentpage" :page-sizes="[25, 50, 75, 100]" :page-size="25" layout="total, sizes, prev, pager, next, jumper" :total="totalpages">
       </el-pagination>
    </div>

    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false">
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
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>
    
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import {getCurrentTransportedData, getQueryTransOrderList} from '../../api/api'
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
      transportForm: {
        'id': '',
        'waybillId': '',
        'waybillStatus': '',
        // 'adjustment': '',
        'origin': '',
        'destination': '',
        'driverName': '',
        'driverPhone': '',
        'deliveryTime': '',
        'arriveTime': '',
        'gross': '',
        'freight': '',
        'transhipment': '',
        'cashBack': '',
        'sendCost': '',
        'allWeight': '',
        'allVolume': '',
        'allNumbers': '',
        'adminName': '',
        'adminId': ''
      },
      orderId: '', // 运单号
      rules: {
      },
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
            headerName: '装载单号', width: 120, field: 'waybillId', filter: 'text', hide: false
          },
          {
            headerName: '装载单状态', width: 120, field: 'waybillStatus', filter: 'text', hide: false
          },
          // {
          //   headerName: '调整状态', width: 120, field: 'adjustment', filter: 'text', hide: false
          // },
          {
            headerName: '起始站', width: 120, field: 'origin', filter: 'text', hide: false
          },
          {
            headerName: '到达站', width: 120, field: 'destination', filter: 'text', hide: false
          },
          {
            headerName: '司机姓名', width: 120, field: 'driverName', filter: 'text', hide: false
          },
          {
            headerName: '司机电话', width: 120, field: 'driverPhone', filter: 'text', hide: false
          },
          {
            headerName: '发车时间', width: 120, field: 'deliveryTime', filter: 'text', hide: false
          },
          {
            headerName: '预计到达时间', width: 120, field: 'arriveTime', filter: 'text', hide: false
          },
          {
            headerName: '大车总毛利', width: 120, field: 'gross', filter: 'text', hide: false
          },
          {
            headerName: '总运费', width: 120, field: 'freight', filter: 'text', hide: false
          },
          {
            headerName: '总中转费', width: 120, field: 'transhipment', filter: 'text', hide: false
          },
          {
            headerName: '总返款', width: 120, field: 'cashBack', filter: 'text', hide: false
          },
          {
            headerName: '总提送费', width: 120, field: 'sendCost', filter: 'text', hide: false
          },
          {
            headerName: '总重量', width: 120, field: 'allWeight', filter: 'text', hide: false
          },
          {
            headerName: '总体积', width: 120, field: 'allVolume', filter: 'text', hide: false
          },
          {
            headerName: '总件数', width: 120, field: 'allNumbers', filter: 'text', hide: false
          },
          {
            headerName: '调度管理员姓名', field: 'adminName', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '调度管理员账号', field: 'adminId', width: 120, filter: 'text', hide: false
          }
        ]
      },
      queryItemOptions: [{
        value: 1,
        label: '装载单号'
      }, {
        value: 2,
        label: '司机姓名'
      }, {
        value: 3,
        label: '到站地点'
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
    'order-details': OrderDetails
  },
  methods: {
    // 订单详情弹框
    detailDoubleClick (event) {
      this.filterForm.orderId = event.data.orderId
      this.detailVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(this.pageSize)
      this.getQueryData()
    },
    handleCurrentChange (val) {
      this.currentpage = val
      console.log(this.currentpage)
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
      getCurrentTransportedData(para).then((res) => {
        console.log('进入getCurrentDelivered')
        // this.gridOptions.rowData = res.data.orderlists
        // 使用gridOptions中的api方法设定RowData数据
        this.gridOptions.api.setRowData(res.data.orderlists)
        this.orderlist = res.data.orderlists
        this.totalpages = res.data.totalPages
        // console.log(this.gridOptions.rowData)
        this.listLoading = false
      })
    },
    getQueryData () {
      let para = {
        queryName: this.queryName,
        queryClass: this.selectvalue,
        pageSize: this.pageSize
      }
      this.listLoading = true
      getQueryTransOrderList(para).then(res => {
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
