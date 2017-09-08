<template>
    <!-- 所有的组件必须要有一个div给包裹住 -->
    <div>
        <el-dialog title='title' :visible.sync="dialogVisible" size="full">
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
      detailVisible: false // 订单详情弹框
    }
  },
  props: ['title', 'dialogVisible'],
    // 引用的组件
  components: {
    AgGridVue
  },
  // 方法
  methods: {

  },
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
