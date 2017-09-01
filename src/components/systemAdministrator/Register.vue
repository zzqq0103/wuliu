<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>账号注册</h2>
    </div>
    <!--下拉选择：角色-->
    <div style="float:left;">
      <el-select v-model="selectvalue" :placeholder="queryItemOptions[0].label" style="width:130px;">
        <el-option v-for="item in queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!--输入-->
    <div>
      <el-form style="float: left" :model="totalForm" ref="totalForm" :inline="true">
        <el-form-item label="中转费合计:">
          <el-input v-model="totalForm.transferFeeTotal"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>

</script>


<style>

</style>
