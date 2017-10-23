<template>
<!-- 组件必须头元素被一个div容器包括 -->
  <div>
      <div id="top">
          <!-- 标题 -->
          <h2 style="text-align:center">待 中 转 订 单 信 息 页</h2>

          <!-- 操作栏 -->
          <div style="margin-top:2%">

          <!-- 查询菜单 -->
          <div style="margin-top:2%;float:left;">
              <el-form :inline="true" :model="formQuery" class="demo-form-inline">
                <el-form-item label="订单时间:">
                  <el-date-picker v-model="formQuery.dateInterval" type="daterange" placeholder="选择日期范围" :picker-options="pickerOptions" range-separator='/' style="width: 150px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="订单号:">
                  <el-input v-model="formQuery.orderId" placeholder="请输入订单号" style="width:124px;margin-right:5px;"></el-input>
                </el-form-item>
                <el-form-item label="中转外包公司">
                  <el-input v-model="formQuery.rouSelection" placeholder="请输入中转外包公司名" style="width:165px;margin-right:5px;"></el-input>
                </el-form-item>
                <el-form-item label="发货人姓名:">
                  <el-input v-model="formQuery.shipNam" placeholder="请输入发货人姓名" style="width:140px;margin-right:5px;"></el-input>
                </el-form-item>
                <el-form-item label="收货人姓名:">
                  <el-input v-model="formQuery.receNam" placeholder="请输入收货人姓名" style="width:140px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitQuery">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          <!-- 导出 -->
          <div style="float:right;margin-top:2%;">
              <el-button style="float:right; margin-right:10px;">导出</el-button>
              <!-- 设置div -->
              <div style="float:right;margin-right:10px;">
                <!-- 鼠标移动上“设置”按钮，浮动出属性列表弹窗 -->
                <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                  <template v-for="(collist,i) in gridOptions.columnDefs">
                    <div class="colVisible">
                      <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"  style="float: left;width: 180px">
                        {{collist.headerName}}
                      </el-checkbox>
                    </div>
                  </template>
                  <template>
                    <div class="colVisible" style="width:200px;clear:both;float:right;margin-top:10px;">
                      <el-button @click="visibleChoice(1)" size="small">全选</el-button>
                      <el-button @click="visibleChoice(2)" size="small">全不选</el-button>
                    </div>
                  </template>
                </el-popover>
                <el-button v-popover:popover1>设置</el-button>
              </div>
            </div>
      </div>
       </div>
      <!-- 清除浮动 -->
      <div style="clear: both;">
      </div>
      <!-- 表格 -->
      <div id="middle" style="margin-top:2%" v-loading="listLoading">
      <ag-grid-vue style="width: 100%;height: 580px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight="40"
                   :headerHeight="40"
                   :rowDoubleClicked="detailDoubleClick"
                   :colWidth="120"
      ></ag-grid-vue>
    </div>
      <!-- 分页 -->
      <div id="bottom" class="block" style="float:right; margin-top:30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalpages">
      </el-pagination>
    </div>

      <!--订单详情弹框  默认隐藏，引用订单详情外部组件-->
      <el-dialog id="shuangji" title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false" top="7%">
        <order-details :orderId="orderId"></order-details>
      </el-dialog>

      <!-- 是否确认中转对话框 -->
      <el-dialog title="" :visible.sync="departVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" top="30%">
          <h2 style="padding:30px">您确认中转吗？</h2>
          <div slot="footer" class="dialog-footer">
            <el-button @click="departVisible = false">取 消</el-button>
            <el-button @click="transfer" type="danger">确 定</el-button>
          </div>
      </el-dialog>

      <!--编辑待中转订单信息，只能修改合同价格 和 外包公司， 外包公司和 外包联系人需要做一个级联-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" top="5%">
        <el-form :model="tableForm">
          <el-form-item label="订单号:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.orderId"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="开单时间:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.orderTim"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="到站点:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.arrStation"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="中转起始点:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.changeStart"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="中转外包公司:" :label-width="formLabelWidth">
            <el-select v-model="selectEpolyComp" filterable placeholder="请选择中转外包公司">
              <el-option
                v-for="item in selectEpolyCompsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同价格:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.contractPrice" ></el-input>
          </el-form-item>
          <el-form-item label="外包联系人:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.lineNam"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="外包联系电话:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.lineTel"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="中转花费:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.changeFee"  :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="发货人姓名:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.shipNam" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.receNam" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="货物名称:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.goodsNam" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="包装:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.package" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="件数:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.goodsNums" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="重量:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.goodsWeight" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="体积:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.goodsVolumn" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input v-model="tableForm.orderNote" :disabled="true"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editEpolyForm">确 定</el-button>
        </div>
      </el-dialog>

</div>
</template>

<script>
  // 引入表格组件
  import {AgGridVue} from 'ag-grid-vue'
  // 引入axios后台接口
  import {queryCurrentEpibolingList, queryOrderDetail, setCurrentEpibolingEdit, setCurrentEpibolingTransfer} from '../../api/dispatch/api'
  // 引入外部 “订单详情接口"
  import OrderDetails from '../financialAdministrator/ShowOrderDetails'
  // 引入外部筛选函数组件系统
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form'
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item'
  import ElDialog from '../../../node_modules/element-ui/packages/dialog/src/component'
  import ElOption from '../../../node_modules/element-ui/packages/select/src/option'

  export default {
    data () {
      return {
        // 查询参数值表单数据
        formQuery: {
          dateInterval: '', // 时间间隔
          orderId: '', // 订单号
          rouSelection: '', // 中转外包公司名
          shipNam: '', // 发货人姓名
          receNam: '' // 收货人姓名
        },
        selectEpolyComp: '',
        selectEpolyCompsOptions: [],
        currentpage: 1, // 当前页数
        // 编辑表单 和 表格表单的数据
        tableForm: {
          'id': '', // 序号
          'orderId': '', // 订单号
          'orderTim': '', // 订单时间
          'shipNam': '', // 发货人姓名
          'receNam': '', // 收货人姓名
          'arrStation': '', // 到站
          'goodsNam': '', // 货物名称
          'goodsNums': '', // 件数
          'goodsWeight': '', // 重量
          'goodsVolumn': '', // 体积
          'package': '', // 包装
          'rouSelection': '', // 中转外包公司
          'changeStart': '', // 中转起始地
          'changeFee': '', // 中转费
          'orderNote': '', // 订单备注
          'lineTel': '', // 外包企业线路账号（联系方式）
          'lineNam': '', // 联系人
          'contractPrice': '' // 合同价格
        },
        formLabelWidth: '120px', // 编辑表格的每一行的宽度
        // Ag-grid 表格组件的data
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          rowSelection: 'single',
          columnDefs: [
            {
              headerName: '序号', field: 'id', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单号', field: 'orderId', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '开单时间', field: 'orderTim', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '到站点', field: 'arrStation', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '中转起始点', field: 'changeStart', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '中转外包公司', field: 'rouSelection', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '中转花费', field: 'changeFee', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '合同价格', field: 'contractPrice', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '外包企业联系人', width: 140, field: 'lineNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '外包企业联系电话', width: 150, field: 'lineTel', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '发货人姓名', field: 'shipNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '收货人姓名', field: 'receNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '货物名称', field: 'goodsNam', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '包装', field: 'package', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '件数', field: 'goodsNums', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '重量', field: 'goodsWeight', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '体积', field: 'goodsVolumn', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '备注', field: 'orderNote', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '操作', field: 'operate', filter: 'text', filterFramework: PartialMatchFilterComponent, hide: false, visible: true, cellRendererFramework: 'operateComponent', pinned: 'right'
            }
          ]
        },
        // 查询的参数
        orderlist: [], // 订单列表
        totalpages: 1, // 总页数
        pageSize: 25, // 每页展示的个数
        dateValue: '', // 日期值
        detailVisible: false, // 订单详情弹框
        departVisible: false, // 确定中转弹框表单
        editVisible: false, // 编辑中转列表信息的弹框表单
        editFormVisible: false, // 编辑待中转弹窗的显示与否
        listLoading: false, // 加载圆圈（默认不显示）
        colVisible: false, // 设置弹窗的显示boolean值
        // 日期控件的数据
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
        }
      }
    },
    // 实例组件
    components: {
      ElOption,
      ElDialog,
      ElFormItem,
      ElForm,
      'ag-grid-vue': AgGridVue,
      OrderDetails,
      operateComponent: {
        template: '<span style="margin-left:5px;"><el-button  class="del-but" @click="edit" type="success" size="small">编辑</el-button> <el-button  class="del-but" @click="depart" type="danger" size="mini">确认中转</el-button></span>',
        methods: {
          // 点击发车按钮，显示确认弹框，之后在弹框中将该行数据转移至已中转的页面中显示。
          depart () {
            console.log(this)
            let self = this.params.context.componentParent
            console.log('所选中的行数据:')
            self.departVisible = true
          },
          // 点击编辑按钮之后，弹出单元格的数据编辑
          edit () {
            let self = this.params.context.componentParent
            self.editFormVisible = true
            self.tableForm = this.params.data
          }
        }
      }
    },
    // 实例方法
    methods: {
      // 查询按钮点击
      submitQuery () {
      },
      // 修改表单中的合同价格和合同外包公司，确定按钮的操作
      editEpolyForm () {
        this.editFormVisible = false
      },
      // 点击“确认中转“ 按钮的”提示“信息bar
      message (result) {
        this.$message({
          message: `订单号：  ${result}    的订单，中转成功！`,
          type: 'success',
          duration: 1500
        })
      },
      // 点击确认中转 按钮
      transfer () {
        console.log(this)
        let selected = this.gridOptions.api.getSelectedRows()
        var res = this.gridOptions.api.updateRowData({remove: selected})
        this.departVisible = false
        this.message(res.remove[0].data.orderId)
      },
      // 订单详情弹框
      detailDoubleClick (event) {
        this.tableForm.orderId = event.data.orderId
        this.detailVisible = true
      },
      // 改变每页显示的个数
      handleSizeChange (val) {
        this.pageSize = val
        this.getOrderList()
      },
      // 点击当前选中的第几页
      handleCurrentChange (val) {
        this.currentpage = val
        this.getOrderList()
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
      // 点击设置按钮之后，显示需要弹出的属性名列表，选择checkbox属性
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          // 调用ag-grid 表格中的api操作
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
      // 全选  与  全不选 执行函数
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
      // 获得当前已中转的订单列表
      getQueryCurrentEpibolingList () {
        let para = {
          page: this.currentpage,
          orderId: this.orderId,
          driverName: this.driverName,
          deliverOrderId: this.deliverOrderId,
          selectvalue: this.selectvalue,
          pageSize: this.pageSize
        }
        // this.listLoading = true
        queryCurrentEpibolingList(para).then((res) => {
          this.gridOptions.api.setRowData(res.data.orderlists)
          this.orderlist = res.data.orderlists
          this.totalpages = res.data.totalPages
          // this.listLoading = false
        })
        return null
      },
      // 查看订单详情
      getQueryOrderDetail () {
        let para = {
          queryName: this.queryName,
          queryClass: this.selectvalue,
          pageSize: this.pageSize
        }
        // this.listLoading = true
        queryOrderDetail(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          // this.listLoading = false
        })
      },
      // 编辑中转订单
      updateEpibolingOrder () {
        let para = {
          order: this.order,
          changeFee: this.tableForm.changeFee,
          changeCompany: this.tableForm.rowSelection
        }
        // this.listLoading = true
        setCurrentEpibolingEdit(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          // this.listLoading = false
        })
      },
      // 编辑中转订单
      updateEpibolingTransfer () {
        let para = {
          order: this.order
        }
        // this.listLoading = true
        setCurrentEpibolingTransfer(para).then(res => {
          this.gridOptions.api.setRowData(res.data.querylists)
          this.orderlist = res.data.querylists
          this.totalpages = res.data.totalpages
          // this.listLoading = false
        })
      },
      // 获取服务端的外包公司数据
      loadEpolyComp () {
        return [
          {
            'value': '1',
            'label': '北京安特国际物流公司'
          },
          {
            'value': '2',
            'label': '北京安特国际物流公司海淀分公司'
          },
          {
            'value': '3',
            'label': '北京安特国际物流公司大兴分公司'
          },
          {
            'value': '4',
            'label': '北京安特国际物流公司昌平分公司'
          }
        ]
      }
    },
    // 挂载元素完毕，自执行函数
    mounted () {
      this.selectEpolyCompsOptions = this.loadEpolyComp()
      this.getQueryCurrentEpibolingList()
    }
  }
</script>
<style scoped>
  .el-form-item__label{
    text-align: center;
  }
  .el-select-css {
    width: 50%;
  }
  .el-input{
    color:black !important;
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
    font-size: 0.99em;
    margin-top: 4px !important;
  }
  .el-select{
    width:85%;
  }
  .el-form-item__content{
    margin-left: 130px;
  }
  .el-form-item__label{
    width: 140px !important;
  }
  .el-form-item{
    margin-bottom:10px;
  }
  .el-input{
    width:85%;
  }
</style>
