<template>
  <div>
    <div>
      <h2 style="text-align:center">已 中 转 订 单 信 息 页</h2>
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

    <div style="margin-top:2%" v-loading="listLoading">
      <ag-grid-vue style="width: 100%;height: 580px" class="ag-blue" :gridOptions="gridOptions" :suppressMovableColumns="true" :enableColResize="true" :enableSorting="true" :enableFilter="true" :groupHeaders="true" :rowHeight="40" :headerHeight="30"> </ag-grid-vue>
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
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import {getCurrentEpiboliedList, getQueryEpiboliedList} from '../../api/api'
export default {
  data () {
    return {
      listLoading: false,
      queryName: '',
      currentpage: 1,
      colVisible: false,
      vehicleVisable: false,
      vehicleDelVisable: false,
      tableForm: {
        'id': '',
        'orderId': '',
        'orderDate': '',
        'destinaiton': '',
        'transitOpen': '',
        'transitCompany': '',
        'contractSpend': '',
        'contractPrice': '',
        'ectocyster': '',
        'ectocystPhone': '',
        'senderName': '',
        'receiverName': '',
        'goodsName': '',
        'numbers': '',
        'weight': '',
        'volume': '',
        'pack': '',
        'remarks': ''
      },
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
            headerName: '订单号', width: 120, field: 'orderId', filter: 'text', hide: false
          },
          {
            headerName: '开单时间', width: 120, field: 'orderDate', filter: 'text', hide: false
          },
          {
            headerName: '到站', width: 120, field: 'destinaiton', filter: 'text', hide: false
          },
          {
            headerName: '中转起始站', width: 120, field: 'transitOpen', filter: 'text', hide: false
          },
          {
            headerName: '中转公司名称', width: 120, field: 'transitCompany', filter: 'text', hide: false
          },
          {
            headerName: '中转费用', width: 120, field: 'contractSpend', filter: 'text', hide: false
          },
          {
            headerName: '合同价格', width: 120, field: 'contractPrice', filter: 'text', hide: false
          },
          {
            headerName: '外包企业联系人', width: 120, field: 'ectocyster', filter: 'text', hide: false
          },
          {
            headerName: '外包企业联系电话', width: 180, field: 'ectocystPhone', filter: 'text', hide: false
          },
          {
            headerName: '发货人姓名', width: 120, field: 'senderName', filter: 'text', hide: false
          },
          {
            headerName: '收货人姓名', field: 'receiverName', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '货物名称', field: 'goodsName', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '货物件数', field: 'numbers', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '货物重量', field: 'weight', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '货物体积', field: 'volume', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '货物包装', field: 'pack', width: 120, filter: 'text', hide: false
          },
          {
            headerName: '备注', field: 'remarks', width: 120, filter: 'text', hide: false
          }
        ]
      },
      queryItemOptions: [{
        value: 1,
        label: '外包企业查询'
      }, {
        value: 2,
        label: '订单号'
      }],
      selectvalue: 2,
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
      dateValue: ''
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  methods: {
    // queryList () {
    //   this.getQueryData()
    // },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(this.pageSize)
      this.getOrderList()
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
      getCurrentEpiboliedList(para).then((res) => {
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
      getQueryEpiboliedList(para).then(res => {
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
