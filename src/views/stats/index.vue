<template>
  <div class="stats">
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
        @change="fetchAllData"
        placeholder="选择日期范围">
      </el-date-picker>
    </div>
    <div class="charts">
      <flow-chart :data="data.flow" :loading="loading.flow"></flow-chart>
      <speed-chart :data="data.speed" :loading="loading.speed"></speed-chart>
      <el-row>
        <el-col :span="8">
          <region-chart :data="data.region" :loading="loading.region"></region-chart>
        </el-col>
        <el-col :span="8">
          <city-chart :data="data.city" :loading="loading.city"></city-chart>
        </el-col>
        <el-col :span="8">
          <isp-chart :data="data.isp" :loading="loading.isp"></isp-chart>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <device-chart :data="data.device" :loading="loading.device"></device-chart>
        </el-col>
        <el-col :span="8">
          <os-chart :data="data.os" :loading="loading.os"></os-chart>
        </el-col>
        <el-col :span="8">
          <status-chart :data="data.status" :loading="loading.status"></status-chart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {getDiffDays} from '../../libs/utils'
import UserChoise from '../../components/UserChoise'
import ProxyChoise from '../../components/ProxyChoise'
import FlowChart from '../../components/Charts/Flow'
import SpeedChart from '../../components/Charts/Speed'
import RegionChart from '../../components/Charts/Region'
import CityChart from '../../components/Charts/City'
import IspChart from '../../components/Charts/Isp'
import StatusChart from '../../components/Charts/Status'
import DeviceChart from '../../components/Charts/Device'
import OsChart from '../../components/Charts/Os'
import Api from '../../api'

export default {
  components: {
    UserChoise,
    ProxyChoise,
    FlowChart,
    SpeedChart,
    RegionChart,
    CityChart,
    IspChart,
    StatusChart,
    DeviceChart,
    OsChart
  },

  data () {
    return {
      date: [
        new Date(),
        new Date()
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      data: {
        flow: [],
        speed: [],
        region: [],
        city: [],
        isp: [],
        device: [],
        os: [],
        status: []
      },
      loading: {
        flow: false,
        speed: false,
        region: false,
        city: false,
        isp: false,
        device: false,
        os: false,
        status: false
      }
    }
  },

  created () {
    this.fetchAllData()
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
      this.fetchAllData()
    },

    proxyChoise (proxy_id) {
      let query = Object.assign({}, this.$route.query, {proxy_id})
      this.$router.push({query})
      this.fetchAllData()
    },

    fetchAllData () {
      if (!this.date || !this.date.length) {
        return false
      }
      for (let type in this.data) {
        this.fetchData(type)
      }
    },

    fetchData (type) {
      let query = {
        end_day: getDiffDays(this.date[0]) + 1,
        start_day: getDiffDays(this.date[1]),
        user_id: this.user_id,
        proxy_id: this.proxy_id
      }
      this.data[type] = []
      this.loading[type] = true
      Api(`/api/stats/${type}`, {query}).then(({data}) => {
        this.loading[type] = false
        this.data[type] = data
      }).catch(() => {
        this.loading[type] = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.stats {
  .topbar {
    .date {
      float: right;
    }
  }
}
</style>
