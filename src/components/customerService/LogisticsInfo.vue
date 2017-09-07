<template>
  <div>
    <div>
      <h2 style="text-align: center">物流信息查看</h2>
      <div style="width: 100%;margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged" style="width: 150px"></el-input>
          <el-button @click="createRowData()">提取</el-button>
          <!--<el-button @click="setting">设置</el-button>-->
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
        </div>
        <div>
          <el-form :model="filterForm" :ref="filterForm" :inline="true">
            <el-form-item label="订单编号:" style="margin-right: 10px">
              <el-input v-model="filterForm.orderId" type="text" placeholder="请输入查找的订单号" style="width: auto" @input="onQuickFilterChanged"></el-input>
            </el-form-item>
            <el-form-item label="订单状态:" style="margin-right: 10px">
              <el-select v-model="filterForm.state" placeholder="请选择订单状态">
                <el-option label="新开单" value="新开单"></el-option>
                <el-option label="旧开单" value="旧开单"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送货方式:" style="margin-right: 10px">
              <el-select v-model="filterForm.sendMode" placeholder="请选择送货方式">
                <el-option label="自提" value="自提"></el-option>
                <el-option label="送货上门" value="送货上门"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="clear: both"></div>
      <div style="width: 100%; margin-top: 2%">
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
      <!--查找物流信息 已弃用-->
      <!--<el-dialog title="查询物流信息:" :visible.sync="selectFormVisible">-->
        <!--<el-form :model="orderForm">-->
          <!--<el-form-item label="订单编号">-->
            <!--<el-input v-model="orderForm.oderId"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="始发地">-->
            <!--<el-input v-model="orderForm.departure"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="发送电话">-->
            <!--<el-input v-model="orderForm.telDeparture"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="目的地">-->
            <!--<el-input v-model="orderForm.destination"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="收货电话">-->
            <!--<el-input v-model="orderForm.telReceiving"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="货物名称">-->
            <!--<el-input v-model="orderForm.cargoName"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="件数">-->
            <!--<el-input v-model="orderForm.cargoPieces"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="物资状态">-->
            <!--<el-input v-model="orderForm.cargoCondition"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div class="dialog-footer">-->
          <!--<el-button @click="selectFormVisible=false">取消</el-button>-->
          <!--<el-button type="primary" @click="selectFormVisible=false">确定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
    </div>
  </div>
</template>

<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
export default {
    data () {
      return {
        gridOptions: {
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 100, field: 'index', suppressMenu: true, hide: false, visible: true
            },
            {
              headerName: '订单编号', width: 150, field: 'oderId', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '始发地', width: 150, field: 'departure', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '发送方电话', width: 150, field: 'telDeparture', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '目的地', width: 150, field: 'destination', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '收货方电话', width: 150, field: 'telReceiving', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '货物名称', width: 150, field: 'cargoName', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '件数', width: 150, field: 'cargoPieces', filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            },
            {
              headerName: '物资状态', field: 'cargoCondition', width: 150, filterFramework: PartialMatchFilterComponent, hide: false, visible: true
            }
          ],
          context: {
            componentParent: this
          }
        },
        options2: [{
          value: '自提',
          lable: '自提'
        }, {
          value: '送货上门',
          lable: '送货上门'
        }],
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
        filterForm: {
          orderId: '', // 运单号
          state: '', // 订单状态
          sendMode: '' // 送货方式
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
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
        this.calculateGrid()
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
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
//      selectForm () {
//        this.selectFormVisible = true
//        this.orderForm = {
//          oderId: '',
//          departure: '',
//          telDeparture: '',
//          destination: '',
//          telReceiving: '',
//          cargoName: '',
//          cargoPieces: '',
//          cargoCondition: ''
//        }
//      },
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
//        console.log(this.gridOptions.rowData)
        let processedRows = model.getRowCount()
//        let totalRows = this.gridOptions.rowData.length
//        console.log(totalRows, processedRows)
        this.rowCount = processedRows
      },
      drawGrid () {
        this.updateGrid()
        this.createRowData()
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
//      this.createRowData()
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

<!--//物流信息查看 数据-->
<!--//请求信息 'request': {-->
              <!--'orderId': '订单编号',-->
              <!--'state': '订单状态',-->
              <!--'sendMode': '送货方式'-->
              <!--}-->
<!--//获得信息 'response': {-->
              <!--'list':[-->
                <!--{-->
                <!--"oderId": '订单编号',-->
                <!--"departure": '始发地',-->
                <!--"telDeparture": '发送方电话',-->
                <!--"destination": '目的地',-->
                <!--"telReceiving": '收货方电话',-->
                <!--"cargoName": '货物名称',-->
                <!--"cargoPieces": '件数',-->
                <!--"cargoCondition": '物资状态'-->
                <!--}-->
              <!--]-->
            <!--}-->
