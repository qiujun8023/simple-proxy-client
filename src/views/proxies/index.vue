<template>
  <div>
    <div class="topbar">
      <user-choise
        :value="user_id"
        :disabled="!profile.is_admin"
        @user-choise="userChoise">
      </user-choise>
      <router-link :to="{name: 'proxies-add', query: {user_id}}">
        <el-button type="primary" icon="fa-plus">添加</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="is_loading"
      :data="proxies"
      stripe
      border>
      <el-table-column
        align="center"
        label="状态">
        <template scope="scope">
          <i class="el-icon-fa-toggle-on" v-if="scope.row.is_enabled"></i>
          <i class="el-icon-fa-toggle-off" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="mark"
        label="名称"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="proxy_type_name"
        label="回源方式"
        sortable>
      </el-table-column>
      <el-table-column
        align="center"
        prop="domain"
        label="回源域名"
        sortable>
        <template scope="scope">
          <a :href="scope.row.proxy_url" target="_blank">{{scope.row.domain}}</a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="回源地址"
        sortable>
        <template scope="scope">
          <a :href="scope.row.target_url" target="_blank">{{scope.row.target}}</a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template scope="scope">
          <router-link :to="{name: 'stats', query: {proxy_id: scope.row.proxy_id}}">
            <el-button size="small" type="info">统计</el-button>
          </router-link>
          <router-link :to="{name: 'proxies-edit', params: {proxy_id: scope.row.proxy_id}, query: {user_id}}">
            <el-button size="small" type="primary">编辑</el-button>
          </router-link>
          <el-button size="small" type="danger" @click="removeProxies(scope.$index, proxies)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Api from '../../api'
import UserChoise from '../../components/UserChoise'

export default {
  data () {
    return {
      is_loading: false,
      proxies: []
    }
  },

  components: {
    UserChoise
  },

  computed: {
    user_id () {
      return this.$route.query.user_id || this.profile.user_id
    },
    ...mapState(['config', 'profile'])
  },

  created () {
    this.fetchProxies()
  },

  methods: {
    fetchProxies () {
      this.is_loading = true
      let user_id = this.user_id
      Api('/api/proxies', {query: {user_id}}).then((res) => {
        this.is_loading = false
        for (let item of res.data) {
          item.target_url = item.target_type.toLowerCase() + '://' + item.target
          if (item.proxy_type === 'HTTP_ONLY') {
            item.proxy_type_name = 'HTTP 访问'
            item.proxy_url = 'http://' + item.domain
            if (Number(this.config.http_port) !== 80) {
              item.proxy_url += ':' + this.config.http_port
            }
          } else {
            if (item.proxy_type === 'HTTPS_ONLY') {
              item.proxy_type_name = 'HTTPS 访问'
            } else {
              item.proxy_type_name = 'HTTP 或 HTTPS'
            }
            item.proxy_url = 'https://' + item.domain
            if (Number(this.config.https_port !== 443)) {
              item.proxy_url += ':' + this.config.https_port
            }
          }
        }
        this.proxies = res.data
      }).catch(() => {
        this.is_loading = false
      })
    },

    userChoise (user_id) {
      this.$router.push({query: {user_id}})
    },

    removeProxies (index, proxies) {
      let proxy = proxies[index]
      if (!confirm(`你确定要删除 【${proxy.mark}】 吗?`)) {
        return false
      }

      Api(`/api/proxies/${proxy.proxy_id}`, {method: 'DELETE'}).then((res) => {
        proxies.splice(index, 1)
        this.$notify({
          title: '删除成功',
          message: `已成功删除 【${proxy.mark}】`,
          type: 'success'
        })
      })
    }
  },

  watch: {
    $route () {
      this.fetchProxies()
    }
  }
}
</script>

<style lang="less" scoped>
.topbar {
  margin-bottom: 15px;
  a {
    float: right;
  }
}
.el-icon-fa-toggle-on {
  color: #20A0FF;
}
.el-icon-fa-toggle-off {
  color: #1F2D3D;
}
</style>
