import Vue from 'vue'
import Router from 'vue-router'
import Proxies from '../views/proxies'
import ProxiesEdit from '../views/proxies/edit'
import Users from '../views/users'
import Stats from '../views/stats'
import Logs from '../views/logs'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {name: 'proxies'}
    },
    {
      path: '/proxies',
      name: 'proxies',
      component: Proxies,
      meta: {title: '代理列表', navbar_active: 'proxies'}
    },
    {
      path: '/proxies/add',
      name: 'proxies-add',
      component: ProxiesEdit,
      meta: {title: '添加代理', navbar_active: 'proxies'}
    },
    {
      path: '/proxies/:proxy_id/edit',
      name: 'proxies-edit',
      component: ProxiesEdit,
      meta: {title: '编辑代理', navbar_active: 'proxies'}
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {title: '用户管理', navbar_active: 'users'}
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
      meta: {title: '统计分析', navbar_active: 'stats'}
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
      meta: {title: '日志分析', navbar_active: 'logs'}
    }
  ]
})
