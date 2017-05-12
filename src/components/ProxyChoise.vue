<template>
  <el-select
    v-model="input"
    v-loading="loading"
    :filterable="true"
    @change="handleChange"
    placeholder="请选择代理">
    <el-option
      v-for="proxy in proxies"
      :key="proxy.proxy_id"
      :label="proxy.mark"
      :value="proxy.proxy_id">
    </el-option>
  </el-select>
</template>

<script>
import Api from '../api'

export default {
  props: ['user_id', 'proxy_id'],

  data () {
    return {
      proxies: [],
      loading: false,
      input: this.proxy_id ? Number(this.proxy_id) : undefined
    }
  },

  created () {
    this.fetchProxies()
  },

  methods: {
    fetchProxies () {
      let user_id = this.user_id
      if (!user_id) {
        return false
      }

      this.loading = true
      Api('/api/proxies', {query: {user_id}}).then((res) => {
        this.loading = false
        this.proxies = res.data
      }).catch(() => {
        this.proxies = []
        this.loading = false
      })
    },

    handleChange (proxy_id) {
      this.$emit('choise', proxy_id)
    }
  },

  watch: {
    user_id () {
      this.fetchProxies()
    },
    proxy_id () {
      this.input = this.proxy_id ? Number(this.proxy_id) : undefined
    }
  }
}
</script>
