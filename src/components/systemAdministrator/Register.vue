<template>
  <div style="border: 2px solid #000000; width: 90%; height: 100%; text-align: center">
    <div style="margin-top: 5%">
      <h2 style="text-align:center">账 号 注 册</h2>
    </div>

    <el-col :span="7" :offset="9">
      <!--下拉选择：角色-->
      <div style="margin-top: 15%">
        <el-form>
          <el-form-item label="角色类型">
            <el-select v-model="selectvalue" :placeholder="queryItemOptions[0].label" style="width:195px">
              <el-option v-for="item in queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!--输入：手机号-->
      <div style="margin-top: 9%">
        <el-form>
          <el-form-item label="手机号">
            <el-input type="text" placeholder="输入手机号" style="width: 210px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--输入：密码-->
      <div>
        <el-form>
          <el-form-item label="密码">
            <el-input type="text" placeholder="密码不少于六位" style="width: 223px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--输入：确认密码-->

      <div>
        <el-form>
          <el-form-item label="确认密码">
            <el-input type="text" placeholder="再次输入密码" style="width: 195px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--按钮：立即注册-->
      <div style="float: right">
        <el-button type="primary" @click="confirmRegister">立即注册</el-button>
      </div>
      <!--按钮：取消-->
      <div style="float: left">
        <el-button @click="confirmCancel">取消</el-button>
      </div>
    </el-col>
  </div>
</template>


<script>
  export default{
    components: {},
    methods: {
      confirmRegister () {
      },
      confirmCancel () {
      }
    },
    data () {
      return {
        selectvalue: 1,
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
        }]
      }
    }
  }
</script>

<style>
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #00ff00;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
