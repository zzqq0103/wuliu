<template>
  <div>
    <div>
      <div style="float: right">
        <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged"></el-input>
      </div>
      <div>
        <el-button @click="test">添加</el-button>
        <el-button @click="setting">设置</el-button>
      </div>

      <el-dialog title="选择要显示的列表:" :visible.sync="colVisible" size="tiny" :closeOnClickModal="false" top="30%">
        <template v-for="(collist,i) in gridOptions.columnDefs">
          <div>
            <el-checkbox v-model="collist.hide" @change="updataColumnDefs(gridOptions.columnDefs)">{{collist.headerName}}</el-checkbox>
          </div>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="colVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="clear: both;"></div>
    <div>
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :enableSorting="true"
                   :enableFilter="true"
                   :groupHeaders="true"
      ></ag-grid-vue>
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
              headerName: '客户企业ID', width: 150, field: 'clientCompId', filter: 'text', hide: false
            },
            {
              headerName: '客户企业名称', width: 150, field: 'clientCompNam', filter: 'text', hide: false
            },
            {
              headerName: '联系人姓名', width: 150, field: 'nam', filter: 'text', hide: false
            },
            {
              headerName: '联系电话', width: 150, field: 'tel', filter: 'text', hide: false
            },
            {
              headerName: '企业详细地址', width: 150, field: 'compAdr', filter: 'text', hide: false
            },
            {
              headerName: '所属片区', width: 150, field: 'area', filter: 'text', hide: false
            },
            {
              headerName: '业务员ID', width: 150, field: 'salesmanId', filter: 'text', hide: false
            },
            {
              headerName: '是否三方', width: 150, field: 'isTril', filter: 'text', hide: false
            }
          ]
        },
        colVisible: false
      }
    },
    components: {
      'ag-grid-vue': AgGridVue
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.personnelInfo.list
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
      test () {
        console.log(this.gridOptions.columnDefs)
//        console.log(this.gridOptions.columnDefs[0].hide)
//        console.log(this.gridOptions.columnApi.getAllDisplayedColumns())
//        if (this.gridOptions.columnDefs[0].hide) {
//          this.gridOptions.columnDefs[0].hide = false
//        } else {
//          this.gridOptions.columnDefs[0].hide = true
//        }
//        this.gridOptions.columnApi.setColumnVisible('clientCompId', true)
//        this.gridOptions.columnApi.setColumnVisible('isTril', false)
//        console.log(this.gridOptions.columnDefs[0].hide)
//        console.log(this.gridOptions.columnApi.getColumnState())
      },
      setting () {
        this.colVisible = true
      }
    },
    beforeMount () {
      this.createRowData()
//      this.createColumnDefs()
    },
    mounted () {
      this.changeColumnDefsBoolen()
    }
  }
</script>
