<template>
  <!-- 所有的组件必须要有一个div给包裹住 -->
  <div style="width:100%;">
    <!--<div v-loading="listLoading">-->
    <!-- 左边表格 -->
    <div style="float:left; width: 49%;">
      <h3 style="text-align: center;color:red;">待装载订单列表</h3>
      <el-button @click="leftSelect" style="float:right;"> > </el-button>
      <el-button @click="leftSelectAll" style="float:right;margin-right:10px;"> >> </el-button>
      <p style="float:left;padding-top:20px;font-size:16px;">司机信息: <span style="color:red;">张学林 豫PE6112 13404164678</span><i class="el-icon-picture" style="margin-left:20px;font-size:18px;"></i></p>
      <ag-grid-vue style="widht:100%;height: 700px; margin-top:57px; " class="ag-blue"
                   :gridOptions="gridOptions_left"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="detailDoubleClick"
                   :animateRows="true"
                   rowSelection="multiple">
      </ag-grid-vue>
      <el-pagination small layout="prev, pager, next" :total="50" style="margin-top:20px;float:left;"> </el-pagination>
      <el-button type="primary" style="float:right; margin-top:10px;">智能配载</el-button>
    </div>
    <!-- 右边表格 -->
    <div style="margin-left: 2%; width:49%; float:left;">
      <h3 style="text-align: center;color:red;" v-if="!flag">调整订单列表</h3>
      <h3 style="text-align: center;color:red;" v-if="flag">新增新的装载单列表</h3>
      <el-button @click="rightSelect" style="float:left;"> < </el-button>
      <el-button @click="rightSelectAll" style="float:left;"> << </el-button>
      <ag-grid-vue style="width: 100%; height: 700px; margin-top:20px; float:right;" class="ag-blue"
                   :gridOptions="gridOptions_right"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :suppressRowClickSelection="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="detailDoubleClick"
                   :animateRows="true"
                   rowSelection="multiple">
      </ag-grid-vue>
      <el-pagination small layout="prev, pager, next" :total="50" style="margin-top:20px;float:left;"> </el-pagination>
      <el-button type="danger" style="float:right;margin-top:10px;" @click="cancle">取消</el-button>
      <el-button type="success" style="float:right;margin-right:30px;margin-top:10px;" @click="adjust">确定</el-button>
    </div>

    <!--订单详情弹框  默认隐藏，引用订单详情外部组件-->
    <el-dialog id="shuangji" title="订单详情:" :visible.sync="detailVisible" size="small" :modal-append-to-body=false :close-on-press-escape=false top="5%">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>

  </div>
</template>
<script>
// 引入 ag-grid 表格
import { AgGridVue } from 'ag-grid-vue'
// 引入 OrderList 订单详情
import OrderDetails from '../financialAdministrator/ShowOrderDetails.vue'
// 引入 axios 的后台请求接口
import { getOrderList } from '../../api/dispatch/api'

export default {
  // 数据模型
  data () {
    return {
      detailVisible: false, // 订单详情弹框
      orderId: '',
      orderlist: null,
      OrderListForm: {
        'id': '',
        'orderId': '',
        'orderDate': '',
        'reservationId': '',
        'departure': '',
        'arrive': '',
        'orderStatus': '',
        'warehouse': '',
        'deliverSite': '',
        'deliverName': '',
        'deliverPhone': '',
        'deliverAddress': '',
        // 'deliverArea': '',
        'consignee': '',
        'consigneeName': '',
        'consigneePhone': '',
        'consigneeAddress': '',
        // 'consigneeArea': '',
        'goodsName': '',
        'allWeights': '',
        'allVolumes': '',
        'allNumbers': '',
        'remarks': '',
        'operation': ''
      },
      gridOptions_left: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '#',
            width: 30,
            checkboxSelection: true,
            suppressSorting: true,
            suppressMenu: true,
            pinned: true
          },
          {
            headerName: '序号', width: 120, field: 'id', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '订单账号', width: 120, field: 'orderId', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '开单时间', width: 120, field: 'orderDate', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '预约单账号', width: 120, field: 'reservationId', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '始发站', width: 120, field: 'departure', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '终点站', width: 120, field: 'arrive', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '订单状态', width: 120, field: 'orderStatus', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '所属仓库', width: 120, field: 'warehouse', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货单位', width: 120, field: 'deliverSite', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货人姓名', width: 120, field: 'deliverName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货人电话', width: 120, field: 'deliverPhone', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货地址', width: 120, field: 'deliverAddress', suppressMenu: true, hide: false, visible: true
          },
          // {
          //   headerName: '序号', width: 120, field: 'deliverArea', suppressMenu: true, hide: false, visible: true
          // },
          {
            headerName: '收货单位', width: 120, field: 'consignee', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货人姓名', width: 120, field: 'consigneeName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货人联系电话', width: 120, field: 'consigneePhone', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货地址', width: 120, field: 'consigneeAddress', suppressMenu: true, hide: false, visible: true
          },
          // {
          //   headerName: '', width: 120, field: 'consigneeArea', suppressMenu: true, hide: false, visible: true
          // },
          {
            headerName: '商品名称', width: 120, field: 'goodsName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总重量', width: 120, field: 'allWeights', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总容积', width: 120, field: 'allVolumes', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总件数', width: 120, field: 'allNumbers', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '备注', width: 120, field: 'remarks', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '操作', width: 60, field: 'operation', suppressMenu: true, hide: false, visible: true
          }
        ]
      },
      gridOptions_right: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '#',
            width: 30,
            checkboxSelection: true,
            suppressSorting: true,
            suppressMenu: true,
            pinned: true
          },
          {
            headerName: '序号', width: 120, field: 'id', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '订单账号', width: 120, field: 'orderId', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '开单时间', width: 120, field: 'orderDate', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '预约单账号', width: 120, field: 'reservationId', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '始发站', width: 120, field: 'departure', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '终点站', width: 120, field: 'arrive', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '订单状态', width: 120, field: 'orderStatus', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '所属仓库', width: 120, field: 'warehouse', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货单位', width: 120, field: 'deliverSite', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货人姓名', width: 120, field: 'deliverName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货人电话', width: 120, field: 'deliverPhone', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货地址', width: 120, field: 'deliverAddress', suppressMenu: true, hide: false, visible: true
          },
          // {
          //   headerName: '序号', width: 120, field: 'deliverArea', suppressMenu: true, hide: false, visible: true
          // },
          {
            headerName: '收货单位', width: 120, field: 'consignee', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货人姓名', width: 120, field: 'consigneeName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货人联系电话', width: 120, field: 'consigneePhone', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货地址', width: 120, field: 'consigneeAddress', suppressMenu: true, hide: false, visible: true
          },
          // {
          //   headerName: '', width: 120, field: 'consigneeArea', suppressMenu: true, hide: false, visible: true
          // },
          {
            headerName: '商品名称', width: 120, field: 'goodsName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总重量', width: 120, field: 'allWeights', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总容积', width: 120, field: 'allVolumes', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总件数', width: 120, field: 'allNumbers', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '备注', width: 120, field: 'remarks', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '操作', width: 60, field: 'operation', suppressMenu: true, hide: false, visible: true
          }
        ]
      },
      gridOptions_new: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '#',
            width: 30,
            checkboxSelection: true,
            suppressSorting: true,
            suppressMenu: true,
            pinned: true
          },
          {
            headerName: '序号', width: 120, field: 'id', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '订单账号', width: 120, field: 'orderId', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '开单时间', width: 120, field: 'orderDate', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '预约单账号', width: 120, field: 'reservationId', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '始发站', width: 120, field: 'departure', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '终点站', width: 120, field: 'arrive', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '订单状态', width: 120, field: 'orderStatus', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '所属仓库', width: 120, field: 'warehouse', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货单位', width: 120, field: 'deliverSite', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货人姓名', width: 120, field: 'deliverName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货人电话', width: 120, field: 'deliverPhone', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '发货地址', width: 120, field: 'deliverAddress', suppressMenu: true, hide: false, visible: true
          },
          // {
          //   headerName: '序号', width: 120, field: 'deliverArea', suppressMenu: true, hide: false, visible: true
          // },
          {
            headerName: '收货单位', width: 120, field: 'consignee', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货人姓名', width: 120, field: 'consigneeName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货人联系电话', width: 120, field: 'consigneePhone', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '收货地址', width: 120, field: 'consigneeAddress', suppressMenu: true, hide: false, visible: true
          },
          // {
          //   headerName: '', width: 120, field: 'consigneeArea', suppressMenu: true, hide: false, visible: true
          // },
          {
            headerName: '商品名称', width: 120, field: 'goodsName', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总重量', width: 120, field: 'allWeights', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总容积', width: 120, field: 'allVolumes', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '总件数', width: 120, field: 'allNumbers', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '备注', width: 120, field: 'remarks', suppressMenu: true, hide: false, visible: true
          },
          {
            headerName: '操作', width: 60, field: 'operation', suppressMenu: true, hide: false, visible: true
          }
        ]
      }
    }
  },
  props: ['loaderId', 'flag'],
  // 引用的组件
  components: {
    AgGridVue,
    OrderDetails
  },
  // 方法
  methods: {
    // 装载单配载界面右侧添加行数据，左侧删除行数据
    addChoose (newItems) {
      this.gridOptions_right.api.updateRowData({add: newItems})
      this.gridOptions_left.api.updateRowData({remove: newItems})
    },
    // 选中左边已选的数据
    leftChoose () {
      const selectedData = this.gridOptions_left.api.getSelectedRows()
      this.addChoose(selectedData)
    },
    detailDoubleClick (event) {
      this.orderId = event.data.OrderId
      this.detailVisible = true
    },
    loadOrderList () {
      let params = {
        loaderId: this.loaderId
      }
      let _flag = this.flag
      getOrderList(params).then((res) => {
        // console.log('进入getCurrentDelivered')
        // this.gridOptions.rowData = res.data.orderlists
        // 使用gridOptions中的api方法设定RowData数据
        // this.gridOptions.rowData = res.data.orderlists
        if (_flag) {
          this.gridOptions_left.api.setRowData(res.data.orderlists)
        } else {
          this.gridOptions_left.api.setRowData(res.data.orderlists)
          this.gridOptions_right.api.setRowData(res.data.orderlists)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  // 计算属性
  computed: {},
  // 监视器
  watch: {},
  mounted () {
    this.loadOrderList()
  }
}
</script>

<style scoped>

</style>
