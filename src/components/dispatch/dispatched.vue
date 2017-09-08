<template>
  <div>
    <!-- 对话框 -->
    <el-dialog title="装载单信息" :visible.sync="dispatchVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // 引入表格组件
  // import { AgGridVue } from 'ag-grid-vue'
  // 引入axios后台接口
  //   import {getCurrentDelivered, getQueryOrderList} from '../../api/api'
  export default {
    // 数据模型
    data () {
      return {}
    },
    props: ['dispatchVisible', 'loadId'],
    // 引用的组件
    components: {},
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
