<template>
  <div>
    <vxe-table border show-overflow :data="payPlanData.payPlan"
               :column-config="{resizable: true}"
               @cell-click="cellClick"
               ref="payTable"
               :edit-config="{trigger: 'click', mode: 'cell',activeMethod: targetCellDisable}">
      <vxe-colgroup>
        <template #header>
          <el-row class="table-row">
            <el-col :span="6">
              <span class="item-label">总本金：</span>{{ dataForm.principal }} {{$getDictLabel('unit',$store.state.unit)}}
            </el-col>
            <el-col :span="6">
              <span class="item-label">总利息：</span>{{  interest }} 元
            </el-col>
            <el-col :span="6">
              <span class="item-label">总还款额：</span>{{ repaymentMoney }} 元
            </el-col>
            <el-col :span="6">
              <span class="item-label">实际还款额：</span>{{ actualRepayment }} 元
            </el-col>
          </el-row>
        </template>
        <!-- <vxe-column field="startDate"
                    title="开始日期"
                    show-overflow
                    :edit-render="{
                                    name: `$input`,
                                    props: {clearable: true, type:'date',disabledMethod:disabledStartDateMethod},
                                    placeholder:'开始日期',
                                    events: {change: columnChange}
                                  }">
        </vxe-column>
        <vxe-column field="endDate"
                    title="结束日期"
                    show-overflow
                    :edit-render="{
                                    name: `$input`,
                                    props: {clearable: true, type:'date',disabledMethod:disabledDateMethod},
                                    placeholder:'结束日期',
                                    events: {change: columnChange}
                                  }">
        </vxe-column> -->
        <vxe-column field="repayDate"
                    title="结束日期"
                    show-overflow
                    :edit-render="{
                                    name: `$input`,
                                    props: {clearable: true, type:'date',disabledMethod:disabledDateMethod},
                                    placeholder:'结束日期',
                                    events: {change: columnChange}
                                  }">
        </vxe-column>
        <!-- <vxe-column field="alreadyRepayPrincipal" :title="`已还本金（${$getDictLabel('unit',dataForm.unit)}）`" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
            <vxe-input v-model="row.alreadyRepayPrincipal" type="text" @blur="columnChange"></vxe-input>
          </template>
          <template #default="{row}">
            {{$numberFormat(row.alreadyRepayPrincipal)}}
          </template>
        </vxe-column> -->
        <vxe-column field="alreadyRepayInterest" title="已还利息（元）" :edit-render="{autofocus: '.vxe-input--inner',events: {change: columnChange}}">
          <template #edit="{ row }">
            <vxe-input v-model="row.alreadyRepayInterest " type="text" @blur="countPrincipal"></vxe-input>
          </template>
          <template #default="{row}">
            <!-- {{$numberFormat(row.alreadyRepayInterest)}} -->
            {{row.alreadyRepayInterest}}
          </template>
        </vxe-column>
        <vxe-column field="rate" title="利率" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
           <vxe-input v-model="row.rate" type="number"></vxe-input>
          </template>
          <template #default="{row}">
            <!-- {{$numberFormat(row.rate)}} -->
            {{row.rate}}
          </template>
        </vxe-column>
        <vxe-column title="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandler(scope)" :disabled = true>{{ $t('delete') }}</el-button>
          </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-table>
    <template slot="footer">
      <el-button type="primary" @click="getPlan">{{ $t('confirm') }}</el-button>
    </template>
  </div>

</template>
<script>
/* import MoneyInput from '@/components/money-input' */
export default {
  name: 'financeRepay',
  /* components: { MoneyInput }, */
  props: {
    // 表单参数
    dataForm: {
      type: Object
    },
    // 是否禁用编辑
    isDisabled: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 当前选中行
      currentRowIndex: 0,
      interest: '',
      repaymentMoney: '',
      actualRepayment: 0,
      payPlanData: {
        // 还款计划
        payPlan: [],
        // 测算周期
        interestMeasurementCycle: 360,
        // 是否结息日算息
        endNeedCount: 0
      }
    }
  },
  watch: {
    issueQuota () {
      this.repaymentAmount = this.issueQuota
    },
    dataForm () {
      this.payPlanData.payPlan = this.dataForm.repaymentInfo.repayInterestInfoList ? this.dataForm.repaymentInfo.repayInterestInfoList : []
      this.actualRepayment = this.dataForm.actualRepayment
    },
    'payPlanData.payPlan': {
      handler (val) {
        if (val.length > 0) {
          var interest = 0
          // var repaymentMoney = 0
          val.forEach(item => {
            interest += Number(item.alreadyRepayInterest)
          // repaymentMoney += item.alreadyRepayInterest + item.alreadyRepayPrincipal
          })
          this.interest = interest
          this.repaymentMoney = interest
          this.dataForm.repaymentInfo.repayPrincipalInfoList.forEach(item => {
            this.repaymentMoney += Number(item.alreadyRepayPrincipal)
          })
        } else {
          this.interest = 0
          this.repaymentMoney = 0
          this.dataForm.repaymentInfo.repayPrincipalInfoList.forEach(item => {
            this.repaymentMoney += Number(item.alreadyRepayPrincipal)
          })
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getRepaymentMoney()
  },
  methods: {
    getRepaymentMoney () {
      var repaymentMoney = 0
      var interest = 0
      this.dataForm.repaymentInfo.repayPrincipalInfoList.forEach(item => {
        if (this.$store.state.unit == 2) {
          // 由于利息单位固定为元，所以当页面单位为万元时，计算累计还款时需将偿还本金乘以10000
          repaymentMoney += Number((Number(item.alreadyRepayPrincipal) * 10000).toFixed())
        } else {
          repaymentMoney += Number(item.alreadyRepayPrincipal)
        }
      })
      this.dataForm.repaymentInfo.repayInterestInfoList.forEach(item => {
        repaymentMoney += Number(item.alreadyRepayInterest)
        interest += Number(item.alreadyRepayInterest)
      })
      this.repaymentMoney = repaymentMoney
      this.interest = interest
    },
    columnChange (val) {
    },
    // 偿还本金录入值 需要 修改剩余本金
    countPrincipal (val) {
      const list = this.payPlanData.payPlan
      this.interestSum = 0
      let total = Number(this.issueQuota)
      for (let i = 0; i < list.length; i++) {
        if (!this.$isNotNull(list[i].repaymentOfPrincipal)) {
          continue
        }
        if (i === this.currentRowIndex) {
          if (this.$isNotNull(val.value)) {
            list[i].oddCorpus = total - Number(val.value)
            total = total - Number(list[i].repaymentOfPrincipal)
          }
        } else {
          list[i].oddCorpus = total - Number(list[i].repaymentOfPrincipal)
          total = total - Number(list[i].repaymentOfPrincipal)
        }
      }
    },
    // 禁用编辑
    targetCellDisable () {
      return !this.isDisabled
    },
    // 初始化数据
    init () {
      this.payPlanData = {
        // 还款计划
        payPlan: [],
        // 测算周期
        interestMeasurementCycle: 360,
        // 是否结息日算息
        endNeedCount: 0
      }
      this.getLpr()
    },
    // 获取lpr周期利率
    async getLpr () {
      try {
        const { data } = await this.$http.get('/lpr/flpr/page', { params: { page: 1, limit: 99999 } })
        console.log(data)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.lpr = []
        if (this.$isNotNull(data?.data?.list)) {
          for (const item of data.data.list) {
            item.startFormat = this.$formatDate(item.startTime, 'YYYY-MM-DD')
            item.endFormat = this.$formatDate(item.endTime, 'YYYY-MM-DD')
          }
          this.lpr = data.data.list
        }
      } catch (e) {
        console.log('getLpr-e:', e)
      }
    },
    // 获取当前选中的行
    cellClick ({ row, rowIndex }) {
      this.currentRowIndex = rowIndex
    },
    // 禁用不符合条件的开始日期
    disabledStartDateMethod ({ date }) {
      const startTime = date.getTime()
      const endDate = this.payPlanData.payPlan[this.currentRowIndex].endDate
      if (this.$isNotNull(endDate)) {
        const endTime = new Date(endDate).getTime()
        return endTime - startTime < 0
      } else {
        return false
      }
    },
    // 禁用不符合条件的结束日期
    disabledDateMethod ({ date }) {
      const endTime = date.getTime()
      const startDate = this.payPlanData.payPlan[this.currentRowIndex].startDate
      if (this.$isNotNull(startDate)) {
        const startTime = new Date(startDate).getTime()
        return endTime - startTime < 0
      } else {
        return false
      }
    },
    // 测算利息
    testRate (row) {
      const text = ['', '直融信息', '间接融资信息', '政府债券信息'][Number(this.pageType)]
      const text2 = ['', '折合人民币金额', '提款金额', '融资金额'][Number(this.pageType)]
      const text3 = ['', '起息日', '放款日期', '放款日期'][Number(this.pageType)]
      const text4 = ['', '到期日', '还款日期', '还款日期'][Number(this.pageType)]
      if (!this.$isNotNull(this.issueQuota)) {
        return this.$message.error(`请录入${text}中的${text2}`)
      }
      if (!this.$isNotNull(this.rateType)) {
        return this.$message.error(`请录入${text}利率计算方式`)
      }

      if (!this.$isNotNull(this.valueDate)) {
        return this.$message.error(`请录入${text}中的${text3}`)
      }

      if (!this.$isNotNull(this.dueDate)) {
        return this.$message.error(`请录入${text}中的${text4}`)
      }
      let errorMsg = null
      // 校验
      const list = this.payPlanData.payPlan
      for (let index = 0; index < list.length; index++) {
        if (!this.$isNotNull(list[index].startDate)) {
          errorMsg = `第${index + 1}行，开始时间不能为空`
          break
        }
        if (!this.$isNotNull(list[index].endDate)) {
          errorMsg = `第${index + 1}行，结束时间不能为空`
          break
        }
      }
      if (this.$isNotNull(errorMsg)) {
        return this.$message.error(errorMsg)
      }
      this.interestSum = 0
      this.repaymentAmount = this.issueQuota
      // 到期日
      const dueDate = new Date(this.dueDate).getTime()
      let _index = 0
      for (const item of this.payPlanData.payPlan) {
        // 还款本金
        const repaymentAmount = this.repaymentAmount
        // 起息日时间戳
        const startTime = new Date(item.startDate).getTime()
        // 结束日时间戳
        const endTime = new Date(item.endDate).getTime()
        // LPR阶段性利息计算描述
        const desc = []
        // 还款天数
        let day = (endTime - startTime) / (1000 * 24 * 60 * 60)
        // 如果需要还款日需要计算利息天数+1
        if (this.payPlanData.endNeedCount === true) {
          day = day + 1
        }
        // 日利率
        // let dayRate = (this.rate / this.payPlanData.interestMeasurementCycle).toFixed(3)
        let dayRate = (this.rate / this.payPlanData.interestMeasurementCycle)
        // console.log('日利率', dayRate, '周期', this.payPlanData.interestMeasurementCycle, 'this.rate', this.rate)
        // 利息
        let interest = 0
        // 利率类型  分固定利率和浮动利率（LPR）
        if (this.rateType === '0') {
          // 利息=本金*利率*天数

          // interest = (repaymentAmount * (dayRate / 100) * day).toFixed(2)
          // interest = (repaymentAmount * (dayRate / 100) * day)
          interest = (repaymentAmount * this.rate / 100 * day / this.payPlanData.interestMeasurementCycle).toFixed(2)
          console.log('固定利率：日利率', dayRate, '本金', repaymentAmount, '天数', day, '利息', interest, '年利率', this.rate, '还款周期', this.payPlanData.interestMeasurementCycle)
        } else {
          // 跨LPR阶段数据
          const stepList = []
          // 递归计算跨了几个LPR
          this.recursionLpr(startTime, endTime, stepList, JSON.parse(JSON.stringify(this.lpr)))
          // 初始化利息
          interest = 0
          // 贷款超过5年取 5年利率
          const attr = day >= 1826 ? 'fiveRate' : 'rate'
          const numberYear = day >= 1826 ? '5' : '1'

          for (const [index, step] of stepList.entries()) {
            if (step.ceilDay <= 0) {
              continue
            }
            // LPR日利率计算
            dayRate = Number(step.lpr[attr]) + Number(this.floatRate)
            // LPR利息计算
            const _interest = (repaymentAmount * (dayRate / 100) * step.ceilDay / this.payPlanData.interestMeasurementCycle).toFixed(2)
            console.log('浮动利率本金：', repaymentAmount, '日利率', dayRate, '利息', _interest, '还款周期', this.interestMeasurementCycle, '当前阶段天数', step.ceilDay, Number(step.lpr[attr]))
            // 跨阶段利息求总数
            interest = Number(interest) + Number(_interest)
            if (interest > 0) {
              // LPR阶段描述
              const end = index === stepList.length - 1 ? item.endDate : step.lpr.endFormat
              desc.push(`${step.lpr.startFormat} 至 ${end}： LPR ${numberYear} 年期利率为： ${step.lpr[attr]}% ,上浮利率为：${this.floatRate}%，本次还款计息天数为： ${step.ceilDay}天 ，利息为： ${_interest}元 `)
            }
          }
          // console.log('跨了几个阶段：', stepList, interest)
        }
        item.desc = desc.join('。')
        item.interest = interest !== 'NaN' ? interest : 0
        // console.log('年利率', this.rate, '日利率', dayRate, '天数', day, '利息', interest)
        this.interestSum = Number(this.interestSum) + Number(item.interest)
        // 已到还款日
        if (endTime >= dueDate) {
          // 已到还款日 偿还本金为剩余金额
          item.repaymentOfPrincipal = this.repaymentAmount
          // 剩余本金为0
          item.oddCorpus = 0
          this.totalPayment = Number(this.issueQuota) + Number(this.interestSum)
        } else {
          let _item = this.payPlanData.payPlan[_index]
          if (_index > 0) {
            _item = this.payPlanData.payPlan[_index - 1]
          }

          // 未到还款日,如果客户手动录入了则为录入的值,取前一个的本金
          _item.repaymentOfPrincipal = this.$isNotNull(_item.repaymentOfPrincipal) ? Number(_item.repaymentOfPrincipal) : 0
          // 总还款金额为 总还款-剩余本金+已产生的利息
          console.log('本金', repaymentAmount, '下标', _index, '偿还本金', item.repaymentOfPrincipal, '天数', day, '利息', interest, '年利率', this.rate, '还款周期', this.payPlanData.interestMeasurementCycle)

          if (this.$isNotNull(_item.repaymentOfPrincipal)) {
            item.oddCorpus = this.repaymentAmount - Number(_item.repaymentOfPrincipal)
            this.repaymentAmount = this.repaymentAmount - Number(_item.repaymentOfPrincipal)
            console.log('剩余本金', this.repaymentAmount)
          }
          this.totalPayment = Number(this.issueQuota) - Number(this.repaymentAmount) + this.interestSum
        }
        _index++
      }
    },
    // 递归跨阶段计算利息
    recursionLpr (startTime, endTime, list, lpr) {
      // console.log('recursionLpr')
      const oneDay = 24 * 60 * 60 * 1000
      // 处于lpr单阶段
      let _lpr = lpr.find(item => startTime >= item.startTime && endTime <= item.endTime)
      if (this.$isNotNull(_lpr)) {
        let day = (endTime - startTime) / oneDay
        // 如果还款日需要计算利息则需要增加1天
        if (this.payPlanData.endNeedCount === true) {
          day = day + 1
        }
        list.push({ lpr: _lpr, day: day, ceilDay: Math.ceil(day) })
        // console.log('lpr周期', `${this.$formatDate(_lpr.startTime, 'YYYY-MM-DD')}-${this.$formatDate(_lpr.endTime, 'YYYY-MM-DD')}`, '开始时间：', this.$formatDate(startTime, 'YYYY-MM-DD'), '结束时间：', this.$formatDate(endTime, 'YYYY-MM-DD'), list)
      } else {
        const index = lpr.findIndex(item => startTime >= item.startTime)
        // console.log('跨周期的：', index, startTime, lpr, this.$formatDate(startTime, 'YYYY-MM-DD'))
        if (index > -1) {
          _lpr = lpr[index]
          // 此处是为了处理前后端时间戳不一致 导致计算出来是小数的问题
          const _endTime = new Date(_lpr.endFormat).getTime()
          const day = (_endTime - startTime) / oneDay
          list.push({ lpr: _lpr, day: day + 1, ceilDay: Math.ceil(day + 1) })
          lpr.splice(index, 1)
          // console.log('跨lpr周期', `${this.$formatDate(_lpr.startTime, 'YYYY-MM-DD')}-${this.$formatDate(_lpr.endTime, 'YYYY-MM-DD')}`, '开始时间：', this.$formatDate(startTime, 'YYYY-MM-DD'), '结束时间：', this.$formatDate(endTime, 'YYYY-MM-DD'), list)
          this.recursionLpr(_endTime + oneDay, endTime, list, lpr)
        }
      }
    },
    // 增加一行还款计划
    addRow () {
      this.payPlanData.payPlan.push(
        {
          startDate: '',
          endDate: '',
          // 偿还利息
          interest: '',
          // 偿还本金
          repaymentOfPrincipal: '',
          // 剩余本金
          oddCorpus: '',
          // 说明
          desc: ''
        }
      )
    },
    // 获取还款计划内容
    getPlan () {
      console.log('测试')
      this.payPlanData.payPlan = this.payPlanData.payPlan.filter(item => !this.$isNotNull(item.startDate) || !this.$isNotNull(item.endDate))
      this.$emit('plan', this.payPlanData)
    },
    // 删除当前行
    deleteHandler (scope) {
      this.payPlanData.payPlan.splice(scope.rowIndex, 1)
    }
  },
  created () {
    this.getLpr()
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-radio{
  font-weight: 400;
  .el-radio__inner{
    position: relative;
    top:-1px;
  }

}
.table-row{
  padding-bottom: 5px;
  line-height: 40px;
  ::v-deep .el-switch{
    line-height: 16px;
  }
  ::v-deep .el-switch__core{
    top:-2px;
  }
}
.item-label{
  margin-right: 5px;
  display: inline-block;
  line-height: 40px;
}
</style>
