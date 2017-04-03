<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import './assets/less/app.less'
import { isEmpty } from 'lodash'
import { mapState } from 'vuex'
import Api from './api'
import Navbar from './components/Navbar'

export default {
  components: {
    Navbar
  },

  computed: mapState(['profile', 'config']),

  created () {
    this.fetchProfile()
    this.fetchConfig()
  },

  methods: {
    fetchProfile () {
      if (!isEmpty(this.profile)) {
        return true
      }

      Api('/api/profile').then((res) => {
        this.$store.dispatch('setProfile', res.data)
      })
    },

    fetchConfig () {
      if (!isEmpty(this.config)) {
        return true
      }

      Api('/api/config').then((res) => {
        this.$store.dispatch('setConfig', res.data)
      })
    }
  }
}
</script>
