import Vue from 'vue'
import Router from 'vue-router'
import Proxies from './views/proxies'
import Users from './views/users'
import Stats from './views/stats'
import Logs from './views/logs'
import Help from './views/help'
import Profile from './views/profile'

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
      meta: {title: '代理列表'}
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {title: '用户管理'}
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
      meta: {title: '统计分析'}
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
      meta: {title: '日志分析'}
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {title: '个人中心'}
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {title: '使用说明'}
    }
  ]
})
