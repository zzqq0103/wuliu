<template>
  <el-dialog title="订单详情:" :visible.sync="detailVisible" size="large" :closeOnClickModal="false" top="30%">
  <p>{{orderId}}</p>
  </el-dialog>
</template>

<script>
  export default {
    name: 'OrderDetails',
    props: {
      orderId: {
        type: String,
        default: ''
      },
      detailVisible: {
        type: Boolean,
        default: false
      }
    }

  }
</script>
