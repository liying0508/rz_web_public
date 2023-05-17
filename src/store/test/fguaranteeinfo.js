import local from '@/store/local'
export const GUARANTEE_SET = 'GUARANTEE_SET'
export const GUARANTEE_CLEAR = 'GUARANTEE_CLEAR'
export default {
  state: local.getItem('guarantee') || [],
  mutations: {
    [GUARANTEE_SET] (state, data) {
      Object.assign(state, data)
      local.setItem('guarantee', state)
    },
    [GUARANTEE_CLEAR] (state, data) {
      Object.assign(state, data)
      local.setItem('guarantee', [])
    }
  },
  actions: {
    [GUARANTEE_SET] ({ commit, state }, data) {
      commit(GUARANTEE_SET, data)
    },
    [GUARANTEE_CLEAR] ({ commit }) {
      commit(GUARANTEE_CLEAR, [])
    }
  }
}
