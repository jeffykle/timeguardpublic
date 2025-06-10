import { createStore } from 'vuex'
import moment from 'moment'

export default createStore({
  state: {
    timers: [],
    theTime: moment.utc(new moment()),
    user: null
  },
  mutations: {
      getTime(state) {
        state.theTime = moment.utc(new moment())
      },
      setUser(state, user) {
        state.user = user
      }
  },
  actions: {
  },
  modules: {
  }
})
