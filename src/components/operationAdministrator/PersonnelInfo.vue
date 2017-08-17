<template>
  <div>
    <div>
      <div style="float: right">
        <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged"></el-input>
      </div>
      <div>
        <el-button @click="test">添加</el-button>
        <el-button @click="colVisible = true">设置</el-button>
      </div>

      <el-dialog title="个人中心:" :visible.sync="colVisible" size="tiny">
        <template v-for="(collist,i) in gridOptions.columnDefs">
          <el-checkbox v-model="gridOptions.columnDefs[i].hide">{{collist.headerName}}</el-checkbox>
        </template>
      </el-dialog>
    </div>
    <div style="clear: both;"></div>
    <div>
      <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue"
                   :gridOptions="gridOptions"
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
          columnDefs: null
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
      createColumnDefs () {
        this.gridOptions.columnDefs = [
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
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      test () {
//        console.log(this.gridOptions.columnDefs[0].hide)
//        console.log(this.gridOptions.columnApi.getAllDisplayedColumns())
        console.log(this.gridOptions.columnApi.getColumnState())
      },
      setting () {

      }
    },
    computed: {
      getcol () {

      }
    },
    beforeMount () {
      this.createRowData()
      this.createColumnDefs()
      console.log(this.gridOptions)
    }
  }
</script>
