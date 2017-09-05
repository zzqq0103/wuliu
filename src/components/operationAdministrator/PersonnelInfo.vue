<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>客户信息管理</h2>
    </div>
    <div>
      <div style="float: right">
        <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged"></el-input>
      </div>
      <div>
        <el-button @click="addForm">添加</el-button>
        <el-button @click="setting">设置</el-button>
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
                   :headerHeight = 40

                   :pagination="true"
                   :paginationPageSize="10"
                   :suppressPaginationPanel="true"
                   :filterChanged="gridfilterChange"
      ></ag-grid-vue>
    </div>

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
        <div>
          <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加客户信息-->
    <el-dialog title="添加客户信息:" :visible.sync="addFormVisible">
      <el-form :model="personnelForm" :rules="rules" ref="personnelForm">
        <el-form-item label="客户企业名称:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.clientCompNam"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.nam"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="企业详细地址:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.compAdr"></el-input>
        </el-form-item>
        <el-form-item label="所属片区:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.area"></el-input>
        </el-form-item>
        <el-form-item label="业务员ID:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.salesmanId"></el-input>
        </el-form-item>
        <el-form-item label="是否三方:" :label-width="formLabelWidth">
          <el-select v-model="personnelForm.isTril" placeholder="请选择" style="width:100%">
            <el-option label="是" value="yes"></el-option>
            <el-option label="否" value="no"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleVisable = false">取 消</el-button>
        <el-button type="primary" @click="vehicleVisable = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑客户信息-->
    <el-dialog title="编辑:" :visible.sync="editFormVisible" size="tiny" :closeOnClickModal="false">
      <el-form :model="personnelForm" :rules="rules" ref="personnelForm">
        <el-form-item label="客户企业名称:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.clientCompNam"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.nam"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="企业详细地址:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.compAdr"></el-input>
        </el-form-item>
        <el-form-item label="所属片区:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.area"></el-input>
        </el-form-item>
        <el-form-item label="业务员ID:" :label-width="formLabelWidth">
          <el-input v-model="personnelForm.salesmanId"></el-input>
        </el-form-item>
        <el-form-item label="是否三方:" :label-width="formLabelWidth">
          <el-select v-model="personnelForm.isTril" placeholder="请选择" style="width:100%">
            <el-option label="是" value="yes"></el-option>
            <el-option label="否" value="no"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--删除客户信息-->
    <el-dialog title="" :visible.sync="delFormVisible" size="tiny" top="30%">
      <h2 style="padding:30px">确认删除 {{personnelForm.clientCompNam}} 吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delFormVisible = false">取 消</el-button>
        <el-button @click="delFormVisible = false">确 定</el-button>
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
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '客户企业名称', width: 150, field: 'clientCompNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '联系人姓名', width: 150, field: 'nam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '联系电话', width: 150, field: 'tel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '企业详细地址', width: 250, field: 'compAdr', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '所属片区', width: 150, field: 'area', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '业务员ID', width: 150, field: 'salesmanId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '是否三方', width: 150, field: 'isTril', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 150,
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
        personnelForm: {
          clientCompNam: '',
          nam: '',
          tel: '',
          compAdr: '',
          area: '',
          salesmanId: '',
          isTril: ''
        },
        rules: {},
        colVisible: false,
        addFormVisible: false,
        delFormVisible: false,
        editFormVisible: false,
        formLabelWidth: '150px',
        currentPage: 1,
        pageSize: 20,
        rowCount: 0
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button  class="del-but" @click="edit" type="info">编 辑</el-button><el-button class="del-but" @click="del" type="danger">删 除</el-button></span>',
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
            console.log(self.personnelForm)
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.personnelInfo.list
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
      test () {
//        this.gridOptions.api.refreshHeader()
        console.log(this.gridOptions.columnApi.getAllColumns())
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
        console.log(model)
        console.log(this.gridOptions.rowData)
        let processedRows = model.getRowCount()
//        let totalRows = this.gridOptions.rowData.length
//        console.log(totalRows, processedRows)
        this.rowCount = processedRows
      }
    },
    beforeMount () {
      this.createRowData()
//      this.createColumnDefs()
    },
    mounted () {
      this.calculateGrid()
//      this.changeColumnDefsBoolen()
    }
  }
</script>
<style>
  .del-but {
    cursor: pointer;
    /*float: right;*/
    /*margin-right: 10px;*/
    /*margin: 5px;*/
    border-radius: 4px;
    /*background: #fff;*/
    border: 1px solid rgb(191, 217, 216);
    color: #f9f9f9;
    font-size: .6em;
  }
</style>
