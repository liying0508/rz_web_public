import session from '@/store/session'
export const USER_SET = 'USER_SET'
export const USER_CLEAR = 'USER_CLEAR'
const init = {
  id: 0,
  name: '',
  superAdmin: 0
}
export default {
  state: init,
  mutations: {
    [USER_SET] (state, data) {
      Object.assign(state, data)
      session.setItem('user', state)
    },
    [USER_CLEAR] (state, data) {
      Object.assign(state, data)
      session.setItem('user', init)
    }
  },
  actions: {
    [USER_SET] ({ commit, state }, data) {
      commit(USER_SET, data)
    },
    [USER_CLEAR] ({ commit }) {
      commit(USER_CLEAR, init)
    }
  }
}
