// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './routers'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI)

let title = '简易反向代理'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title + ' - ' + title
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
