import { createStore } from 'vuex'

const store = createStore({
  state: {
    user_profile: null
  },
  getters: {
    getUserProfile(state) {
      return state.user_profile
    },
  },
  mutations: {
    setUserProfile(state, data) {
      state.user_profile = data
    },
  }
})

export default store