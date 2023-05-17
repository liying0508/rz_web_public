<template>
<!--  银行间接融资明细表-->
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
        getDataListURL: '/report/Indirect/list',
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
          prop: 'institutionName',
          label: '银行名称',
          align: 'center',
          sortable: true,
          allowDrag: false,
          sortMethod: this.handleNameSort,
          n: ' '
        }, {
          prop: 'institutionBranchName',
          label: '支行名称',
          allowDrag: false,
          align: 'center',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'deptName',
          label: '融资主体',
          align: 'center',
          minWidth: '120',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'productName',
          label: '产品名称',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'rate',
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
          prop: 'repaymentDate',
          label: '到期日',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'financingAmount',
          label: '融资金额',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'financingBalanceAmount',
          label: '融资余额（万元）',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'creditMeasures',
          label: '增信措施',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }, {
          prop: 'remark',
          label: '备注',
          align: 'center',
          minWidth: '150',
          allowDrag: false,
          n: '/'
        }
      ],
      tableHeader: [],

      tableData: [],
      mergeRules: ['institutionName', 'institutionBranchName', 'deptName']
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
      _data = _data.filter(item => this.$isNotNull(item.institutionName))
      _data?.sort((a, b) => {
        return b.institutionName.localeCompare(a.institutionName) // 重点是这个比较函数
      })
      // _data.sort((a, b) => { return a.institutionName.localeCompare(b.institutionName) })

      console.log('_data==>', _data)
      // 将需要统计的进行分组
      const set = new Set()
      _data.map(item => {
        set.add(item.institutionName)
      })
      const list = Array.from(set).sort((a, b) => b.localeCompare(a))

      const totalList = []
      const total = {}
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const object = {
          start: -1,
          sameDataCount: 0,
          count: 0,
          allAmount: 0,
          nextIndex: 0,
          institutionName: item
        }
        for (let i = 0; i < _data.length; i++) {
          if (object.start === -1 && item === _data[i].institutionName) {
            object.start = i + index
          }
          if (item === _data[i].institutionName) {
            object.sameDataCount = object.sameDataCount + 1
            if (this.$isNotNull(_data[i].financingBalanceAmount)) {
              object.count = Number(object.count) + _data[i].financingBalanceAmount
            }
            if (this.$isNotNull(_data[i].financingAmount)) {
              object.allAmount = Number(object.allAmount) + _data[i].financingAmount
            }
            if (this.$isNotNull(_data[i].creditMeasures)) {
              _data[i].creditMeasures = this.$getDictLabel('creditMeasures', _data[i].creditMeasures)
            }
            if (this.$isNotNull(_data[i].loanDate)) {
              _data[i].loanDate = _data[i].loanDate.substring(0, 11)
            }
            if (this.$isNotNull(_data[i].repaymentDate)) {
              _data[i].repaymentDate = _data[i].repaymentDate.substring(0, 11)
            }
          }
        }
        object.nextIndex = object.start + object.sameDataCount
        console.log('object', object)
        totalList.push(object)
      }
      console.log('total', total)
      totalList.map(_t => {
        _data.splice(_t.nextIndex, 0, {
          institutionName: _t.institutionName,
          institutionBranchName: '小计',
          deptName: '',
          productName: '',
          rate: '',
          deadLine: '',
          loanDate: '',
          repaymentDate: '',
          financingAmount: _t.allAmount,
          financingBalanceAmount: _t.count,
          creditMeasures: '',
          remark: ''
        })
      })
      console.log('转换后的数据', _data)
      this.$nextTick(() => {
        const tableData = this.$refs['drag-table'].setData(_data)
        tableData.map(item => {
          if (item.institutionBranchName === '小计' || item.institutionBranchName === '合计' || item.institutionBranchName === '直融合计' || item.institutionBranchName === '间融合计') {
            item['institutionBranchName-span'] = {
              rowspan: 1,
              colspan: 4
            }
            for (let i = 2; i <= item['institutionBranchName-span'].colspan; i++) {
              item['deptName-span'] = {
                rowspan: 0,
                colspan: 0
              }
              item['productName-span'] = {
                rowspan: 0,
                colspan: 0
              }
              item['rate-span'] = {
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
