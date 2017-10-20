<template>
  <div>
    <div>
      <h2 style="text-align:center">角色信息管理</h2>
      <div style="margin-top:2%">

        <div>
          <el-form :inline="true">
            <el-select v-model="selectvalue" style="width:130px;">
              <el-option v-for="item in queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-form-item style="margin-left: 20px" label="姓名:">
              <el-input v-model="filterForm.name" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item label="站点:" style="margin-left: 10px">
              <el-input v-model="filterForm.station" style="width: 150px"></el-input>
            </el-form-item>
            <el-button @click="drawGrid">提取</el-button>
          </el-form>
        </div>

      </div>
    </div>

    <div style="clear: both;">
    </div>

    <!-- 表格 -->
    <div v-loading="listLoading">
      <ag-grid-vue style="width: 100%;height: 580px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="false"
                   :enableFilter="false"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :pagination="true"
                   :suppressPaginationPanel="true"
                   :rowHeight="40"
                   :headerHeight="40"
      ></ag-grid-vue>
    </div>

    <div class="block" style="float:right; margin-top:30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="[20,50,100,200]"
        :total="rowCount"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next">
      </el-pagination>
    </div>
    <div>
      <el-dialog title="提示" :visible.sync="delFormVisible" size="tiny" top="30%"
                 :closeOnClickModal="false"
                 :close-on-press-escape="false"
                 :show-close="false">
        <h2 style="padding:30px">确认删除吗？</h2>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delFormVisible = false">取 消</el-button>
          <el-button @click="delFormVisible = false" type="danger">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import {getCurrentDelivered, getQueryOrderList} from '../../api/dispatch/api'
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  export default {
    data () {
      return {
        filterForm: {
          'name': '',
          'station': ''
        },
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
              headerName: '序号', width: 100, field: 'id', filter: 'text', hide: false
            },
            {
              headerName: '角色', width: 100, field: 'deliverOrderId', filter: 'text', hide: false
            },
            {
              headerName: '电话', width: 100, field: 'orderId', filter: 'text', hide: false
            },
            {
              headerName: '密码', width: 100, field: 'OrderDate', filter: 'text', hide: false
            },
            {
              headerName: '姓名', width: 100, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '站点', width: 100, field: 'consigneeAddr', filter: 'text', hide: false
            },
            {
              headerName: '操作', width: 100, field: 'consignee', cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        },
        queryItemOptions: [{

          value: 1,
          label: '全部'
        }, {
          value: 2,
          label: '客服'
        }, {
          value: 3,
          label: '财务核销'
        }, {
          value: 4,
          label: '财务审核'
        }, {
          value: 5,
          label: '高级财务管理员'
        }, {
          value: 6,
          label: '调度'
        }, {
          value: 7,
          label: '业务员'
        }, {
          value: 8,
          label: '短途司机'
        }, {
          value: 9,
          label: '营运'
        }],
        selectvalue: 1,
        orderlist: [],
        delFormVisible: false,
        pageSize: 20,
        rowCount: 0,
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
      handleSizeChange (val) {
        this.gridOptions.api.paginationSetPageSize(Number(val))
      },
      handleCurrentChange (val) {
        this.gridOptions.api.paginationGoToPage(val - 1)
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
          this.listLoading = false
        })
      },
      drawGrid () {
        this.getOrderList()
//        this.updateGrid()
//        this.createRowData()
      },
      updateGrid () {
      },
      createRowData () {
      }
    },
    mounted () {
//      this.getOrderList()
    }
  }
</script>

<style>
  .el-select-css {
    width: 50%;
  }
</style>
