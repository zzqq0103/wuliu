<template>
    <div>
        <!-- 对话框 -->
        <el-dialog title="装载单信息" :visible.sync="" >
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
// 引入表格组件
import { AgGridVue } from 'ag-grid-vue'
// 引入axios后台接口
//   import {getCurrentDelivered, getQueryOrderList} from '../../api/api'
// 引入外部 “订单详情接口"
import OrderDetails from '../financialAdministrator/ShowOrderDetails'
// 引入外部筛选函数组件系统
import PartialMatchFilterComponent from '../common/PartialMatchFilterComponent'
export default {
    // 数据模型
    data() {

    },
    // 引用的组件
    components: {

    },
    // 方法
    methods: {

    },
    // 计算属性
    computed() {

    },
    // 监视器
    watch() {

    }
}
</script>

<style scoped>

</style>
