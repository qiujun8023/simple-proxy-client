<template>
  <div class="navbar">
    <div class="container">
      <el-menu theme="dark" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
        <el-menu-item index="proxies">代理列表</el-menu-item>
        <el-menu-item index="users">用户管理</el-menu-item>
        <el-menu-item index="stats">统计分析</el-menu-item>
        <el-menu-item index="logs">日志记录</el-menu-item>
        <el-submenu index="me" class="right">
          <template slot="title">
            <i class="fa fa-user fa-lg" aria-hidden="true"></i>
          </template>
          <el-menu-item index="profile">个人中心</el-menu-item>
          <el-menu-item index="logout">注销登录</el-menu-item>
        </el-submenu>
        <el-menu-item class="right" index="github">
          <i class="fa fa-github fa-lg" aria-hidden="true"></i>
        </el-menu-item>
        <el-menu-item class="right" index="help">
          <i class="fa fa-book fa-lg" aria-hidden="true"></i>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Api from '../api'

export default {
  computed: {
    activeIndex () {
      return this.$route.name
    },
    ...mapState(['config'])
  },

  methods: {
    handleSelect (name) {
      if (name === 'github') {
        if (this.config.github) {
          window.location.href = this.config.github
        }
      } else if (name === 'logout') {
        Api('/api/wechat/logout')
      } else {
        this.$router.push(name)
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  margin-bottom: 10px;
  background-color: #324157;
}
.right {
  float: right;
}
</style>
