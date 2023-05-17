import local from '@/store/local'
export const GIC_SET = 'GIC_SET'
export const GIC_CLEAR = 'GIC_CLEAR'
export default {
  state: local.getItem('gic') || [],
  mutations: {
    [GIC_SET] (state, data) {
      Object.assign(state, data)
      local.setItem('gic', state)
    },
    [GIC_CLEAR] (state, data) {
      Object.assign(state, data)
      local.setItem('gic', [])
    }
  },
  actions: {
    [GIC_SET] ({ commit, state }, data) {
      commit(GIC_SET, data)
    },
    [GIC_CLEAR] ({ commit }) {
      commit(GIC_CLEAR, [])
    }
  }
}
