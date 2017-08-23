
<template>
  <div>
    <h2 style="text-align:center;margin-top:0">新建预约单</h2>
    <div class='div-form'>
      <el-form :model="test2">
        <el-form-item label="发货方：" style="float:left;width:50%;">
          <input type="text" list="shipComp" v-model="shipComp" class='input-tishi' style="float:left;width:50%" />
          <datalist id="shipComp">
            <option v-for="item in shipTipList" :value="item" :key="item" />
          </datalist>
        </el-form-item>
        <el-form-item label="联系人：" style="float:left;width:50%">
          <el-input v-model="shipNam" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机：" style="clear:both;width:50%">
          <el-input v-model="shipTel" style="width:60%;margin-left:5%"></el-input>
        </el-form-item>
        <el-form-item label="提货地址：" style="clear:both;width:100%">
          <el-input v-model="pickUpAdr" style="width:78%;margin-left:-2%"></el-input>
        </el-form-item>
        <el-form-item label="货物名称：" style="float:left;width:50%">
          <el-input v-model="goodsNam" style="width:60%;margin-left:-4%"></el-input>
        </el-form-item>
        <el-form-item label="件数：" style="float:left;width:50%">
          <el-input v-model="goodsNums" style="width:60%;margin-left:5%"></el-input>
        </el-form-item>
        <el-form-item label="重量：" style="float:left;width:50%">
          <el-input v-model="goodsWeight" style="width:60%;margin-left:5%"></el-input>
        </el-form-item>
        <el-form-item label="体积：" style="float:left;width:50%">
          <el-input v-model="goodsVolumn" style="width:60%;margin-left:5%"></el-input>
        </el-form-item>
        <el-form-item label="包装：" style="float:left;width:50%">
          <el-input v-model="package" style="width:60%;margin-left:5%"></el-input>
        </el-form-item>
        <el-form-item label="货物备注：" style="clear:both;width:100%">
          <el-input v-model="note" style="width:78%;margin-left:-2%"></el-input>
        </el-form-item>
        <el-form-item label="收货方：" style="float:left;width:50%;">
          <input type="text" list="receComp" v-model="receComp" class='input-tishi' style="float:left;width:50%" />
          <datalist id="receComp">
            <option v-for="item in receTipList" :value="item" :key="item" />
          </datalist>
        </el-form-item>
        <el-form-item label="联系人：" style="float:left;width:50%">
          <el-input v-model="receNam" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机：" style="clear:both;width:50%">
          <el-input v-model="receTel" style="width:60%;margin-left:5%"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：" style="clear:both;width:100%">
          <el-input v-model="receAdr" style="width:78%;margin-left:-2%"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style='text-align:center'>
      <el-button style='margin-top:2%' @click="submitAppoint">保存</el-button>
      <el-button style='margin-left:10%' @click="cancleVisable=true">取消</el-button>
    </div>
    <!--提交弹窗-->
    <el-dialog title="" :visible.sync="submitVisable" size="" tiny>
      <h2 style="padding:30px">新建预约单成功！</h2>
    </el-dialog>
    <!--取消弹窗-->
    <el-dialog title="" :visible.sync="cancleVisable" size="" tiny>
      <h2 style="padding:30px">确定取消吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle_cancle">取 消</el-button>
        <el-button @click="cancle_ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      /** 发货人信息 */
      shipComp: '',
      shipTipList: ['单位1', '单位2', '单位33333'],
      shipNam: '',
      shipTel: '',
      pickUpAdr: '',
      /** 货物信息 */
      goodsNam: '',
      goodsNums: '',
      goodsWeight: '',
      goodsVolumn: '',
      package: '',
      note: '',
      /** 收货人信息 */
      receComp: '',
      receTipList: ['单位111111111', '单位2', '单位3'],
      receNam: '',
      receTel: '',
      receAdr: '',
      /** 其它 */
      cancleVisable: false,
      submitVisable: false
    }
  },
  methods: {
    getShipComp () {
      console.log('testtesttesttesttest')
    },
    cancle_cancle () {
      this.cancleVisable = false
    },
    cancle_ok () {
      this.cancleVisable = false
    },
    submitAppoint () {
      this.submitVisable = true
      setTimeout(() => { this.submitVisable = false }, 500)
    }
  }
}
</script>
<style scoped>
.div-form {
  border: 2px solid black;
  width: 60%;
  margin-left: 18%;
  display: inline-block;
  margin-top: 2%;
  padding: 2%;
  box-sizing: border-box
}

.input-tishi {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid rgb(191, 217, 216);
  box-sizing: border-box;
  color: rgb(31, 61, 60);
  display: block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}
</style>
