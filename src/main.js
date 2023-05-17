import Vue from 'vue'
import Element from 'element-ui'
import App from '@/App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import '@/icons'
import '@/element-ui/theme/index.css'
import '@/assets/scss/aui.scss'
import '@/assets/scss/custom.scss'
import http from '@/utils/request'
import renRadioGroup from '@/components/ren-radio-group'
import renSelect from '@/components/ren-select'
import renProcessRunning from '@/components/ren-process-running'
import renProcessDetail from '@/components/ren-process-detail'
import renDeptTree from '@/components/ren-dept-tree'
import renRegionTree from '@/components/ren-region-tree'
import financeDeptTree from '@/components/finance-dept-tree'
import financeFirstDeptTree from '@/components/finance-first-dept-tree'
import { hasPermission, getDictLabel, getDictLabelByList, numberFormat, downloadFile, addMonths, getDictDataList } from '@/utils'
import * as echarts from 'echarts'
import isNotNull from '@/utils/not-null'
import formatDate from '@/utils/format-date'
import cloneDeep from 'lodash/cloneDeep'

import Tinymce from '@/components/tinymce/index.vue'

import '@/utils/form-generator/styles/index.scss'
import SvgIcon from '@/utils/form-generator/components/SvgIcon'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.prototype.$echarts = echarts
Vue.component('tinymce', Tinymce)
Vue.component('svg-icon', SvgIcon)
Vue.use(VXETable)

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'default',
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(renRadioGroup)
Vue.use(renSelect)
Vue.use(renDeptTree)
Vue.use(renRegionTree)
Vue.use(renProcessRunning)
Vue.use(renProcessDetail)
Vue.use(financeDeptTree)
Vue.use(financeFirstDeptTree)

// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$hasPermission = hasPermission
// 从字典里面取文本
Vue.prototype.$getDictLabel = getDictLabel
// 金额文本转化
Vue.prototype.$numberFormat = numberFormat
// 从指定list里面取文本
Vue.prototype.$getDictLabelByList = getDictLabelByList
Vue.prototype.$getDictDataList = getDictDataList
// 判断非空
Vue.prototype.$isNotNull = isNotNull
// 时间格式处理
Vue.prototype.$formatDate = formatDate
// 下载附件
Vue.prototype.$downloadFile = downloadFile
// 日期增减月份数
Vue.prototype.$addMonths = addMonths
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG.storeState = cloneDeep(store.state)

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
