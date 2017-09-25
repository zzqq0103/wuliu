<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>返款详情</h2>
    </div>
    <!--表格筛选区域-->
    <!--<div style='margin-top:2%;font-size:15px'>
        <el-form :model="filterForm" ref="filterForm">
          <span style='float:left;padding:0.6% 1% 0% 0%'>订单时间：</span>
          <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style='float:left;width:16%'>
          </el-date-picker>
           <span style='float:left;padding:0.6% 1% 0% 3%'>区间：</span>
          <el-form-item style='float:left;width:7%'>
            <el-select placeholder="起点" style="width:100%" v-model="filterForm.startPoint">
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="南京" value="nanjing"></el-option>
              <el-option label="全部" value="all"></el-option>
            </el-select>
          </el-form-item>
          <span style='float:left;padding:0.8% 0.8%'>--</span>
          <el-form-item style='float:left;width:7%'>
            <el-select placeholder="终点" style="width:100%" v-model="filterForm.endPoint">
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="南京" value="nanjing"></el-option>
              <el-option label="全部" value="all"></el-option>
            </el-select>
          </el-form-item>
          <span style='float:left;padding:0.6% 1% 0% 3%'>类型：</span>
          <el-form-item style='float:left;width:8%'>
            <el-select v-model="filterForm.payType" placeholder="类型" style="width: 100%">
              <el-option label="现返" value="nowPay"></el-option>
              <el-option label="欠返" value="inArrears"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:right;width:5%;padding-right:3%">
            <el-button @click="verification">开始核销</el-button>
          </el-form-item>
          <el-form-item style="width:5%;float:right;padding-right:1%">
            <el-button @click="setting">导出</el-button>
          </el-form-item>

          <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
            <template v-for="(collist,i) in gridOptions.columnDefs">
              <div class="colVisible">
                <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)"
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
          <el-form-item style="float:right;width:5%;padding-right:1%">
            <el-button  v-popover:popover1>设置</el-button>
          </el-form-item>
          <el-form-item style="width:5%;float:right;padding-right:1%">
            <el-button @click="drawGrid(1)">提取</el-button>
          </el-form-item>

          <el-form-item label="中转费合计：" style='float:left;width:25%'>
            <el-input v-model="totalForm.transferFeeTotal" style='width:50%'></el-input>
          </el-form-item>
          <div v-if="filterForm.payType === 'nowPay'">
            <el-form-item label="现返金额合计：" style='float:left;width:25%'>
              <el-input readonly="readonly" v-model="totalForm.totalMoney" style='width:50%'></el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="欠返金额合计：" style='float:left;width:25%'>
              <el-input readonly="readonly" v-model="totalForm.totalMoney" style='width:50%'></el-input>
            </el-form-item>
          </div>
          <el-form-item style="float:left;width:13%;padding-left:0.6%">
            <el-input  placeholder="输入内容进行搜索" @input="onQuickFilterChanged" style="width:100%"></el-input>
          </el-form-item>
        </el-form>
    </div>-->
    <!--表格上方操作区域-->
    <div>
      <!--第一行右侧按钮-->
      <div style="float: right">
        <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 150px"></el-input>
      </div>
      <!--第一行左侧按钮-->
      <div>
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="订单时间:">
            <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="区间:">
            <el-select v-model="filterForm.startPoint" placeholder="起点" style="width: 80px">
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="南京" value="nanjing"></el-option>
              <el-option label="全部" value="all"></el-option>
            </el-select>
            <span>--&nbsp</span>
            <el-select v-model="filterForm.endPoint" placeholder="终点" style="width: 80px">
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="南京" value="nanjing"></el-option>
              <el-option label="全部" value="all"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select v-model="filterForm.payType" placeholder="类型" style="width: 80px">
              <el-option label="现返" value="nowPay"></el-option>
              <el-option label="欠返" value="inArrears"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="drawGrid(1)">提取</el-button>
        </el-form>
      </div>
      <!--第二行开始-->
      <div>
        <el-form style="float: left" :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="中转费合计:">
            <el-input v-model="totalForm.transferFeeTotal" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="float: right">
        <!--<el-button @click="setting">设置</el-button>-->
        <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)"
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
        <el-button @click="verification">开始核销</el-button>
      </div>
      <!--判断当前需要显示的label-->
      <div v-if="this.filterForm.payType === 'nowPay'">
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="现返金额合计:">
            <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="欠返金额合计:">
            <el-input v-model="totalForm.totalMoney" style="width: 100px" readonly="true"></el-input>
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
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
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
    <div style="text-align: center;margin-top:2%">
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
        <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)">
          {{collist.headerName}}
        </el-checkbox>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible2" size="tiny" :closeOnClickModal="false" top="30%">
      <template v-for="(collist,i) in gridOptions2.columnDefs">
        <div>
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
        <div>
          <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 回单核销界面 -->
    <!--<el-dialog :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <h2 style='text-align:center;margin-top:-2%'>返款核销</h2>
      <el-form :model="filterForm" ref="filterForm" style='margin-top:2%'>
        <div style='clear:float;width:100%'>
          <span style='float:left;padding:0.4% 1% 0% 0%'>订单时间：</span>
          <el-form-item  style='float:left;width:18%'>
            <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                              :picker-options="pickerOptions" range-separator='/'>
            </el-date-picker>
          </el-form-item>

          <span style='float:left;padding:0.6% 1% 0% 3%'>类型：</span>
          <el-form-item style='float:left;width:7%'>
            <el-select v-model="filterForm.payType" placeholder="类型" style="width: 100%">
              <el-option label="现返" value="nowPay"></el-option>
              <el-option label="欠返" value="inArrears"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:right;width:5%;padding-right:3%">
            <el-button  @click="verVisible = false">取消</el-button>
          </el-form-item>
          <el-form-item style="float:right;width:7%;padding-right:2%">
            <el-button @click="confirmSubmit">确认核销</el-button>
          </el-form-item>
          <el-form-item style="float:right;width:5%;padding-right:2%">
            <el-button @click="drawGrid(2)">提取</el-button>
          </el-form-item>
        </div>
        <el-form-item style="float:left;width:18.5%;clear:left">
            <el-input placeholder="输入内容进行搜索" @input="onQuickFilterChanged2" style="width:100%"></el-input>
        </el-form-item>
        <el-popover ref="popover2" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions2.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)"
                            style="float: left;width: 180px">
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
        <el-form-item style="float:left;width:5%;margin-left:4.5%">
          <el-button v-popover:popover2>设置</el-button>
        </el-form-item>
        <el-form-item style="float:left;width:25%;margin-left:14.5%">
            <el-button @click="leftSelect"> > </el-button>
            <el-button @click="leftSelectAll"> >> </el-button>
            <el-button @click="rightSelect"> < </el-button>
            <el-button @click="rightSelectAll"> << </el-button>
        </el-form-item>
         <el-popover ref="popover3" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions3.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)"
                            style="float: left;width: 180px">
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
        <el-form-item style="float:right;width:5%;margin-right:3%">
          <el-button v-popover:popover3>设置</el-button>
        </el-form-item>
        <el-form-item style="float:right;width:18.5%;margin-right:4%">
            <el-input placeholder="输入内容进行搜索" @input="onQuickFilterChanged3" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 10px;float:left;width:100%">
            <ag-grid-vue style="width:48%;height: 550px;display:inline-block;" class="ag-blue"
                        :gridOptions="gridOptions2"
                        :suppressMovableColumns="true"
                        :enableColResize="true"
                        :enableSorting="true"
                        :enableFilter="true"
                        :groupHeaders="true"
                        :suppressCellSelection="true"
                        :rowHeight=40
                        :headerHeight=40
                        :gridReady="grid2Ready"
                        :rowDoubleClicked="leftDoubleClick"
                        :animateRows="true"
                        rowSelection="multiple"/>
            <ag-grid-vue style="display:inline-block;width:48%;margin-left:3%;height: 550px" class="ag-blue"
                        :gridOptions="gridOptions3"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :enableSorting="true"
                         :enableFilter="true"
                         :groupHeaders="true"
                         :suppressCellSelection="true"
                         :rowHeight=40
                         :headerHeight=40
                         :rowDoubleClicked="rightDoubleClick"
                         :animateRows="true"
                         rowSelection="multiple"/>
          </div>
    </el-dialog> -->

        <!--
    --核销界面
    -->
    <el-dialog title="返款核销" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="filterForm" ref="filterForm" :inline="true">
            <div>
              <el-form-item label="订单时间">
                <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                                  :picker-options="pickerOptions" style='width:200px' range-separator='/'>
                </el-date-picker>
              </el-form-item>
            </div>
            <div>
              <div style="float: right">
                <el-button @click="drawGrid(2)">提取库存</el-button>
                <!--<el-button @click="colVisible2 = true">设置</el-button>-->
                <el-popover ref="popover2" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                  <template v-for="(collist,i) in gridOptions2.columnDefs">
                    <div class="colVisible">
                      <el-checkbox v-model="collist.visible"
                                   @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)"
                                   style="float: left;width: 180px">
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
                <el-button v-popover:popover2>设置</el-button>
              </div>
              <el-form-item label="类型:">
                <el-select v-model="filterForm.payType" placeholder="付款方式" style="width: 80px">
                  <el-option label="现返" value="nowPay"></el-option>
                  <el-option label="欠返" value="inArrears"></el-option>
                </el-select>
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
            <ag-grid-vue style="width: 100%;height: 550px" class="ag-blue"
                         :gridOptions="gridOptions2"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :enableSorting="true"
                         :enableFilter="true"
                         :groupHeaders="true"
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
              <!--<el-button @click="colVisible3 = true">设置</el-button>-->
              <el-popover ref="popover3" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                <template v-for="(collist,i) in gridOptions3.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)"
                                 style="float: left;width: 180px">
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
              <el-button v-popover:popover3>设置</el-button>
            </el-form-item>
          </el-form>
          <el-button @click="rightSelect"> < </el-button>
          <el-button @click="rightSelectAll"> << </el-button>
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged3" style="width: 200px"></el-input>
          <!--待核销处表格-->
          <div style="margin-top: 10px">
            <ag-grid-vue style="width: 100%;height: 550px" class="ag-blue"
                         :gridOptions="gridOptions3"
                         :suppressMovableColumns="true"
                         :enableColResize="true"
                         :enableSorting="true"
                         :enableFilter="true"
                         :groupHeaders="true"
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
      <el-form :model="confirmSubForm" ref="confirmSubForm" labelWidth="80px">
        <el-form-item label="支付方式">
          <el-select v-model="confirmSubForm.payMode" placeholder="支付方式" style="width: 110px">
            <el-option label="微信" value="WeChat"></el-option>
            <el-option label="支付宝" value="Alipay"></el-option>
            <el-option label="转账" value="transfer "></el-option>
            <el-option label="现金" value="cash"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
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
  import OrderDetails from '../ShowOrderDetails'
  import PartialMatchFilterComponent from '../../common/PartialMatchFilterComponent'
  export default {
    created () {
      for (let i = 0; i < 100; i++) {
        this.testData1.push({
          'orderId': '运单号' + i,
          'orderState': '运单状态' + i,
          'billBranch': '开单网点' + i,
          'orderTim': '开单日期' + i,
          'startStation': '发站' + i,
          'arrStation': '到站' + i,
          'shipNam': '发货人' + i,
          'shipTel': '发货人联系方式' + i,
          'receNam': '收货人' + i,
          'receTel': '收货人联系方式' + i,
          'serviceNam': '开单客服' + i,
          'changeFee': i, // 中转费
          'changeTim': '中转时间' + i,
          'payType': '付款方式' + i,
          'salesmanId': '业务员' + i,
          'trilNote': '备注' + i,
          'receNums': '回单份数' + i,
          'feeMoney': i, // 付款金额
          'veriState': '核销状态' + i,
          'veriNam': '核销人' + i,
          'veriTim': '核销日期' + i,
          'veriSite': '核销网点' + i,
          'payMode': '支付方式' + i
        })
        this.testData2.push({
          'orderId': '运单号' + i,
          'orderState': '运单状态' + i,
          'shipNam': '发货人' + i,
          'receNam': '收货人' + i,
          'serviceNam': '开单客服' + i,
          'feeMoney': i // 付款金额
        })
      }
    },
    data () {
      return {
        // 表格1数据
        testData1: [],
        // 表格2数据
        testData2: [],
        // 定义三个表格数据
        gridOptions: {
          rowData: [],
          columnDefs: [
            {
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单网点', width: 150, field: 'billBranch', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单日期', width: 150, field: 'orderTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '到站', width: 150, field: 'arrStation', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发货人联系方式', width: 150, field: 'shipTel', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '收货人联系方式', width: 150, field: 'receTel', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单客服', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '中转费', width: 150, field: 'changeFee', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '中转时间', width: 150, field: 'changeTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '业务员', width: 150, field: 'salesmanId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '备注', width: 150, field: 'trilNote', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '回单份数', width: 150, field: 'receNums', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销状态', width: 150, field: 'veriState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销人', width: 150, field: 'veriNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销日期', width: 150, field: 'veriTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '核销网点', width: 150, field: 'veriSite', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '支付方式', width: 150, field: 'payMode', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
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
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单客服', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
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
              headerName: '运单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '运单状态', width: 150, field: 'orderState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发货人', width: 150, field: 'shipNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '收货人', width: 150, field: 'receNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '开单客服', width: 150, field: 'serviceNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {}
          ],
          context: {
            componentParent: this
          }
        },
        // 根据下拉框，表格最后显示不同的列
        additionalColumnDefs: {
          nowPay: {
            headerName: '现返金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          inArrears: {
            headerName: '欠返金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          }
        },
        additionalColumnDefs2: {
          nowPay: {
            headerName: '现返金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          inArrears: {
            headerName: '欠返金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          }
        },
        additionalColumnDefs3: {
          nowPay: {
            headerName: '现返金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          },
          inArrears: {
            headerName: '欠返金额', width: 150, field: 'feeMoney', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
          }
        },
        // 定义筛选条件
        filterForm: {
          startTime: '', // 开始时间
          endTime: '', // 截止时间
          startPoint: '', //  区间起点
          endPoint: '', //  区间终点
          payType: 'nowPay' // 类型（现付，到付，欠付，月结）
        },
        // 各种费用合计
        totalForm: {
          transferFeeTotal: 0, // 中转费合计
          totalMoney: 0 // 三方收入合计
        },
        // 核销完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          payMode: 'WeChat',
          digest: ''
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
        rowCount: 0 // 总数据量（如果有筛选，则是筛选后的）
      }
    },
    components: {
      OrderDetails,
      'ag-grid-vue': AgGridVue
    },
    methods: {
      // 切换列可见性，i=1或者2，1全选或者2全不选，gridnum表示三个表格
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
       // 更新列数据
      updateGrid (i) {
        if (i === 1) {
          const payType = this.filterForm.payType
          const lenth = (this.gridOptions.columnDefs.length - 1)
          if (payType === 'nowPay') {
            this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.nowPay
          } else if (payType === 'inArrears') {
            this.gridOptions.columnDefs[lenth] = this.additionalColumnDefs.inArrears
          }
          this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
        } else if (i === 2) {
          const payType = this.filterForm.payType
          const lenth = (this.gridOptions2.columnDefs.length - 1)
          if (payType === 'nowPay') {
            this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.nowPay
            this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.nowPay
          } else if (payType === 'inArrears') {
            this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.inArrears
            this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.inArrears
          }
          this.gridOptions2.api.setColumnDefs(this.gridOptions2.columnDefs)
          this.gridOptions3.api.setColumnDefs(this.gridOptions3.columnDefs)
        }
      },
      // 获取行数据
      createRowData (i) {
        if (i === 1) {
          this.gridOptions.rowData = this.testData1
          this.gridOptions.api.setRowData(this.gridOptions.rowData)
        } else if (i === 2) {
          this.gridOptions2.rowData = this.testData2
          this.gridOptions2.api.setRowData(this.gridOptions2.rowData)
        }
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
      grid2Ready () {
        this.updateGrid(2)
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
          payType: 'nowPay' // 支付类型
        }
        this.verVisible = true
        this.gridOptions2.api.selectAll()
        this.gridOptions3.api.selectAll()
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
        this.confirmSubVisible = false
        this.drawGrid(2)
      }
    },
    computed: {
      // 计算合计金额
      calculateMoney: function () {
        if (this.verVisible === false) {
          this.totalForm.transferFeeTotal = 0
          this.totalForm.totalMoney = 0
          let model = this.gridOptions.api.getModel()
          let arr = model.rootNode.childrenAfterFilter
          for (let i = 0; i < arr.length; i++) {
            this.totalForm.transferFeeTotal += arr[i].data.changeFee
            this.totalForm.totalMoney += arr[i].data.feeMoney
          }
        }
      }
    },
    mounted () {
      this.updateGrid(1)
    },
    // 数据发生更新时
    updated () {
      this.calculateMoney
    }
  }
</script>
