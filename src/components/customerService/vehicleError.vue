<template>
  <div>
    <div>
      <h2 style="text-align:center">大车异常处理</h2>
      <el-form v-model="filterForm" ref="filterForm1" style='margin-top:20px' :inline="true">
        <el-form-item label="发车时间：">
          <el-date-picker v-model="filterForm.startTime" type="daterange" placeholder="选择日期范围"
                          :picker-options="pickerOptions" range-separator='/' style="width: 200px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="司机姓名：">
          <el-input v-model="filterForm.orderId" placeholder="输入司机姓名" style="width: 150px"></el-input>
        </el-form-item>
        <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
          <template v-for="(collist,i) in gridOptions.columnDefs">
            <div class="colVisible">
              <el-checkbox v-model="collist.visible" @change="updateColumnDefsVisible(1,gridOptions.columnDefs)"
                            style="float: left;width: 180px">
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
        <el-button v-popover:popover1 style='margin-left:10px;float:right'>设 置</el-button>
        <el-button style='float:right'>导 出</el-button>
        <el-button @click="drawGrid(1)" style='float:right'>提 取</el-button>
      </el-form>
    </div>

    <div style="clear: both;">
    </div>
    <div style="margin-top:2%">
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue" 
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40

                   :rowDoubleClicked="detailDoubleClick"
                   :pagination="true"
                   :paginationPageSize="20"
                   :suppressPaginationPanel="true">
      </ag-grid-vue>
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
export default {
  created () {
    for (var i = 0; i < 50; i++) {
      this.orderErrorList.push({
        'loadingId': '装载单' + i,
        'driverNam': '司机姓名' + i,
        'licePlateNum': '车牌号' + i,
        'startStation': '起始站' + i,
        'arrStation': '到站' + i,
        'departTim': '发车时间' + i,
        'unActExpense': '异动支出' + i,
        'unActTim': '异动时间' + i,
        'unActDes': '异动描述' + i
      })
    }
  },
  data () {
    return {
      orderErrorList: [],
      colVisible: false,
      addEditVisable: false,
      delVisable: false,
      filterForm: {
        driverNam: '',
        startTime: '',
        endTime: ''
      },
      rules: {
      },
      rowCount: 0,
      pageSize: 10,
      formLabelWidth: '20%',
      gridOptions: {
        context: {
          componentParent: this
        },
        rowData: null,
        columnDefs: [
          {
            headerName: '装载单号', width: 150, field: 'loadingId', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '司机姓名', width: 150, field: 'driverNam', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '装载单号', width: 150, field: 'loadingId', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '车牌号', width: 150, field: 'licePlateNum', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '起始站', width: 150, field: 'startStation', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '到站', width: 150, field: 'arrStation', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '发车时间', width: 150, field: 'departTim', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '异动支出', width: 150, field: 'unActExpense', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '异动时间', width: 150, field: 'unActTim', filter: 'text', hide: false, visible: true
          },
          {
            headerName: '异动描述', width: 150, field: 'unActDes', filter: 'text', hide: false, visible: true
          }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '上周',
          onClick (picker) {
            const now = new Date()
            const start = new Date()
            const end = new Date()
            const nowDayOfWeek = now.getDay()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek + 6))
            end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfWeek)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick (picker) {
            const now = new Date()
            const start = new Date()
            const end = new Date()
            const nowDayOfMonth = now.getDate()
            const nowMonth = now.getMonth()
            start.setDate(1)
            start.setMonth(nowMonth - 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfMonth)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '去年',
          onClick (picker) {
            const now = new Date()
            const start = new Date()
            const end = new Date()
            const nowYear = now.getFullYear()
            start.setYear(nowYear - 1)
            start.setMonth(0)
            start.setDate(1)
            end.setYear(nowYear - 1)
            end.setMonth(11)
            end.setDate(31)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今年',
          onClick (picker) {
            const start = new Date()
            const end = new Date()
            start.setMonth(0)
            start.setDate(1)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          const now = new Date()
          const timeYear = time.getFullYear()
          const nowYear = now.getFullYear()
          return timeYear < (nowYear - 1)
        }
      }
    }
  },
  components: {
    'ag-grid-vue': AgGridVue
  },
  methods: {
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
    },
    createRowData () {
      this.gridOptions.rowData = this.orderErrorList
      this.gridOptions.api.setRowData(this.gridOptions.rowData)
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
        this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
      }
    },
    addEdit () {
      setTimeout(() => { this.addEditVisable = false }, 600)
    },
    del () {
      this.delVisable = false
    },
    handleSizeChange (val) {
      this.gridOptions.api.paginationSetPageSize(Number(val))
    },
    handleCurrnetChange (val) {
      this.gridOptions.api.paginationGoToPage(val - 1)
    },
    gridfilterChange () {
      this.calculateGrid()
    },
    calculateGrid () {
      this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
      this.rowCount = this.gridOptions.api.getModel().getRowCount()
    },
    drawGrid () {
      this.updateGrid()
      this.createRowData()
      this.calculateGrid()
    },
    updateGrid () {
      this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
    }
  },
  beforeMount () {
  },
  mounted () {
    this.calculateGrid()
  }
}
</script>
<!-- <template>
<div class="pdf-wrap" id="pdfWrap">
 <button v-on:click="getPdf">点击下载PDF</button>
 <div class="pdf-dom" id="pdfDom">
   <div>测试pdf</div>
   <h2>biaoti</h2>
 </div>
</div>
</template>
<style lang="scss" scoped>
</style>
<script>
 import html2Canvas from 'html2canvas'
 import JsPDF from 'jspdf'
 export default {
   methods: {
     getPdf: function () {
       // let _this = this
       let pdfDom = document.querySelector('#pdfDom')
       html2Canvas(pdfDom, {
         onrendered: function (canvas) {
           let contentWidth = canvas.width
           let contentHeight = canvas.height
           let pageHeight = contentWidth / 592.28 * 841.89
           let leftHeight = contentHeight
           let position = 0
           let imgWidth = 595.28
           let imgHeight = 592.28 / contentWidth * contentHeight
           let pageData = canvas.toDataURL('image/jpeg', 1.0)
           let PDF = new JsPDF('', 'pt', 'a4')
           if (leftHeight < pageHeight) {
             PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
           } else {
             while (leftHeight > 0) {
               PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
               leftHeight -= pageHeight
               position -= 841.89
               if (leftHeight > 0) {
                 PDF.addPage()
               }
             }
           }
           // PDF.save(_this.pdfData.title + '.pdf')
           PDF.save('123.pdf')
         }
       })
       html2Canvas()
     }
   }
 }
</script>