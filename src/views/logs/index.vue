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
        :picker-options="pickerOptions"
        @change="fetchData"
        placeholder="选择日期范围">
      </el-date-picker>
    </div>
    <el-tabs type="card" class="content" v-model="tab" @tab-click="fetchData">
      <el-tab-pane label="慢请求" name="slow">
        <el-table v-loading="loading" v-if="tab === 'slow'" :data="data" stripe>
          <el-table-column align="center" prop="method" label="方法" width="100"></el-table-column>
          <el-table-column prop="path" label="地址"></el-table-column>
          <el-table-column align="center" prop="cost" label="平均耗时" width="130">
            <template scope="scope">
              {{scope.row.cost.toFixed(2)}} ms
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="错误请求" name="error">
        <el-table v-loading="loading" v-if="tab === 'error'" :data="data" stripe>
          <el-table-column align="center" prop="method" label="方法" width="100"></el-table-column>
          <el-table-column prop="path" label="地址"></el-table-column>
          <el-table-column align="center" prop="status" label="状态码" width="100" sortable></el-table-column>
          <el-table-column align="center" prop="count" label="计次" width="100" sortable></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="热门请求" name="hot">
        <el-table v-loading="loading" v-if="tab === 'hot'" :data="data" stripe>
          <el-table-column align="center" prop="method" label="方法" width="100"></el-table-column>
          <el-table-column prop="path" label="地址"></el-table-column>
          <el-table-column align="center" prop="count" label="计次" width="100"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="热门IP" name="hot_ip">
        <el-table v-loading="loading" v-if="tab === 'hot_ip'" :data="data" stripe>
          <el-table-column align="center" prop="ip" label="IP" sortable></el-table-column>
          <el-table-column align="center" prop="region" label="地区" sortable></el-table-column>
          <el-table-column align="center" prop="city" label="城市" sortable></el-table-column>
          <el-table-column align="center" prop="count" label="计次" sortable></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {getDiffDays} from '../../libs/utils'
import UserChoise from '../../components/UserChoise'
import ProxyChoise from '../../components/ProxyChoise'
import Api from '../../api'

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
      tab: 'slow',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      loading: false
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

  created () {
    this.fetchData()
  },

  methods: {
    userChoise (user_id) {
      this.$router.push({query: {user_id}})
      this.fetchData()
    },

    proxyChoise (proxy_id) {
      let query = Object.assign({}, this.$route.query, {proxy_id})
      this.$router.push({query})
      this.fetchData()
    },

    fetchData () {
      if (!this.date || !this.date.length) {
        return false
      }

      let query = {
        end_day: getDiffDays(this.date[0]) + 1,
        start_day: getDiffDays(this.date[1]),
        user_id: this.user_id,
        proxy_id: this.proxy_id
      }
      this.data = []
      this.loading = true
      Api(`/api/logs/${this.tab}`, {query}).then(({data}) => {
        this.loading = false
        this.data = data
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.logs {
  .topbar {
    .date {
      float: right;
    }
  }
  .content {
    margin-top: 20px;
  }
}
</style>
