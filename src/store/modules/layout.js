import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import local from '@/store/local'
Vue.use(Vuex)
export const LAYOUT_SET = 'LAYOUT_SET'
export const LAYOUT_CLEAR = 'LAYOUT_CLEAR'
const init = {
  // 导航条, 布局风格, default(白色) / colorful(鲜艳)
  navbarLayoutType: 'colorful',
  // 侧边栏, 布局皮肤, default(白色) / dark(黑色)
  sidebarLayoutSkin: 'dark',
  // 侧边栏, 折叠状态
  sidebarFold: false,
  // 侧边栏, 菜单
  sidebarMenuList: [],
  sidebarMenuActiveName: '',
  // 内容, 是否需要刷新
  contentIsNeedRefresh: false,
  // 内容, 标签页(默认添加首页)
  contentTabs: [
    {
      ...window.SITE_CONFIG.contentTabDefault,
      name: 'home',
      title: 'home'
    }
  ],
  contentTabsActiveName: 'home'
}
export default {
  state: local.getItem('layout') || init,
  mutations: {
    [LAYOUT_SET] (state, data) {
      Object.assign(state, data)
      local.setItem('layout', state)
    },
    [LAYOUT_CLEAR] (state, data) {
      Object.assign(state, data)
      local.setItem('layout', init)
    },
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG.storeState[key])
      })
    }
  },
  actions: {
    [LAYOUT_SET] ({ commit, state }, data) {
      commit(LAYOUT_SET, data)
    },
    [LAYOUT_CLEAR] ({ commit }) {
      commit(LAYOUT_CLEAR, init)
    }
  }
}
