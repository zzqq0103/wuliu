<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>其他支出详情</h2>
    </div>
    <!--表格上方操作区域-->
    <div>
      <!--第一行右侧按钮-->
      <div style="float: right">
        <!-- <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 150px"></el-input>
        <el-button @click="setting">设置</el-button>
        <el-button>导出</el-button> -->
        <el-button @click="drawGrid(1)">提取</el-button>
        <el-button>打印</el-button>
        <el-button>导出</el-button>
        <el-button @click="verification">开始核销</el-button>
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
          <!-- <el-form-item label="类型:">
            <el-select v-model="filterForm.payType" placeholder="付款方式" style="width: 110px">
              <el-option label="现付" value="nowPay"></el-option>
              <el-option label="到付" value="cashOnDelivery"></el-option>
              <el-option label="欠付" value="inArrears"></el-option>
              <el-option label="月结" value="monthly"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-button @click="drawGrid(1)">提取</el-button> -->
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
        <el-button @click="setting">设置</el-button>
      </div>
      <!--判断当前需要显示的label-->
      <div v-if="this.filterForm.payType === 'nowPay'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="现付金额合计:">
            <el-input v-model="totalForm.totalMoney"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="this.filterForm.payType === 'cashOnDelivery'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="到付金额合计:">
            <el-input v-model="totalForm.totalMoney"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="this.filterForm.payType === 'inArrears'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="欠付金额合计:">
            <el-input v-model="totalForm.totalMoney"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="this.filterForm.payType === 'monthly'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="月结金额合计:">
            <el-input v-model="totalForm.totalMoney"></el-input>
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

                   :rowDoubleClicked="detailDoubleClick"
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
        <div v-if="collist.children">
        </div>
        <div v-else>
          <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
'     <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible2" size="tiny" :closeOnClickModal="false" top="30%">
      <template v-for="(collist,i) in gridOptions2.columnDefs">
        <div v-if="collist.children">
        </div>
        <div v-else>
          <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible2 = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible3" size="tiny" :closeOnClickModal="false" top="30%">
      <template v-for="(collist,i) in gridOptions3.columnDefs">
        <div v-if="collist.children">
        </div>
        <div v-else>
          <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>


    <!--
    --核销界面
    -->
    <el-dialog title="其他支出核销" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="filterForm" ref="filterForm" :inline="true">
            <div>
              <el-form-item label="运单号:">
                <el-input v-model="filterForm.orderId"></el-input>
              </el-form-item>
              <el-form-item label="发货人:">
                <el-input v-model="filterForm.shipNam"></el-input>
              </el-form-item>
            </div>
            <div style= "margin-bottom: 22px">
              <div style="float: right">
                <el-button @click="drawGrid(2)">提取库存</el-button>
                <el-button @click="colVisible2 = true">设置</el-button>
              </div>
              <el-form-item>
                <!-- <el-select v-model="filterForm.payType" placeholder="付款方式" :closeOnClickModal="false" style="width: 110px">
                  <!-- <el-option label="现付" value="nowPay"></el-option>
                  <el-option label="到付" value="cashOnDelivery"></el-option>
                  <el-option label="欠付" value="inArrears"></el-option>
                  <el-option label="月结" value="monthly"></el-option> -->
                <!-- </el-select> -->
              </el-form-item>
            </div>
          </el-form>
          <div style="float: right">
            <el-button @click="leftSelect"> > </el-button>
            <el-button @click="leftSelectAll"> >> </el-button>
          </div>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged2" style="width: 200px"></el-input>
          <!--未核销处表格-->
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

                         :rowDoubleClicked="leftDoubleClick"
                         :animateRows="true"
                         rowSelection="multiple"
            ></ag-grid-vue>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form>
            <el-form-item>
              <el-button style="visibility: hidden">不可见的按钮（用于添加一个空行）</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="confirmSubmit">确认核销</el-button>
              <el-button @click="colVisible3 = true">设置</el-button>
            </el-form-item>
          </el-form>
          <el-button @click="rightSelect"> < </el-button>
          <el-button @click="rightSelectAll"> << </el-button>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged3" style="width: 200px"></el-input>
          <!--待核销处表格-->
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

                         :gridReady="test"
                         :rowDoubleClicked="rightDoubleClick"
                         :animateRows="true"
                         rowSelection="multiple"
            ></ag-grid-vue>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="verVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--确认核销弹框，选择支付方式与填写摘要-->
    <el-dialog title="确认核销" :visible.sync="confirmSubVisible" size="tiny" :closeOnClickModal="false">
      <el-form :model="confirmSubForm" ref="confirmSubForm" labelWidth="80px">
        <el-form-item label="支付方式">
          <el-select v-model="confirmSubForm.payMode" placeholder="支付方式" style="width: 110px">
            <el-option label="微信" value="WeChat"></el-option>
            <el-option label="支付宝" value="Alipay"></el-option>
            <el-option label="转账" value="transfer "></el-option>
            <el-option label="现金" value="cash"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要:">
          <el-input v-model="confirmSubForm.digest"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmSubVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!--警告弹窗-->
    <el-dialog title="错误" :visible.sync="errorVisible" size="tiny">
      <p>未发现需要核销的内容</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--订单详情弹框-->
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="filterForm.orderId"></order-details>
    </el-dialog>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../../static/test/texttriparte.js'
  import OrderDetails from '../ShowOrderDetails'
  export default {
    data () {
      return {
        // 定义三个表格数据
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
            {
              headerName: '中转日期', width: 150, field: 'changeTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动原因', width: 150, field: 'unActDes', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运费异动减款', width: 150, field: 'unActExpense', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销状态', width: 150, field: 'unActVeriStat', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销人', width: 150, field: 'unActVeriNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销日期', width: 150, field: 'unActVeriTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销网点', width: 150, field: 'unActVeriBran', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '支付方式', width: 150, field: 'unActPayMod', filter: 'text', hide: false, visible: true
            }
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
            {
              headerName: '中转日期', width: 150, field: 'changeTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动原因', width: 150, field: 'unActDes', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运费异动减款', width: 150, field: 'unActExpense', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销状态', width: 150, field: 'unActVeriStat', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销人', width: 150, field: 'unActVeriNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销日期', width: 150, field: 'unActVeriTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销网点', width: 150, field: 'unActVeriBran', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '支付方式', width: 150, field: 'unActPayMod', filter: 'text', hide: false, visible: true
            }
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
            {
              headerName: '中转日期', width: 150, field: 'changeTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '异动原因', width: 150, field: 'unActDes', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '运费异动减款', width: 150, field: 'unActExpense', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销状态', width: 150, field: 'unActVeriStat', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销人', width: 150, field: 'unActVeriNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销日期', width: 150, field: 'unActVeriTim', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '核销网点', width: 150, field: 'unActVeriBran', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '支付方式', width: 150, field: 'unActPayMod', filter: 'text', hide: false, visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        // 定义筛选条件
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
        // 各种费用合计
        totalForm: {
          transferFeeTotal: 0, // 中转费合计
          totalMoney: 0// 月结合计
        },
        // 核销完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          payMode: 'WeChat',
          digest: ''
        },
        // 表格显示
        // additionalColumnDefs: {
        //   nowPay: {
        //     headerName: '异动费用',
        //     children: [
        //       {
        //         headerName: '送货费', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //       },
        //       {
        //         headerName: '核销状态', width: 150, field: 'veriState', filter: 'text', hide: false, visible: true
        //       },
        //       {
        //         headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true
        //       },
        //       {
        //         headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true
        //       },
        //       {
        //         headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true
        //       },
        //       {
        //         headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true
        //       }
        //     ]
        //   }
        // },
        // additionalColumnDefs2: {
        //   nowPay: {
        //     headerName: '送货费', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   },
        //   cashOnDelivery: {
        //     headerName: '到付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   },
        //   inArrears: {
        //     headerName: '欠付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   },
        //   monthly: {
        //     headerName: '月结金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   }
        // },
        // additionalColumnDefs3: {
        //   nowPay: {
        //     headerName: '送货费', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   },
        //   cashOnDelivery: {
        //     headerName: '到付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   },
        //   inArrears: {
        //     headerName: '欠付金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   },
        //   monthly: {
        //     headerName: '月结金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true
        //   }
        // },
        //  表单验证规则
        rules: {},
        // dialog的可见性
        colVisible: false, // 切换列可见性的弹窗
        colVisible2: false,
        colVisible3: false,
        verVisible: false, // 进入核销页面的弹框
        confirmSubVisible: false, // 提交核销信息的弹框
        errorVisible: false, // 错误信息弹框
        detailVisible: false, // 订单详情弹框
        currentPage: 1, // 分页当前页面
        pageSize: 20, // 每页显示的数据
        rowCount: 0 // 总数据量（如果有筛选，则是筛选后的）
      }
    },
    components: {
      OrderDetails,
      'ag-grid-vue': AgGridVue
    },
    methods: {
      // 绘制表格，包括更新列信息与行信息
      drawGrid (i) {
        if (i === 2) {
          this.gridOptions3.api.selectAll()
          const selectedData = this.gridOptions3.api.getSelectedRows()
          this.delChoose(selectedData)
        }
        this.updateGrid(i)
        this.createRowData(i)
        this.calculateGrid()
      },
      // 获取行数据
      createRowData (i) {
        if (i === 1) {
          this.gridOptions.rowData = testJson.tripartitepayment.list
          this.gridOptions.api.setRowData(this.gridOptions.rowData)
        } else if (i === 2) {
          this.gridOptions2.rowData = testJson.tripartitepayment.list
          this.gridOptions2.api.setRowData(this.gridOptions2.rowData)
        }
      },
      // 更新列数据
      updateGrid (i) {
        if (i === 1) {
          // const payType = this.filterForm.payType
          // const lenth = (this.gridOptions.columnDefs.length - 1)
          // if (payType === 'nowPay') {
          // this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.nowPay
          // } else if (payType === 'cashOnDelivery') {
            // this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.cashOnDelivery
          // } else if (payType === 'inArrears') {
            // this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.inArrears
          // } else if (payType === 'monthly') {
            // this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.monthly
          // }
          this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
        } else if (i === 2) {
          // const payType = this.filterForm.payType
          // const lenth = (this.gridOptions2.columnDefs.length - 1)
          // if (payType === 'nowPay') {
          //   this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.nowPay
          //   this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.nowPay
          // } else if (payType === 'cashOnDelivery') {
          //   this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.cashOnDelivery
          //   this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.cashOnDelivery
          // } else if (payType === 'inArrears') {
          //   this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.inArrears
          //   this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.inArrears
          // } else if (payType === 'monthly') {
          //   this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.monthly
          //   this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.monthly
          // }
          this.gridOptions2.api.setColumnDefs(this.gridOptions2.columnDefs)
          this.gridOptions3.api.setColumnDefs(this.gridOptions3.columnDefs)
        }

//        console.log(this.gridOptions.columnDefs)
      },
      // 切换列的可见性，三个表格，三个参数j
      updateColumnDefsVisible (j, collist) {
        if (j === 1) {
          for (let i = 0; i < collist.length; i++) {
            this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
          }
        } else if (j === 2) {
          for (let i = 0; i < collist.length; i++) {
            this.gridOptions2.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
          }
        } else if (j === 3) {
          for (let i = 0; i < collist.length; i++) {
            this.gridOptions3.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
          }
        }
      },
      // 三个表格的快速匹配
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      onQuickFilterChanged2 (input) {
        this.gridOptions2.api.setQuickFilter(input)
      },
      onQuickFilterChanged3 (input) {
        this.gridOptions3.api.setQuickFilter(input)
      },
      // 更改hide的值，（已放弃），添加了visible作为切换可见的条件
//      changeColumnDefsBoolen () {
//        const columnlist = this.gridOptions.columnDefs
//        for (let i = 0; i < columnlist.length; i++) {
//          columnlist[i].hide = !columnlist[i].hide
//        }
//      },

      // 分页的操作
      // 每页显示数量改变时
      handleSizeChange (val) {
        this.gridOptions.api.paginationSetPageSize(Number(val))
      },
      // 切换不同分页时
      handleCurrnetChange (val) {
        this.gridOptions.api.paginationGoToPage(val - 1)
      },
      // 发生筛选时，重新计算分页数量
      gridfilterChange () {
        this.calculateGrid()
      },
      // 计算总数据量
      calculateGrid () {
        this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
        let model = this.gridOptions.api.getModel()
        let processedRows = model.getRowCount()
//        let totalRows = this.gridOptions.rowData.length
//        console.log(totalRows, processedRows)
        this.rowCount = processedRows
      },
      // 显示切换列可见的弹框
      setting () {
        this.colVisible = true
      },
      // 显示切换核销界面的弹框
      verification () {
        this.filterForm = {
          startTime: '', // 开始时间
          endTime: '', // 截止时间
          startPoint: '', //  区间起点
          endPoint: '', //  区间终点
          shipNam: '', //  发货人
          payType: 'nowPay', // 类型（现付，到付，欠付，月结）
          freiVeriState: '', // 运费核销状态
          orderId: '' // 运单号
        }
        this.verVisible = true
        this.gridOptions2.api.selectAllFiltered()
        this.gridOptions3.api.selectAllFiltered()
        let data2 = this.gridOptions2.api.getSelectedRows()
        let data3 = this.gridOptions3.api.getSelectedRows()
        this.gridOptions2.api.updateRowData({remove: data2})
        this.gridOptions3.api.updateRowData({remove: data3})
      },
      // 订单详情弹框
      detailDoubleClick (event) {
        this.filterForm.orderId = event.data.orderId
        this.detailVisible = true
      },
      // 核销界面左侧表格双击事件
      leftDoubleClick (event) {
        this.leftSelect(event.data)
      },
      // 核销界面右侧表格双击事件
      rightDoubleClick (event) {
        this.rightSelect(event.data)
      },
      // 核销界面左侧表格多选切换至右侧
      leftSelect () {
        const selectedData = this.gridOptions2.api.getSelectedRows()
        this.addChoose(selectedData)
//        console.log(this.gridOptions3.api.getAllRows())
      },
      // 核销界面左侧表格全选切换至右侧
      leftSelectAll () {
        this.gridOptions2.api.selectAllFiltered()
        const selectedData = this.gridOptions2.api.getSelectedRows()
        this.addChoose(selectedData)
      },
      // 核销界面右侧表格多选切换至左侧
      rightSelect () {
        const selectedData = this.gridOptions3.api.getSelectedRows()
        this.delChoose(selectedData)
      },
      // 核销界面右侧表格全选切换至左侧
      rightSelectAll () {
        this.gridOptions3.api.selectAllFiltered()
        const selectedData = this.gridOptions3.api.getSelectedRows()
        this.delChoose(selectedData)
      },
      // 核销界面右侧添加行数据，左侧删除行数据
      addChoose (newItems) {
        this.gridOptions3.api.updateRowData({add: newItems})
        this.gridOptions2.api.updateRowData({remove: newItems})
      },
      // 核销界面左侧添加行数据，右侧删除行数据
      delChoose (newItems) {
        this.gridOptions2.api.updateRowData({add: newItems})
        this.gridOptions3.api.updateRowData({remove: newItems})
      },
      // 打开提交核销结果的窗口
      confirmSubmit () {
        this.gridOptions3.api.selectAllFiltered()
        const confirmData = this.gridOptions3.api.getSelectedRows()
        if (confirmData.length < 1) {
          this.errorVisible = true
        } else {
          for (let i = 0; i < confirmData.length; i++) {
            this.confirmSubForm.orderId[i] = confirmData[i].orderId
          }
          this.confirmSubVisible = true
        }
        console.log(confirmData)
      },
      // 提交后台
      submit () {
        console.log(this.confirmSubForm)
        this.confirmSubVisible = false
        this.drawGrid(2)
      }
    },
    computed: {
      // 计算合计金额
      calculateMoney () {
        if (this.verVisible === false) {
          this.totalForm.transferFeeTotal = 0
          this.totalForm.totalMoney = 0
          let model = this.gridOptions.api.getModel()
          let arr = model.rootNode.childrenAfterFilter
          console.log(arr[0].data)
          for (let i = 0; i < arr.length; i++) {
            this.totalForm.transferFeeTotal += arr[i].data.changeFee
            this.totalForm.totalMoney += arr[i].data.feeMoney
          }
        }
      }
    },
//    beforeMount () {
//      this.createRowData()
//      console.log(this.gridOptions)
//    },
    // 实例挂载完成之后
    mounted () {
      this.updateGrid(1)
    },
    // 数据发生更新时
    updated () {
      console.log('update')
      this.calculateMoney
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
