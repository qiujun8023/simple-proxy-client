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
