<template>
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
      <drag-table ref="drag-table" v-loading="dataListLoading" :data="tableData" :header="tableHeader" :option="tableOption" :merging-rules="mergeRules" :no-drag="[1,2]">
        <el-table-column slot="fixed"
                         fixed
                         prop="column1"
                         label="序号"
                         align="left"

                         width="70">
          <template slot="header" >
            <div><span>序号</span>
              <el-tooltip class="item" effect="dark" content="报表头管理" placement="bottom">
                <i class="el-icon-edit-outline like-btn" @click="tableHeaderManager" ></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
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
        getDataListURL: '/report/financingbalance/list',
        getDataListIsPage: true,
        exportURL: '/report/credit/export-balance',
        deleteURL: '/financing/findirectfinancing',
        deleteIsBatch: true,
        createdIsNeed: false
      },
      dataForm: {
        /* deptId: '',
         startDate: '',
         endDate: ''*/
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
          prop: 'varieties',
          label: '融资品种',
          align: 'center',
          sortable: true,
          allowDrag: false,
          sortMethod: this.handleNameSort,
          n: ' '
        }, {
          prop: 'deptName',
          label: '用款/融资主体',
          allowDrag: false,
          align: 'center',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'institutionName',
          label: '合作机构',
          align: 'center',
          minWidth: '120',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'project',
          label: '授信项目',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'column14',
          label: '利率',
          align: 'center',
          minWidth: '120',
          allowDrag: false,
          n: '/',
          children: [
            {
              prop: 'lprStr',
              label: 'Lpr利率',
              align: 'center',
              width: '75',
              n: '/'
            },
            {
              prop: 'floatRate',
              label: '上浮利率(%)',
              align: 'center',
              width: '80',
              n: '/'
            },
            {
              prop: 'rate',
              label: '固定利率(%)',
              align: 'center',
              width: '80',
              n: '/'
            }
          ]
        }, {
          prop: 'loanDate',
          label: '放款时间',
          align: 'center',
          width: '95',
          n: '/'
        }, {
          prop: 'deadLine',
          label: '期限/月',
          align: 'center',
          width: '70',
          n: '/'
        }, {
          prop: 'expireDate',
          label: '到期日',
          align: 'center',
          width: '95',
          n: '/'
        }, {
          prop: 'financingBalance',
          label: '贷款余额',
          align: 'right',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'column11',
          label: '增信措施',
          minWidth: '120',
          align: 'center',
          children: [
            {
              prop: 'creditMeasures',
              align: 'center',
              label: '增信内容',
              width: '100',
              n: '/'
            },
            {
              prop: 'guaranteeBody',
              align: 'center',
              label: '担保主体',
              width: '100',
              n: '/'
            }
          ]
        }
      ],
      tableHeader: [],

      tableData: [],
      mergeRules: ['varieties', 'deptName']
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
      console.log('data', data)
      if (data.code !== 0) {
        return this.$message.error(data.msg)
      }
      const _data = this.$isNotNull(data.data) ? data.data : []
      const set = new Set()
      _data.map(item => {
        set.add(item.deptName)
      })
      const list = Array.from(set)
      const totalList = []
      const total = {}
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const object = {
          start: -1,
          end: -1,
          nextIndex: 0,
          count: 0,
          currency: '',
          countStr: '',
          index: 0,
          total: {}
        }
        for (let i = 0; i < _data.length; i++) {
          _data[i].column1 = i + 1
          _data[i].currency = this.$isNotNull(_data[i].currency) ? _data[i].currency : '元'
          if (object.start === -1 && item === _data[i].deptName) {
            object.start = i
          }
          if (item === _data[i].deptName) {
            object.index = object.index++
            object.currency = this.$isNotNull(_data[i].currency) ? _data[i].currency : '元'
            if (this.$isNotNull(_data[i].financingBalance)) {
              object.total[object.currency] = this.$isNotNull(object.total[object.currency]) ? object.total[object.currency] + Number(_data[i].financingBalance) : Number(_data[i].financingBalance)
              /* object.count = object.count + Number(_data[i].financingBalance) */
              _data[i].financingBalance = this.$numberFormat(_data[i].financingBalance) + _data[i].currency
            }
          }
          if (this.$isNotNull(_data[i].rate) && item === _data[i].deptName) {
            _data[i].rate = _data[i].rate
          }
          if (this.$isNotNull(_data[i].varieties) && item === _data[i].deptName) {
            // console.log('_data[i].varieties', _data[i].varieties)
            _data[i].varieties = this.$getDictLabel('varieties', _data[i].varieties)
            // console.log('_data[i].varieties>>', _data[i].varieties)
          }
          if (this.$isNotNull(_data[i].creditMeasures) && item === _data[i].deptName) {
            // console.log('_data[i].creditMeasures', _data[i].creditMeasures)
            _data[i].creditMeasures = this.$getDictLabel('creditMeasures', _data[i].creditMeasures)
            // console.log('_data[i].creditMeasures>>', _data[i].creditMeasures)
          }
          if (this.$isNotNull(_data[i].loanDate) && item === _data[i].deptName) {
            _data[i].loanDate = _data[i].loanDate.substring(0, 11)
          }
          if (this.$isNotNull(_data[i].expireDate) && item === _data[i].deptName) {
            _data[i].expireDate = _data[i].expireDate.substring(0, 11)
          }
        }
        object.end = object.start + object.index + 1
        object.end = object.end >= _data.length - 1 ? _data.length : object.end
        object.nextIndex = index + object.end + 1
        const str = []
        Object.keys(object.total).map(key => {
          if (this.$isNotNull(object.total[key])) {
            str.push(this.$numberFormat(object.total[key]) + key)
            total[key] = this.$isNotNull(total[key]) ? Number(total[key]) + object.total[key] : object.total[key]
          }
        })
        object.count = str.join('+')
        console.log('object.currency', object.currency)
        // total[object.currency] = this.$isNotNull(total[object.currency]) ? Number(total[object.currency]) + object.total[object.currency].count : object.count
        totalList.push(object)
      }
      console.log('total', total)
      totalList.map(_t => {
        _data.splice(_t.nextIndex, 0, {
          column1: '小计',
          varieties: '',
          deptName: '',
          institutionName: '',
          project: '',
          lprStr: '',
          loanDate: '',
          deadLine: '',
          expireDate: '',
          financingBalance: _t.count,
          column11: '',
          creditMeasures: '',
          guaranteeBody: ''
        })
      })
      const str = []
      Object.keys(total).map(key => {
        if (this.$isNotNull(total[key])) {
          str.push(this.$numberFormat(total[key]) + key)
        }
      })
      _data.push({
        column1: '合计',
        varieties: '',
        deptName: '',
        institutionName: '',
        project: '',
        lprStr: '',
        loanDate: '',
        deadLine: '',
        expireDate: '',
        financingBalance: str.join('+'),
        column11: '',
        creditMeasures: '',
        guaranteeBody: ''
      })
      console.log('转换后的数据', totalList, _data, total)
      this.$nextTick(() => {
        const tableData = this.$refs['drag-table'].setData(_data)
        tableData.map(item => {
          if (item.column1 === '小计' || item.column1 === '合计' || item.column1 === '直融合计' || item.column1 === '间融合计') {
            item['column1-span'] = {
              rowspan: 1,
              colspan: 3
            }
            for (let i = 2; i <= item['column1-span'].colspan; i++) {
              item[`column${i}-span`] = {
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

    /*  const data = [
        {
          column1: '1',
          varieties: '品种1',
          deptName: '集团公司',
          institutionName: '浦发银行',
          project: '流动资金贷款',
          lprRate: '一年期LPR+0.5%',
          loanDate: '2021/3/31',
          deadLine: '3',
          expireDate: '2024/3/30',
          financingBalance: '10000',
          column11: '',
          creditMeasures: '信用',
          guaranteeBody: '',
          column14: '',
          rate: '4.35%'
        },
        {
          column1: '2',
          varieties: '品种2',
          deptName: '集团公司',
          institutionName: '工商银行',
          project: '类永续',
          lprRate: '',
          loanDate: '2021/5/28',
          deadLine: '2',
          expireDate: '2023/5/27',
          financingBalance: '60000',
          column11: '',
          creditMeasures: '信用',
          guaranteeBody: '',
          column14: '',
          rate: '4.95%'
        },
        {
          column1: '3',
          varieties: '品种3',
          deptName: '集团公司',
          institutionName: '国开行',
          project: '流动资金贷款',
          lprRate: '',
          loanDate: '2021/6/16',
          deadLine: '3',
          expireDate: '2024/6/15',
          financingBalance: '74000',
          column11: '',
          creditMeasures: '信用',
          guaranteeBody: '',
          column14: '',
          rate: '3.7%'
        },
        {
          column1: '小计',
          varieties: '',
          deptName: '',
          institutionName: '',
          project: '',
          lprRate: '',
          loanDate: '',
          deadLine: '',
          expireDate: '',
          financingBalance: '144000.00',
          column11: '',
          creditMeasures: '',
          guaranteeBody: ''
        },
        {
          column1: '4',
          varieties: '品种3',
          deptName: '中盈投资',
          institutionName: '进出口',
          project: '流动资金贷款',
          lprRate: '',
          loanDate: '2020/10/19',
          deadLine: '1',
          expireDate: '2021/10/18',
          financingBalance: '3000',
          column11: '',
          creditMeasures: '保证担保',
          guaranteeBody: '集团公司',
          column14: '',
          rate: '2.7%'
        },
        {
          column1: '5',
          varieties: '品种3',
          deptName: '中盈投资',
          institutionName: '农业银行',
          project: '流动资金贷款',
          lprRate: '',
          loanDate: '2020/9/7',
          deadLine: '1',
          expireDate: '2021/9/6',
          financingBalance: '3200',
          column11: '',
          creditMeasures: '保证担保',
          guaranteeBody: '集团公司',
          column14: '',
          rate: '3.8%'
        },
        {
          column1: '合计',
          varieties: '',
          deptName: '',
          institutionName: '',
          project: '',
          lprRate: '',
          loanDate: '',
          deadLine: '',
          expireDate: '',
          financingBalance: '150400.00',
          column11: '',
          creditMeasures: '',
          guaranteeBody: ''
        }
      ]
      this.$nextTick(() => {
        const tableData = this.$refs['drag-table'].setData(data)
        tableData.map(item => {
          if (item.column1 === '小计' || item.column1 === '合计' || item.column1 === '直融合计' || item.column1 === '间融合计') {
            item['column1-span'] = {
              rowspan: 1,
              colspan: 3
            }
            for (let i = 2; i <= item['column1-span'].colspan; i++) {
              item[`column${i}-span`] = {
                rowspan: 0,
                colspan: 0
              }
            }
          }
        })
        console.log(tableData)
        this.tableData = tableData
      }) */
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
