import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import Icon from 'vue-awesome'
// import 'element-ui/lib/theme-default/index.css';    // 默认主题
import '../static/css/theme-green/index.css'     // 浅绿色主题
import 'babel-polyfill'
import '../node_modules/ag-grid/dist/styles/ag-grid.css'
// import '../node_modules/ag-grid/dist/styles/theme-blue.css'
import '../static/css/grid-theme.css'
// 导入假数据
import mock from './mock'
mock.bootstrap()

Vue.use(ElementUI)
Vue.use(Icon)
Vue.use(Vuelidate)
Vue.prototype.$axios = axios
new Vue({
  router,
  // router: router,
  render: h => h(App)
}).$mount('#app')
