<template>
  <el-col span="14" offset="6" style="margin-top: 3%">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角 色">
        <el-select v-model="ruleForm2.selectvalue" :placeholder="ruleForm2.queryItemOptions[0].label">
          <el-option span="14" v-for="item in ruleForm2.queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓 名" prop="name">
        <el-input v-model="ruleForm2.name" placeholder="输入姓名" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="账 号" prop="phone">
        <el-input v-model.number="ruleForm2.phone" placeholder="输入手机号" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="密 码" prop="pass">
        <el-input v-model="ruleForm2.pass" auto-complete="off" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="ruleForm2.checkPass" auto-complete="off" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="站点 / 网点" prop="station">
        <el-input v-model="ruleForm2.station" placeholder="输入所属 站点/网点" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')" class="register">注 册</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  export default {
    data () {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (value.toString().length !== 11) {
              callback(new Error('请输入十一位手机号'))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('姓名不能为空'))
        }
        callback()
      }
      var checkStation = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('站点 / 网点 不能为空'))
        }
        callback()
      }
      return {
        ruleForm2: {
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
          }],
          name: '',
          station: '',
          pass: '666666',
          checkPass: '666666',
          phone: ''
        },
        rules2: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
          station: [
            {validator: checkStation, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style>
  .register {
    margin-top: 2%;
    font-size: large;
    height: 40px;
    width: 525px;
  }
</style>
