<template>
  <div>
    <div>
      <div style="text-align: center;margin: 10px">
        <h2>查看库存</h2>
      </div>
      <div>
        <el-form v-model="filterForm" style='margin-top:20px' :inline="true">
          <el-form-item label="出入库时间:">
            <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input v-model="filterForm.orderId" placeholder="输入订单号" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="始发站：">
            <el-select style='width:100px' v-model="filterForm.startStation">
              <el-option value="北京"></el-option>
              <el-option value='南京'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否加锁：">
            <el-select style='width:100px' v-model="filterForm.isLock">
              <el-option value="是"></el-option>
              <el-option value='否'></el-option>
            </el-select>
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
          <el-button @click="drawGrid" style='float:right'>提 取</el-button>
          <el-button v-popover:popover1 style='margin-left:10px;float:right'>设 置</el-button>
          <el-button @click="" style='float:right'>导 出</el-button>
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
        :current-page="filterForm.currentPage"
        :page-sizes="[10,20,50,100,200]"
        :page-size="filterForm.pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount">
      </el-pagination>
    </div>
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

    <!-- 加锁/减锁提示弹窗 -->
    <el-dialog title="" :visible.sync="lockVisible" size="tiny">
      <h2 style="text-align:center;padding: 30px 0 30px 0px">{{lockNote}}</h2>
    </el-dialog>

    <!-- 请求数据提示弹窗 -->
    <el-dialog title="" :visible.sync="pointVisible" size="" tiny>
      <h2 style="text-align:center;padding: 30px 0 30px 0px">{{Note}}</h2>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import OrderDetails from '../financialAdministrator/ShowOrderDetails.vue'
import api from '../../api/customerService/api.js'
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.orderList.push({
        'orderId': '订单号' + i,
        'subId': '子件号' + i,
        'startStation': '始发站' + i,
        'startTime': '入库时间' + i,
        'goodsNam': '货物名称' + i,
        'isLock': 1,
        'goodsNums': i,
        'goodsVolume': '货物体积' + i,
        'goodsWeight': '货物重量' + i
      })
      if (i % 2 === 0) {
        this.orderList[i].isLock = 0
      }
    }
  },
  data () {
    return {
      testLock: '测试按钮',
      orderList: [],
      Note: '', // 向后台发送数据后的相关提示
      lockVisible: false, // 加锁/取消加锁提示弹窗
      lockNote: '', // 加锁/取消加锁提示文字
      pointVisible: false,
      colVisible: false,
      detailVisible: false,
      errorEditVisable: false,
      orderVisable: false,
      moneyVisable: true,
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
        startTime: [], // 筛选区间, startTime[0]为起始时间，startTime[1]为终止时间[1]
        orderId: '', // 运单号
        subId: '', // 子订单ID
        shipNam: '', // 发货方
        startStation: '', // 始发站
        isLock: '', // 是否加锁
        currentPage: 1, // 当前页数
        pageSize: 20 // 页面大小
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
            headerName: '子件号', width: 150, field: 'subId', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '始发站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '是否加锁', width: 150, field: 'isLock', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '入库时间', width: 150, field: 'startTime', filter: 'text', hide: false, visible: true
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
      template: '<el-button class="del-but" type="info" style="margin-left:25px;width:100px" size="small" @click="lock">{{Template}}</el-button>',
      data () {
        return {
        }
      },
      computed: {
        Template: function () {
          let self = this.params.context.componentParent
          let data = self.gridOptions.rowData
          if (data[this.params.rowIndex].isLock === 0) {
            return '加锁'
          } else {
            return '取消加锁'
          }
          /* for (let i = 0; i < data.length; i++) {
            if (data[i].isLock === 1) {
              this.initArray.push(i)
            }
          } */
          /* console.log('template:')
          let flag = 0
          for (let i = 0; i < this.initArray.length; i++) {
            if (this.params.rowIndex === this.initArray[i]) {
              flag = 1
              break
            }
          }
          if (flag) {
            return '加锁'
          } else {
            return '取消加锁'
          } */
        }
      },
      methods: {
        lock () {
          let self = this.params.context.componentParent
          let data = self.gridOptions.rowData
          self.lockVisible = true
          // 原来是加锁
          if (!this.params.data.isLock) {
            data[this.params.rowIndex].isLock = 1
            self.lockNote = '加锁成功'
            setTimeout(() => { self.lockVisible = false }, 800)
          } else {
            data[this.params.rowIndex].isLock = 0
            self.lockNote = '已经取消加锁'
            setTimeout(() => { self.lockVisible = false }, 800)
          }
          self.gridOptions.api.setRowData(self.gridOptions.rowData)
        }
      }
    }
  },
  methods: {
    test (data) {
      console.log('选择时间类型是：')
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
      // console.log(this.filterForm)
      this.getOrderListFro()
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
      console.log('分页大小改变')
      this.filterForm.pageSize = val
      this.filterForm.currentPage = 1
      // 向后台发送数据
      console.log(this.filterForm.pageSize)
      this.getOrderListFro()
      this.gridOptions.api.paginationSetPageSize(Number(val))
    },
    // 切换不同分页
    handleCurrentChange (val) {
      console.log('切换页数为：')
      this.filterForm.currentPage = val
      // 向后台发送数据
      this.getOrderListFro()
      console.log(this.filterForm.currentPage)
      this.gridOptions.api.paginationGoToPage(val - 1)
    },
    gridfilterChange () {
      this.calculateGrid()
    },
    // 设置分页组件数据总数
    calculateGrid () {
      this.gridOptions.api.paginationSetPageSize(Number(this.filterForm.pageSize))
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
    },
    /** 提交后台相关函数 */
    // 查看订单列表
    getOrderListFro () {
      // 入参：筛选条件，第几个页面（默认为0）
      // 回参：对应页面表格数据，对应筛选条件下的页数
      api.getOrderList(this.filterForm).then(res => {
        console.log('成功')
        console.log(res)
      })
      .catch(error => {
        this.pointVisible = true
        setTimeout(() => { this.pointVisible = false }, 800)
        this.Note = '获取数据失败，网络异常请检查'
        console.log('失败')
        console.log(error)
      })
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
