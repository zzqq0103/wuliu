<template>
  <div>
    <div>
      <h2 style="text-align:center">外包企业信息管理</h2>
      <div style="margin-top:1%">
        <div style="float: right">
          <!--<el-row>订单号</el-row> -->
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <el-button @click="addForm">添加</el-button>
          <!--<el-button @click="setting">设置</el-button>-->
          <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="200" trigger="hover">
            <template v-for="(collist,i) in gridOptions.columnDefs">
              <div class="colVisible">
                <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">
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
    </div>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :rowHeight="40"
                   :headerHeight="40"
      ></ag-grid-vue>
    </div>
    <div style="text-align: center;margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrnetChange"
        :current-page="currentPage"
        :page-sizes="[10,20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount">
      </el-pagination>
    </div>
    <!--注册弹框-->
    <el-dialog title="外包企业注册:" :visible.sync="enterpriseVisable" :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false" size="tiny">
      <el-form :model="enterpriseForm" :rules="rules" ref="enterpriseForm">
        <el-form-item label="公司名称:" :label-width="formLabelWidth" prop="companyname">
          <el-input v-model="enterpriseForm.companyname" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="中转起始点:" :label-width="formLabelWidth" prop="changeStart">
          <el-input v-model="enterpriseForm.changeStart" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="中转企业联系人:" :label-width="formLabelWidth" prop="changeName">
          <el-input v-model="enterpriseForm.changeName" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" :label-width="formLabelWidth" prop="id">
          <el-input v-model="enterpriseForm.id" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="enterpriseVisable = false">取 消</el-button>-->
        <el-button @click="cancleForm('enterpriseForm')">取 消</el-button>
        <el-button @click="resetForm('enterpriseForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('enterpriseForm')">注 册</el-button>
        <!--<el-button type="primary" @click="enterpriseVisable = false">确 定</el-button>-->
      </div>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog title="外包企业信息编辑:" :visible.sync="editVisable" :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false" size="tiny">
      <el-form :model="enterpriseeditForm" :rules="rules" ref="enterpriseeditForm">
        <el-form-item label="公司名称:" :label-width="formLabelWidth" prop="companyname">
          <el-input v-model="enterpriseeditForm.companyname" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="中转起始点:" :label-width="formLabelWidth" prop="changeStart">
          <el-input v-model="enterpriseeditForm.changeStart" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="中转企业联系人:" :label-width="formLabelWidth" prop="changeName">
          <el-input v-model="enterpriseeditForm.changeName" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" :label-width="formLabelWidth" prop="id">
          <el-input v-model="enterpriseeditForm.id" style="width: 50%" disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="editVisable = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="editVisable = false">确 定</el-button>-->
        <el-button @click="cancleForm('enterpriseeditForm')">取 消</el-button>
        <el-button @click="resetForm('enterpriseeditForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('enterpriseeditForm')">更 新</el-button>

      </div>
    </el-dialog>
    <el-dialog title="删除客户信息" :visible.sync="enterpriseDelVisable" size="tiny">
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="enterpriseDelVisable = false">取 消</el-button>
        <el-button @click="enterpriseDelVisable = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false">
      <template v-for="(collist,i) in gridOptions.columnDefs">
        <div>
          <el-checkbox v-model="collist.hide" @change="updataColumnDefs(gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { AgGridVue } from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'

  export default {
    data () {
      return {
        colVisible: false,
        enterpriseVisable: false,
        enterpriseDelVisable: false,
        editVisable: false,
        enterpriseForm: {
          'companyname': '', // 外包公司名称
          'changeStart': '', // 中转起始地
          'changeName': '', // 中转企业联系人
          'id': '' // 联系方式

        },
        enterpriseeditForm: {
          'companyname': '', // 外包公司名称
          'changeStart': '', // 中转起始地
          'changeName': '', // 中转企业联系人
          'id': '' // 联系方式
        },
        rules: {
          companyname: [{
            required: true, message: '请输入公司名称', trigger: 'blur'
          }],
          changeStart: [{
            required: true, message: '请输入中转起始地', trigger: 'blur'
          }],
          changeName: [{
            required: true, message: '请输入企业联系人', trigger: 'blur'
          }],
          id: [{
            required: true, message: '请输入联系方式', trigger: 'blur'
          }]
        },
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '序号',
              width: 60,
              field: 'index',
              suppressMenu: true,
              hide: false,
              visible: true
            },
            {
              headerName: '公司名称',
              width: 150,
              field: 'companyName',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转起始点',
              width: 120,
              field: 'changeStart',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转企业联系人',
              width: 150,
              field: 'changeName',
              visible: true,
              filterFramework: PartialMatchFilterComponent,
              hide: false
            },
            {
              headerName: '联系方式',
              width: 150,
              field: 'id',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 150,
              cellRendererFramework: 'operateComponent',
              suppressMenu: true,
              hide: false,
              visible: true
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button class="del-but" @click="vehicleEdit" type="info" size="small">编 辑</el-button><el-button class="del-but" @click="vehicleDel" type="danger" size="small">删 除</el-button></span>',
        methods: {
          vehicleDel () {
            this.params.context.componentParent.enterpriseDelVisable = true
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
             vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.editVisable = true
            this.enterpriseeditForm.companyname = ''
            this.enterpriseeditForm.changeStart = ''
            this.enterpriseeditForm.changeName = ''
            this.enterpriseeditForm.id = ''
//            console.log(this.params.data)
//            this.params.context.componentParent.enterpriseeditForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.enterpriseInfo.list
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
//      },
//      setting () {
//        this.colVisible = true
//      },
//      updataColumnDefs (collist) {
//        for (let i = 0; i < collist.length; i++) {
//          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
//        }
//      },
      // 增加
      addForm () {
        this.enterpriseVisable = true
        this.enterpriseForm.companyname = ''
        this.enterpriseForm.changeStart = ''
        this.enterpriseForm.changeName = ''
        this.enterpriseForm.id = ''
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
        this.rowCount = this.gridOptions.api.getModel().getRowCount()
      },
      // 提交表单，提交前验证
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'enterpriseForm') {
              alert('添加成功')
            } else if (formName === 'enterpriseeditForm') {
              alert('编辑成功')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 重置表单
      resetForm (formName) {
        this.$nextTick(function () {
          this.$refs[formName].resetFields()
        })
      },
      // 点击取消弹框时，重置表单
      cancleForm (formName) {
        this.resetForm(formName)
        this.enterpriseVisable = false
        this.editVisable = false
      }
    },
    beforeMount () {
      this.createRowData()
    },
    mounted () {
      this.changeColumnDefsBoolen()
    }
  }
</script>
<style>
  .el-select-css {
    width: 50%;
  }

  .ag-blue .ag-cell-focus {
    border: 0px solid #217346;
  }
</style>
