<template>
  <div>
    <div style="text-align: center;margin：10px">
      <h2>入库信息</h2>
    </div>
    <!--表格筛选区域-->
    <div style='margin-top:2%;font-size:15px'>
        <el-form :model="filterForm1" ref="filterForm1">
          <!--<span style='float:left;padding:0.6% 1% 0% 0%'>发车时间：</span>
          <el-form-item prop="startTime" style='float:left;width:13%'>
              <el-date-picker type="datetime" placeholder="1" v-model="filterForm1.departTimStart"
                              style="width:100%"></el-date-picker>
          </el-form-item>
          <span style='float:left;padding:0.8% 1% 0% 1%'>到</span>
          <el-form-item prop="endTime" style='float:left;width:13%'>
              <el-date-picker type="datetime" placeholder="2" v-model="filterForm1.departTimEnd"
                              style="width:100%"></el-date-picker>
          </el-form-item>-->
          <span style='float:left;padding:0.6% 1% 0% 0%'>订单时间：</span>
          <el-date-picker v-model="filterForm1.departTimEnd" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style='float:left;width:200px'>
          </el-date-picker>
          <span style='float:left;padding:0.6% 1% 0% 3%'>仓库位置：</span>
          <el-form-item style="float:left;width:10%">
            <el-select placeholder="请选择" v-model="filterForm1.stockPos" style='width:100%'>
              <el-option label="南京" value="nanjing"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="司机姓名：" style="float:left;width:25%">
            <el-input v-model="filterForm1.driverNam" style="width:65%"></el-input>
          </el-form-item> -->

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
          <el-form-item style="float:right;width:5%">
            <el-button v-popover:popover1>设置</el-button>
          </el-form-item>
          <el-form-item style="float:right;width:5%;margin-right:1%">
            <el-button>导出</el-button>
          </el-form-item>
          <el-form-item style="float:right;width:5%;margin-right:1%">
            <el-button @click="drawGrid(1)">提取</el-button>
          </el-form-item>
          <el-form-item style="float:right;width:15%;margin-right:2%">
            <el-input  placeholder="输入内容进行搜索" @input="onQuickFilterChanged" style="width:100%"></el-input>
          </el-form-item>
        </el-form>
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
    <!--列表1切换显示-->
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false">
      <template v-for="(collist,i) in gridOptions.columnDefs">
        <div>
          <el-checkbox v-model="collist.visible" v-bind:key="collist.field" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--列表2切换显示-->
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible2" size="tiny" :closeOnClickModal="false" top="30%">
      <template v-for="(collist,i) in gridOptions2.columnDefs">
       <div>
          <el-checkbox v-model="collist.visible" v-bind:key="collist.field" @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
       </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible2 = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--列表3切换显示-->
    <el-dialog title="选择要显示的列表:" :visible.sync="colVisible3" size="tiny" :closeOnClickModal="false" top="30%">
      <template v-for="(collist,i) in gridOptions3.columnDefs">
        <div>
          <el-checkbox v-model="collist.visible" v-bind:key="collist.field" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)">
            {{collist.headerName}}
          </el-checkbox>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="colVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 入库界面 -->
    <!--<el-dialog :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <h2 style='text-align:center;margin-top:-2%'>入库更新</h2>
      <el-form :model="filterForm2" ref="filterForm2" style='margin-top:2%'>
        <el-form-item label="订单号：" style="float:left;width:23%">
          <el-input v-model="filterForm2.orderId" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="发货方：" style="float:left;width:23%">
          <el-input v-model="filterForm2.shipNam" style="width:65%"></el-input>
        </el-form-item>
        <el-form-item label="收货方：" style="float:left;width:23%">
          <el-input v-model="filterForm1.receNam" style="width:65%"></el-input>
        </el-form-item>
        <el-form-item style="float:right;width:5%;margin-right:3%">
          <el-button @click="drawGrid(2)">提取</el-button>
        </el-form-item>
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
        <el-form-item style="float:left;width:5%;margin-left:4%">
          <el-button v-popover:popover2>设置</el-button>
        </el-form-item>
        <el-form-item style="float:left;width:25%;margin-left:15%">
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
          <div style='text-align:center;clear:both;padding-top:2%'>
            <el-button @click="confirmSubmit" >确认入库</el-button>
            <el-button style='margin-left:10%' @click="verVisible = false">取消</el-button>
          </div>
    </el-dialog> -->


            <!--
    --入库界面
    -->
    <el-dialog title="订单入库" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="filterForm2" ref="filterForm" :inline="true">
            <div>
              <el-form-item label="订单时间">
                <el-date-picker v-model="filterForm2.startTime" type="daterange" placeholder="选择日期范围"
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
              <el-form-item>
                <el-button style="visibility: hidden"></el-button>
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
              <el-button style="visibility: hidden"></el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="confirmSubmit">确认入库</el-button>
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


    <!--确认入库弹框，选择支付方式与填写摘要-->
    <el-dialog title="确认入库" :visible.sync="confirmSubVisible" size="tiny" :closeOnClickModal="false">
      <h2>入库成功！</h2>
    </el-dialog>
    <!--警告弹窗-->
    <el-dialog title="错误" :visible.sync="errorVisible" size="tiny">
      <p>未发现需要入库的内容</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--订单详情弹框-->
    <el-dialog title="订单详情:" :visible.sync="detailVisible" size="small" :closeOnClickModal="false">
      <order-details :orderId="filterForm2.orderId"></order-details>
    </el-dialog>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import OrderDetails from '../financialAdministrator/ShowOrderDetails.vue'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  export default {
    created () {
      for (let i = 0; i < 100; i++) {
        this.testData1.push({
          'loadingId': '装载单ID' + i,
          'stockPos': '南京' + i,
          'driverNam': '司机姓名' + i,
          'licePlateNum': '车牌号' + i,
          'startPoint': '起始站' + i,
          'endPoint': '终点站' + i,
          'departTim': '发车时间' + i,
          'arrTim': '到达时间' + i
        })
        this.testData2.push({
          'loadingId': 'loadingId',
          'orderId': '订单号' + i,
          'goodsNam': '货物名称' + i,
          'licePlateNum': '车牌号' + i,
          'shipNam': '发货人' + i,
          'shipTel': '发货人联系方式' + i,
          'receNam': '收货人' + i,
          'receTel': '收货人联系方式' + i
        })
      }
    },
    data () {
      return {
        testData1: [], // 表1测试数据
        testData2: [], // 表2测试数据
        // 定义三个表格数据
        gridOptions: {
          rowData: [],
          columnDefs: [
            {
              headerName: '装载单号', width: 150, field: 'loadingId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '司机', width: 150, field: 'driverNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '车牌号', width: 150, field: 'licePlateNum', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '起始站', width: 150, field: 'startPoint', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '终点站', width: 150, field: 'endPoint', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发车时间', width: 150, field: 'departTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '到达时间', width: 150, field: 'arrTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
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
              headerName: '装载单号', width: 150, field: 'loadingId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '订单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '车牌号', width: 150, field: 'licePlateNum', filter: 'text', hide: false, visible: true
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
              headerName: '装载单号', width: 150, field: 'loadingId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '订单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true
            },
            {
              headerName: '车牌号', width: 150, field: 'licePlateNum', filter: 'text', hide: false, visible: true
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
            }
          ],
          context: {
            componentParent: this
          }
        },
        // 定义筛选条件
        filterForm1: {
          departTimStart: '', // 发车区域开始
          departTimEnd: '', // 发车区域结束
          loadingId: '', // 装载单ID
          stockPos: '', // 仓库位置
          driverNam: '' // 司机姓名
        },
        filterForm2: {
          orderId: '', // 订单号
          shipNam: '', // 发货方姓名
          receNam: '', // 收货人姓名
          startTime: ''
        },
        // 核销完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          payMode: 'WeChat',
          digest: '',
          loadingId: ''
        },
        //  表单验证规则
        rules: {},
        // dialog的可见性
        colVisible: false, // 切换列可见性的弹窗
        colVisible2: false,
        colVisible3: false,
        verVisible: false, // 进入入库页面的弹框
        confirmSubVisible: false, // 提交入库信息的弹框
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
          this.delChoose(this.gridOptions3.api.getSelectedRows())
        }
        this.createRowData(i)
        this.calculateGrid()
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
        this.rowCount = this.gridOptions.api.getModel().getRowCount()
      },
      // 显示切换列可见的弹框
      setting () {
        this.colVisible = true
      },
      // 进入订单入库界面
      detailDoubleClick (event) {
        this.confirmSubForm.loadingId = event.data.loadingId
        this.verVisible = true
        this.gridOptions2.api.selectAll()
        this.gridOptions3.api.selectAll()
        let data2 = this.gridOptions2.api.getSelectedRows()
        let data3 = this.gridOptions3.api.getSelectedRows()
        this.gridOptions2.api.updateRowData({remove: data2})
        this.gridOptions3.api.updateRowData({remove: data3})
      },
      // 核销界面左侧表格双击时间
      leftDoubleClick (event) {
        // this.leftSelect(event.data)
        this.filterForm2.orderId = event.data.orderId
        this.detailVisible = true
      },
      // 核销界面右侧表格双击时间
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
      // 打开提交入库结果的窗口
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
        this.drawGrid(2)
      },
      // 提交后台
      submit () {
        console.log(this.confirmSubForm)
        this.confirmSubVisible = false
        this.drawGrid(2)
      }
    },
    computed: {
    },
    updated () {
      console.log('update')
    }
  }
</script>
<style>
</style>
