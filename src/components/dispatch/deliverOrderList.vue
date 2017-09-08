<template>
  <!-- 所有的组件必须要有一个div给包裹住 -->
  <div>
    <el-dialog :title='title' :visible.sync="dialogVisible" size="full">
      <!-- 表格 -->
      <ag-grid-vue style="width: 100%;height: 70%" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :pagination="true"
                   :paginationPageSize="10"
                   :suppressPaginationPanel="true"
                   :filterChanged="gridfilterChange"
                   :rowDoubleClicked="detailDoubleClick"
      ></ag-grid-vue>
    </el-dialog>
    <!--订单详情弹框  默认隐藏，引用订单详情外部组件-->
    <el-dialog id="shuangji" title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>
  </div>
</template>
<script>
  // 引入 ag-grid 表格
  import {AgGridVue} from 'ag-grid-vue'

  export default {
    // 数据模型
    data () {
      return {
        detailVisible: false, // 订单详情弹框
        OrderListForm: {
          'id': '',
          'orderId': '',
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
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 120, field: 'id', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单账号', width: 120, field: 'orderId', suppressMenu: true, hide: false, visible: true
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
              headerName: '操作', width: 120, field: 'operation', suppressMenu: true, hide: false, visible: true
            }
          ]
        }
      }
    },
    props: ['title', 'dialogVisible', 'loaderId'],
    // 引用的组件
    components: {
      AgGridVue
    },
    // 方法
    methods: {},
    // 计算属性
    computed () {
    },
    // 监视器
    watch () {
    }
  }
</script>

<style scoped>
</style>
