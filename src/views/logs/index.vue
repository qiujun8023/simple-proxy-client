<template>
  <div class="logs">
    <div class="topbar">
      <user-choise
        :value="user_id"
        :disabled="!profile.is_admin"
        @choise="userChoise">
      </user-choise>
      <proxy-choise
        :user_id="user_id"
        :proxy_id="proxy_id"
        @choise="proxyChoise">
      </proxy-choise>
      <el-date-picker
        v-model="date"
        class="date"
        type="daterange"
        placeholder="选择日期范围">
      </el-date-picker>
    </div>
    <el-tabs type="card" class="logs" v-model="tab">
      <el-tab-pane label="慢请求" name="slow_request">
        <el-table v-loading="loading" v-if="tab === 'slow_request'" :data="data" stripe border>
          <el-table-column align="center" prop="method" label="方法"></el-table-column>
          <el-table-column align="center" prop="path" label="路径"></el-table-column>
          <el-table-column align="center" prop="cost" label="平均耗时"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="错误请求" name="error_request">
        <el-table v-loading="loading" v-if="tab === 'error_request'" :data="data" stripe border>
          <el-table-column align="center" prop="method" label="方法"></el-table-column>
          <el-table-column align="center" prop="path" label="路径"></el-table-column>
          <el-table-column align="center" prop="status" label="状态码"></el-table-column>
          <el-table-column align="center" prop="count" label="计次"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="热门请求" name="host_request">
        <el-table v-loading="loading" v-if="tab === 'host_request'" :data="data" stripe border>
          <el-table-column align="center" prop="method" label="方法"></el-table-column>
          <el-table-column align="center" prop="path" label="路径"></el-table-column>
          <el-table-column align="center" prop="count" label="计次"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="热门IP" name="host_ip">
        <el-table v-loading="loading" v-if="tab === 'host_ip'" :data="data" stripe border>
          <el-table-column align="center" prop="ip" label="IP"></el-table-column>
          <el-table-column align="center" prop="count" label="计次"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserChoise from '../../components/UserChoise'
import ProxyChoise from '../../components/ProxyChoise'

export default {
  components: {
    UserChoise,
    ProxyChoise
  },

  data () {
    return {
      date: [
        new Date(),
        new Date()
      ],
      data: [],
      tab: 'slow_request'
    }
  },

  computed: {
    user_id () {
      return this.$route.query.user_id || this.profile.user_id
    },
    proxy_id () {
      return this.$route.query.proxy_id
    },
    ...mapState(['profile'])
  },

  methods: {
    userChoise (user_id) {
      this.$router.push({query: {user_id}})
    },

    proxyChoise (proxy_id) {
      let query = Object.assign({}, this.$route.query, {proxy_id})
      this.$router.push({query})
    },

    fetchData () {

    },

    fetchSlowRequest () {

    },

    fetchErrorRequest () {

    },

    fetchHotRequest () {

    },

    fetchHotIp () {

    }
  }
}
</script>

<style lang="less" scoped>
.topbar {
  .date {
    float: right;
  }
}
.logs {
  margin-top: 20px;
}
</style>
