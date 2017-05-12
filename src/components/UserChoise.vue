<template>
  <el-autocomplete
    v-model="input"
    :fetch-suggestions="featchUser"
    :disabled="disabled"
    placeholder="请输入用户名"
    icon="fa-user"
    @select="handleSelect">
  </el-autocomplete>
</template>

<script>
import Api from '../api'

export default {
  props: ['value', 'disabled'],

  data () {
    return {
      input: this.value
    }
  },

  watch: {
    value (val) {
      this.input = val
    }
  },

  methods: {
    featchUser (key, cb) {
      Api('/api/users', {query: {key}}).then((res) => {
        for (let item of res.data) {
          item.value = `${item.name}(${item.user_id})`
        }
        cb(res.data.slice(0, 5))
      })
    },

    handleSelect (item) {
      this.input = item.user_id
      this.$emit('choise', item.user_id)
    }
  }
}
</script>
