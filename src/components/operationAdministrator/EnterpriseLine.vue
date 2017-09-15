<template>
  <div>
    <div>
      <h2 style="text-align:center">外包企业线路信息管理</h2>
      <div style="margin-top:1%">
        <div style="float: right">
          <!--<el-row>订单号</el-row> -->
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <el-form v-model="filterForm" ref="filterForm" inline="true">
            <el-form-item label="外包企业名称">
              <el-input v-model="filterForm.companyName"></el-input>
            </el-form-item>
            <el-button @click="">提取</el-button>
            <el-button @click="addForm" style="margin-left: 50px">添加</el-button>
            <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="200" trigger="hover">
              <template v-for="(collist,i) in gridOptions.columnDefs">
                <div class="colVisible">
                  <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)">
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
            <el-button v-popover:popover1>设置</el-button>
          </el-form>
          <!--<el-button @click="setting">设置</el-button>-->
        </div>
      </div>
    </div>
    <div style="clear: both;">
    </div>
    <div>
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :rowHeight="40"
                   :headerHeight="40"
      ></ag-grid-vue>
    </div>
    <div style="text-align: center;margin-top:2%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrnetChange"
        :current-page="currentPage"
        :page-sizes="[10,20,50,100,200]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next"
        :total="rowCount">
      </el-pagination>
    </div>

    <el-dialog title="外包企业信息:" :visible.sync="enterpriseVisable">
      <el-form :model="enterpriseForm" :rules="rules" ref="enterpriseForm">
        <el-form-item label="公司名称:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.companyname"></el-input>
        </el-form-item>
        <el-form-item label="中转起始点:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.changeStart"></el-input>
        </el-form-item>
        <el-form-item label="中转目的地:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.changeEnd"></el-input>
        </el-form-item>
        <el-form-item label="中转企业联系人:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.changeName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.id"></el-input>
        </el-form-item>
        <el-form-item label="合同号:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.contractId"></el-input>
        </el-form-item>
        <el-form-item label="合同价格:" :label-width="formLabelWidth">
          <el-input v-model="enterpriseForm.contractPrice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="enterpriseVisable = false">取 消</el-button>
        <el-button type="primary" @click="enterpriseVisable = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="enterpriseDelVisable" size="" tiny>
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="enterpriseDelVisable = false">取 消</el-button>
        <el-button @click="enterpriseDelVisable = false">确 定</el-button>
      </div>
    </el-dialog>

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

  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'

  export default {
    data () {
      return {
        colVisible: false,
        enterpriseVisable: false,
        enterpriseDelVisable: false,
        enterpriseForm: {
          'companyname': '', // 外包公司名称
          'changeStart': '', // 中转起始地
          'changeEnd': '', // 中转目的地
          'changeName': '', // 中转企业联系人
          'id': '', // 联系方式
          'contractId': '', // 合同号
          'contractPrice': '' // 合同价格
        },
        filterForm: {
          'companyName': ''
        },
        rules: {},
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
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
              headerName: '公司名称',
              width: 150,
              field: 'companyName',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转起始点',
              width: 120,
              field: 'changeStart',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转目的地',
              width: 120,
              field: 'changeEnd',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '中转企业联系人',
              width: 150,
              field: 'changeName',
              visible: true,
              filterFramework: PartialMatchFilterComponent,
              hide: false
            },
            {
              headerName: '联系方式',
              width: 150,
              field: 'id',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '合同号',
              width: 120,
              field: 'contractId',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '合同价格',
              width: 120,
              field: 'contractPrice',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 150,
              cellRendererFramework: 'operateComponent',
              suppressMenu: true,
              hide: false,
              visible: true
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button class="del-but" @click="vehicleEdit" type="info" size="small">编 辑</el-button><el-button class="del-but" @click="vehicleDel" type="danger" size="small">删 除</el-button></span>',
        methods: {
          vehicleDel () {
            this.params.context.componentParent.enterpriseDelVisable = true
          },
          vehicleEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
             vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.enterpriseVisable = true
            console.log(this.params.data)
            this.params.context.componentParent.enterpriseForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.enterpriseInfo.list
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      // 增加
      addForm () {
        this.enterpriseVisable = true
        this.enterpriseForm.licePlateNum = ''
        this.enterpriseForm.driverName = ''
        this.enterpriseForm.tel = ''
        this.enterpriseForm.capacity = ''
        this.enterpriseForm.carType = ''
        this.enterpriseForm.pickUpArea = ''
        this.enterpriseForm.carPosition = ''
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
      }
    },
    beforeMount () {
      this.createRowData()
    },
    mounted () {
      this.changeColumnDefsBoolen()
    }
  }
</script>
<style>
</style>
