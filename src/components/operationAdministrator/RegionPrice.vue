<template>
  <div>
    <div>
      <h2 style="text-align:center">区域价格管理</h2>
      <div style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>

        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="车型:">
            <el-input v-model="filterForm.carType" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="区域名称:">
            <el-input v-model="filterForm.regionName" style="width: 150px"></el-input>
          </el-form-item>
          <el-button @click="drawGrid()">提取</el-button>
        </el-form>

        <div style="float: right">
          <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
            <template v-for="(collist,i) in gridOptions.columnDefs">
              <div class="colVisible">
                <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"
                             style="float: left;width: 180px">
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
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
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
                   :filterChanged="gridfilterChange">
      </ag-grid-vue>
    </div>

    <!--分页-->
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
    <!--编辑车辆信息-->
    <el-dialog title="编辑接送货车辆信息:" :visible.sync="editVisable" size="tiny">
      <el-form :model="regionForm" :rules="rules" ref="regionForm">
        <el-form-item label="车牌号码:" :label-width="formLabelWidth" prop="licePlateNum">
          <el-input v-model="regionForm.licePlateNum" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="司机姓名:" :label-width="formLabelWidth" prop="driverName">
          <el-input v-model="regionForm.driverName" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="regionForm.tel" style="width: 50%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="车容量:" :label-width="formLabelWidth" prop="capacity">
          <el-input v-model="regionForm.capacity" style="width: 30%"></el-input>
          &nbsp/立方
        </el-form-item>
        <el-form-item label="吨位:" :label-width="formLabelWidth" prop="tonnage">
          <el-input v-model="regionForm.tonnage" style="width: 30%"></el-input>
          &nbsp/吨
        </el-form-item>
        <el-form-item label="车辆类型:" :label-width="formLabelWidth" prop="carType">
          <el-input v-model="regionForm.carType" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="车辆状态:" :label-width="formLabelWidth" prop="carState">
          <el-select v-model="regionForm.carState" style="width: 30%">
            <el-option key="available" label="可用" value="available"></el-option>
            <el-option key="unavailable" label="不可用" value="unavailable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆位置:" :label-width="formLabelWidth" prop="carPosition">
          <el-input v-model="regionForm.carPosition" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleForm('regionForm')">取 消</el-button>
        <el-button @click="resetForm('regionForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('regionForm')">更 新</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="" :visible.sync="regionDelVisable" size="tiny">
      <h2 style="text-align:center">确认删除车牌号为<{{regionForm.licePlateNum}}>的车吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="regionDelVisable = false">取 消</el-button>
        <el-button @click="regionDelVisable = false" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 列表显示弹窗 -->
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
  import {AgGridVue} from 'ag-grid-vue'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  export default {
    created () {
      for (var i = 0; i < 100; i++) {
        this.regionList.push({
          'licePlateNum': 'num' + i,
          'driverName': 'test' + i,
          'tel': '电话号码' + i,
          'contractID': '合同ID' + i,
          'contractPrice': '合同价格' + i,
          'capacity': '车容量' + i,
          'tonnage': '吨位' + i,
          'carType': '车辆类型' + i,
          'pickUpArea': '区域' + i,
          'receState': '司机状态' + i,
          'carState': '车辆状态' + i,
          'carPosition': '车辆位置' + i
        })
      }
    },
    data () {
      return {
        regionList: [],
        colVisible: false,
        regionVisable: false,
        regionDelVisable: false,
        editVisable: false,
        filterForm: {
          'regionName': '', // 区域名称
          'carType': '' // 车型
        },
        regionForm: {
          'licePlateNum': '', // 车牌号
          'driverName': '', // 司机姓名
          'tel': '', // 司机联系方式
          'capacity': '', // 车容量
          'carType': '', // 车型
          'tonnage': '', // 吨位
          'carState': '', // 车辆状态
          'carPosition': '' // 车辆位置
        },
        rerender: true, // 用于重新刷新添加的弹框
        rules: {
          licePlateNum: [{
            required: true, message: '请输入车牌号', trigger: 'blur'
          }],
          driverName: [{
            required: true, message: '请输入司机姓名', trigger: 'blur'
          }],
          tel: [{
            required: true, message: '请输入联系方式', trigger: 'blur'
          }],
          capacity: [{
            required: true, message: '请输入车容量', trigger: 'blur'
          }],
          carType: [{
            required: true, message: '请输入车型', trigger: 'blur'
          }],
          tonnage: [{
            required: true, message: '请输入吨位', trigger: 'blur'
          }],
          carState: [{
            required: true, message: '请输入车辆状态', trigger: 'blur'
          }],
          carPosition: [{
            required: true, message: '请输入车辆位置', trigger: 'blur'
          }]
        },
        rowCount: 0,
        pageSize: 10,
        currentPage: 1, // 分页当前页面
        formLabelWidth: '30%',
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
              headerName: '车型',
              width: 150,
              field: 'carType',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '所属区域名称',
              width: 150,
              field: 'regionName',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '区域起步价',
              width: 150,
              field: 'startPrice',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '区域单票价',
              width: 150,
              field: 'singleFare ',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 150,
              cellRendererFramework: 'operateComponent',
              hide: false,
              visible: true,
              suppressMenu: true,
              suppressSorting: true,
              pinned: 'right'
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button class="del-but" type="info" size="small" @click="regionEdit">编 辑</el-button><el-button class="del-but" @click="del" type="danger" size="small">删 除</el-button></span>',
        methods: {
          del () {
            let self = this.params.context.componentParent
            self.delFormVisible = true
            self.personnelForm.clientCompNam = this.params.data.clientCompNam
//            self.delFormVisible = true
//            console.log(this.params.data.clientCompNam)
          },
          regionEdit () {
            this.params.context.componentParent.editVisable = true
            this.params.context.componentParent.regionForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = this.regionList
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      setting () {
        this.colVisible = true
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
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
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
      // 设置分页组件数据总数
      calculateGrid () {
        this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
        this.rowCount = this.gridOptions.api.getModel().getRowCount()
      },
      cancleForm (formName) {
        this.resetForm(formName)
        this.editVisable = false
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
            } else if (formName === 'regionForm') {
              alert('编辑成功')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      drawGrid () {
        this.updateGrid()
        this.createRowData()
        this.calculateGrid()
      },
      updateGrid () {
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
      }
    },
    beforeMount () {
//      this.createRowData()
    },
    mounted () {
//      this.calculateGrid()
    }
//    update () {
//      console.log('update')
//    }
  }
</script>

