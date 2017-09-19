<template>
  <div>
    <el-col span="14" offset="7" style="margin-top: 3%">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色">
          <el-select v-model="ruleForm2.selectvalue" :placeholder="ruleForm2.queryItemOptions[0].label" style="width: 300px">
            <el-option span="14" v-for="item in ruleForm2.queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点/网点">
          <div style="width: 230px; float: left">
            <el-cascader
              expand-trigger="hover"
              :options="ruleForm2.stationOptions"
              @change="handleChange"
              :placeholder="ruleForm2.stationOptions[0].children[0].label">
            </el-cascader>
          </div>
          <el-button style="width: 70px; height: 35px" @click="editVisible = true" type="primary">编 辑</el-button>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm2.name" placeholder="输入姓名" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="phone">
          <el-input v-model.number="ruleForm2.phone" placeholder="输入手机号" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="ruleForm2.pass" auto-complete="off" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm2.checkPass" auto-complete="off" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')" class="register">注 册</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div>
      <el-dialog title="编辑: " :visible.sync="editVisible" size="tiny"
                 :closeOnClickModal="false"
                 :close-on-press-escape="false"
                 :show-close="false">
        <el-tree
          :data="data2"
          show-checkbox
          default-expand-all
          ref="tree"
          node-key="id"
          @node-click="clickSelect"
          style="width: 100%"
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetChecked" style="float: left">清空</el-button>
          <el-button @click="deleteStation">删除</el-button>
          <el-button>添加</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
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
      return {
        data2: [{
          label: '北京',
          children: [{
            id: 1,
            label: '西城区'
          }, {
            id: 2,
            label: '朝阳区'
          }, {
            id: 3,
            label: '海淀区'
          }]
        }, {
          label: '南京',
          children: [{
            id: 4,
            label: '玄武区'
          }, {
            id: 5,
            label: '秦淮区'
          }, {
            id: 6,
            label: '鼓楼区'
          }]
        }],
        editVisible: false,
        rules: {},
        ruleForm2: {
          selectvalue: 1,
          queryItemOptions: [{

            value: 1,
            label: '营运'
          }, {
            value: 2,
            label: '客服'
          }, {
            value: 3,
            label: '财务核销'
          }, {
            value: 4,
            label: '财务审核'
          }, {
            value: 5,
            label: '高级财务管理员'
          }, {
            value: 6,
            label: '调度'
          }, {
            value: 7,
            label: '业务员'
          }, {
            value: 8,
            label: '短途司机'
          }],
          name: '',
          pass: '666666',
          checkPass: '666666',
          phone: '',
          stationOptions: [{
            value: 'beijing',
            label: '北京',
            children: [{
              value: '1',
              label: '西城区'
            }, {
              value: '2',
              label: '朝阳区'
            }, {
              value: '3',
              label: '海淀区'
            }]
          }, {
            value: 'nanjing',
            label: '南京',
            children: [{
              value: '1',
              label: '玄武区'
            }, {
              value: '2',
              label: '秦淮区'
            }, {
              value: '3',
              label: '鼓楼区'
            }]
          }],
          selectedOptions2: []
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
          ]
        }
      }
    },
    methods: {
      resetChecked () {
        this.$refs.tree.setCheckedKeys([])
      },
      clickSelect (data) {
        var arr = []
        for (var j = 0; j < this.$refs.tree.getCheckedNodes(true).length; j++) {
          arr.push(this.$refs.tree.getCheckedNodes(true)[j].$treeNodeId)
        }
        console.log(arr)
        for (var k = 0; k < arr.length; k++) {
          if (arr[k] === data.$treeNodeId) {
            this.$refs.tree.setChecked(data, false, false)
            return 0
          }
        }
        this.$refs.tree.setChecked(data, true, false)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!')
            return false
          }
        })
      },
      deleteStation () {
        console.log(this.$refs.tree.getCheckedKeys())
      },
      handleChange (value) {
        console.log(value)
      },
      cancelEdit () {
        this.editVisible = false
        this.$refs.tree.setCheckedKeys([])
      }
    }
  }
</script>

<style>
  .register {
    margin-top: 2%;
    font-size: large;
    height: 40px;
    width: 300px;
  }
</style>
