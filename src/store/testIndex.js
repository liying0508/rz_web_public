import Vue from 'vue'
import Vuex from 'vuex'
/* 公用vuex */
import direct from './test/findirectfinancing'
import gic from './test/fgovernmentbond'
import guarantee from './test/fguaranteeinfo'
import user from './modules/user'
import layout from './modules/layout'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    direct,
    gic,
    guarantee,
    user,
    layout
  },
  getters: {
    direct: state => state.direct,
    gic: state => state.gic,
    guarantee: state => state.guarantee,
    user: state => state.user,
    layout: state => state.layout
  }
})
