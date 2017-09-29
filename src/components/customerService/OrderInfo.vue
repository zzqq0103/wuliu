<template>
  <div>
    <div>
      <div style="text-align: center;margin: 10px">
        <h2>查看订单列表</h2>
      </div>
      <div>
        <el-form v-model="filterForm" ref="filterForm" style='margin-top:20px' :inline="true">
          <el-form-item label="出入库时间:">
            <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发货方:">
            <el-input v-model="filterForm.shipNam" placeholder="输入发货方名称" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="订单号:">
            <el-input v-model="filterForm.orderId" placeholder="输入订单号" style="width: 150px"></el-input>
          </el-form-item>
          <!-- 设置列 -->
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
          <el-button v-popover:popover1 style='margin-left:10px;float:right'>设 置</el-button>
          <el-button @click="toOrderAdd" style='float:right'>添 加</el-button>
          <el-button @click="drawGrid" style='float:right'>提 取</el-button>
       </el-form>
      </div>
    </div>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

                   :rowDoubleClicked="detailDoubleClick"
                   :pagination="true"
                   :paginationPageSize="20"
                   :suppressPaginationPanel="true">
        
      </ag-grid-vue>
    </div>

    <!--分页-->
    <div style="text-align: center;margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount">
      </el-pagination>
    </div>

    <!-- 添加异常信息弹窗 -->
    <el-dialog title="编辑异常信息:"   :visible.sync="errorEditVisable" size="tiny"
        :closeOnClickModal="false" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false" 
        :show-close="false">
      <el-form :model='errorForm' :rules="rules" ref="errorForm">
        <el-form-item label="订单ID：" :label-width="formLabelWidth">
          <el-label v-model='errorForm.orderId' style='width:80%'>{{errorForm.orderId}}</el-label>
        </el-form-item>
        <el-form-item label="异常类型：" :label-width="formLabelWidth">
          <el-select  placeholder="请选择"  v-model='errorForm.errorType' @change="resetError('errorForm')" style='float:left;width:80%'>
            <el-option key="yes" label="订单异常" value="order"></el-option>
            <el-option key="no" label="运费异常" value="money"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="this.errorForm.errorType === 'order'">
          <el-form-item label="订单物流状态：" :label-width="formLabelWidth" prop="orderLogiState">
            <!-- <el-input  style='width:80%' v-model='errorForm.orderLogiState'></el-input> -->
            <el-select placeholder="选择物流状态"  v-model='errorForm.orderLogiState' style='float:left;width:80%'>
              <el-option key="kaidan" label="新开单" value="kaidan"></el-option>
              <el-option key="fache" label="发车" value="fache"></el-option>
              <el-option key="daozhan" label="到站" value="daozhan"></el-option>
              <el-option key="zhongzhuan" label="已中转外包" value="zhongzhuan"></el-option>
              <el-option key="paisong" label="正在派送" value="paisong"></el-option>
              <el-option key="qianshou" label="已签收" value="qianshou"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单当前位置：" :label-width="formLabelWidth" prop="currPosition">
            <el-input style='width:80%'  v-model='errorForm.currPosition'></el-input>
          </el-form-item>
        </div>
        <div v-else-if="this.errorForm.errorType === 'money'">
          <el-form-item label="异动支出：" :label-width="formLabelWidth" prop="unActExpense">
            <el-input style='width:80%' v-model='errorForm.unActExpense' type="number"></el-input>
          </el-form-item>
          <el-form-item label="异动收入：" :label-width="formLabelWidth" prop="unActIncome">
            <el-input style='width:80%' v-model='errorForm.unActIncome' type="number"></el-input>
          </el-form-item>
          <el-form-item label="异动时间：" :label-width="formLabelWidth" prop="unActTim">
            <el-date-picker type="date" placeholder="选择日期" v-model='errorForm.unActTim' @focus="test(errorForm.unActTim)" style="width: 80%"></el-date-picker>
          </el-form-item>
          <el-form-item label="异动原因：" :label-width="formLabelWidth" prop="unActDes">
            <el-input style='width:80%' v-model='errorForm.unActDes'></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleError('errorForm')">取 消</el-button>
        <el-button type="primary" @click="resetError('errorForm')">重 置</el-button>
        <el-button type="primary" @click="submitError('errorForm')">确 定</el-button>
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
      errorType: 'money',
      errorForm: {
        'errorType': 'money',
        'orderId': '',
        'unActExpense': '',
        'unActIncome': '',
        'unActTim': new Date(),
        'unActDes': '',
        'serviceNam': '',
        'orderLogiState': '',
        'currPosition': ''
      },
      filterForm: {
        startTime: '', // 开始时间
        endTime: '', // 截止时间
        orderId: '', // 运单号
        shipNam: '' // 发货方
      },
      pickerOptions: {
        shortcuts: [{
          text: '上周',
          onClick (picker) {
            const now = new Date()
            const start = new Date()
            const end = new Date()
            const nowDayOfWeek = now.getDay()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek + 6))
            end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfWeek)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick (picker) {
            const now = new Date()
            const start = new Date()
            const end = new Date()
            const nowDayOfMonth = now.getDate()
            const nowMonth = now.getMonth()
            start.setDate(1)
            start.setMonth(nowMonth - 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfMonth)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '去年',
          onClick (picker) {
            const now = new Date()
            const start = new Date()
            const end = new Date()
            const nowYear = now.getFullYear()
            start.setYear(nowYear - 1)
            start.setMonth(0)
            start.setDate(1)
            end.setYear(nowYear - 1)
            end.setMonth(11)
            end.setDate(31)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今年',
          onClick (picker) {
            const start = new Date()
            const end = new Date()
            start.setMonth(0)
            start.setDate(1)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          const now = new Date()
          const timeYear = time.getFullYear()
          const nowYear = now.getFullYear()
          return timeYear < (nowYear - 1)
        }
      },
      rules: {
        currPosition: [
          {required: true, message: '请输入订单当前位置', trigger: 'blur'}
        ],
        orderLogiState: [
          {required: true, message: '请输入订单当前物流状态'}
        ],
        unActExpense: [
          {required: true, message: '请输入异动支出', trigger: 'blur'},
          {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确的异动支出')) }}
        ],
        unActIncome: [
          {required: true, message: '请输入异动收入', trigger: 'blur'},
          {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确的异动收入')) }}
        ],
        unActTim: [
          {required: true, message: '请选择时间', type: 'date'}
        ],
        unActDes: [
          {required: true, message: '请填写异常描述', trigger: 'blur'}
        ]
      },
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
            headerName: '订单ID', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '发货单位', width: 150, field: 'shipComp', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '收货单位', width: 150, field: 'receComp', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '货物名称', field: 'goodsNam', width: 150, filter: 'text', hide: false, visible: true
          },
          {
            headerName: '件数', field: 'goodsNums', width: 150, filter: 'text', hide: false, visible: true
          },
          {
            headerName: '体积', field: 'goodsVolume', width: 150, filter: 'text', hide: false, visible: true
          },
          {
            headerName: '重量', field: 'goodsWeight', width: 150, filter: 'text', hide: false, visible: true
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
      template: '<el-button class="del-but" type="info" style="margin-left:25%" size="small" @click="addError">编辑异常</el-button>',
      methods: {
        addError () {
          let self = this.params.context.componentParent
          self.errorEditVisable = true
          self.errorForm = {
            'errorType': 'money',
            'orderId': '',
            'unActExpense': '',
            'unActIncome': '',
            'unActTim': new Date(),
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
    test (data) {
      console.log('选择时间类型是：')
      console.log(typeof (data))
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
    // 取消表单
    cancleError (formName) {
      this.resetError(formName)
      this.errorEditVisable = false
    },
    // 重置表单
    resetError (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 提交订单异常
    submitError (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          this.errorEditVisable = false
          // 向服务器提交数据
        } else {
          console.log('error submit!!!')
          return false
        }
      })
    },
    // 订单详情弹框
    detailDoubleClick (event) {
      this.orderList.orderId = event.data.orderId
      this.detailVisible = true
    },
    createRowData () {
      this.gridOptions.rowData = this.orderList
      this.gridOptions.api.setRowData(this.gridOptions.rowData)
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
    // 分页大小改变，提交后台发送数据
    handleSizeChange (val) {
      this.gridOptions.api.paginationSetPageSize(Number(val))
    },
    // 跳转页数发生变化，提交后台发送数据
    handleCurrentChange (val) {
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
    // 绘制表格
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
    // this.createRowData()
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
