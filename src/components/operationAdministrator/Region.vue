<template>
  <div>
    <div>
      <h2 style="text-align:center">区域管理</h2>
      <div style="margin-top:1%">
        <el-form :model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="企业详细地址:" class="Taddress">
            <div id='focus1' class='dropdown1' style='outline:none' tabindex="0"  @click="getFocus(1)" @blur="addressVisible=false">
              <el-input v-model="filterForm.receAdr" style="width: 142.5px;"></el-input>
              <div class="dropdown-content" style='width:142.5px' v-show="addressVisible">
                <ul class='dropdown-content-select'>
                  <li @click="setShenfen(1)" class='dropdown-li dropdown-two' v-bind:class="{'selectOn':shenfen}">省份</li>
                  <li @click="setShi(1)" class='dropdown-li dropdown-two' v-bind:class="{'selectOn':shi}">城市</li>
                </ul>
                <div class='dropdown-select'>
                  <ul class='dropdown-shenfen' v-show="shenfen">
                    <li v-for="(data,i) in this.regionList" @click="selectShenfen(1,data.name)" style='text-align:center'
                        :key='data.name'>{{data.name}}
                    </li>
                  </ul>
                  <ul class='dropdown-shi' v-show="shi">
                    <li v-for="(data,i) in this.shiList.sub" @click="selectShi(1,data.name)" style='text-align:center'
                        :key='data.name'>{{data.name}}
                    </li>
                  </ul>
                </div>
              </div>            </div>
          </el-form-item>
          <el-form-item label="所属区域名称:">
            <el-input v-model="filterForm.regionName" style="width: 150px"></el-input>
          </el-form-item>
          <el-button @click="drawGrid()" style="margin-right: 10px">提取</el-button>

            <el-popover ref="popover1" placement="right-start" title="选择显示的列表" width="500" trigger="hover">
              <template v-for="(collist,i) in gridOptions.columnDefs">
                <div class="colVisible">
                  <el-checkbox v-model="collist.visible" @change="updataColumnDefs(gridOptions.columnDefs)"
                               style="float: left;width: 180px">
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
      </div>
    </div>
    <div>
      <ag-grid-vue style="width: 100%;height: 450px" class="ag-blue"
                   :gridOptions="gridOptions"
                   :suppressMovableColumns="true"
                   :enableColResize="true"
                   :groupHeaders="true"
                   :suppressCellSelection="true"
                   :rowHeight=40
                   :headerHeight=40
                   :pagination="true"
                   :paginationPageSize="10"
                   :suppressPaginationPanel="true"
                   :filterChanged="gridfilterChange">
      </ag-grid-vue>
    </div>

    <!--分页-->
    <div style="text-align: center">
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

    <!--编辑车辆信息-->
    <el-dialog title="编辑接送货车辆信息:" :visible.sync="editFormVisible" size="tiny" :closeOnClickModal="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="regionForm" :rules="rules" ref="regionForm">
        <el-form-item label="省:" :label-width="formLabelWidth" >
          <el-input v-model="regionForm.province" style="width: 50%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="市:" :label-width="formLabelWidth" >
          <el-input v-model="regionForm.city" style="width: 50%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="行政区:" :label-width="formLabelWidth" >
          <el-input v-model="regionForm.adminRegion" style="width: 50%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属区域:" :label-width="formLabelWidth" prop="regionName">
          <el-select v-model="regionForm.regionName">
            <el-option value="A"></el-option>
            <el-option value="B"></el-option>
            <el-option value="C"></el-option>
            <el-option value="D"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleForm('regionForm')">取 消</el-button>
        <el-button @click="resetForm('regionForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm('regionForm')">更 新</el-button>
      </div>
    </el-dialog>
    <!--删除客户信息-->
    <el-dialog title="" :visible.sync="delFormVisible" size="tiny" top="30%">
      <h2 style="padding:30px">确认删除吗？</h2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delFormVisible = false">取 消</el-button>
        <el-button @click="delFormVisible = false" type="danger">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {AgGridVue} from 'ag-grid-vue'
  import testJson from '../../../static/test/testJSON.js'
  import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
  import regionJson from '../../../static/region.json'
  export default {
    created () {
      this.regionList = regionJson
    },
    data () {
      return {
        colVisible: false,
        regionVisable: false,
        regionDelVisable: false,
        editVisable: false,
        filterForm: {
          'regionName': '', // 区域名称
          'carType': '', // 车型
          'province': '', // 省
          'city': '', // 市
          'receAdr': ''
        },
        regionForm: {
          'province': '', // 省
          'city': '', // 市
          'adminRegion': '', // 行政区
          'regionName': '' // 所属区域名称
        },
        rerender: true, // 用于重新刷新添加的弹框
        rules: {
          regionName: [{
            required: true, message: '请输入区域', trigger: 'blur'
          }]
        },
        rowCount: 0,
        pageSize: 10,
        currentPage: 1, // 分页当前页面
        formLabelWidth: '30%',
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
              headerName: '省',
              width: 150,
              field: 'province',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '市',
              width: 150,
              field: 'city',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '行政区',
              width: 150,
              field: 'adminRegion',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '所属区域名称',
              width: 150,
              field: 'regionName',
              filterFramework: PartialMatchFilterComponent,
              hide: false,
              visible: true
            },
            {
              headerName: '操作',
              field: 'value',
              width: 150,
              cellRendererFramework: 'operateComponent',
              hide: false,
              visible: true,
              suppressMenu: true,
              suppressSorting: true,
              pinned: 'right'
            }
          ]
        },
        editFormVisible: false,
        delFormVisible: false,
        /** 地址内容 */
        shenfenSelected: '',
        shiSelected: '',
        quSelected: '',
        shenfenSelected2: '',
        shiSelected2: '',
        quSelected2: '',
        regionList: [],
        shiList: [],
        quList: [],
        shiList2: [],
        quList2: [],
        /** 地址样式 */
        addressVisible: false,
        addressVisible2: false,
        shenfen: false,
        shi: false,
        quyu: false,
        shenfen2: false,
        shi2: false,
        quyu2: false,
        inputWidth: 78,
        inputWidth2: 78,
        dropdownWidth: 78,
        isFocus: false,
        isFocus2: false,
        detailVisible: false,
        detailVisible2: false,
        isReadOnly: false,
        isReadOnly2: false,
        /** 收货人信息 */
        receComp: '',
        receTipList: ['单位111111111', '单位2', '单位3'],
        receNam: '',
        receTel: '',
        receAdr: '',
        messageErro: false
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      operateComponent: {
        template: '<span><el-button class="del-but" type="info" size="small" @click="regionEdit">编 辑</el-button><el-button class="del-but" @click="del" type="danger" size="small">删 除</el-button></span>',
        methods: {
          del () {
            let self = this.params.context.componentParent
            self.delFormVisible = true
//            self.delFormVisible = true
//            console.log(this.params.data.clientCompNam)
          },
          regionEdit () {
            this.params.context.componentParent.editFormVisible = true
            this.params.context.componentParent.regionForm = this.params.data
          }
        }
      }
    },
    methods: {
      createRowData () {
        this.gridOptions.rowData = testJson.regionList.list
        this.gridOptions.api.setRowData(this.gridOptions.rowData)
      },
      onQuickFilterChanged (input) {
        this.gridOptions.api.setQuickFilter(input)
      },
      setting () {
        this.colVisible = true
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
      },
      updataColumnDefs (collist) {
        for (let i = 0; i < collist.length; i++) {
          this.gridOptions.columnApi.setColumnVisible(collist[i].field, collist[i].visible)
        }
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
      // 设置分页组件数据总数
      calculateGrid () {
        this.gridOptions.api.paginationSetPageSize(Number(this.pageSize))
        this.rowCount = this.gridOptions.api.getModel().getRowCount()
      },
      cancleForm (formName) {
        this.resetForm(formName)
        this.editFormVisible = false
      },
      // 重置表单
      resetForm (formName) {
        this.$nextTick(function () {
          this.$refs[formName].resetFields()
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'personnelForm') {
              alert('添加成功')
            } else if (formName === 'regionForm') {
              alert('编辑成功')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      drawGrid () {
        this.updateGrid()
        this.createRowData()
        this.calculateGrid()
      },
      updateGrid () {
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs)
      },
      //      地址选择
      getFocus (num) {
        if (num === 1) {
          this.addressVisible = true
          document.getElementById('focus1').focus()
        } else {
          this.addressVisible2 = true
          document.getElementById('focus2').focus()
        }
      },
      selectShenfen (num, name) {
        if (num === 1) {
          this.filterForm.shenfen = name
          this.shenfenSelected = name
          this.shiSelected = ''
          this.quSelected = ''
          this.quList = []
          this.shiList = []
        } else {
          this.personnelForm.shenfen = name
          this.shenfenSelected2 = name
          this.shiSelected2 = ''
          this.quSelected2 = ''
          this.quList2 = []
          this.shiList2 = []
        }
        this.filterForm.receAdr = this.shenfenSelected + this.shiSelected + this.quSelected
        console.log(this.filterForm)
      },
      selectShi (num, name) {
        if (num === 1) {
          this.filterForm.shi = name
          this.shiSelected = name
          this.quSelected = ''
          this.quList = []
        } else {
          this.personnelForm.shi = name
          this.shiSelected2 = name
          this.quSelected2 = ''
          this.quList2 = []
        }
        this.filterForm.receAdr = this.shenfenSelected + this.shiSelected + this.quSelected
      },
      selectQu (num, name) {
        if (num === 1) {
          this.filterForm.adminRegion = name
          this.quSelected = name
          this.addressVisible = false
          this.inputWidth = 73
          this.dropdownWidth = 33
          this.isFocus = true
          this.detailVisible = true
          this.isReadOnly = true
        } else {
          this.personnelForm.adminRegion = name
          this.quSelected2 = name
          this.addressVisible2 = false
          this.inputWidth2 = 73
          this.dropdownWidth2 = 33
          this.isFocus2 = true
          this.detailVisible2 = true
          this.isReadOnly2 = true
        }
        this.filterForm.receAdr = this.shenfenSelected + this.shiSelected + this.quSelected
      },
      setShenfen (num) {
        if (num === 1) {
          this.shenfen = true
          this.shi = false
          this.quyu = false
        } else {
          this.shenfen2 = true
          this.shi2 = false
          this.quyu2 = false
        }
      },
      /** 设置城市级 */
      setShi (num) {
        if (num === 1) {
          this.shenfen = false
          this.shi = true
          this.quyu = false
          if (this.shenfenSelected) {
            regionJson.filter(item => {
              if (item.name === this.shenfenSelected) {
                this.shiList = item
                return true
              }
            })
          }
        } else {
          this.shenfen2 = false
          this.shi2 = true
          this.quyu2 = false
          if (this.shenfenSelected2) {
            regionJson.filter(item => {
              if (item.name === this.shenfenSelected2) {
                this.shiList2 = item
                return true
              }
            })
          }
        }
      },
      /** 设置地区 */
      setQuyu (num) {
        if (num === 1) {
          this.shenfen = false
          this.shi = false
          this.quyu = true
          if (this.shiSelected && this.shenfenSelected) {
            this.shiList.sub.filter(item => {
              if (item.name === this.shiSelected) {
                this.quList = item.sub
                return true
              }
            })
          }
        } else {
          this.shenfen2 = false
          this.shi2 = false
          this.quyu2 = true
          if (this.shiSelected2 && this.shenfenSelected2) {
            this.shiList2.sub.filter(item => {
              if (item.name === this.shiSelected2) {
                this.quList2 = item.sub
                return true
              }
            })
          }
        }
      }
    },
    beforeMount () {
//      this.createRowData()
    },
    mounted () {
//      this.calculateGrid()
    }
//    update () {
//      console.log('update')
//    }
  }
</script>
<style scoped>
  .dropdown {
    width: 100%;
    margin-left: 15%
  }

  .dropdown2 {
    display: inline-block;
    width: 100%;
    float: left
  }

  .dropdown-content {
    height: 200px;
    position: absolute;
    background-color: #fff;
    margin-left: -1%;
    padding: 0;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
    z-index: 1;
    width: 78%
  }

  .dropdown-select {
    clear: both;
    height: 160px;
    overflow-y: scroll
  }

  .dropdown-select ul {
    clear: both;
    list-style-type: none
  }

  .dropdown-select ul li:hover {
    cursor: pointer;
    background-color: #D1E5E5
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-content-select {
    list-style-type: none;
  }

  .dropdown-li {
    cursor: pointer;
    border-right: 1px solid #C0C0C0;
    width: 33.33%;
    margin: 0;
    float: left;
    box-sizing: border-box;
    background-color: #D1E5E5;
    text-align: center
  }

  .dropdown-shenfen li:hover {
    cursor: pointer;
    background-color: #D1E5E5
  }

  .addressDetail {
    width: 45%;
    float: left;
    margin-left: -5%
  }

  .selectOn {
    background-color: #00d1b2;
  }

  .selectNo {
    background-color: #EEF6F6
  }

  .div-form {
    border: 2px solid black;
    width: 60%;
    margin-left: 18%;
    display: inline-block;
    margin-top: 2%;
    padding: 2%;
    box-sizing: border-box
  }

  .input-tishi {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid rgb(191, 217, 216);
    box-sizing: border-box;
    color: rgb(31, 61, 60);
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  }

  .dropdown-two{
    width: 50%;
  }

  .Taddress label{
    float: left;
  }
</style>
