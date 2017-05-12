<template>
  <div>
    <el-input v-model="filter" icon="fa-filter" placeholder="请输入内容"></el-input>
    <el-table
      v-loading="is_loading"
      :data="data"
      stripe
      border>
      <el-table-column
        align="center"
        min-width="80">
        <template scope="scope">
          <img class="avatar" :src="scope.row.avatar" :alt="scope.row.name">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="user_id"
        label="ID"
        min-width="120"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="姓名"
        min-width="120"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="gender"
        label="性别"
        min-width="100"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="mobile"
        label="电话"
        min-width="160"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        min-width="200"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="is_admin"
        label="角色"
        min-width="100"
        sortable>
        <template scope="scope">
          <el-dropdown @command="changeRole(scope.row, arguments[0])">
            <span class="el-dropdown-link">
              {{scope.row.is_admin? '管理员' : '用户'}}
              <i class="el-icon-fa-caret-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="user" @command="changeRole">用户</el-dropdown-item>
              <el-dropdown-item command="admin">管理员</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="is_locked"
        label="状态"
        min-width="100"
        sortable>
        <template scope="scope">
          <el-dropdown @command="changeState(scope.row, arguments[0])">
            <span class="el-dropdown-link">
              {{scope.row.is_locked? '禁用' : '正常'}}
              <i class="el-icon-fa-caret-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="normal">正常</el-dropdown-item>
              <el-dropdown-item command="lock">禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Api from '../../api'

export default {
  data () {
    return {
      is_loading: false,
      filter: '',
      users: []
    }
  },

  computed: {
    data () {
      let exp = new RegExp(this.filter)
      let keys = ['user_id', 'name', 'mobile', 'email']
      return this.users.filter(function (row) {
        for (let key of keys) {
          if (row[key].match(exp)) {
            return true
          }
        }
        return false
      })
    }
  },

  created () {
    this.fetchUsers()
  },

  methods: {
    fetchUsers () {
      this.is_loading = true
      Api('/api/users').then((res) => {
        this.is_loading = false
        this.users = res.data
      }).catch(() => {
        this.is_loading = false
      })
    },

    updateUser (row, body) {
      let method = 'PUT'
      Api(`/api/users/${row.user_id}`, {method, body}).then((res) => {
        Object.assign(row, body)
        this.$message.success(`修改成功`)
      })
    },

    changeRole (row, role) {
      let is_admin = role === 'admin'
      this.updateUser(row, {is_admin})
    },

    changeState (row, state) {
      let is_locked = state === 'lock'
      this.updateUser(row, {is_locked})
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
  .avatar {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    border-radius: 50%;
  }
}
</style>
