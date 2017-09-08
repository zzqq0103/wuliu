<template>
  <div>
    <!-- 对话框 -->
    <el-dialog title="装载单订单列表" :visible.sync="dispatchVisible" size="full" close-on-click-modal="false" modal="true"
               modal-append-to-body="true">
      <!-- 表单 -->
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">

        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">

        </el-form-item>

        <!-- 表格 -->
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

                     :pagination="true"
                     :paginationPageSize="10"
                     :suppressPaginationPanel="true"
                     :filterChanged="gridfilterChange"
                     :rowDoubleClicked="detailDoubleClick"
        ></ag-grid-vue>

      </el-form>

      <!-- footer组件 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog>
      <order-detail>

      </order-detail>
    </el-dialog>

  </div>
</template>

<script>
  // 引入表格组件
  import {AgGridVue} from 'ag-grid-vue'
  // 引入订单详情列表
  import {OrderDetail} from '../financialAdministrator/ShowOrderDetails'
  // 引入外部筛选函数组件系统
  export default {
    // 数据模型
    data () {
      return {
        // 订单详情框是否显示
        detailVisible: false
      }
    },
    props: ['dispatchVisible', 'loadId'],
    // 引用的组件
    components: {
      AgGridVue,
      OrderDetail
    },
    // 方法
    methods: {},
    // 计算属性
    computed: {
    },
    // 监视器
    watch: {
    }
  }
</script>

<style scoped>

</style>
