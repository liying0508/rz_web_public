import local from '@/store/local'
export const DIRECT_SET = 'DIRECT_SET'
export const DIRECT_CLEAR = 'DIRECT_CLEAR'
export default {
  state: local.getItem('direct') || [],
  mutations: {
    [DIRECT_SET] (state, data) {
      Object.assign(state, data)
      local.setItem('direct', state)
    },
    [DIRECT_CLEAR] (state, data) {
      Object.assign(state, data)
      local.setItem('direct', [])
    }
  },
  actions: {
    [DIRECT_SET] ({ commit, state }, data) {
      commit(DIRECT_SET, data)
    },
    [DIRECT_CLEAR] ({ commit }) {
      commit(DIRECT_CLEAR, [])
    }
  }
}
