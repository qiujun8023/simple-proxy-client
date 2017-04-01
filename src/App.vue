<template>
  <div>
    <Navbar></Navbar>
    <router-view class="container"></router-view>
  </div>
</template>

<script>
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

<style>
body {
  margin: 0;
  width: 100%;
}
.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
</style>
