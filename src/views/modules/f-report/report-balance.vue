<template>
  <!--  融资余额明细表-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord-report">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getReport">
        <el-form-item  label="融资主体">
          <ren-dept-tree v-model="dataForm.deptId" placeholder="融资主体" :dept-name.sync="dataForm.deptName"></ren-dept-tree>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.startDate" :picker-options="startTimeOptions" type="month" value-format="yyyy-MM" placeholder="起始月份" @focus="clickStartTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.endDate" :picker-options="endTimeOptions" type="month" value-format="yyyy-MM" placeholder="结束月份" @focus="clickEndTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getReport">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>

      </el-form>
      <drag-table ref="drag-table" v-loading="dataListLoading"
                  :data="tableData" :header="tableHeader" :option="tableOption" :merging-rules="mergeRules" :no-drag="[1,2]">
      </drag-table>
    </div>
    <el-dialog :visible.sync="tableHeaderManagerVisible"
               title="报表头管理"
               append-to-body
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-checkbox-group v-model="checkHeader">
        <el-checkbox v-for="data in baseHeader"
                     :key="data.dictValue"
                     :label ="data">{{data.label}}</el-checkbox>
      </el-checkbox-group>
      <template slot="footer">
        <el-button @click="tableHeaderManagerVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submitTableHeader">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import DragTable from '@/components/drag-table'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'Table',
  mixins: [mixinViewModule],
  data () {
    return {
      tableHeaderManagerVisible: false,
      mixinViewModuleOptions: {
        // getDataListURL: '/financing/findirectfinancing/page',
        getDataListURL: '/report/balanceDetail/list',
        getDataListIsPage: true,
        exportURL: '/report/credit/export-balance',
        deleteURL: '/financing/findirectfinancing',
        deleteIsBatch: true,
        createdIsNeed: false
      },
      dataForm: {
        /* deptId: '',
         startDate: '',
         endDate: '' */
      },
      tableOption: {
        border: true,
        maxHeight: 1000
      },
      startTimeOptions: {},
      endTimeOptions: {},
      checkHeader: [],
      baseHeader: [
        {
          prop: 'financingTypeName',
          label: '融资品种',
          align: 'center',
          sortable: true,
          allowDrag: false,
          sortMethod: this.handleNameSort,
          n: ' '
        }, {
          prop: 'deptName',
          label: '融资主体',
          allowDrag: false,
          align: 'center',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'institutionName',
          label: '金融机构',
          align: 'center',
          minWidth: '120',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'financeProduct',
          label: '融资产品',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'strikeRate',
          label: '执行利率',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'deadLine',
          label: '期限（年）',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'loanDate',
          label: '放款日',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'endDate',
          label: '到期日',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'financingAmount',
          label: '贷款金额',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'financingBalance',
          label: '贷款余额',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'column11',
          label: '增信措施',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/',
          children: [
            {
              prop: 'creditMeasures',
              align: 'center',
              label: '增信方式',
              width: '100',
              n: '/'
            },
            {
              prop: 'guarantor',
              align: 'center',
              label: '担保主体',
              width: '100',
              n: '/'
            },
            {
              prop: 'contractAmount',
              align: 'center',
              label: '担保金额',
              width: '100',
              n: '/'
            },
            {
              prop: 'propertyRelations',
              align: 'center',
              label: '是否与被担保方存在产权关系',
              width: '100',
              n: '/'
            },
            {
              prop: 'shareRatio',
              align: 'center',
              label: '是否为被担保方超股比担保',
              width: '100',
              n: '/'
            },
            {
              prop: 'counterGuarantee',
              align: 'center',
              label: '是否有反担保，注明反担保方式',
              width: '100',
              n: '/'
            }
          ]
        }, {
          prop: 'decisionBasis',
          label: '决策依据',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }
      ],
      tableHeader: [],

      tableData: [],
      mergeRules: ['financingTypeName', 'deptName', 'institutionName']
    }
  },
  methods: {
    clickStartTime () {
      this.startTimeOptions.disabledDate = time => {
        if (this.dataForm.endDate) {
          if (time.getTime() > new Date(this.dataForm.endDate).getTime()) {
            return true
          }
        }
      }
    },
    clickEndTime () {
      this.endTimeOptions.disabledDate = time => {
        if (this.dataForm.beginDate) {
          return (
            time.getTime() < new Date(this.dataForm.beginDate).getTime()
          )
        }
      }
    },
    handleNameSort () {
      console.log('handleNameSort')
    },
    tableHeaderManager () {
      this.tableHeaderManagerVisible = true
    },
    submitTableHeader () {
      console.log('checkHeader选中', this.checkHeader)
      this.tableHeader = this.checkHeader
      this.tableHeaderManagerVisible = false
    },
    // 获取报表
    async getReport () {
      this.dataListLoading = true
      const { data } = await this.$http.get(this.mixinViewModuleOptions.getDataListURL, { params: { ...this.dataForm } })
      if (data.code !== 0) {
        return this.$message.error(data.msg)
      }
      // 处理数据排序问题

      let _data = this.$isNotNull(data.data) ? data.data : []
      _data = _data.filter(item => this.$isNotNull(item.deptName))
      _data?.sort((a, b) => {
        if (b.financingTypeName === a.financingTypeName) {
          return b.deptName.localeCompare(a.deptName) // 重点是这个比较函数
        }
        return b.financingTypeName.localeCompare(a.financingTypeName) // 重点是这个比较函数
      })
      // _data.sort((a, b) => { return a.institutionName.localeCompare(b.institutionName) })

      console.log('_data==>', _data)
      // 将需要统计的进行分组
      // 融资品种+融资主体
      const set = new Set()
      // 融资品种
      const typeSumSet = new Set()
      _data.map(item => {
        typeSumSet.add(item.financingTypeName)
        set.add(item.financingTypeName + '_' + item.deptName)
      })
      const list = Array.from(set).sort((a, b) => b.localeCompare(a))

      const totalList = []
      const total = {}
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const object = {
          start: -1,
          sameDataCount: 0,
          financingBalanceSum: 0,
          financingAmountSum: 0,
          contractAmountSum: 0,
          nextIndex: 0,
          financingTypeName: '',
          deptName: ''

        }
        for (let i = 0; i < _data.length; i++) {
          const compare = _data[i].financingTypeName + '_' + _data[i].deptName
          if (object.start === -1 && item === compare) {
            object.start = i + index
          }
          if (item === compare) {
            object.sameDataCount = object.sameDataCount + 1
            object.financingTypeName = _data[i].financingTypeName
            object.deptName = _data[i].deptName
            if (this.$isNotNull(_data[i].financingBalance)) {
              object.financingBalanceSum = Number(object.financingBalanceSum) + _data[i].financingBalance
            }
            if (this.$isNotNull(_data[i].financingAmount)) {
              object.financingAmountSum = Number(object.financingAmountSum) + _data[i].financingAmount
            }
            if (this.$isNotNull(_data[i].contractAmount)) {
              object.contractAmountSum = Number(object.contractAmountSum) + _data[i].contractAmount
            }
            if (this.$isNotNull(_data[i].creditMeasures)) {
              _data[i].creditMeasures = this.$getDictLabel('creditMeasures', _data[i].creditMeasures)
            }

            if (this.$isNotNull(_data[i].loanDate)) {
              _data[i].loanDate = _data[i].loanDate.substring(0, 11)
            }
            if (this.$isNotNull(_data[i].endDate)) {
              _data[i].endDate = _data[i].endDate.substring(0, 11)
            }
            _data[i].propertyRelations = (_data[i].propertyRelations === 0 || _data[i].propertyRelations === '否') ? '否' : '是'
            _data[i].shareRatio = (_data[i].shareRatio === 0 || _data[i].shareRatio === '否') ? '否' : '是'
            _data[i].counterGuarantee = (_data[i].counterGuarantee === 0 || _data[i].counterGuarantee === '否') ? '否' : '是'
          }
        }
        object.nextIndex = object.start + object.sameDataCount
        // console.log('object', object)
        totalList.push(object)
      }
      console.log('total', total)
      totalList.map(_t => {
        _data.splice(_t.nextIndex, 0, {
          // 担保金额
          contractAmount: _t.contractAmountSum,
          // 是否有反担保，注明反担保方式
          counterGuarantee: '',
          // 增信措施
          creditMeasures: '',
          // 期限/年
          deadLine: '',
          // 决策依据
          decisionBasis: '',
          // 融资主体名
          deptName: _t.deptName,
          // 到期日
          endDate: '',
          // 融资产品
          financeProduct: '',
          // 贷款金额
          financingAmount: _t.financingAmountSum,
          // 贷款余额
          financingBalance: _t.financingBalanceSum,
          // 融资种类名
          financingTypeName: _t.financingTypeName,
          // 担保主体
          guarantor: '',
          // 金融机构名
          institutionName: '小计',
          // 放款日
          loanDate: '',
          // 是否与被担保方存在产权关系
          propertyRelations: '',
          // 备注
          remarks: '',
          // 是否为被担保方超股比担保
          shareRatio: '',
          // 执行利率
          strikeRate: ''
        })
      })
      const typeSumList = Array.from(typeSumSet).sort((a, b) => b.localeCompare(a))
      console.log('typeSumList', typeSumList)
      const sumList = []
      for (let index = 0; index < typeSumList.length; index++) {
        const item = typeSumList[index]
        const object = {
          start: -1,
          sameDataCount: 0,
          financingBalanceSum: 0,
          financingAmountSum: 0,
          contractAmountSum: 0,
          nextIndex: 0,
          financingTypeName: '',
          deptName: ''

        }
        for (let i = 0; i < _data.length; i++) {
          const compare = _data[i].financingTypeName
          if (object.start === -1 && item === compare) {
            object.start = i + index
          }
          if (item === compare) {
            object.financingTypeName = _data[i].financingTypeName
            object.sameDataCount = object.sameDataCount + 1
            if (this.$isNotNull(_data[i].financingBalance)) {
              object.financingBalanceSum = Number(object.financingBalanceSum) + _data[i].financingBalance
            }
            if (this.$isNotNull(_data[i].financingAmount)) {
              object.financingAmountSum = Number(object.financingAmountSum) + _data[i].financingAmount
            }
            if (this.$isNotNull(_data[i].contractAmount)) {
              object.contractAmountSum = Number(object.contractAmountSum) + _data[i].contractAmount
            }
          }
        }
        object.nextIndex = object.start + object.sameDataCount
        console.log('object', object)
        sumList.push(object)
      }
      console.log('sumList>>>>>', sumList)
      sumList.map(_t => {
        _data.splice(_t.nextIndex, 0, {
          // 担保金额
          contractAmount: _t.contractAmountSum,
          // 是否有反担保，注明反担保方式
          counterGuarantee: '',
          // 增信措施
          creditMeasures: '',
          // 期限/年
          deadLine: '',
          // 决策依据
          decisionBasis: '',
          // 融资主体名
          deptName: _t.financingTypeName + '合计',
          // 到期日
          endDate: '',
          // 融资产品
          financeProduct: '',
          // 贷款金额
          financingAmount: _t.financingAmountSum,
          // 贷款余额
          financingBalance: _t.financingBalanceSum,
          // 融资种类名
          financingTypeName: _t.financingTypeName,
          // 担保主体
          guarantor: '',
          // 金融机构名
          institutionName: '',
          // 放款日
          loanDate: '',
          // 是否与被担保方存在产权关系
          propertyRelations: '',
          // 备注
          remarks: '',
          // 是否为被担保方超股比担保
          shareRatio: '',
          // 执行利率
          strikeRate: ''
        })
      })
      console.log('转换后的数据', _data)
      this.$nextTick(() => {
        const tableData = this.$refs['drag-table'].setData(_data)
        tableData.map(item => {
          if (item.deptName.includes('合计')) {
            item['deptName-span'] = {
              rowspan: 1,
              colspan: 2
            }
            for (let i = 2; i <= item['deptName-span'].colspan; i++) {
              item['institutionName-span'] = {
                rowspan: 0,
                colspan: 0
              }
            }
          }
        })
        console.log(tableData)
        this.tableData = tableData
        this.dataListLoading = false
      })
    }

  },
  created () {
    this.tableHeader = this.baseHeader
    this.getReport()
  },
  components: {
    DragTable
  }
}
</script>
<style lang="scss" scoped>
.like-btn{
  font-size: 20px;
  color: #409eff;
  float: right;
  cursor: pointer;
  &:after{
    clear: both;
  }
}
</style>
