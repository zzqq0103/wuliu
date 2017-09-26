<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>干线运输费详情</h2>
    </div>
    <!--表格上方操作区域-->
    <div>
      <!--第一行右侧按钮-->
      <div style="float: right">
        <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"
                           style="float: left;width: 180px">
                {{collist.headerName}}
              </el-checkbox>
            </div>
          </template>
          <template>
            <div class="colVisible">
              <el-button @click="visibleChoice(1,'grid1')" size="small">全选</el-button>
              <el-button @click="visibleChoice(2,'grid1')" size="small">全不选</el-button>
            </div>
          </template>
        </el-popover>
        <el-button v-popover:popover1>设置</el-button>
        <el-button>导出</el-button>
      </div>
      <!--第一行左侧按钮-->
      <div>
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="发车时间:">
            <el-date-picker v-model="filterForm.dateInterval" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
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
          <el-form-item label="核销状态:">
            <el-select v-model="filterForm.veriState" style="width: 100px">
              <el-option label="未核销" value="uncompleted"></el-option>
              <el-option label="已核销" value="completed"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select v-model="filterForm.payType" placeholder="付款方式" style="width: 80px" @change="typeChange(1)">
              <el-option label="现付" value="nowPay"></el-option>
              <el-option label="到付" value="cashOnDelivery"></el-option>
              <el-option label="欠付" value="inArrears"></el-option>
              <el-option label="月结" value="monthly"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="drawGrid(1)">提取</el-button>
        </el-form>
      </div>
      <div style="float: right">
        <el-button @click="verification">开始核销</el-button>
      </div>
      <div>
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="现付合计:" v-if="this.filterForm.payType === 'nowPay'">
            <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="到付合计:" v-else-if="this.filterForm.payType === 'cashOnDelivery'">
            <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="欠付合计:" v-else-if="this.filterForm.payType === 'inArrears'">
            <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="月结合计:" v-else-if="this.filterForm.payType === 'monthly'">
            <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="油卡金额合计:">
            <el-input v-model="totalForm.oilCardMoneyTotal" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="clear: both;"></div>

    <!--表格-->
    <div style="margin-top: 10px">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

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
      <div slot="footer" class="dialog-footer">
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
    <el-dialog :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <h2 style='text-align:center;margin-top:-2%'>干线运输费核销</h2>
      <el-row :gutter="20" style="margin-top: 2%">
        <el-col :span="12">
          <el-form :model="filterForm" ref="filterForm" :inline="true">
            <div>
              <el-form-item label="装载单ID:">
                <el-input v-model="filterForm.loadingId" style="width: 100px"></el-input>
              </el-form-item>
              <el-form-item label="起始站:">
                <el-input v-model="filterForm.startPoint" style="width: 100px"></el-input>
              </el-form-item>
              <el-form-item label="到达站:">
                <el-input v-model="filterForm.endPoint" style="width: 100px"></el-input>
              </el-form-item>
            </div>
            <div style="float: right">
              <el-button @click="drawGrid(2)">提取库存</el-button>
              <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="200" trigger="hover">
                <template v-for="(collist,i) in gridOptions2.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible"
                                 @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)">
                      {{collist.headerName}}
                    </el-checkbox>
                  </div>
                </template>
                <template>
                  <div class="colVisible">
                    <el-button @click="visibleChoice(1,'grid2')" size="small">全选</el-button>
                    <el-button @click="visibleChoice(2,'grid2')" size="small">全不选</el-button>
                  </div>
                </template>
              </el-popover>
              <el-button v-popover:popover1>设置</el-button>
            </div>
            <el-form-item label="类型:">
              <el-select v-model="filterForm.payType" placeholder="付款方式" style="width: 80px" @change="typeChange(2)">
                <el-option label="现付" value="nowPay"></el-option>
                <el-option label="到付" value="cashOnDelivery"></el-option>
                <el-option label="欠付" value="inArrears"></el-option>
                <el-option label="月结" value="monthly"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button style="visibility: hidden">不可见的按钮（用于添加一个空行）</el-button>
          <div style="float: right">
            <el-button @click="leftSelect"> > </el-button>
            <el-button @click="leftSelectAll"> >> </el-button>
          </div>
          <!--未核销处表格-->
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 550px" class="ag-blue"
                         :gridOptions="gridOptions2"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
                         :headerHeight=40

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
              <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="200" trigger="hover">
                <template v-for="(collist,i) in gridOptions3.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible"
                                 @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)">
                      {{collist.headerName}}
                    </el-checkbox>
                  </div>
                </template>
                <template>
                  <div class="colVisible">
                    <el-button @click="visibleChoice(1,'grid3')" size="small">全选</el-button>
                    <el-button @click="visibleChoice(2,'grid3')" size="small">全不选</el-button>
                  </div>
                </template>
              </el-popover>
              <el-button v-popover:popover1>设置</el-button>
            </el-form-item>
          </el-form>
          <el-button @click="rightSelect"> < </el-button>
          <el-button @click="rightSelectAll"> << </el-button>
          <!--待核销处表格-->
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 550px" class="ag-blue"
                         :gridOptions="gridOptions3"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
                         :headerHeight=40

                         :gridReady="grid3Ready"
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
      <el-form :model="confirmSubForm" ref="confirmSubForm" labelWidth="20%">
        <el-form-item label="支付方式">
          <el-select v-model="confirmSubForm.payMode" placeholder="支付方式" style="width: 100px" @change="showOil()">
            <el-option label="微信" value="WeChat"></el-option>
            <el-option label="支付宝" value="Alipay"></el-option>
            <el-option label="转账" value="transfer "></el-option>
            <el-option label="现金" value="cash"></el-option>
            <el-option label="油卡" value="oilCard"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="confirmSubForm.digest" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item v-if="oilShow" label="油卡号:">
          <el-input v-model="confirmSubForm.oilCard" id="oId" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item v-if="oilShow" label="油卡金额:">
          <el-input v-model="confirmSubForm.oilCardMoney" style="width: 50%"></el-input>
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
    <el-dialog title="订单详情:" :visible.sync="detailVisible" :closeOnClickModal="false">
      <order-details :orderId="filterForm.orderId"></order-details>
    </el-dialog>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../../static/test/testJSON.js'
  import OrderDetails from '../ShowOrderDetails'
  import PartialMatchFilterComponent from '../../common/PartialMatchFilterComponent'
  export default {
    data () {
      return {
        // 定义三个表格数据
        gridOptions: {
          rowData: [],
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '装载单ID', width: 150, field: 'loadingId', hide: false, visible: true
            },
            {
              headerName: '起始站', width: 150, field: 'startStation', hide: false, visible: true
            },
            {
              headerName: '到达站', width: 150, field: 'arrStation', hide: false, visible: true
            },
            {
              headerName: '发车时间', width: 150, field: 'shipTim', hide: false, visible: true
            },
            {
              headerName: '合同号',
              width: 150,
              field: 'contractId',
              hide: false,
              visible: true
            },
            {
              headerName: '合同价格',
              width: 150,
              field: 'contractPrice',
              hide: false,
              visible: true
            },
            {
              headerName: '司机姓名',
              width: 150,
              field: 'driverNam',
              hide: false,
              visible: true
            },
            {
              headerName: '司机电话',
              width: 150,
              field: 'driverTel',
              hide: false,
              visible: true
            },
            {
              headerName: '车牌号',
              width: 150,
              field: 'licePlateNum',
              hide: false,
              visible: true
            },
            {
              headerName: '总重量',
              width: 150,
              field: 'totalWeight',
              hide: false,
              visible: true
            },
            {
              headerName: '总体积',
              width: 150,
              field: 'totalVolume',
              hide: false,
              visible: true
            },
            {
              headerName: '总件数',
              width: 150,
              field: 'totalNums',
              hide: false,
              visible: true
            },
            {
              headerName: '油卡号',
              width: 150,
              field: 'oilCard',
              hide: false,
              visible: true
            },
            {
              headerName: '油卡金额',
              width: 150,
              field: 'oilCardMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '调度员姓名',
              width: 150,
              field: 'dispatNam',
              hide: false,
              visible: true
            },
            {
              headerName: '付款方式',
              width: 150,
              field: 'payType',
              hide: false,
              visible: true
            },
            {
              headerName: '现付大车费',
              width: 150,
              field: 'feeMoney ',
              hide: false,
              visible: true
            },
            {
              headerName: '核销状态',
              width: 150,
              field: 'veriState',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '核销人',
              width: 150,
              field: 'veriNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '核销日期',
              width: 150,
              field: 'veriTim',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '核销站点',
              width: 150,
              field: 'veriSite',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '备注',
              width: 150,
              field: 'trilNote',
              filter: 'text',
              hide: false,
              visible: true
            },
            {
              headerName: '支付方式',
              width: 150,
              field: 'payMode',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
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
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '装载单ID', width: 150, field: 'loadingId', hide: false, visible: true
            },
            {
              headerName: '起始站', width: 150, field: 'startStation', hide: false, visible: true
            },
            {
              headerName: '到达站', width: 150, field: 'arrStation', hide: false, visible: true
            },
            {
              headerName: '发车时间', width: 150, field: 'shipTim', hide: false, visible: true
            },
            {
              headerName: '合同号',
              width: 150,
              field: 'contractId',
              hide: false,
              visible: true
            },
            {
              headerName: '合同价格',
              width: 150,
              field: 'contractPrice',
              hide: false,
              visible: true
            },
            {
              headerName: '司机姓名',
              width: 150,
              field: 'driverNam',
              hide: false,
              visible: true
            },
            {
              headerName: '司机电话',
              width: 150,
              field: 'driverTel',
              hide: false,
              visible: true
            },
            {
              headerName: '车牌号',
              width: 150,
              field: 'licePlateNum',
              hide: false,
              visible: true
            },
            {
              headerName: '总重量',
              width: 150,
              field: 'totalWeight',
              hide: false,
              visible: true
            },
            {
              headerName: '总体积',
              width: 150,
              field: 'totalVolume',
              hide: false,
              visible: true
            },
            {
              headerName: '总件数',
              width: 150,
              field: 'totalNums',
              hide: false,
              visible: true
            },
            {
              headerName: '油卡号',
              width: 150,
              field: 'oilCard',
              hide: false,
              visible: true
            },
            {
              headerName: '油卡金额',
              width: 150,
              field: 'oilCardMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '付款方式',
              width: 150,
              field: 'payType',
              hide: false,
              visible: true
            },
            {
              headerName: '调度员姓名',
              width: 150,
              field: 'dispatNam',
              hide: false,
              visible: true
            },
            {
              headerName: '现付大车费',
              width: 150,
              field: 'feeMoney ',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
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
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '装载单ID', width: 150, field: 'loadingId', hide: false, visible: true
            },
            {
              headerName: '起始站', width: 150, field: 'startStation', hide: false, visible: true
            },
            {
              headerName: '到达站', width: 150, field: 'arrStation', hide: false, visible: true
            },
            {
              headerName: '发车时间', width: 150, field: 'shipTim', hide: false, visible: true
            },
            {
              headerName: '合同号',
              width: 150,
              field: 'contractId',
              hide: false,
              visible: true
            },
            {
              headerName: '合同价格',
              width: 150,
              field: 'contractPrice',
              hide: false,
              visible: true
            },
            {
              headerName: '司机姓名',
              width: 150,
              field: 'driverNam',
              hide: false,
              visible: true
            },
            {
              headerName: '司机电话',
              width: 150,
              field: 'driverTel',
              hide: false,
              visible: true
            },
            {
              headerName: '车牌号',
              width: 150,
              field: 'licePlateNum',
              hide: false,
              visible: true
            },
            {
              headerName: '总重量',
              width: 150,
              field: 'totalWeight',
              hide: false,
              visible: true
            },
            {
              headerName: '总体积',
              width: 150,
              field: 'totalVolume',
              hide: false,
              visible: true
            },
            {
              headerName: '总件数',
              width: 150,
              field: 'totalNums',
              hide: false,
              visible: true
            },
            {
              headerName: '油卡号',
              width: 150,
              field: 'oilCard',
              hide: false,
              visible: true
            },
            {
              headerName: '油卡金额',
              width: 150,
              field: 'oilCardMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '付款方式',
              width: 150,
              field: 'payType',
              hide: false,
              visible: true
            },
            {
              headerName: '调度员姓名',
              width: 150,
              field: 'dispatNam',
              hide: false,
              visible: true
            },
            {
              headerName: '现付大车费',
              width: 150,
              field: 'feeMoney ',
              hide: false,
              visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        // 根据下拉框，表格最后显示不同的列
        newadditionalColumnDefs: {
          nowPay: {
            headerName: '现付大车费',
            width: 100,
            field: 'feeMoney',
            hide: false,
            visible: true
          },
          cashOnDelivery: {
            headerName: '到付大车费',
            width: 100,
            field: 'feeMoney',
            hide: false,
            visible: true
          },
          inArrears: {
            headerName: '欠付大车费',
            width: 100,
            field: 'feeMoney',
            hide: false,
            visible: true
          },
          monthly: {
            headerName: '月结大车费',
            width: 100,
            field: 'feeMoney',
            hide: false,
            visible: true
          }
        },
        // 定义筛选条件
        filterForm: {
          dateInterval: '', // 时间间隔
          startPoint: '', //  区间起点
          endPoint: '', //  区间终点
          shipNam: '', //  发货方
          payType: 'nowPay', // 类型（现付，到付，欠付，月结）
          loadingId: '', // 装载单号
          veriState: '', // 核销状态
          pageNum: 1, // 当前页码数
          pageSize: 20 // 分页大小
        },
        // 各种费用合计
        totalForm: {
          oilCardMoneyTotal: 0, // 中转费合计
          totalMoney: 0// 月结合计
        },
        // 核销完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          payMode: 'WeChat',
          digest: '',
          oilCard: '',
          oilCardMoney: ''
        },
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
        rowCount: 0, // 总数据量（如果有筛选，则是筛选后的）
        oilShow: false // 油卡号可见性
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
          this.gridOptions.rowData = testJson.freight.list
          this.gridOptions.api.setRowData(this.gridOptions.rowData)
        } else if (i === 2) {
          this.gridOptions2.rowData = testJson.freight.list
          this.gridOptions2.api.setRowData(this.gridOptions2.rowData)
        }
      },
      // 更新列数据
      updateGrid (i) {
        if (i === 1) {
          const payType = this.filterForm.payType
          if (payType === 'nowPay') {
            this.gridOptions.columnDefs[17] = this.newadditionalColumnDefs.nowPay
          } else if (payType === 'cashOnDelivery') {
            this.gridOptions.columnDefs[17] = this.newadditionalColumnDefs.cashOnDelivery
          } else if (payType === 'inArrears') {
            this.gridOptions.columnDefs[17] = this.newadditionalColumnDefs.inArrears
          } else if (payType === 'monthly') {
            this.gridOptions.columnDefs[17] = this.newadditionalColumnDefs.monthly
          }
          this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
        } else if (i === 2) {
          const payType = this.filterForm.payType
          const lenth = (this.gridOptions2.columnDefs.length - 1)
          if (payType === 'nowPay') {
            this.gridOptions2.columnDefs[lenth] = this.newadditionalColumnDefs.nowPay
            this.gridOptions3.columnDefs[lenth] = this.newadditionalColumnDefs.nowPay
          } else if (payType === 'cashOnDelivery') {
            this.gridOptions2.columnDefs[lenth] = this.newadditionalColumnDefs.cashOnDelivery
            this.gridOptions3.columnDefs[lenth] = this.newadditionalColumnDefs.cashOnDelivery
          } else if (payType === 'inArrears') {
            this.gridOptions2.columnDefs[lenth] = this.newadditionalColumnDefs.inArrears
            this.gridOptions3.columnDefs[lenth] = this.newadditionalColumnDefs.inArrears
          } else if (payType === 'monthly') {
            this.gridOptions2.columnDefs[lenth] = this.newadditionalColumnDefs.monthly
            this.gridOptions3.columnDefs[lenth] = this.newadditionalColumnDefs.monthly
          }
          this.gridOptions2.api.setColumnDefs(this.gridOptions2.columnDefs)
          this.gridOptions3.api.setColumnDefs(this.gridOptions3.columnDefs)
        }

//        console.log(this.gridOptions.columnDefs)
      },
      // 核销界面，提取库存时，修改类型，清空表格数据
      typeChange (i) {
        this.updateGrid(i)
        this.gridOptions.rowData = []
        this.gridOptions2.rowData = []
        this.gridOptions3.rowData = []
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
        this.gridOptions2.api.setRowData(this.gridOptions2.rowData)
        this.gridOptions3.api.setRowData(this.gridOptions3.rowData)
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
          payType: 'nowPay', // 类型（现付，到付，欠付，月结，油卡）
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
      },
      showOil () {
        if (this.confirmSubForm.payMode === 'oilCard') {
          this.oilShow = true
        } else {
          this.oilShow = false
        }
      },
      visibleChoice (i, gridnum) {
        let gridCol
        let num
        if (gridnum === 'grid1') {
          gridCol = this.gridOptions
          num = 1
        } else if (gridnum === 'grid2') {
          gridCol = this.gridOptions2
          num = 2
        } else if (gridnum === 'grid3') {
          gridCol = this.gridOptions3
          num = 3
        }
        if (i === 1) {
          for (let j = 0; j < gridCol.columnDefs.length; j++) {
            gridCol.columnDefs[j].visible = true
          }
        } else if (i === 2) {
          for (let j = 0; j < gridCol.columnDefs.length; j++) {
            gridCol.columnDefs[j].visible = false
          }
        }
        this.updateColumnDefsVisible(num, gridCol.columnDefs)
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          console.log(this.gridOptions.columnDefs[i].visible)
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
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
<!--//发出请求-->
<!--filterForm: {-->
<!--startTime: '', // 开始时间-->
<!--endTime: '', // 截止时间-->
<!--startPoint: '', //  区间起点-->
<!--endPoint: '', //  区间终点-->
<!--shipNam: '', //  发货人-->
<!--payType: 'nowPay', // 类型（现付，到付，欠付，月结）-->
<!--freiVeriState: '', // 运费核销状态-->
<!--orderId: '' // 运单号-->
<!--},-->
<!--//获得响应 filterForm1和filterForm2是不同的获得响应事件q-->
<!--filterForm1：{-->
<!--orderState 运单状态-->
<!--orderId 运单号-->
<!--billBranch 开单网点-->
<!--orderTim 开单日期-->
<!--startStation 发站-->
<!--arrStation 到站-->
<!--shipNam 发货人-->
<!--receNam 收货人-->
<!--shipTim 发车时间-->
<!--contractId 合同号-->
<!--licePlateNum 车牌号-->
<!--driverNam 司机姓名-->
<!--driverTel 司机电话-->
<!--receTel 收货人联系方式-->
<!--goodsNam 品名-->
<!--goodsNums 件数-->
<!--serviceNam 开单客服-->
<!--companyNam 中转路线-->
<!--changeFee 中转日期-->
<!--sendMode 送货方式-->
<!--payType 付款方式-->
<!--feeMoney 付款金额-->
<!--oilMoney 油卡金额-->
<!--goodsWeight 重量-->
<!--goodsVolume 体积-->
<!--}-->
<!--filterForm2：{-->
<!--orderState 运单状态-->
<!--orderId 运单号-->
<!--orderTim 下单时间-->
<!--shipTim 发车时间-->
<!--contractId 合同号-->
<!--licePlateNum 车牌号-->
<!--driverNam 司机姓名-->
<!--payType 付款方式-->
<!--feeMoney 付款金额-->
<!--totalFreight 总运费-->
<!--veriState 核销状态-->
<!--}-->
