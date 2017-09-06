<template>
    <div>
        <div>
            <h2 style="text-align:center">回单管理</h2>
            <p style="margin-top:1%;float:left" class="appointment" :model="transfer">
                <el-h5 class="appointmenttime">开单时间</el-h5>
                <el-date-picker type="datetime" class="appointmenttimes" placeholder="开始时间" v-model="transfer.startTime"></el-date-picker>
                <el-h5 class="appointmenttimes">到</el-h5>
                <el-date-picker type="datetime" class="appointmenttimes" placeholder="结束时间" v-model="transfer.endTime"></el-date-picker>
                <el-h5 class="appointmenttimes">预约单号：</el-h5>
                <el-input class="appointmenttimeman"></el-input>
                <el-h5 class="appointmenttimes">回单状态：</el-h5>
                <el-select v-model="transfer.Selectsite" placeholder="选择" class="appointmentoption" style='width:100px'>
                    <el-option key="yes" label="待生成" value="yes"></el-option>
                    <el-option key="no" label="已生成" value="no"></el-option>
                </el-select>
                <el-h5 class="appointmenttimes">回单押款状态：</el-h5>
                <el-select v-model="transfer.state" placeholder="选择" class="appointmentoption" style='width:100px'>
                    <el-option key="yes" label="已付款" value="yes"></el-option>
                    <el-option key="no" label="未付款" value="no"></el-option>
                </el-select>
            </p>
            <p style="margin-top:1%;float:right;margin-right:5%">
                <el-button>查找</el-button>
                <el-button>导出</el-button>
            </p>
        </div>
        <div style="clear: both;">
        </div>
        <div style="margin-top:2%">
            <ag-grid-vue style="width: 100%;height: 350px" class="ag-blue" :gridOptions="gridOptions" :suppressMovableColumns="true" :enableColResize="true" :enableSorting="true" :enableFilter="true" :groupHeaders="true" :rowHeight="40" :headerHeight="30"></ag-grid-vue>
        </div>
            <div style="clear: both;">
        </div>
        <div>
          <p style="margin-top:1%;float:right;margin-right:5%;width:50%">
                <el-button style="margin-right:6%">确 认 更 新</el-button>
                <!--<el-button>全选</el-button>-->
          </p>
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
        transfer: {
          Selectsite: '',
          state: '',
          // receiptstatus: '',
          startTime: '',
          endTime: ''
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
              headerName: '序号', width: 70, field: 'choose', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '订单编号', width: 120, field: 'ordernumber', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '始发地', width: 100, field: 'provenance', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '始发电话', width: 120, field: 'fromphone', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '目的地', width: 100, field: 'destination', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '收货电话', width: 120, field: 'receivingphone', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '回单数量', width: 100, field: 'receiptnumber', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '件数', width: 100, field: 'number', filterFramework: PartialMatchFilterComponent, hide: false
            },
            {
              headerName: '回单状态', field: 'value', width: 150, suppressMenu: true, cellRendererFramework: 'operateComponent', hide: false
            },
            {
              headerName: '回单押款状态', width: 150, field: 'receiptYaKuanstate', filterFramework: PartialMatchFilterComponent, hide: false
            }
          ]
        }
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<el-select v-model="appointlnfoForm.Selectsites"  placeholder="选择" class="appointmentoption col-1" style="width:130px"> <el-option key="yes" label=" 回单已签 " value="yes"></el-option><el-option key="yes" label=" 回单在途 " value=""></el-option></el-option><el-option key="yes" label=" 回单已返 " value="no"></el-option></el-select>',
        // '<select placeholder="选择" class="appointmentoption" style="width:150px;heght:60px"><option key="yes" label="回单已签" value="yes"></option><option key="no" label="回单在途" value="no"></option><option key="no" label="回单已反" value="no"></option> </select>'
        data: function () {
          return {
            appointlnfoForm: {
              Selectsites: ''
            }
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.transfer.list
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
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].hide)
        }
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
.appointmenttime {
    float: left;
    margin: 1%;
}

.appointment {
    padding-top: 5%;
    width: 100%;
    font-size: 0.6em;
}

.appointmenttimes {
    width: 145px;
    margin-left: 1%;
}
.appointmenttimeman{
  width:100px;
}

.appointmentoption {
    height: 30px;
}
.ag-blue .ag-cell-focus {
  border: 0px solid #217346;
}
</style>

