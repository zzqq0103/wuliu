<template>
  <div class="sidebar">
    <!--
    defalut-active:当前激活菜单的index
    unique-openeds：是否只保持一个子菜单的展开
    router：是否使用vue-router的模式，启用该模式会在激活导航时以index作为path进行路由跳转
    -->
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router>
      <template v-for="item in getSideItems">
        <template v-if="item.subs">
          <el-submenu :index="item.index">
            <template slot="title">
              <!--<i :class="item.icon"></i>-->
              <icon :name="item.icon" :scale="scale"></icon>
              {{item.title}}
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
              {{subItem.title}}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <!--<i :class="item.icon"></i>-->
            <icon :name="item.icon" :scale="scale"></icon>
            {{item.title}}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  /* eslint-disable quotes */

  import '../../../static/icon/icon.js'
  import Icon from '../../../node_modules/vue-awesome/components/Icon'
  const sideData = require('../../json/sidebar-json.json')
  export default {
    components: {Icon},
    data: function () {
//      return sideData.test1
//      return sideData.operationAdmin
      return {
        sideItems: sideData,
        scale: 1.8
      }
    },
    computed: {
      onRoutes () {
        return this.$route.path.replace('/', '')
      },
      getSideItems () {
        let username = localStorage.getItem('ms_username')
        if (username === 'yingyun') {
          return this.sideItems.operationAdmin.items
        } else if (username === 'caiwu') {
          return this.sideItems.financialAdmin.items
        } else if (username === 'caiwuzongzhang') {
          return this.sideItems.financialDirector.items
        } else if (username === 'diaodu') {
          return this.sideItems.logitstiAdmin.items
        } else if (username === 'kefu') {
          return this.sideItems.customerService.items
        } else if (username === 'xitong') {
          return this.sideItems.systemAdmin.items
        } else if (username === 'waibao') {
          return this.sideItems.outsourcingAdmin.items
        }
      }

    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    width: 200px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
  }

  .sidebar > ul {
    height: 100%;
  }

  svg {
    transform: translateY(6px);
  }


</style>
