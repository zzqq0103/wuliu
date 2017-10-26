<template>
  <!-- 所有的组件必须要有一个div给包裹住 -->
  <div style="width:100%;">
    <!--<div v-loading="listLoading">-->
    <!-- 左边表格 -->
    <div style="float:left; width: 49%;">
      <h3 style="text-align: center;color:red;">库 存 订 单</h3>
      <el-button @click="leftSelect" style="float:right;"> > </el-button>
      <el-button @click="leftSelectAll" style="float:right;margin-right:10px;"> >> </el-button>
      <p style="float:left;padding-top:20px;font-size:16px;">司机信息: <span
        style="color:red;">张学林 豫PE6112 13404164678</span>
        <!--<i class="el-icon-picture" style="margin-left:20px;font-size:18px;"></i>-->
      </p>
      <ag-grid-vue style="widht:100%;height: 700px; margin-top:57px; " class="ag-blue" v-loading="listLoading"
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
      <el-pagination small layout="prev, pager, next" :total="50" style="margin-top:20px;float:left;"></el-pagination>
      <el-button type="primary" style="float:right; margin-top:10px;" v-if="flag !== 'driverList'">智能配载</el-button>
    </div>
    <!-- 右边表格 -->
    <div style="margin-left: 2%; width:49%; float:left;">
      <h3 style="text-align: center;color:red;" v-if="flag === '1'">调整订单列表</h3>
      <h3 style="text-align: center;color:red;" v-else-if="flag === '2'">新增新的装载单列表</h3>
      <h3 style="text-align: center;color:red;" v-else-if="flag === 'driverList'">短 途 送 货 司 机 送 货 订 单</h3>
      <el-button @click="rightSelect" style="float:left;"> < </el-button>
      <el-button @click="rightSelectAll" style="float:left;"> << </el-button>
      <el-form :inline="true" class="demo-form-inline" v-if="flag !== 'driverList'">
        <el-form-item label="总运费:" style="float:right;">
          <el-input v-model="CostFee" size="small"></el-input>
        </el-form-item>
      </el-form>
      <ag-grid-vue style="width: 100%; height: 700px; margin-top:20px; float:right;" class="ag-blue"
                   v-loading="listLoading"
                   :gridOptions="gridOptions_right"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :suppressRowClickSelection="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="detailDoubleClick"
                   :animateRows="true"
                   rowSelection="multiple">
      </ag-grid-vue>
      <el-pagination small layout="prev, pager, next" :total="50" style="margin-top:20px;float:left;"></el-pagination>
      <el-button type="danger" style="float:right;margin-top:10px;" @click="cancle">取消</el-button>
      <el-button type="success" style="float:right;margin-right:30px;margin-top:10px;" @click="adjust">确定</el-button>
    </div>

    <!--订单详情弹框  默认隐藏，引用订单详情外部组件-->
    <el-dialog id="shuangji" title="订单详情:" :visible.sync="detailVisible" size="small" :modal-append-to-body=false
               :close-on-press-escape=false top="5%">
      <order-details :orderId="orderId"></order-details>
    </el-dialog>

  </div>
</template>
<script>
  // 引入 ag-grid 表格
  import {AgGridVue} from 'ag-grid-vue'
  // 引入 OrderList 订单详情
  import OrderDetails from '../financialAdministrator/ShowOrderDetails.vue'
  // 引入 mock_api.js 中的接口文件
  import {queryDeliveringDisPatch} from '../../api/dispatch/mock_api'

  export default {
    // 数据模型
    data () {
      return {
        CostFee: '', // 大车总运费的确定
        detailVisible: false, // 订单详情弹框
        orderId: '',
        orderlistLeft: null,
        orderlistRight: null,
        OrderListForm: {
          'id': '',
          'orderId': '',
          'subId': '',
          'startStation': '',
          'arrStation': '',
          'shipNam': '',
          'shipTel': '',
          'shipAdr': '',
          'shipArea': '',
          'receNam': '',
          'receTel': '',
          'receAdr': '',
          'receArea': '',
          'goodsNam': '',
          'goodsNums': '',
          'goodsWeight': '',
          'goodsVolumn': '',
          'goodsPackage': '',
          'flag': ''
        },
        gridOptions_left: {
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
              headerName: '订单ID', width: 120, field: 'orderId', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '子件ID', width: 120, field: 'subId', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '始发站', width: 120, field: 'startStation', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '到站', width: 120, field: 'arrStation', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货人', width: 120, field: 'shipNam', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货人联系电话', width: 120, field: 'shipTel', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货地址', width: 120, field: 'shipAdr', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货地址所属区域', width: 120, field: 'shipArea', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货人姓名', width: 120, field: 'receNam', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货人电话', width: 120, field: 'receTel', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货地址', width: 120, field: 'receAdr', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货地址所属区域', width: 120, field: 'receArea', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 120, field: 'goodsNam', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物件数', width: 120, field: 'goodsNums', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物重量', width: 120, field: 'goodsWeight', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物体积', width: 120, field: 'goodsVolumn', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '包装', width: 120, field: 'goodsPackage', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单/子件标识', width: 120, field: 'flag', suppressMenu: true, hide: false, visible: true
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
              headerName: '序号', width: 120, field: 'id', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单ID', width: 120, field: 'orderId', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '子件ID', width: 120, field: 'subId', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '始发站', width: 120, field: 'startStation', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '到站', width: 120, field: 'arrStation', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货人', width: 120, field: 'shipNam', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货人联系电话', width: 120, field: 'shipTel', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货地址', width: 120, field: 'shipAdr', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '发货地址所属区域', width: 120, field: 'shipArea', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货人姓名', width: 120, field: 'receNam', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货人电话', width: 120, field: 'receTel', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货地址', width: 120, field: 'receAdr', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '收货地址所属区域', width: 120, field: 'receArea', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 120, field: 'goodsNam', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物件数', width: 120, field: 'goodsNums', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物重量', width: 120, field: 'goodsWeight', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '货物体积', width: 120, field: 'goodsVolumn', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '包装', width: 120, field: 'goodsPackage', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单/子件标识', width: 120, field: 'flag', suppressMenu: true, hide: false, visible: true
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
    props: ['loaderId', 'flag', 'driverTel'],
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
      queryDeliveringDispatch () {
        let para = {
          driverTel: this.driverTel
        }
        this.listloading = true
        queryDeliveringDisPatch(para).then(res => {
          this.gridOptions_left.api.setRowData(res.data.mockListLeft)
          this.gridOptions_right.api.setRowData(res.data.mockListRight)
          this.orderlistLeft = res.data.mockListLeft
          this.orderlistRight = res.data.mockListRight
          this.totalpages = res.data.totalPages
          this.listLoading = false
        })
      }
    },
    watch: {
      'driverTel': function (newvalue) {
        console.log(`this.flag: ${this.flag} 和 this.driverTel : ${this.driverTel}`)
        this.queryDeliveringDispatch()
      }
    },
    mounted () {
      this.$nextTick(function () {
        console.log(`this.flag: ${this.flag} 和 this.driverTel : ${this.driverTel}`)
        this.queryDeliveringDispatch()
      })
    }
  }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0px !important;
  }
</style>
