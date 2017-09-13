<template>
  <div>
    <div>
      <h2 style="text-align:center">订单列表</h2>
      <p style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <el-button @click="toOrderAdd">添加</el-button>
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
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
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
        :rowDoubleClicked="detailDoubleClick">
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

    <!-- 添加异常信息弹窗 -->
    <el-dialog title="增加异常信息:" :visible.sync="errorEditVisable">
      <el-form :rules="rules" v-model='errorForm' ref="orderErrorForm">
        <el-form-item label="订单ID：" :label-width="formLabelWidth">
          <el-label v-model='errorForm.orderId' style='width:80%'>{{errorForm.orderId}}</el-label>
        </el-form-item>
        <el-form-item label="异常类型：" :label-width="formLabelWidth">
          <el-select  placeholder="请选择"  v-model='errorForm.errorType' @click='test()' class='col-1' style='float:left'>
            <el-option key="yes" label="订单异常" value="order"></el-option>
            <el-option key="no" label="运费异常" value="money"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="this.errorForm.errorType === 'order'">
          <el-form-item label="订单当前位置：" :label-width="formLabelWidth">
            <el-input style='width:80%'  v-model='errorForm.currPosition'></el-input>
          </el-form-item>
          <el-form-item label="订单物流状态：" :label-width="formLabelWidth">
            <el-input  style='width:80%' v-model='errorForm.orderLogiState'></el-input>
          </el-form-item>
        </div>
        <div v-else-if="this.errorForm.errorType === 'money'">
          <el-form-item label="异动支出：" :label-width="formLabelWidth">
            <el-input style='width:35%' v-model='errorForm.unActExpense'></el-input>
          </el-form-item>
          <el-form-item label="异动收入：" :label-width="formLabelWidth">
            <el-input style='width:35%' v-model='errorForm.unActIncome'></el-input>
          </el-form-item>
          <el-form-item label="异动时间：" :label-width="formLabelWidth">
            <el-date-picker type="date" placeholder="选择日期" v-model='errorForm.unActTim' style="width: 35%"></el-date-picker>
          </el-form-item>
          <el-form-item label="异动原因：" :label-width="formLabelWidth">
            <el-input style='width:80%' v-model='errorForm.unActDes'></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorEditVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitError">确 定</el-button>
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

    <!-- 订单详情弹窗 -->
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="orderList.orderId"></order-details>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import OrderDetails from '../financialAdministrator/ShowOrderDetails.vue'
import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.orderList.push({
        'orderId': 'asasas' + i,
        'shipComp': '发货单位' + i,
        'shipNam': '发货人' + i,
        'receComp': '收货单位' + i,
        'receNam': '收货人' + i,
        'goodsNam': '货物名称' + i,
        'goodsNums': i,
        'goodsVolume': '货物体积' + i,
        'goodsWeight': '货物重量' + i
      })
    }
  },
  data () {
    return {
      orderList: [],
      colVisible: false,
      detailVisible: false,
      errorEditVisable: false,
      orderVisable: false,
      moneyVisable: true,
      currentPage: 1,
      errorType: '',
      errorForm: {
        'errorType': 'order',
        'orderId': '',
        'unActExpense': '',
        'unActIncome': '',
        'unActTim': '',
        'unActDes': '',
        'serviceNam': '',
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
            headerName: '订单ID', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '发货单位', width: 150, field: 'shipComp', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '收货单位', width: 150, field: 'receComp', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '货物名称', field: 'goodsNam', width: 150, filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '件数', field: 'goodsNums', width: 150, filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '体积', field: 'goodsVolume', width: 150, filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '重量', field: 'goodsWeight', width: 150, filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          {
            headerName: '操作', field: 'value', width: 150, cellRendererFramework: 'operateComponent', hide: false, visible: true, pinned: 'right', suppressMenu: true, suppressSorting: true
          }
        ]
      }
    }
  },
  components: {
    OrderDetails,
    'ag-grid-vue': AgGridVue,
    operateComponent: {
      template: '<el-button class="del-but" type="info" style="margin-left:25%" size="small" @click="addError">增加异常</el-button>',
      methods: {
        addError () {
          let self = this.params.context.componentParent
          self.errorEditVisable = true
          self.errorForm = {
            'errorType': 'order',
            'orderId': '',
            'unActExpense': '',
            'unActIncome': '',
            'unActTim': '',
            'unActDes': '',
            'serviceNam': '',
            'orderLogiState': '',
            'currPosition': ''
          }
          self.errorForm.orderId = this.params.data.orderId
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
    submitError () {
      console.log(this.errorForm)
      this.errorEditVisable = false
    },
    // 订单详情弹框
    detailDoubleClick (event) {
      this.orderList.orderId = event.data.orderId
      this.detailVisible = true
    },
    createRowData () {
      this.gridOptions.rowData = this.orderList
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
    // 跳转到网点开单页面
    toOrderAdd () {
      this.$router.push('/orderAdd')
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
    // this.changeColumnDefsBoolen()
  }
}
</script>
<style scoped>
/* .del-but {
  cursor: pointer;
  float:left;
  margin-left:26%;
  margin-top:2%;
  border-radius: 4px;
  background: #fff;
  border: 1px solid rgb(191, 217, 216);
  color: rgb(31, 61, 60);
  padding: 5px 10px;
  font-size: 10px
} */
</style>
