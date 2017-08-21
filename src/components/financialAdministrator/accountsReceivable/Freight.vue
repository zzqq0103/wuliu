<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>运费详情</h2>
    </div>
    <div>
      <!--<div style="float: right">-->
        <!--<el-button>开始核销</el-button>-->
        <!--<el-button>导出</el-button>-->
        <!--<el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged"></el-input>-->
      <!--</div>-->
      <div>
        <el-form :model="filterForm" ref="filterForm" :inline="true">
            <el-form-item label="订单时间:">
                <el-form-item prop="startTime">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="filterForm.startTime" style="width: 150px"></el-date-picker>
                </el-form-item>
              <span>--&nbsp</span>
                <el-form-item prop="endTime">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="filterForm.endTime" style="width: 150px"></el-date-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="区间:">
              <el-select v-model="filterForm.startPoint" placeholder="起点" style="width: 100px">
                <el-option label="北京" value="beijing"></el-option>
                <el-option label="南京" value="nanjing"></el-option>
                <el-option label="全部" value="all"></el-option>
              </el-select>
              <span>--&nbsp</span>
              <el-select v-model="filterForm.endPoint" placeholder="终点" style="width: 100px">
                <el-option label="北京" value="beijing"></el-option>
                <el-option label="南京" value="nanjing"></el-option>
                <el-option label="全部" value="all"></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="addForm">添加</el-button>
            <el-button @click="setting">设置</el-button>
        </el-form>
      </div>
    </div>
    <div style="clear: both;"></div>
    <div style="margin-top: 10px">
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
      ></ag-grid-vue>
    </div>

    <!--列表切换显示-->
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false" top="30%">
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
  import testJson from '../../../../static/test/testJSON.js'
  export default {
    data () {
      return {
        filterForm: {
          startTime: '',
          endTime: '',
          startPoint: '',
          endPoint: '',
          shipNam: '',
          payType: '',
          freiVeriState: ''
        },
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '客户企业名称', width: 150, field: 'clientCompNam', filter: 'text', hide: false
            },
            {
              headerName: '联系人姓名', width: 150, field: 'nam', filter: 'text', hide: false
            },
            {
              headerName: '联系电话', width: 150, field: 'tel', filter: 'text', hide: false
            },
            {
              headerName: '企业详细地址', width: 150, field: 'compAdr', filter: 'text', hide: false
            },
            {
              headerName: '所属片区', width: 150, field: 'area', filter: 'text', hide: false
            },
            {
              headerName: '业务员ID', width: 150, field: 'salesmanId', filter: 'text', hide: false
            },
            {
              headerName: '是否三方', width: 150, field: 'isTril', filter: 'text', hide: false
            },
            {
              headerName: '操作', field: 'value', width: 150, cellRendererFramework: 'operateComponent', hide: false
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
        formLabelWidth: '150px'
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button class="del-but" @click="del">删 除</el-button><el-button  class="del-but" @click="edit">编 辑</el-button></span>',
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
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
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
      test () {
        console.log(this.gridOptions.columnDefs)
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
      }
    },
    beforeMount () {
      this.createRowData()
//      this.createColumnDefs()
    },
    mounted () {
      this.changeColumnDefsBoolen()
    }
  }
</script>
<style>
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
