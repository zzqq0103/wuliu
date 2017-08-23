<template>
  <div>
    <div>
      <h2 style="text-align:center">外包企业订单信息</h2>
      <p style="margin-top:1%">
        <div style="float: right">
          <el-input type="text" placeholder="请输入搜索内容" @input="onQuickFilterChanged"></el-input>
        </div>
        <div>
          <!--<el-button @click="vehicleVisable = true">添加</el-button>-->
          <el-button @click="ordeformerAdd">添加</el-button>
          <el-button @click="setting">设置</el-button>
        </div>
      </p>
    </div>
    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
                   :rowHeight="40"
                   :headerHeight="30"
      ></ag-grid-vue>
    </div>

    <el-dialog title="外包企业订单列表:" :visible.sync="orderFormVisable">
        <el-form :model="orderForm" :rules="rules" ref="orderForm">
          <el-form-item label="序号:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.licePlateNum"></el-input>
          </el-form-item>
          <el-form-item label="订单号:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.driverName"></el-input>
          </el-form-item>
          <el-form-item label="订单状态:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="发货人:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.capacity"></el-input>
          </el-form-item>
          <el-form-item label="发站:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.carType"></el-input>
          </el-form-item>
          <el-form-item label="发货方联系方式:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.carPosition"></el-input>
          </el-form-item>
          <el-form-item label="收货人:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.carpenon"></el-input>
          </el-form-item>
          <el-form-item label="收货方联系方式:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.carpenoning"></el-input>
          </el-form-item>
          <el-form-item label="货物名称:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.description"></el-input>
          </el-form-item>
          <el-form-item label="数量:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.denumber"></el-input>
          </el-form-item>
          <el-form-item label="制单人:" :label-width="formLabelWidth">
            <el-input v-model="orderForm.prepared"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="orderFormVisable = false">取 消</el-button>
          <el-button type="primary" @click="orderFormVisable = false">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="orderFormDelVisable" size=""tiny>
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderFormDelVisable = false">取 消</el-button>
        <el-button @click="orderFormDelVisable = false">确 定</el-button>
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
  export default {
    data () {
      return {
        colVisible: false,
        orderFormVisable: false,
        orderFormDelVisable: false,
        orderForm: {
          'licePlateNum': '',
          'driverName': '',
          'tel': '',
          'capacity': '',
          'carType': '',
          'pickUpArea': '',
          'carPosition': ''
        },
        rules: {
        },
        formLabelWidth: '150px',
        gridOptions: {
          context: {
            componentParent: this
          },
          rowData: null,
          columnDefs: [
            {
              headerName: '序号', width: 70, field: 'licePlateNum', filter: 'text', hide: false
            },
            {
              headerName: '订单号', width: 150, field: 'driverName', filter: 'text', hide: false
            },
            {
              headerName: '订单状态', width: 100, field: 'tel', filter: 'text', hide: false
            },
            {
              headerName: '发货人', width: 100, field: 'contractID', filter: 'text', hide: false
            },
            {
              headerName: '发站', width: 100, field: 'contractPrice', filter: 'text', hide: false
            },
            {
              headerName: '发货方联系方式', width: 150, field: 'capacity', filter: 'text', hide: false
            },
            {
              headerName: '收货人', width: 100, field: 'tonnage', filter: 'text', hide: false
            },
            {
              headerName: '收货方联系方式', width: 150, field: 'carType', filter: 'text', hide: false
            },
            {
              headerName: '货物名称', width: 150, field: 'pickUpArea', filter: 'text', hide: false
            },
            {
              headerName: '数量', width: 80, field: 'receState', filter: 'text', hide: false
            },
            {
              headerName: '制单人', width: 100, field: 'carState', filter: 'text', hide: false
            },
            {
              headerName: '状态', field: 'value', width: 80, cellRendererFramework: 'operateComponent', hide: false
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        // template:'<span></span><select><option  @click="vehicleDel" value="派送">派送</option><option  @click="vehicleDel" value="签收">签收</option></select></span>',
        template: '<select><option class="del-but" @click="orderDel">派  送</option><option class="del-but" @click="orderEdit">签 收</option></select>',
        methods: {
          orderDel () {
            this.params.context.componentParent.orderformDelVisable = true
          },
          orderEdit () {
            /* var vehicleform = this.params.context.componentParent.vehicleForm
            vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum */
            this.params.context.componentParent.orderFormVisable = true
            this.params.context.componentParent.orderForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.vehicleInfo.list
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
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
      },
      // 增加
      ordeformerAdd () {
        this.orderFormVisable = true
        this.orderForm.licePlateNum = ''
        this.orderForm.driverName = ''
        this.orderForm.tel = ''
        this.orderForm.capacity = ''
        this.orderForm.carType = ''
        this.orderForm.pickUpArea = ''
        this.orderForm.carPosition = ''
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
 .el-select-css {
   width: 50%;
 }
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