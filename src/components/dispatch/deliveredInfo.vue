
<template>
  <div>
    <div>
      <h2 style="text-align:center">已 发 货 订 单 信 息 页</h2>
      <p style="margin-top:1%">
        <div>
          <!--<el-button @click="vehicleVisable = true">添加</el-button>-->
          <!-- <el-button @click="vehicleAdd">添加</el-button> -->
          <el-input placeholder="请输入查询数据" icon="search"  v-model="filters.names" :on-icon-click="handleIconClick" style="width:145px;"> </el-input>
          <el-select v-model="value" :placeholder="queryItemOptions[0].label" style="width:105px;">
            <el-option v-for="item in queryItemOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="setting">设置</el-button>
          <el-button style="float:right;">导出</el-button>
        </div>
      </p>
    </div>

    <div style="clear: both;">
    </div>

    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 470px" class="ag-blue" :gridOptions="gridOptions" :suppressMovableColumns="true" :enableColResize="true" :enableSorting="true" :enableFilter="true" :groupHeaders="true" :rowHeight=40 :headerHeight=30></ag-grid-vue>
    </div>

    <div class="block" style="float:right; padding-top:10px;">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="100"
            layout="prev, pager, next, jumper"
            :total="1000">
        </el-pagination>
    </div>
  
    <el-dialog title="" :visible.sync="vehicleDelVisable" size="" tiny>
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vehicleDelVisable = false">取 消</el-button>
        <el-button @click="vehicleDelVisable = false">确 定</el-button>
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
import { AgGridVue } from 'ag-grid-vue'
import testJson from '../../../static/test/testJSON.js'
export default {
  data () {
    return {
      filters: {
        name: '请输入查询数据'
      },
      currentPage: 1,
      colVisible: false,
      vehicleVisable: false,
      vehicleDelVisable: false,
      vehicleForm: {
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
      formLabelWidth: '120px',
      gridOptions: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '序号', width: 120, field: 'licePlateNum', filter: 'text', hide: false
          },
          {
            headerName: '装载单号', width: 120, field: 'driverName', filter: 'text', hide: false
          },
          {
            headerName: '订单号', width: 120, field: 'tel', filter: 'text', hide: false
          },
          {
            headerName: '开单时间', width: 120, field: 'contractID', filter: 'text', hide: false
          },
          {
            headerName: '收货单位', width: 120, field: 'contractPrice', filter: 'text', hide: false
          },
          {
            headerName: '收货人姓名', width: 120, field: 'capacity', filter: 'text', hide: false
          },
          {
            headerName: '联系电话', width: 120, field: 'tonnage', filter: 'text', hide: false
          },
          {
            headerName: '搜狐或地址', width: 120, field: 'carType', filter: 'text', hide: false
          },
          {
            headerName: '货物名称', width: 120, field: 'pickUpArea', filter: 'text', hide: false
          },
          {
            headerName: '件数', width: 120, field: 'receState', filter: 'text', hide: false
          },
          {
            headerName: '重量', width: 120, field: 'carState', filter: 'text', hide: false
          },
          {
            headerName: '体积', width: 120, field: 'carPosition', filter: 'text', hide: false
          },
          {
            headerName: '包装', field: 'value', width: 120, hide: false
          },
          {
            headerName: '备注', field: 'value', width: 120, hide: false
          }
        ]
      },
      queryItemOptions: [{
        value: '选项1',
        label: '装载单号'
      }, {
        value: '选项2',
        label: '订单号'
      }],
      value: '',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    operateComponent: {
      template: '<span><button class="del-but" @click="vehicleDel">删 除</button><button class="del-but" @click="vehicleEdit">编 辑</button></span>',
      methods: {
        vehicleDel () {
          this.params.context.componentParent.vehicleDelVisable = true
        },
        vehicleEdit () {
          var vehicleform = this.params.context.componentParent.vehicleForm
          vehicleform.licePlateNum = testJson.vehicleInfo.list[this.params.node.rowIndex].licePlateNum
          vehicleform.driverName = testJson.vehicleInfo.list[this.params.node.rowIndex].driverName
          vehicleform.tel = testJson.vehicleInfo.list[this.params.node.rowIndex].tel
          vehicleform.capacity = testJson.vehicleInfo.list[this.params.node.rowIndex].capacity
          vehicleform.carType = testJson.vehicleInfo.list[this.params.node.rowIndex].carType
          vehicleform.pickUpArea = testJson.vehicleInfo.list[this.params.node.rowIndex].pickUpArea
          vehicleform.carPosition = testJson.vehicleInfo.list[this.params.node.rowIndex].carPosition
          this.params.context.componentParent.vehicleVisable = true
        }
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    handleIconClick (input) {
      this.gridOptions.api.setQuickFilter(input)
    },
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
    vehicleAdd () {
      this.vehicleVisable = true
      this.vehicleForm.licePlateNum = ''
      this.vehicleForm.driverName = ''
      this.vehicleForm.tel = ''
      this.vehicleForm.capacity = ''
      this.vehicleForm.carType = ''
      this.vehicleForm.pickUpArea = ''
      this.vehicleForm.carPosition = ''
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
