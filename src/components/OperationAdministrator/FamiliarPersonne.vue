<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>常用收货方信息管理</h2>
    </div>
    <div>
      <div style="position: absolute">
        <el-form v-model="filterForm" ref="filterForm" inline="true"s>
          <el-form-item label="常用发货方:">
            <el-input v-model="filterForm.shipNam"></el-input>
          </el-form-item>
          <el-button @click="drawGrid()">提取</el-button>
        </el-form>
      </div>
      <div style="float: right;margin-right: 20px">
        <el-button @click="addForm">添加</el-button>
        <!--<el-button @click="setting">设置</el-button>-->
        <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)" style="float: left;width: 180px">
                {{collist.headerName}}
              </el-checkbox>
            </div>
          </template>
          <template>
            <div class="colVisible">
              <el-button @click="visibleChoice(1)" size="small">全选</el-button>
              <el-button @click="visibleChoice(2)" size="small">全不选</el-button>
            </div>
          </template>
        </el-popover>
        <el-button v-popover:popover1>设置</el-button>
      </div>

    </div>
    <div style="clear: both;"></div>
    <div style="margin-top: 10px">
      <ag-grid-vue style="width: 100%;height: 450px;" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

                   :pagination="true"
                   :paginationPageSize="10"
                   :suppressPaginationPanel="true"
                   :filterChanged="gridfilterChange"
      ></ag-grid-vue>
    </div>

    <!--添加客户信息-->
    <el-dialog title="添加客户信息:" :visible.sync="addFormVisible" size="tiny" :closeOnClickModal="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="personnelForm" ref="personnelForm" :rules="rules">
        <el-form-item label="所属发货方:" :label-width="formLabelWidth" prop="clientCompNam">
          <el-input v-model="personnelForm.shipNam" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="收货方:" :label-width="formLabelWidth" prop="clientCompNam">
          <el-input v-model="personnelForm.receNam" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="收货方联系电话:" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="personnelForm.receTelTel" :rules="rules" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="企业详细地址：" style="clear:both;width:100%" :label-width="formLabelWidth" prop="compAdr">
          <div id='focus2' class='dropdown2' style='outline:none' tabindex="0"  @click="getFocus(2)" @blur="addressVisible2=false">
            <el-input v-model="personnelForm.receAdr" style="width: 142.5px;"></el-input>
            <div class="dropdown-content" style='width:142.5px' v-show="addressVisible2">
              <ul class='dropdown-content-select'>
                <li @click="setShenfen(2)" class='dropdown-li' v-bind:class="{'selectOn':shenfen2}">省份</li>
                <li @click="setShi(2)" class='dropdown-li' v-bind:class="{'selectOn':shi2}">城市</li>
                <li @click="setQuyu(2)" class='dropdown-li' v-bind:class="{'selectOn':quyu2}">区县</li>
              </ul>
              <div class='dropdown-select'>
                <ul class='dropdown-shenfen' v-show="shenfen2">
                  <li v-for="(data,i) in this.regionList" @click="selectShenfen(2,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
                <ul class='dropdown-shi' v-show="shi2">
                  <li v-for="(data,i) in this.shiList2.sub" @click="selectShi(2,data.name)" style='text-align:center'
                      :key='data.name'>{{data.name}}
                  </li>
                </ul>
                <ul v-show="quyu2">
                  <li v-for="(data,i) in this.quList2" @click="selectQu(2,data.name)" style='text-align:center' :key='data.name'>{{data.name}}</li>
                </ul>
              </div>
            </div>
          </div>
          <el-input v-model="personnelForm.compAdr" style="width: 100px;left: 160px;position: absolute"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleForm('personnelForm')">取 消</el-button>
        <el-button @click="resetForm('personnelForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('personnelForm')">更 新</el-button>
      </div>
    </el-dialog>

    <!--分页-->
    <div style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrnetChange"
        :current-page="currentPage"
        :page-sizes="[20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount"></el-pagination>
    </div>

    <!--列表切换显示-->
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false" top="30%">
      <template v-for="(collist,i) in gridOptions.columnDefs">
        <div class="colVisible">
          <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑客户信息-->
    <el-dialog title="编辑:" :visible.sync="editFormVisible" size="tiny" :closeOnClickModal="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="所属发货方:" :label-width="formLabelWidth" prop="clientCompNam">
          <el-input v-model="editForm.shipNam" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="收货方:" :label-width="formLabelWidth" prop="clientCompNam">
          <el-input v-model="editForm.receNam" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="收货方联系电话:" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="editForm.shipTel" :rules="rules" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="企业详细地址:" :label-width="formLabelWidth" prop="compAdr">
          <el-input v-model="editForm.compAdr" style="width: 80%"></el-input>
        </el-form-item>      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleForm('editForm')">取 消</el-button>
        <el-button @click="resetForm('editForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('editForm')">更 新</el-button>
      </div>
    </el-dialog>

    <!--删除客户信息-->
    <el-dialog title="" :visible.sync="delFormVisible" size="tiny" top="30%">
      <h2 style="padding:30px">确认删除 {{editForm.clientCompNam}} 吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delFormVisible = false">取 消</el-button>
        <el-button @click="delFormVisible = false" type="danger">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  import regionJson from '../../../static/region.json'

  export default {
    created () {
      this.regionList = regionJson
    },
    data () {
//      验证电话号码
      let validatePhoneNum = (rule, value, callback) => {
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if (value === '') {
          callback(new Error('请输入电话号码'))
        } else {
          if (reg.test(value) === false) {
            callback(new Error('请输入正确电话号码'))
          }
          callback()
        }
      }
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '所属发货方',
              width: 150,
              field: 'shipNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货方',
              width: 150,
              field: 'receNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '收货方联系电话',
              width: 150,
              field: 'receTel',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '企业详细地址',
              width: 250,
              field: 'compAdr',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 120,
              suppressMenu: true,
              suppressSorting: true,
              cellRendererFramework: 'operateComponent',
              hide: false,
              visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        filterForm: {
          'shipNam': ''
        },
        personnelForm: {
          'shipNam': '',
          'receNam': '',
          'receTel': '',
          'compAdr': '', // 企业详细地址
          'province': '', // 省
          'city': '', // 市
          'adminRegion': '',
          'receAdr': ''
        },
        editForm: {
          'shipNam  ': '', //
          'receNam ': '', //
          'shipTel ': '', //
          'receAdr': '', //
          'province': '', // 省
          'compAdr': '', // 企业详细地址
          'city': '', //
          'adminRegion': ''
        },
        salesmanReq: '',
        rules: {
          clientCompNam: [{
            required: true,
            message: '请输入企业名称',
            trigger: 'blur'
          }],
          nam: [{
            required: true,
            message: '请输入联系人姓名',
            trigger: 'blur'
          }],
          tel: [{
            validator: validatePhoneNum,
            trigger: 'blur'
          }],
          compAdr: [{
            required: true,
            message: '请输入企业详细地址',
            trigger: 'blur'
          }],
          area: [{
            required: true,
            message: '请输入片区',
            trigger: 'blur'
          }],
          isTril: [{
            required: true,
            message: '请输入三方信息',
            trigger: 'blur'
          }],
          salesmanId: [{
            required: true,
            message: '请输入业务员',
            trigger: 'blur'
          }]
        },
        colVisible: false,
        addFormVisible: false,
        delFormVisible: false,
        editFormVisible: false,
        salesmanVisible: false,
        formLabelWidth: '150px',
        currentPage: 1,
        pageSize: 20,
        rowCount: 0,
        /** 地址内容 */
        shenfenSelected: '',
        shiSelected: '',
        quSelected: '',
        shenfenSelected2: '',
        shiSelected2: '',
        quSelected2: '',
        regionList: [],
        shiList: [],
        quList: [],
        shiList2: [],
        quList2: [],
        /** 地址样式 */
        addressVisible: false,
        addressVisible2: false,
        shenfen: false,
        shi: false,
        quyu: false,
        shenfen2: false,
        shi2: false,
        quyu2: false,
        inputWidth: 78,
        inputWidth2: 78,
        dropdownWidth: 78,
        isFocus: false,
        isFocus2: false,
        detailVisible: false,
        detailVisible2: false,
        isReadOnly: false,
        isReadOnly2: false,
        /** 收货人信息 */
        receComp: '',
        receTipList: ['单位111111111', '单位2', '单位3'],
        receNam: '',
        receTel: '',
        receAdr: '',
        messageErro: false
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button  class="del-but" @click="edit" type="info" size="small">编 辑</el-button><el-button class="del-but" @click="del" type="danger" size="small">删 除</el-button></span>',
        methods: {
          del () {
            let self = this.params.context.componentParent
            self.delFormVisible = true
            self.personnelForm.clientCompNam = this.params.data.clientCompNam
//            self.delFormVisible = true
//            console.log(this.params.data.clientCompNam)
          },
          edit () {
            let self = this.params.context.componentParent
            self.editFormVisible = true
            self.personnelForm = this.params.data
//            console.log(self.personnelForm)
          }
        }
      }
    },
    methods: {
      createSalesmanData () {
        this.salesmanData = testJson.salesman
        this.salesmanVisible = true
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
//      changeColumnDefsBoolen () {
//        var columnlist = this.gridOptions.columnDefs
//        for (let i = 0; i < columnlist.length; i++) {
//          columnlist[i].hide = !columnlist[i].hide
//        }
      test () {
//        this.gridOptions.api.refreshHeader()
//        console.log(this.gridOptions.columnApi.getAllColumns())
//        console.log(this.gridOptions.columnDefs[0].hide)
//        console.log(this.gridOptions.columnApi.getAllDisplayedColumns())
//        if (this.gridOptions.columnDefs[0].hide) {
//          this.gridOptions.columnDefs[0].hide = false
//        } else {
//          this.gridOptions.columnDefs[0].hide = true
//        }
//        this.gridOptions.columnApi.setColumnVisible('clientCompId', true)
//        this.gridOptions.columnApi.setColumnVisible('isTril', false)
//        console.log(this.gridOptions.columnDefs[0].hide)
//        console.log(this.gridOptions.columnApi.getColumnState())
      },
      setting () {
        this.colVisible = true
      },
      addForm () {
        this.addFormVisible = true
        this.personnelForm = {
          clientCompNam: '',
          nam: '',
          tel: '',
          compAdr: '',
          area: '',
          salesmanId: '',
          isTril: ''
        }
      },
      handleSizeChange (val) {
        this.gridOptions.api.paginationSetPageSize(Number(val))
      },
      handleCurrnetChange (val) {
        this.gridOptions.api.paginationGoToPage(val - 1)
      },
      gridfilterChange () {
        this.calculateGrid()
      },
      calculateGrid () {
        this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
        let model = this.gridOptions.api.getModel()
//        console.log(model)
//        console.log(this.gridOptions.rowData)
        let processedRows = model.getRowCount()
//        let totalRows = this.gridOptions.rowData.length
//        console.log(totalRows, processedRows)
        this.rowCount = processedRows
      },
      visibleChoice (i) {
        if (i === 1) {
          for (let j = 0; j < this.gridOptions.columnDefs.length; j++) {
            this.gridOptions.columnDefs[j].visible = true
          }
        } else if (i === 2) {
          for (let j = 0; j < this.gridOptions.columnDefs.length; j++) {
            this.gridOptions.columnDefs[j].visible = false
          }
        }
        this.updataColumnDefs(this.gridOptions.columnDefs)
      },
      updateSalesman () {
        this.personnelForm.salesmanData = this.salesmanReq
        this.salesmanVisible = false
        console.log(this.personnelForm.salesmanData)
      },
      cancleForm (formName) {
        this.resetForm(formName)
        this.addFormVisible = false
        this.editFormVisible = false
      },
      // 重置表单
      resetForm (formName) {
        this.$nextTick(function () {
          this.$refs[formName].resetFields()
        })
        this.personnelForm.receAdr = ''
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'personnelForm') {
              alert('添加成功')
            } else if (formName === 'editForm') {
              alert('编辑成功')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      createRowData () {
        this.gridOptions.rowData = testJson.regionList.list
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
      },
      drawGrid () {
        this.updateGrid()
        this.createRowData()
        this.calculateGrid()
      },
      updateGrid () {
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
      },
      //      地址选择
      getFocus (num) {
        if (num === 1) {
          this.addressVisible = true
          document.getElementById('focus1').focus()
        } else {
          this.addressVisible2 = true
          document.getElementById('focus2').focus()
        }
      },
      selectShenfen (num, name) {
        if (num === 1) {
          this.filterForm.shenfen = name
          this.shenfenSelected = name
          this.shiSelected = ''
          this.quSelected = ''
          this.quList = []
          this.shiList = []
        } else {
          this.personnelForm.shenfen = name
          this.shenfenSelected2 = name
          this.shiSelected2 = ''
          this.quSelected2 = ''
          this.quList2 = []
          this.shiList2 = []
        }
        this.personnelForm.receAdr = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
        this.filterForm.receAdr = this.shenfenSelected + this.shiSelected + this.quSelected
      },
      selectShi (num, name) {
        if (num === 1) {
          this.filterForm.shi = name
          this.shiSelected = name
          this.quSelected = ''
          this.quList = []
        } else {
          this.personnelForm.shi = name
          this.shiSelected2 = name
          this.quSelected2 = ''
          this.quList2 = []
        }
        this.personnelForm.receAdr = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
        this.filterForm.receAdr = this.shenfenSelected + this.shiSelected + this.quSelected
      },
      selectQu (num, name) {
        if (num === 1) {
          this.filterForm.adminRegion = name
          this.quSelected = name
          this.addressVisible = false
          this.inputWidth = 73
          this.dropdownWidth = 33
          this.isFocus = true
          this.detailVisible = true
          this.isReadOnly = true
        } else {
          this.personnelForm.adminRegion = name
          this.quSelected2 = name
          this.addressVisible2 = false
          this.inputWidth2 = 73
          this.dropdownWidth2 = 33
          this.isFocus2 = true
          this.detailVisible2 = true
          this.isReadOnly2 = true
        }
        this.personnelForm.receAdr = this.shenfenSelected2 + this.shiSelected2 + this.quSelected2
        this.filterForm.receAdr = this.shenfenSelected + this.shiSelected + this.quSelected
      },
      setShenfen (num) {
        if (num === 1) {
          this.shenfen = true
          this.shi = false
          this.quyu = false
        } else {
          this.shenfen2 = true
          this.shi2 = false
          this.quyu2 = false
        }
      },
      /** 设置城市级 */
      setShi (num) {
        if (num === 1) {
          this.shenfen = false
          this.shi = true
          this.quyu = false
          if (this.shenfenSelected) {
            regionJson.filter(item => {
              if (item.name === this.shenfenSelected) {
                this.shiList = item
                return true
              }
            })
          }
        } else {
          this.shenfen2 = false
          this.shi2 = true
          this.quyu2 = false
          if (this.shenfenSelected2) {
            regionJson.filter(item => {
              if (item.name === this.shenfenSelected2) {
                this.shiList2 = item
                return true
              }
            })
          }
        }
      },
      /** 设置地区 */
      setQuyu (num) {
        if (num === 1) {
          this.shenfen = false
          this.shi = false
          this.quyu = true
          if (this.shiSelected && this.shenfenSelected) {
            this.shiList.sub.filter(item => {
              if (item.name === this.shiSelected) {
                this.quList = item.sub
                return true
              }
            })
          }
        } else {
          this.shenfen2 = false
          this.shi2 = false
          this.quyu2 = true
          if (this.shiSelected2 && this.shenfenSelected2) {
            this.shiList2.sub.filter(item => {
              if (item.name === this.shiSelected2) {
                this.quList2 = item.sub
                return true
              }
            })
          }
        }
      }
    },
    beforeMount () {
//      this.createRowData()
//      this.createColumnDefs()
    },
    mounted () {
      this.calculateGrid()
//      this.changeColumnDefsBoolen()
    }
  }
</script>
<style scoped>
  .dropdown {
    width: 100%;
    margin-left: 15%
  }

  .dropdown2 {
    display: inline-block;
    width: 100%;
    float: left
  }

  .dropdown-content {
    height: 200px;
    position: absolute;
    background-color: #fff;
    margin-left: -1%;
    padding: 0;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
    z-index: 1;
    width: 78%
  }

  .dropdown-select {
    clear: both;
    height: 160px;
    overflow-y: scroll
  }

  .dropdown-select ul {
    clear: both;
    list-style-type: none
  }

  .dropdown-select ul li:hover {
    cursor: pointer;
    background-color: #D1E5E5
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-content-select {
    list-style-type: none;
  }

  .dropdown-li {
    cursor: pointer;
    border-right: 1px solid #C0C0C0;
    width: 33.33%;
    margin: 0;
    float: left;
    box-sizing: border-box;
    background-color: #D1E5E5;
    text-align: center
  }

  .dropdown-shenfen li:hover {
    cursor: pointer;
    background-color: #D1E5E5
  }

  .addressDetail {
    width: 45%;
    float: left;
    margin-left: -5%
  }

  .selectOn {
    background-color: #00d1b2;
  }

  .selectNo {
    background-color: #EEF6F6
  }

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

  .Taddress label{
    float: left;
  }
</style>
