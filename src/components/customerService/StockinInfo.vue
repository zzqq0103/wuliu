<template>
  <div>
    <div style="text-align: center;margin：10px">
      <h2>长途入库</h2>
    </div>
    <!--表格筛选区域-->
    <div>
        <el-form v-model="filterForm1" ref="filterForm1" style='margin-top:20px' :inline="true">
          <el-form-item label="发车时间：">
            <el-date-picker v-model="filterForm1.departTimStart" type="daterange" placeholder="选择日期范围"
                            :picker-options="pickerOptions" range-separator='/' style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="始发站：">
            <el-select style='width:100px' v-model="filterForm1.startStation">
              <el-option v-for="item in initForm.startStationList" :value="item" :label="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装载单号：">
            <el-input v-model="filterForm1.loadingId" placeholder="输入装载号" style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="装载单状态：">
            <el-select style='width:100px' v-model="filterForm1.loadingState">
              <el-option value='已发车'></el-option>
              <el-option value="已到货"></el-option>
              <el-option value="异常"></el-option>
            </el-select>
          </el-form-item>
          <!-- 设置列 -->
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
          <el-button v-popover:popover1 style='margin-left:10px;float:right'>设 置</el-button>
          <el-button style='float:right'>导 出</el-button>
          <el-button @click="drawGrid(1)" style='float:right'>提 取</el-button>
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
    <!--入库界面-->
    <el-dialog title="订单长途入库" :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="filterForm2" ref="filterForm" :inline="true">
            <div>
              <el-form-item label="发车时间：">
                <el-date-picker v-model="filterForm2.startTime" type="daterange" placeholder="选择日期范围"
                                  :picker-options="pickerOptions" style='width:200px' range-separator='/'>
                </el-date-picker>
              </el-form-item>
              <el-form-item label="订单号：">
                <el-input  v-model="filterForm2.orderId" placeholder="输入订单号" style='width:150px'></el-input>
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
          <el-input style="visibility: hidden;width: 200px"></el-input>
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
              <el-button @click="confirmSubmit(1)">确认入库</el-button>
              <el-button @click="confirmSubmit(0)">入库异常</el-button>
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

        <!-- 添加异常信息弹窗 -->
    <el-dialog title="编辑大车异常信息:"   :visible.sync="errorEditVisable" size="tiny"
        :closeOnClickModal="false" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false" 
        :show-close="false">
      <el-form :model='errorForm' :rules="rules" ref="errorForm">
        <el-form-item label="装载单号：" label-width="100px">
          <el-label style='width:200px'>{{errorForm.loadingId}}</el-label>
        </el-form-item>
        <el-form-item label="车牌号：" label-width="100px">
          <el-label  style='width:80%'>{{errorForm.licePlateNum}}</el-label>
        </el-form-item>
        <el-form-item label="异动支出："label-width="100px" prop="unActExpense">
          <el-input style='width:80%' v-model='errorForm.unActExpense' type="number"></el-input>
        </el-form-item>
        <el-form-item label="异动时间：" label-width="100px" prop="unActTim">
          <el-date-picker type="date" placeholder="选择日期" v-model='errorForm.unActTim' style="width: 80%"></el-date-picker>
        </el-form-item>
        <el-form-item label="异动原因：" label-width="100px" prop="unActDes">
          <el-input style='width:80%' v-model='errorForm.unActDes'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleError('errorForm')">取 消</el-button>
        <el-button type="primary" @click="resetError('errorForm')">重 置</el-button>
        <el-button type="primary" @click="submitError('errorForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--确认入库弹框-->
    <el-dialog title="确认入库" :visible.sync="confirmSubVisible" size="tiny" :close-on-click-modal="false"
        :close-on-press-escape="false" 
        :show-close="false">
      <h2 style='text-align:center'>确认入库吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmSubVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(1)">确 定</el-button>
      </div>
    </el-dialog>

    <!--无入库内容警告弹窗-->
    <el-dialog title="错误" :visible.sync="errorVisible" size="tiny">
      <h2>未发现需要提交的内容</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--提交异常弹窗-->
    <el-dialog title="确认入库异常" :visible.sync="unusualVisible" size="tiny":close-on-click-modal="false"
        :close-on-press-escape="false" 
        :show-close="false">
      <h2>确认提交入库异常么？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submit(0)" type="primary">确 定</el-button>
        <el-button @click="unusualVisible = false">取 消</el-button>
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
          'driverNam': '司机姓名' + i,
          'licePlateNum': '车牌号' + i,
          'startPoint': '起始站' + i,
          'endPoint': '终点站' + i,
          'departTim': '发车时间' + i,
          'loadingState': '装载单状态'
        })
        this.testData2.push({
          'orderId': '订单号' + i,
          'subId': '子件号' + i,
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
        // 添加大车异常
        errorForm: {
          'loadingId': '',
          'licePlateNum': '',
          'unActExpense': '',
          'unActTim': new Date(),
          'unActDes': ''
        },
        // 定义三个表格数据
        gridOptions: {
          rowData: [],
          columnDefs: [
            {
              headerName: '装载单号', width: 200, field: 'loadingId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '司机', width: 200, field: 'driverNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '车牌号', width: 200, field: 'licePlateNum', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '起始站', width: 200, field: 'startPoint', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '终点站', width: 200, field: 'endPoint', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '发车时间', width: 200, field: 'departTim', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '装载单状态', width: 200, field: 'loadingState', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '操作', field: 'value', width: 150, cellRendererFramework: 'operateComponent', hide: false, visible: true, pinned: 'right', suppressMenu: true, suppressSorting: true
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
              headerName: '订单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '子件号', width: 150, field: 'subId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '车牌号', width: 150, field: 'licePlateNum', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
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
              headerName: '订单号', width: 150, field: 'orderId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '子件号', width: 150, field: 'subId', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '货物名称', width: 150, field: 'goodsNam', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
            },
            {
              headerName: '车牌号', width: 150, field: 'licePlateNum', filter: 'text', hide: false, visible: true, filterFramework: PartialMatchFilterComponent
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
            }
          ],
          context: {
            componentParent: this
          }
        },
        // 初始
        initForm: {
          startStationList: ['始发站1', '始发站2', '始发站3', '始发站4', '始发站5']
        },
        // 定义筛选条件
        filterForm1: {
          departTimStart: '', // 发车区域开始
          departTimEnd: '', // 发车区域结束
          loadingId: '', // 装载单ID
          driverNam: '', // 司机姓名
          loadingState: '', // 装载单状态
          startStation: '' // 始发站
        },
        filterForm2: {
          orderId: '', // 订单号
          startTime: ''
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
        // 入库完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          type: 1 // 1为正常入库，0为入库异常
        },
        //  表单验证规则
        rules: {
          unActExpense: [
            {required: true, message: '请输入异动支出', trigger: 'blur'},
            {validator (r, v, b) { (/^\d*?\.?\d*?$/).test(v) ? b() : b(new Error('请填写正确的异动支出')) }}
          ],
          unActTim: [
            {required: true, message: '请选择时间', type: 'date'}
          ],
          unActDes: [
            {required: true, message: '请填写异常描述', trigger: 'blur'}
          ]
        },
        // dialog的可见性
        errorEditVisable: false, // 编辑异常弹窗
        colVisible: false, // 切换列可见性的弹窗
        colVisible2: false,
        colVisible3: false,
        verVisible: false, // 进入入库页面的弹框
        confirmSubVisible: false, // 提交入库信息的弹框
        unusualVisible: false, // 提交入库异常信息弹窗
        errorVisible: false, // 错误信息弹框
        detailVisible: false, // 订单详情弹框
        currentPage: 1, // 分页当前页面
        pageSize: 20, // 每页显示的数据
        rowCount: 0 // 总数据量（如果有筛选，则是筛选后的）
      }
    },
    components: {
      OrderDetails,
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<el-button class="del-but" type="info" style="margin-left:20px" size="small" @click="addError">编辑大车异常</el-button>',
        methods: {
          addError () {
            let self = this.params.context.componentParent
            self.errorEditVisable = true
            self.errorForm = {
              'licePlateNum': '',
              'loadingId': '',
              'unActExpense': '',
              'unActTim': new Date(),
              'unActDes': '',
              'serviceNam': ''
            }
            self.errorForm.loadingId = this.params.data.loadingId
            self.errorForm.licePlateNum = this.params.data.licePlateNum
          }
        }
      }
    },
    methods: {
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
        // this.confirmSubForm.loadingId = event.data.loadingId
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
      // 打开提交入库结果的窗口 type=1为正常入库 type=0为入库异常
      confirmSubmit (type) {
        this.gridOptions3.api.selectAllFiltered()
        const confirmData = this.gridOptions3.api.getSelectedRows()
        if (confirmData.length < 1) {
          this.errorVisible = true
        } else {
          for (let i = 0; i < confirmData.length; i++) {
            this.confirmSubForm.orderId[i] = confirmData[i].orderId
          }
          if (type === 1) {
            this.confirmSubVisible = true
          }
          if (type === 0) {
            this.unusualVisible = true
          }
        }
        console.log(confirmData)
        // this.drawGrid(2)
      },
      // 提交后台
      submit (type) {
        if (type) {
          this.confirmSubVisible = false
        } else {
          this.unusualVisible = false
        }
        console.log(this.confirmSubForm)

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