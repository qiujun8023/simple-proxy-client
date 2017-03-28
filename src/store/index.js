import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: {},
    config: {}
  },

  getters: {
    getProfile (state) {
      return state.profile
    },

    getConfig (state) {
      return state.config
    }
  },

  mutations: {
    setProfile (state, profile) {
      state.profile = profile
    },

    setConfig (state, config) {
      state.config = config
    }
  },

  actions: {
    setProfile ({ commit }, profile) {
      commit('setProfile', profile)
    },

    setConfig ({ commit }, config) {
      commit('setConfig', config)
    }
  }
})
