<template>
  <div>
    <div>
      <div style="float: right">
        <el-input type="text" placeholder="请输入要搜索的内容" @input="onQuickFilterChanged"></el-input>
      </div>
      <div>
        <el-button>添加</el-button>
      </div>
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
          columnDefs: null,
          rowData: null
        }
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
            headerName: '客户企业ID', width: 150, field: 'clientCompId', filter: 'text'
          },
          {
            headerName: '客户企业名称', width: 150, field: 'clientCompNam', filter: 'text'
          },
          {
            headerName: '联系人姓名', width: 150, field: 'nam', filter: 'text'
          },
          {
            headerName: '联系电话', width: 150, field: 'tel', filter: 'text'
          },
          {
            headerName: '企业详细地址', width: 150, field: 'compAdr', filter: 'text'
          },
          {
            headerName: '所属片区', width: 150, field: 'area', filter: 'text'
          },
          {
            headerName: '业务员ID', width: 150, field: 'salesmanId', filter: 'text'
          },
          {
            headerName: '是否三方', width: 150, field: 'isTril', filter: 'text'
          }

        ]
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      }
    },
    beforeMount () {
      this.createRowData()
      this.createColumnDefs()
      console.log(this.gridOptions)
    }
  }
</script>
