import Cookies from 'js-cookie'
import qs from 'qs'
import { addDynamicRoute } from '@/router'
export default {
  data () {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        createdIsNeed: true,       // 此页面是否在创建时，调用查询数据列表接口？
        activatedIsNeed: false,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '',       // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: ''             // 导出接口，API地址
      },
      // 默认属性
      dataForm: {},               // 查询条件
      dataList: [],               // 数据列表
      order: '',                  // 排序，asc／desc
      orderField: '',             // 排序，字段
      page: 1,                    // 当前页码
      limit: 10,                  // 每页数
      total: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false   // 新增／更新，弹窗visible状态
    }
    /* eslint-enable */
  },
  created () {
    if (this.mixinViewModuleOptions.createdIsNeed) {
      this.query()
    }
  },
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.query()
    }
  },

  watch: {
    'dataForm.unit' (val) {
      this.$store.state.unit = val
      this.query()
    }
  },
  methods: {
    // 获取数据列表
    query (fn) {
      this.dataListLoading = true
      // 当参数为空数组时，请求接口自动过滤了该参数，而后台接口该参数必传，所以处理为空
      if (Object.prototype.hasOwnProperty.call(this.dataForm, 'creditMeasures')) {
        this.dataForm.creditMeasures = this.dataForm.creditMeasures.length === 0 ? '' : this.dataForm.creditMeasures
      }
      console.log('查询参数dataForm', this.dataForm)
      this.$http.get(
        this.mixinViewModuleOptions.getDataListURL,
        {
          params: {
            order: this.order,
            orderField: this.orderField,
            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
            limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null,
            ...this.dataForm
          }
        }
      ).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.dataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data.list : res.data
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.data.total : 0
        fn && fn()
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.query()
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.query()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.query()
    },
    getDataList (fn) {
      console.log(this.dataForm)
      this.page = 1
      this.query(fn)
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      console.log(id)
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        try {
          this.$refs.addOrUpdate.dataForm.id = id
          this.$refs.addOrUpdate.init()
        } catch (e) {
          console.log(e)
        }
      })
    },
    // 关闭当前窗口
    closeCurrentTab (data) {
      var tabName = this.$store.state.contentTabsActiveName
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
        return false
      }
      if (tabName === this.$store.state.contentTabsActiveName) {
        this.$router.push({ name: this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1].name })
      }
    },
    // 删除
    deleteHandle (id) {
      console.log('选中的', this.dataListSelections)
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { handle: this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.delete(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            data: id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
          } : {}
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.page = 1
              this.query()
            }
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    // 导出
    exportHandle () {
      if (Object.prototype.hasOwnProperty.call(this.dataForm, 'creditMeasures')) {
        this.dataForm.creditMeasures = this.dataForm.creditMeasures.length === 0 ? '' : this.dataForm.creditMeasures
      }
      var params = qs.stringify({
        token: Cookies.get('token'),
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG.apiURL}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
    // 处理流程路由
    handleFlowRoute (data) {
      const routeParams = {
        routeName: `${this.$route.name}__handle_${data.processInstanceId}`,
        menuId: `${this.$route.meta.menuId}`,
        title: `${this.$route.meta.title} - ${data.processDefinitionName}`,
        path: `flow-form/${data.processDefinitionKey}/form`,
        params: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          businessKey: data.businessKey,
          showType: 'taskHandle'
        }
      }
      addDynamicRoute(routeParams, this.$router)
    },
    // 查看流程详情
    flowDetailRoute (data) {
      const routeParams = {
        routeName: `${this.$route.name}__detail_${data.processInstanceId}`,
        menuId: `${this.$route.meta.menuId}`,
        title: `${this.$route.meta.title} - ${data.processDefinitionName}`,
        path: `flow-form/${data.processDefinitionKey}/form`,
        params: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          businessKey: data.businessKey,
          showType: 'detail'
        }
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
