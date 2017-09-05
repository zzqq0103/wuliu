<template>
  <div>
    <div>
      <h2 style="text-align:center">外包企业信息管理</h2>
      <p style="margin-top:1%">
      <div style="float: right">
        <!-- <el-row>订单号</el-row> -->
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
                   :rowHeight="40"
                   :headerHeight="30"
      ></ag-grid-vue>
    </div>

    <el-dialog title="外包企业信息:" :visible.sync="enterpriseVisable">
      <el-form :model="enterpriseForm" :rules="rules" ref="enterpriseForm">
        <el-form-item label="公司名称:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.licePlateNum"></el-input>
        </el-form-item>
        <el-form-item label="中转起始点:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.driverName"></el-input>
        </el-form-item>
        <el-form-item label="中转目的地:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.capacity"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.carType"></el-input>
        </el-form-item>
        <el-form-item label="合同号:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.carPosition"></el-input>
        </el-form-item>
        <el-form-item label="合同价格:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.carPositionjiage"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="enterpriseVisable = false">取 消</el-button>
        <el-button type="primary" @click="enterpriseVisable = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="enterpriseDelVisable" size="" tiny>
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
        enterpriseForm: {
          'companyname': '',
          'Transferstartingpoint': '',
          'Transferdestination': '',
          'linkman': '',
          'contact': '',
          'contractnumber': '',
          'contractprice': ''
        },
        rules: {},
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '公司名称', width: 150, field: 'companyname', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '中转起始点',
              width: 120,
              field: 'Transferstartingpoint',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转目的地',
              width: 120,
              field: 'Transferdestination',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '联系人',
              width: 150,
              field: 'linkman',
              visible: true,
              filterFramework: PartialMatchFilterComponent,
              hide: false
            },
            {
              headerName: '联系方式',
              width: 150,
              field: 'contact',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '合同号',
              width: 150,
              field: 'contractnumber',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '合同价格',
              width: 100,
              field: 'contractprice',
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
        template: '<span><button class="del-but" @click="vehicleDel">删 除</button><button class="del-but" @click="vehicleEdit">编 辑</button></span>',
        methods: {
          vehicleDel () {
            this.params.context.componentParent.enterpriseDelVisable = true
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
            vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.enterpriseVisable = true
            this.params.context.componentParent.enterpriseForm = this.params.data
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
        this.enterpriseForm.licePlateNum = ''
        this.enterpriseForm.driverName = ''
        this.enterpriseForm.tel = ''
        this.enterpriseForm.capacity = ''
        this.enterpriseForm.carType = ''
        this.enterpriseForm.pickUpArea = ''
        this.enterpriseForm.carPosition = ''
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
