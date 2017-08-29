<template>
  <div>
    <div>
      <h2 style="text-align: center">物流信息查看</h2>
      <div style="width: 100%">
       <p style="margin-top:1%"></p>
        <div style="float: left; margin-right: 20px">
          <label>订单编号</label>
          <el-input type="text" placeholder="请输入查找的订单号" style="width: auto" @input="onQuickFilterChanged"></el-input>
        </div>
        <div style="float: left; margin-right: 20px">
          <label>订单状态</label>
          <el-select v-model="value1" placeholder="请选择送货方式">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float: left; margin-right: 20px">
          <label>送货方式</label>
          <el-select v-model="value2" placeholder="请选择送货方式">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float: right">
          <el-button @click="selectForm">查找</el-button>
          <el-button @click="setting">设置</el-button>
          <el-button>打印</el-button>
        </div>
      </div>
      <div style="clear: both"></div>
      <div style="width: 100%; margin-top: 2%">
        <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                     :gridOptions="gridOptions"
                     :suppressMovableColumns="true"
                     :enableColResize="true"
                     :enableSorting="true"
                     :enableFilter="true"
                     :groupHeaders="true"
                     :suppressCellSelection="true"
                     :rowHeight=40

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
      <!--查找物流信息-->
      <el-dialog title="查询物流信息:" :visible.sync="selectFormVisible">
        <el-form :model="orderForm">
          <el-form-item label="订单编号">
            <el-input v-model="orderForm.oderId"></el-input>
          </el-form-item>
          <el-form-item label="始发地">
            <el-input v-model="orderForm.departure"></el-input>
          </el-form-item>
          <el-form-item label="发送电话">
            <el-input v-model="orderForm.telDeparture"></el-input>
          </el-form-item>
          <el-form-item label="目的地">
            <el-input v-model="orderForm.destination"></el-input>
          </el-form-item>
          <el-form-item label="收货电话">
            <el-input v-model="orderForm.telReceiving"></el-input>
          </el-form-item>
          <el-form-item label="货物名称">
            <el-input v-model="orderForm.cargoName"></el-input>
          </el-form-item>
          <el-form-item label="件数">
            <el-input v-model="orderForm.cargoPieces"></el-input>
          </el-form-item>
          <el-form-item label="物资状态">
            <el-input v-model="orderForm.cargoCondition"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="selectFormVisible=false">取消</el-button>
          <el-button type="primary" @click="selectFormVisible=false">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
export default {
    data () {
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '订单编号', width: 150, field: 'oderId', filter: 'text', hide: false
            },
            {
              headerName: '始发地', width: 150, field: 'departure', filter: 'text', hide: false
            },
            {
              headerName: '发送方电话', width: 150, field: 'telDeparture', filter: 'text', hide: false
            },
            {
              headerName: '目的地', width: 150, field: 'destination', filter: 'text', hide: false
            },
            {
              headerName: '收货方电话', width: 150, field: 'telReceiving', filter: 'text', hide: false
            },
            {
              headerName: '货物名称', width: 150, field: 'cargoName', filter: 'text', hide: false
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filter: 'text', hide: false
            },
            {
              headerName: '物资状态', field: 'cargoCondition', width: 150, filter: 'text', hide: false
            }
          ],
          context: {
            componentParent: this
          }
        },
        options1: [{
          value: '新开单',
          lable: '新开单'
        }, {
          value: '旧开单',
          lable: '旧开单'
        }
        ],
        options2: [{
          value: '自提',
          lable: '自提'
        }, {
          value: '送货上门',
          lable: '送货上门'
        }],
        value1: '',
        value2: '',
        orderForm: {
          oderId: '',
          departure: '',
          telDeparture: '',
          destination: '',
          telReceiving: '',
          cargoName: '',
          cargoPieces: '',
          cargoCondition: ''
        },
        rules: {},
        colVisible: false,
        selectFormVisible: false,
        formLabelWidth: '150px',
        currentPage: 1,
        pageSize: 20,
        rowCount: 0
      }
    },
    components: {
      'ag-grid-vue': AgGridVue
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.oderInfo.list
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
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
      selectForm () {
        this.selectFormVisible = true
        this.orderForm = {
          oderId: '',
          departure: '',
          telDeparture: '',
          destination: '',
          telReceiving: '',
          cargoName: '',
          cargoPieces: '',
          cargoCondition: ''
        }
      },
      handleSizeChange (val) {
        this.gridOptions.api.paginationSetPageSize(Number(val))
      },
      handleCurrnetChange (val) {
        this.gridOptions.api.paginationGoToPage(val)
      },
      gridfilterChange () {
        this.calculateGrid()
      },
      calculateGrid () {
        this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
        let model = this.gridOptions.api.getModel()
        console.log(model)
        console.log(this.gridOptions.rowData)
        let processedRows = model.getRowCount()
//        let totalRows = this.gridOptions.rowData.length
//        console.log(totalRows, processedRows)
        this.rowCount = processedRows
      }
    },
    beforeMount () {
      this.createRowData()
    },
    mounted () {
      this.changeColumnDefsBoolen()
      this.gridfilterChange()
    }
  }
</script>

<style>
  .dialog-footer{
    float: right;
    margin-bottom: 40px;
  }
</style>
