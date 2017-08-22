<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>运费详情</h2>
    </div>
    <!--表格上方操作区域-->
    <div>
      <!--第一行右侧按钮-->
      <div style="float: right">
        <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 150px"></el-input>
        <el-button @click="setting">设置</el-button>
        <el-button>导出</el-button>
      </div>
      <!--第一行左侧按钮-->
      <div>
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="订单时间:">
            <el-form-item prop="startTime">
              <el-date-picker type="date" placeholder="选择开始日期" v-model="filterForm.startTime"
                              style="width: 150px"></el-date-picker>
            </el-form-item>
            <span>--&nbsp</span>
            <el-form-item prop="endTime">
              <el-date-picker type="date" placeholder="选择结束日期" v-model="filterForm.endTime"
                              style="width: 150px"></el-date-picker>
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
          <el-form-item label="类型:">
            <el-select v-model="filterForm.payType" placeholder="付款方式" style="width: 110px">
              <el-option label="现付" value="nowPay"></el-option>
              <el-option label="到付" value="cashOnDelivery"></el-option>
              <el-option label="欠付" value="inArrears"></el-option>
              <el-option label="月结" value="monthly"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="drawGrid">提取</el-button>
        </el-form>
      </div>
      <!--第二行开始-->
      <div>
        <el-form style="float: left" :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="中转费合计:">
            <el-input v-model="totalForm.transferFeeTotal"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="float: right">
        <el-button @click="verification">开始核销</el-button>
      </div>
      <!--判断当前需要显示的label-->
      <div v-if="this.filterForm.payType === 'nowPay'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="现付金额合计:">
            <el-input v-model="totalForm.nowPayTotal"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="this.filterForm.payType === 'cashOnDelivery'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="到付金额合计:">
            <el-input v-model="totalForm.cashOnDeliveryTotal"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="this.filterForm.payType === 'inArrears'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="欠付金额合计:">
            <el-input v-model="totalForm.inArrearsTotal"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="this.filterForm.payType === 'monthly'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="月结金额合计:">
            <el-input v-model="totalForm.monthlyTotal"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="clear: both;"></div>

    <!--表格-->
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
        <div v-if="collist.children">
        </div>
        <div v-else>
          <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--核销界面-->
    <el-dialog title="运费核销" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="filterForm" ref="filterForm" :inline="true">
            <el-form-item label="运单号:">
              <el-input v-model="filterForm.orderId"></el-input>
            </el-form-item>
            <el-form-item label="发货人:">
              <el-input v-model="filterForm.shipNam"></el-input>
            </el-form-item>
            <el-form-item label="类型:">
              <el-select v-model="filterForm.payType" placeholder="付款方式" style="width: 110px">
                <el-option label="现付" value="nowPay"></el-option>
                <el-option label="到付" value="cashOnDelivery"></el-option>
                <el-option label="欠付" value="inArrears"></el-option>
                <el-option label="月结" value="monthly"></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="drawGrid">提取库存</el-button>
          </el-form>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 200px"></el-input>
          <!--表格-->
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                         :gridOptions="gridOptions2"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :enableSorting="true"
                         :enableFilter="true"
                         :groupHeaders="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
            ></ag-grid-vue>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form>
            <el-form-item>
              <el-button>确认核销</el-button>
            </el-form-item>
          </el-form>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 200px"></el-input>
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                         :gridOptions="gridOptions3"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :enableSorting="true"
                         :enableFilter="true"
                         :groupHeaders="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
            ></ag-grid-vue>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../../static/test/testJSON.js'
  export default {
    data () {
      return {
        gridOptions: {
          rowData: [],
          columnDefs: [
            {
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单网点', width: 150, field: 'billBranch', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单日期', width: 150, field: 'orderTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '到站', width: 150, field: 'arrStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货人联系方式', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货人联系方式', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '品名', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'goodsNums', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '制单人', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '中转路线', width: 150, field: 'companyNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '中转费', width: 150, field: 'changeFee', filter: 'text', hide: false, visible: true
            },
            {}
          ],
          context: {
            componentParent: this
          }
        },
        gridOptions2: {
          rowData: [],
          columnDefs: [
            {
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单网点', width: 150, field: 'billBranch', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单日期', width: 150, field: 'orderTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '到站', width: 150, field: 'arrStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货人联系方式', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货人联系方式', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '品名', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'goodsNums', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '制单人', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '中转路线', width: 150, field: 'companyNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '中转费', width: 150, field: 'changeFee', filter: 'text', hide: false, visible: true
            },
            {}
          ],
          context: {
            componentParent: this
          }
        },
        gridOptions3: {
          rowData: [],
          columnDefs: [
            {
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单网点', width: 150, field: 'billBranch', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '开单日期', width: 150, field: 'orderTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '到站', width: 150, field: 'arrStation', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '发货人联系方式', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '收货人联系方式', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '品名', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'goodsNums', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '制单人', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '中转路线', width: 150, field: 'companyNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '中转费', width: 150, field: 'changeFee', filter: 'text', hide: false, visible: true
            },
            {}
          ],
          context: {
            componentParent: this
          }
        },
        filterForm: {
          startTime: '', // 开始时间
          endTime: '', // 截止时间
          startPoint: '', //  区间起点
          endPoint: '', //  区间终点
          shipNam: '', //  发货人
          payType: 'nowPay', // 类型（现付，到付，欠付，月结）
          freiVeriState: '', // 运费核销状态
          orderId: '' // 运单号
        },
        totalForm: {
          transferFeeTotal: '', // 中转费合计
          nowPayTotal: '', // 现付合计
          cashOnDeliveryTotal: '', // 到付合计
          inArrearsTotal: '', // 欠付合计
          monthlyTotal: ''// 月结合计
        },
        additionalColumnDefs: {
          nowPay: {
            headerName: '现付',
            children: [
              {
                headerName: '现付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销状态', width: 150, field: 'veriState', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true
              }
            ]
          },
          cashOnDelivery: {
            headerName: '到付',
            children: [
              {
                headerName: '到付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销状态', width: 150, field: 'veriState', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true
              }
            ]
          },
          inArrears: {
            headerName: '欠付',
            children: [
              {
                headerName: '欠付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销状态', width: 150, field: 'veriState', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true
              }
            ]
          },
          monthly: {
            headerName: '月结',
            children: [
              {
                headerName: '月结金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销状态', width: 150, field: 'veriState', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true
              },
              {
                headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true
              }
            ]
          }
        },
        rules: {},
        colVisible: false,
        verVisible: false
      }
    },
    components: {
      'ag-grid-vue': AgGridVue
    },
    methods: {
      drawGrid () {
        this.updateGrid()
        this.createRowData()
      },
      createRowData () {
        this.gridOptions.rowData = testJson.freight.list
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
      },
      updateGrid () {
        const payType = this.filterForm.payType
        const lenth = (this.gridOptions.columnDefs.length - 1)
        if (payType === 'nowPay') {
          this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.nowPay
        } else if (payType === 'cashOnDelivery') {
          this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.cashOnDelivery
        } else if (payType === 'inArrears') {
          this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.inArrears
        } else if (payType === 'monthly') {
          this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.monthly
        }
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
//        console.log(this.gridOptions.columnDefs)
      },
      updateColumnDefsVisible (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
        console.log(this.gridOptions.rowData)
      },
      changeColumnDefsBoolen () {
        const columnlist = this.gridOptions.columnDefs
        for (let i = 0; i < columnlist.length; i++) {
          columnlist[i].hide = !columnlist[i].hide
        }
      },
      test () {
        console.log(this.gridOptions.columnDefs)
      },
      setting () {
        this.colVisible = true
      },
      verification () {
        this.verVisible = true
      }
    },
//    beforeMount () {
//      this.createRowData()
//      console.log(this.gridOptions)
//    },
    mounted () {
      this.updateGrid()
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
