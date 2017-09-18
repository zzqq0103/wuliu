<template>
  <div class="header">
    <div class="logo">物流管理系统</div>
    <div class="user-info">

      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img src="../../../static/img/img.jpg" class="user-logo">
          {{username}}&nbsp{{personalForm.roleSitOrBran}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--使用dialog进行弹框显示个人中心-->
      <el-dialog title="个人中心:" :visible.sync="personalCenterVisable" size="tiny">
        <el-form :model="personalForm" :rules="rules" ref="personalForm" class="personalForm">
          <el-form-item label="角色:" :label-width="formLabelWidth">
            <el-input v-model="personalForm.role" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名:" :label-width="formLabelWidth">
            <el-input v-model="personalForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" :label-width="formLabelWidth">
            <el-input v-model="personalForm.email"></el-input>
          </el-form-item>
          <el-form-item label="联系方式:" :label-width="formLabelWidth">
            <el-input v-model="personalForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="密码:" :label-width="formLabelWidth">
            <el-button type="text" @click="confirmPasswordVisable = true">修改密码</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="personalCenterVisable = false">取 消</el-button>
          <el-button type="primary" @click="personalCenterVisable = false">确 定</el-button>
        </div>
      </el-dialog>

      <!--修改密码提示框-->
      <el-dialog title="修改密码:" :visible.sync="confirmPasswordVisable" size="tiny" top="30%" :closeOnClickModal="false">
        <el-form :model="personalForm" :rules="rules" ref="personalForm">
          <el-form-item label="登陆旧密码:" :label-width="formLabelWidth" prop="password">
            <el-input type="password" v-model="personalForm.password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="confirmPasswordVisable = false">取 消</el-button>
          <el-button type="primary" @click="confirmPassword">下一步</el-button>
        </div>
      </el-dialog>

      <!--修改新密码-->
      <el-dialog title="修改密码:" :visible.sync="changePasswordVisable" size="tiny" top="30%" :closeOnClickModal="false">
        <el-form :model="personalForm" :rules="rules" ref="personalForm">
          <el-form-item label="请输入新密码:" :label-width="formLabelWidth" prop="newPassword">
            <el-input type="password" v-model="personalForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="请确认新密码:" :label-width="formLabelWidth" prop="confirmNewPassword">
            <el-input type="password" v-model="personalForm.confirmNewPassword"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changePasswordVisable = false">取 消</el-button>
          <el-button type="primary" @click="confirmPassword">下一步</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      // 验证两次输入的密码是否一致
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.personalForm.confirmNewPassword !== '') {
            this.$refs.personalForm.validateField('confirmNewPassword')
          }
          callback()
        }
      }
      let validateConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value !== this.personalForm.newPassword) {
          callback(new Error('两次输入的密码不一致！'))
        } else {
          callback()
        }
      }
      return {
        personalCenterVisable: false,
        confirmPasswordVisable: false,
        changePasswordVisable: false,
        personalForm: {
          role: '',
          name: '',
          email: '',
          tel: '',
          roleSitOrBran: '北京',
          password: '',
          newPassword: '',
          confirmNewPassword: ''
        },
        rules: {
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          newPassword: [{
            validator: validatePassword,
            trigger: 'blur'
          }],
          confirmNewPassword: [{
            validator: validateConfirmPassword,
            trigger: 'blur'
          }]
        },
        formLabelWidth: '25%'
      }
    },
    computed: {
      username () {
        let username = localStorage.getItem('ms_username')
        return username
      }

    },
    methods: {
      // 个人信息与退出，下拉框
      handleCommand (command) {
        if (command === 'loginout') {
          localStorage.removeItem('ms_username')
          this.$router.push('/login')
        } else if (command === 'personalCenter') {
          this.personalCenterVisable = true
        }
      },
      confirmPassword () {
        // 确认旧密码

        // 确认成功
        this.changePasswordVisable = true
        this.confirmPasswordVisable = false
      }

    }
  }
</script>

<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
  }

  .header .logo {
    float: left;
    width: 250px;
    text-align: center;
  }

  .user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
  }

  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
  }

  .user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }

  .el-dialog .el-input {
    width: 80%
  }
</style>
