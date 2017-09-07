<template>
  <div>
    <div>
      <h2 style="text-align:center">运费异常</h2>
      <p style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
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
        :suppressCellSelection="true"
        :rowHeight=40 
        :headerHeight=30
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

    <!-- 编辑/添加异常信息弹窗 -->
    <el-dialog title="异动信息:" :visible.sync="addEditVisable">
      <el-form :model="unActForm" :rules="rules" ref="unActForm">
        <el-form-item label="订单ID：" :label-width="formLabelWidth">
          <el-input v-model="unActForm.orderID" style='width:30%'></el-input>
        </el-form-item>
        <el-form-item label="异动支出：" :label-width="formLabelWidth">
          <el-input v-model="unActForm.unActExpense" style='width:30%'></el-input>
        </el-form-item>
        <el-form-item label="异动收入：" :label-width="formLabelWidth">
          <el-input v-model="unActForm.unActIncome" style='width:30%'></el-input>
        </el-form-item>
        <el-form-item label="订单时间:" :label-width="formLabelWidth">
          <el-form-item prop="startTime">
            <el-date-picker type="date" placeholder="选择开始日期" v-model="unActForm.unActTim"
                            style="width: 150px"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="异动原因：" :label-width="formLabelWidth">
          <el-input v-model="unActForm.unActDes"></el-input>
        </el-form-item>
        <el-form-item label="处理客服名称：" :label-width="formLabelWidth">
          <el-input v-model="unActForm.serviceNam" style='width:30%'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEditVisable = false">取 消</el-button>
        <el-button type="primary" @click="addEdit">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 删除弹窗 -->
    <el-dialog title="" :visible.sync="delVisable" size="tiny">
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delVisable = false">取 消</el-button>
        <el-button @click="del">确 定</el-button>
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

    <!-- 增加/编辑成功弹窗 -->
    <el-dialog title="" :visible.sync="successVisable" size="" tiny>
      <h2 style="padding:30px">异动信息提交成功！</h2>
    </el-dialog>

  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.unActList.push({
        'orderID': i,
        'unActExpense': '异动支出' + i,
        'unActIncome': '异动收入' + i,
        'unActTim': '异动时间' + i,
        'unActDes': '异动说明' + i,
        'serviceNam': '处理客服' + i
      })
    }
  },
  data () {
    return {
      unActList: [],
      colVisible: false,
      addEditVisable: false,
      delVisable: false,
      successVisable: false,
      unActForm: {
        'orderID': '',
        'unActExpense': '',
        'unActIncome': '',
        'unActTim': '',
        'unActDes': '',
        'serviceNam': ''
      },
      rules: {
      },
      rowCount: 0,
      pageSize: 10,
      formLabelWidth: '20%',
      gridOptions: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '订单ID', width: 150, field: 'orderID', filter: 'text', hide: false
          },
          {
            headerName: '异动支出', width: 150, field: 'unActExpense', filter: 'text', hide: false
          },
          {
            headerName: '异动收入', width: 150, field: 'unActIncome', filter: 'text', hide: false
          },
          {
            headerName: '异动时间', width: 150, field: 'unActTim', filter: 'text', hide: false
          },
          {
            headerName: '异动描述', width: 290, field: 'unActDes', filter: 'text', hide: false
          },
          {
            headerName: '客服名称', width: 150, field: 'serviceNam', filter: 'text', hide: false
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
      template: '<button class="del-but" @click="setDelVisable">删 除</button>',
      methods: {
        setDelVisable () {
          this.params.context.componentParent.delVisable = true
        },
        setEditVisable () {
          /* var vehicleform = this.params.context.componentParent.vehicleForm
          vehicleform.licePlateNum = vehicleList[this.params.node.rowIndex].licePlateNum */
          this.params.context.componentParent.addEditVisable = true
          this.params.context.componentParent.unActForm = this.params.data
        }
      }
    }
  },
  methods: {
    createRowData () {
      this.gridOptions.rowData = this.unActList
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
    // 编辑/增加异动信息
    addEdit () {
      setTimeout(() => { this.addEditVisable = false }, 600)
    },
    // 删除异动信息
    del () {
      this.delVisable = false
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
    this.changeColumnDefsBoolen()
    this.calculateGrid()
  }
}
</script>
<style>
.el-select-css {
  width: 50%;
}

.del-but {
  cursor: pointer;
  float: left;
  margin-left: 30%;
  border-radius: 4px;
  background: #fff;
  border: 1px solid rgb(191, 217, 216);
  color: rgb(31, 61, 60);
  padding: 5px 10px;
  font-size: 10px
}
</style>
