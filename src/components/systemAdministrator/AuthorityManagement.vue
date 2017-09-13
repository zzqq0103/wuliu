<template>
  <div>
    <div>
      <h2 style="text-align:center">角 色 信 息 表</h2>
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
          <!--下拉选择：角色-->
          <el-select v-model="selectvalue" :placeholder="queryItemOptions[0].label" style="width:130px;">
            <el-option v-for="item in queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 150px"></el-input>
        </div>

        <div>

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
                   :headerHeight="40"
      ></ag-grid-vue>
    </div>

    <div class="block" style="float:right; margin-top:30px;">
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
    <div>
      <el-dialog title="提示" :visible.sync="delFormVisible" size="small" top="30%" :closeOnClickModal="false">
        <h2 style="padding:30px">确认删除吗？</h2>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delFormVisible = false">取 消</el-button>
          <el-button @click="delFormVisible = false" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
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
        deleteVisible: false,
        vehicleDelVisable: false,
        orderId: '', // 运单号
        tableForm: {
          'name': '',
          'gender': '',
          'phone': '',
          'station': '',
          'status': '',
          'type': ''
        },
        rules: {},
//        formLabelWidth: '140px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '调度员姓名', width: 100, field: 'id', filter: 'text', hide: false
            },
            {
              headerName: '性别', width: 100, field: 'deliverOrderId', filter: 'text', hide: false
            },
            {
              headerName: '联系电话', width: 100, field: 'orderId', filter: 'text', hide: false
            },
            {
              headerName: '所属站点', width: 100, field: 'OrderDate', filter: 'text', hide: false
            },
            {
              headerName: '调度员状态', width: 100, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '调度员类别', width: 100, field: 'consigneeAddr', filter: 'text', hide: false
            },
            {
              headerName: '操作', width: 100, field: 'consignee', cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        },
        queryItemOptions: [{
          value: 1,
          label: '调度管理员'
        }, {
          value: 2,
          label: '客服人员'
        }, {
          value: 3,
          label: '外包人员'
        }, {
          value: 4,
          label: '财务核销人员'
        }, {
          value: 5,
          label: '财务审核人员'
        }, {
          value: 6,
          label: '业务员'
        }],
        selectvalue: 1,
        orderlist: [],
        delFormVisible: false,
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
      OrderDetails,
      operateComponent: {
        template: '<span><el-button type="danger" @click="del">删 除</el-button></span>',
        methods: {
          del () {
            let self = this.params.context.componentParent
            self.delFormVisible = true
          },
          vehicleDel () {
            this.params.context.componentParent.vehicleDelVisable = true
          }
        }
      }
    },
    methods: {
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
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
</style>
