<template>
  <div>
    <div>
      <h2 style="text-align:center">接送货车辆信息管理</h2>
      <div style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <!--<el-button @click="vehicleVisable = true">添加</el-button>-->
          <el-button @click="vehicleAdd">注册</el-button>
          <!-- <el-button @click="setting">设置</el-button> -->
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

    <!-- 添加车辆信息弹窗 -->
    <el-dialog title="添加接送货车辆信息:" :visible.sync="vehicleVisable" size="tiny">
      <el-form :model="vehicleForm" :rules="rules" ref="vehicleForm">
        <el-form-item label="车牌号码:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.licePlateNum" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="司机姓名:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.driverName" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.tel" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="车容量:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.capacity" style="width: 30%"></el-input>&nbsp/立方
        </el-form-item>
        <el-form-item label="吨位:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.tonnage" style="width: 30%"></el-input>&nbsp/吨
        </el-form-item>
        <el-form-item label="车辆类型:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.carType" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="车辆状态:" :label-width="formLabelWidth">
          <el-select v-model="vehicleForm.carState" style="width: 30%">
            <el-option key="available" label="可用" value="available"></el-option>
            <el-option key="unavailable" label="不可用" value="unavailable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆位置:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.carPosition" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleVisable = false">取 消</el-button>
        <el-button type="primary" @click="vehicleVisable = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑车辆信息-->
    <el-dialog title="编辑接送货车辆信息:" :visible.sync="vehicleVisable" size="tiny">
      <el-form :model="vehicleForm" :rules="rules" ref="vehicleForm">
        <el-form-item label="车牌号码:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.licePlateNum" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="司机姓名:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.driverName" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.tel" style="width: 50%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="车容量:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.capacity" style="width: 30%"></el-input>&nbsp/立方
        </el-form-item>
        <el-form-item label="吨位:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.tonnage" style="width: 30%"></el-input>&nbsp/吨
        </el-form-item>
        <el-form-item label="车辆类型:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.carType" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="车辆状态:" :label-width="formLabelWidth">
          <el-select v-model="vehicleForm.carState" style="width: 30%">
            <el-option key="available" label="可用" value="available"></el-option>
            <el-option key="unavailable" label="不可用" value="unavailable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆位置:" :label-width="formLabelWidth">
          <el-input v-model="vehicleForm.carPosition" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleVisable = false">取 消</el-button>
        <el-button type="primary" @click="vehicleVisable = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="" :visible.sync="vehicleDelVisable" size="tiny">
      <h2 style="text-align:center">确认删除车牌号为<{{vehicleForm.licePlateNum}}>的车吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleDelVisable = false">取 消</el-button>
        <el-button @click="vehicleDelVisable = false" type="primary">确 定</el-button>
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
        this.vehicleList.push({
          'licePlateNum': i,
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
        vehicleList: [],
        colVisible: false,
        vehicleVisable: false,
        vehicleDelVisable: false,
        vehicleForm: {
          'licePlateNum': '', // 车牌号
          'driverName': '', // 司机姓名
          'tel': '', // 司机联系方式
          'capacity': '', // 车容量
          'carType': '', // 车型
          'tonnage': '', // 吨位
          'carState': '', // 车辆状态
          'carPosition': '' // 车辆位置
        },
        rules: {},
        rowCount: 0,
        pageSize: 10,
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
              headerName: '车牌号码',
              width: 150,
              field: 'licePlateNum',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '司机姓名',
              width: 150,
              field: 'driverName',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '联系电话',
              width: 150,
              field: 'tel',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '车容量',
              width: 150,
              field: 'capacity',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '吨位',
              width: 150,
              field: 'tonnage',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '车辆类型',
              width: 150,
              field: 'carType',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '车辆状态',
              width: 150,
              field: 'carState',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '车辆位置',
              width: 150,
              field: 'carPosition',
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
        template: '<span><el-button class="del-but" type="info" size="small" @click="vehicleEdit">编 辑</el-button><el-button class="del-but" type="danger" size="small" @click="vehicleDel">删 除</el-button></span>',
        methods: {
          vehicleDel () {
            this.params.context.componentParent.vehicleDelVisable = true
            this.params.context.componentParent.vehicleForm.licePlateNum = this.params.data.licePlateNum
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
             vehicleform.licePlateNum = vehicleList[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.vehicleVisable = true
            this.params.context.componentParent.vehicleForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = this.vehicleList
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
      // 增加
      vehicleAdd () {
        this.vehicleVisable = true
        this.vehicleForm.licePlateNum = ''
        this.vehicleForm.driverName = ''
        this.vehicleForm.tel = ''
        this.vehicleForm.capacity = ''
        this.vehicleForm.carType = ''
        this.vehicleForm.pickUpArea = ''
        this.vehicleForm.carPosition = ''
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
      }
    },
    beforeMount () {
      this.createRowData()
    },
    mounted () {
      this.calculateGrid()
    }
  }
</script>
<style scoped>
  .el-select-css {
    width: 50%;
  }
</style>
