<template>
  <div>
    <div>
      <h2 style="text-align:center">订单异常处理</h2>
      <p style="margin-top:1%">
        <div style="float: right;margin-right:20%">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div style="margin-left:12%">
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
      </p>
    </div>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 68%;margin-left:12%;height: 450px" class="ag-blue" 
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

    <!-- 编辑/添加异常信息弹窗 -->
    <el-dialog title="更改订单异常信息:" :visible.sync="addEditVisable"  >
      <el-form :model="orderErrorForm" :rules="rules" ref="orderErrorForm">
        <el-form-item label="订单ID：" :label-width="formLabelWidth">
          <el-input v-model="orderErrorForm.orderId" style='width:80%'></el-input>
        </el-form-item>
        <el-form-item label="订单当前位置：" :label-width="formLabelWidth">
          <el-input v-model="orderErrorForm.currPosition" style='width:80%'></el-input>
        </el-form-item>
        <el-form-item label="订单物流状态：" :label-width="formLabelWidth">
          <el-input v-model="orderErrorForm.orderLogiState" style='width:80%'></el-input>
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
import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.orderErrorList.push({
        'orderId': '订单ID' + i,
        'orderLogiState': '物流状态' + i,
        'currPosition': '订单当前位置' + i
      })
    }
  },
  data () {
    return {
      orderErrorList: [],
      colVisible: false,
      addEditVisable: false,
      delVisable: false,
      successVisable: false,
      orderErrorForm: {
        'orderId': '',
        'orderLogiState': '',
        'currPosition': ''
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
            headerName: '订单ID', width: 200, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '物流状态更改', width: 200, field: 'orderLogiState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '订单位置更改', width: 200, field: 'currPosition', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '操作', field: 'value', width: 200, cellRendererFramework: 'operateComponent', hide: false, visible: true
          }
        ]
      }
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    operateComponent: {
      template: '<el-button class="del-but" type="info" size="small" style="margin-left:35%" @click="setDelVisable">删 除</el-button>',
      methods: {
        setDelVisable () {
          this.params.context.componentParent.delVisable = true
        },
        setEditVisable () {
          let self = this.params.context.componentParent
          /* var vehicleform = this.params.context.componentParent.vehicleForm
          vehicleform.licePlateNum = vehicleList[this.params.node.rowIndex].licePlateNum */
          self.addEditVisable = true
          self.orderErrorForm = this.params.data
        }
      }
    }
  },
  methods: {
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
    createRowData () {
      this.gridOptions.rowData = this.orderErrorList
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
        this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
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
</style>