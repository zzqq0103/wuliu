
<template>
  <div>
    <div>
      <h2 style="text-align:center">车辆信息管理</h2>
      <p style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <!--<el-button @click="vehicleVisable = true">添加</el-button>-->
          <el-button @click="vehicleAdd">添加</el-button>
          <el-button @click="setting">设置</el-button>
        </div>
      </p>
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
                   :rowHeight=40
                   :headerHeight=30
      ></ag-grid-vue>
    </div>

    <el-dialog title="车辆信息:" :visible.sync="vehicleVisable">
        <el-form :model="vehicleForm" :rules="rules" ref="vehicleForm">
          <el-form-item label="车牌号码:" :label-width="formLabelWidth">
            <el-input v-model="vehicleForm.licePlateNum"></el-input>
          </el-form-item>
          <el-form-item label="司机姓名:" :label-width="formLabelWidth">
            <el-input v-model="vehicleForm.driverName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" :label-width="formLabelWidth">
            <el-input v-model="vehicleForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="车容量:" :label-width="formLabelWidth">
            <el-input v-model="vehicleForm.capacity"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型:" :label-width="formLabelWidth">
            <el-input v-model="vehicleForm.carType"></el-input>
          </el-form-item>
          <el-form-item label="车辆位置:" :label-width="formLabelWidth">
            <el-input v-model="vehicleForm.carPosition"></el-input>
          </el-form-item>
          <el-form-item label="车辆接送区域:" label-width="150px">
            <el-select v-model="vehicleForm.pickUpArea" placeholder="请选择" style="width:100%" >
                <el-option key="ct" label="长途" value="ct"></el-option>
                <el-option key="dt" label="短途" value="dt"></el-option>
                <el-option key="ctdt" label="长途与短途" value="ctdt"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="vehicleVisable = false">取 消</el-button>
          <el-button type="primary" @click="vehicleVisable = false">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="vehicleDelVisable" size="tiny">
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleDelVisable = false">取 消</el-button>
        <el-button @click="vehicleDelVisable = false">确 定</el-button>
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
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  export default {
    data () {
      return {
        colVisible: false,
        vehicleVisable: false,
        vehicleDelVisable: false,
        vehicleForm: {
          'licePlateNum': '',
          'driverName': '',
          'tel': '',
          'capacity': '',
          'carType': '',
          'pickUpArea': '',
          'carPosition': ''
        },
        rules: {
        },
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '车牌号码', width: 150, field: 'licePlateNum', filter: 'text', hide: false
            },
            {
              headerName: '司机姓名', width: 150, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '联系电话', width: 150, field: 'tel', filter: 'text', hide: false
            },
            {
              headerName: '合同号', width: 150, field: 'contractID', filter: 'text', hide: false
            },
            {
              headerName: '合同价格', width: 150, field: 'contractPrice', filter: 'text', hide: false
            },
            {
              headerName: '车容量', width: 150, field: 'capacity', filter: 'text', hide: false
            },
            {
              headerName: '吨位', width: 150, field: 'tonnage', filter: 'text', hide: false
            },
            {
              headerName: '车辆类型', width: 150, field: 'carType', filter: 'text', hide: false
            },
            {
              headerName: '车辆接送区域', width: 150, field: 'pickUpArea', filter: 'text', hide: false
            },
            {
              headerName: '司机状态', width: 150, field: 'receState', filter: 'text', hide: false
            },
            {
              headerName: '车辆状态', width: 150, field: 'carState', filter: 'text', hide: false
            },
            {
              headerName: '车辆位置', width: 150, field: 'carPosition', filter: 'text', hide: false
            },
            {
              headerName: '操作', field: 'value', width: 150, cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><button class="del-but" @click="vehicleDel">删 除</button><button class="del-but" @click="vehicleEdit">编 辑</button></span>',
        methods: {
          vehicleDel () {
            this.params.context.componentParent.vehicleDelVisable = true
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
            vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.vehicleVisable = true
            this.params.context.componentParent.vehicleForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.vehicleInfo.list
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      changeColumnDefsBoolen () {
        var columnlist = this.gridOptions.columnDefs
        for (let i = 0; i < columnlist.length; i++) {
          columnlist[i].hide = !columnlist[i].hide
        }
      },
      setting () {
        this.colVisible = true
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
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
 .del-but {
   cursor: pointer;
   float: right;
   margin-right: 10px;
   border-radius: 4px;
   background: #fff;
   border: 1px solid rgb(191, 217, 216);
   color: rgb(31, 61, 60);
   padding: 5px 10px;
   font-size: 10px
 }
</style>
