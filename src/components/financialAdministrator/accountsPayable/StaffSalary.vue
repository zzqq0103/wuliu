<template>
  <div>
    <div style="text-align: center;margin: 10px">
      <h2>人员支出</h2>
    </div>
    <!--表格上方操作区域-->
    <div>
      <div style="float: right">
        <!--<el-button @click="setting">设置</el-button>-->
        <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)" style="float: left;width: 180px">
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
      <div>
        <el-form ref="filterForm" :model="filterForm" :inline="true">
          <el-form-item label="员工姓名:">
            <el-input v-model="filterForm.employeeNam" style="width: 100px"></el-input>
          </el-form-item>
          <el-form-item label="工作岗位:">
            <el-input v-model="filterForm.workPosition" style="width: 100px"></el-input>
          </el-form-item>
          <el-button @click="drawGrid(1)">提取</el-button>
          <el-button @click="addForm">添加员工</el-button>
        </el-form>
      </div>
      <!--第二行开始-->
      <div>
        <el-form style="float: left" :model="totalForm" ref="totalForm" :inline="true">
          <el-form-item label="实发工资合计:">
            <el-input v-model="totalForm.realSalaryTotal" style="width: 100px" readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="float: right">
        <el-button @click="verification">开始核销</el-button>
      </div>
    </div>
    <div style="clear: both;"></div>
    <!--表格开始-->
    <div style="margin-top: 10px">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

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
    <!--添加员工信息-->
    <el-dialog title="添加员工信息:" :visible.sync="addFormVisible" size="tiny">
      <el-form :model="staffForm" :rules="rules" ref="staffForm">
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="员工姓名:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.employeeNam" style="width: 80%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="工作岗位:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.workPosition" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="20">
            <el-form-item label="入职时间:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.hireDate" style="width: 80%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="基本工资:" :label-width="formLabelWidth" style="float: right">
              <el-input v-model="staffForm.baseSalary" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实发工资:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.realSalary" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="借款总额:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.totalBorrMoney" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="扣款总额:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.deductMoney" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="事假天数:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.affairDays" style="width: 50%" maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="病假天数:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.sickDays" style="width: 50%" maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节假日天数:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.holidayDays" style="width: 50%" maxlength="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleVisable = false">取 消</el-button>
        <el-button type="primary" @click="vehicleVisable = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑员工信息-->
    <el-dialog title="编辑:" :visible.sync="editFormVisible" size="tiny" :closeOnClickModal="false">
      <el-form :model="staffForm" :rules="rules" ref="staffForm">
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="员工姓名:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.employeeNam" style="width: 80%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="工作岗位:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.workPosition" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="20">
            <el-form-item label="入职时间:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.hireDate" style="width: 80%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="基本工资:" :label-width="formLabelWidth" style="float: right">
              <el-input v-model="staffForm.baseSalary" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实发工资:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.realSalary" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="借款总额:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.totalBorrMoney" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="扣款总额:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.deductMoney" style="width: 60%" maxlength="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="事假天数:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.affairDays" style="width: 50%" maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="病假天数:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.sickDays" style="width: 50%" maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="节假日天数:" :label-width="formLabelWidth">
              <el-input v-model="staffForm.holidayDays" style="width: 50%" maxlength="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--删除客户信息-->
    <el-dialog title="" :visible.sync="delFormVisible" size="tiny" top="30%">
      <h2 style="padding:30px">确认删除 {{staffForm.employeeNam}} 吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delFormVisible = false">取 消</el-button>
        <el-button @click="delFormVisible = false" type="danger">确 定</el-button>
      </div>
    </el-dialog>


    <!--
--核销界面
-->
    <el-dialog :visible.sync="verVisible" size="full" :closeOnClickModal="false">
      <h2 style='text-align:center;margin-top:-2%'>人员支出核销</h2>
      <el-row :gutter="20" style="margin-top: 2%">
        <el-col :span="12">
          <el-form :model="filterForm" ref="filterForm" :inline="true">
            <div style="float: right">
              <el-button @click="drawGrid(2)">提取库存</el-button>
              <!--<el-button @click="colVisible2 = true">设置</el-button>-->
              <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                <template v-for="(collist,i) in gridOptions2.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible"
                                 @change="updateColumnDefsVisible(2,gridOptions2.columnDefs)" style="float: left;width: 180px">
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
            <div>
              <el-form-item label="员工姓名:">
                <el-input v-model="filterForm.employeeNam" style="width: 100px"></el-input>
              </el-form-item>
              <el-form-item label="工作岗位:">
                <el-input v-model="filterForm.workPosition" style="width: 100px"></el-input>
              </el-form-item>
            </div>
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
              <el-button @click="confirmSubmit">确认核销</el-button>
              <!--<el-button @click="colVisible3 = true">设置</el-button>-->
              <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
                <template v-for="(collist,i) in gridOptions3.columnDefs">
                  <div class="colVisible">
                    <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(3,gridOptions3.columnDefs)"style="float: left;width: 180px">
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
      <el-form :model="confirmSubForm" ref="confirmSubForm" labelWidth="80px">
        <el-form-item label="支付方式">
          <el-select v-model="confirmSubForm.payMode" placeholder="支付方式" style="width: 80px">
            <el-option label="微信" value="WeChat"></el-option>
            <el-option label="支付宝" value="Alipay"></el-option>
            <el-option label="转账" value="transfer "></el-option>
            <el-option label="现金" value="cash"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="confirmSubForm.digest" style="width: 200px"></el-input>
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
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import PartialMatchFilterComponent from '../../common/PartialMatchFilterComponent'
  import testJson from '../../../../static/test/testJSON.js'

  export default {
    data () {
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '序号',
              width: 60,
              field: 'index',
              suppressMenu: true,
              hide: false,
              visible: true
            },
            {
              headerName: '员工姓名',
              width: 100,
              field: 'employeeNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '入职时间',
              width: 200,
              field: 'hireDate',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '工作岗位',
              width: 150,
              field: 'workPosition',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '基本工资',
              width: 100,
              field: 'baseSalary',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '实发工资',
              width: 100,
              field: 'realSalary',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '借款总额',
              width: 100,
              field: 'totalBorrMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '扣款总额',
              width: 100,
              field: 'deductMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '事假天数',
              width: 100,
              field: 'affairDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '病假天数',
              width: 100,
              field: 'sickDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '节假日天数',
              width: 100,
              field: 'holidayDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '核销状态',
              width: 100,
              field: 'veriState',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '核销人',
              width: 100,
              field: 'veriNam',
              filterFramework: PartialMatchFilterComponent,
              hide: true,
              visible: false
            },
            {
              headerName: '核销日期',
              width: 200,
              field: 'veriTim',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '支付方式',
              width: 100,
              field: 'payMode',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 120,
              cellRendererFramework: 'operateComponent',
              hide: false,
              visible: true,
              pinned: 'right'
            }
          ],
          context: {
            componentParent: this
          }
        },
        gridOptions2: {
          rowData: null,
          columnDefs: [
            {
              headerName: '序号',
              width: 60,
              field: 'index',
              suppressMenu: true,
              hide: false,
              visible: true
            },

            {
              headerName: '员工姓名',
              width: 100,
              field: 'employeeNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '入职时间',
              width: 200,
              field: 'hireDate',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '工作岗位',
              width: 150,
              field: 'workPosition',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '基本工资',
              width: 100,
              field: 'baseSalary',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '实发工资',
              width: 100,
              field: 'realSalary',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '借款总额',
              width: 100,
              field: 'totalBorrMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '扣款总额',
              width: 100,
              field: 'deductMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '事假天数',
              width: 100,
              field: 'affairDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '病假天数',
              width: 100,
              field: 'sickDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '节假日天数',
              width: 100,
              field: 'holidayDays',
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
          rowData: null,
          columnDefs: [
            {
              headerName: '序号',
              width: 60,
              field: 'index',
              suppressMenu: true,
              hide: false,
              visible: true
            },

            {
              headerName: '员工姓名',
              width: 100,
              field: 'employeeNam',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '入职时间',
              width: 200,
              field: 'hireDate',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '工作岗位',
              width: 150,
              field: 'workPosition',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '基本工资',
              width: 100,
              field: 'baseSalary',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '实发工资',
              width: 100,
              field: 'realSalary',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '借款总额',
              width: 100,
              field: 'totalBorrMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '扣款总额',
              width: 100,
              field: 'deductMoney',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '事假天数',
              width: 100,
              field: 'affairDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '病假天数',
              width: 100,
              field: 'sickDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '节假日天数',
              width: 100,
              field: 'holidayDays',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },

        filterForm: {
          employeeNam: '',
          workPosition: ''
        },
        staffForm: {
          employeeNam: '',
          hireDate: '',
          workPosition: '',
          baseSalary: '',
          realSalary: '',
          totalBorrMoney: '',
          deductMoney: '',
          affairDays: '',
          sickDays: '',
          holidayDays: ''
        },
        // 各种费用合计
        totalForm: {
          realSalaryTotal: 0 // 实发工资
        },
        // 核销完成后提交给后台的数据
        confirmSubForm: {
          orderId: [],
          payMode: 'WeChat',
          digest: ''
        },
        rules: {},
        addFormVisible: false,
        delFormVisible: false,
        editFormVisible: false,
        formLabelWidth: '90px',
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
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button  class="del-but" @click="edit" type="info" size="small">编 辑</el-button><el-button class="del-but" @click="del" type="danger" size="small">删 除</el-button></span>',
        methods: {
          del () {
            let self = this.params.context.componentParent
            self.delFormVisible = true
            self.staffForm.employeeNam = this.params.data.employeeNam
          },
          edit () {
            let self = this.params.context.componentParent
            self.editFormVisible = true
            self.staffForm = this.params.data
//            console.log(self.personnelForm)
          }
        }
      }
    },
    methods: {
      // 绘制表格，包括更新列信息与行信息
      drawGrid (i) {
        console.log(this.filterForm)
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
          // 测试一下有条件时提取，是否会刷新表格
          if (this.filterForm.employeeNam === '1') {
            this.gridOptions.rowData = testJson.staffSalary2.list
            this.gridOptions.api.setRowData(this.gridOptions.rowData)
          } else {
            this.gridOptions.rowData = testJson.staffSalary.list
            this.gridOptions.api.setRowData(this.gridOptions.rowData)
          }
        } else if (i === 2) {
          this.gridOptions2.rowData = testJson.staffSalary.list
          this.gridOptions2.api.setRowData(this.gridOptions2.rowData)
        }
      },
      // 更新列数据
      updateGrid (i) {
        if (i === 1) {
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
        } else if (i === 2) {
          const payType = this.filterForm.payType
          const lenth = (this.gridOptions2.columnDefs.length - 1)
          if (payType === 'nowPay') {
            this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.nowPay
            this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.nowPay
          } else if (payType === 'cashOnDelivery') {
            this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.cashOnDelivery
            this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.cashOnDelivery
          } else if (payType === 'inArrears') {
            this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.inArrears
            this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.inArrears
          } else if (payType === 'monthly') {
            this.gridOptions2.columnDefs[lenth] = this.additionalColumnDefs2.monthly
            this.gridOptions3.columnDefs[lenth] = this.additionalColumnDefs3.monthly
          }
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
      // 添加员工信息
      addForm () {
        this.staffForm = {
          employeeNam: '',
          hireDate: '',
          workPosition: '',
          baseSalary: '',
          realSalary: '',
          totalBorrMoney: '',
          deductMoney: '',
          affairDays: '',
          sickDays: '',
          holidayDays: ''
        }
        this.addFormVisible = true
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
      grid3Ready () {
        this.updateGrid(2)
      },
      // 测试用的方法，没用
      test () {
        this.updateGrid(2)
        console.log(this.gridOptions2.columnDefs)
      },
      // 显示切换列可见的弹框
      setting () {
        this.colVisible = true
      },
      // 显示切换核销界面的弹框
      verification () {
        this.filterForm = {
          employeeNam: '',
          workPosition: ''
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
      }
    },
    computed: {
      // 计算合计金额
      calculateMoney () {
        if (this.verVisible === false) {
          this.totalForm.realSalaryTotal = 0
          let model = this.gridOptions.api.getModel()
          let arr = model.rootNode.childrenAfterFilter
          console.log(arr[0].data)
          for (let i = 0; i < arr.length; i++) {
            this.totalForm.realSalaryTotal += arr[i].data.realSalary
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

</style>
