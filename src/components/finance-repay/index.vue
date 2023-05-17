<template>
  <div>

    <vxe-table border show-overflow :data="payPlanData.payPlan"
               :column-config="{resizable: true}"
               @cell-click="cellClick"
               ref="payTable"
               :height="tableHeight"
               :edit-config="{trigger: 'click', mode: 'cell',activeMethod: targetCellDisable}" style="margin-bottom:20px;">
      <vxe-colgroup>
        <template #header>
          <el-row class="table-row">
            <el-col :span="6">
              <span class="item-label">测算周期：</span>
              <ren-radio-group :disabled="isDisabled" v-model="payPlanData.interestMeasurementCycle" dict-type="interestMeasurementCycle"></ren-radio-group>
            </el-col>
            <el-col :span="6">
              <span class="item-label">还本日是否付息：</span>
              <el-switch
                  v-model="payPlanData.endNeedCount"
                  :disabled="isDisabled"
                  active-text="是"
                  inactive-text="否">
              </el-switch>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="7"><span class="item-label">计息本金：</span></el-col>
                <el-col :span="10"><span class="item-label">{{$numberFormat(issueQuota)}}  {{$getDictLabel('unit',$store.state.unit)}}</span></el-col>
<!--                <el-col :span="17"><money-input :value.sync="repaymentAmount"></money-input></el-col>-->
              </el-row>
            </el-col>
            <el-col :span="6">
              <span class="item-label">中途还本时是否付息：</span>
              <el-switch
                  v-model="payPlanData.isPayPrincipalAndInterest"
                  :disabled="isDisabled"
                  active-text="是"
                  inactive-text="否">
              </el-switch>
            </el-col>
          </el-row>
          <el-row class="table-row">
            <el-col :span="6">
              <span class="item-label">计息利率：</span>
              {{ rateType=='0'?pageType==1?'固定利率':'执行利率':$getDictLabel("interestRatesWay",rateType) }} {{$isNotNull(rate)&& rateType=='0'?`(${rate} %)`:''}}
            </el-col>
            <el-col :span="6" v-show="$isNotNull(principalMethod)">
              <span class="item-label">还本方式：</span>  {{$getDictLabel('serviceCycle',principalMethod)}}
            </el-col>
            <el-col :span="6" v-show="$isNotNull(interestMethod)">
              <span class="item-label">付息方式：</span>  {{$getDictLabel('serviceCycle',interestMethod)}}
            </el-col>
            <el-col :span="6"  v-show="$isNotNull(lprCycle)">
              <span class="item-label">调息周期：</span>{{$getDictLabel('lpr',lprCycle)}}
            </el-col>
          </el-row>
          <el-row class="table-row">
            <el-col :span="6">
              <span class="item-label">起息日：</span>{{ valueDate }}
            </el-col>
            <el-col :span="6">
              <span class="item-label">到期日：</span>{{  dueDate }}
            </el-col>
            <el-col :span="6">
              <span class="item-label">累计支付利息：</span>{{ $numberFormat(interestSum )}} 元
            </el-col>
            <el-col :span="6">
              <span class="item-label">累计还款总额：</span>{{  $numberFormat(totalPayment) }} 元
            </el-col>
          </el-row>
        </template>
        <!-- <vxe-column field="startDate" title="开始日期" ></vxe-column> -->
        <vxe-column field="endDate"
                    title="还款日期"
                    show-overflow
                    :edit-render="{
                                    name: `$input`,
                                    props: {clearable: true, type:'date',disabledMethod:disabledDateMethod},
                                    placeholder:'还款日期',
                                    events: {change: columnChange}
                                  }">
        </vxe-column>
        <!-- <vxe-column field="interest" :title="`偿还利息（元）`" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
            <vxe-input v-model="row.interest" type="text" @blur="columnChange"></vxe-input>
          </template>
          <template #default="{row}">
            {{$numberFormat(row.interest)}}
          </template>
        </vxe-column> -->
        <vxe-column field="repaymentOfPrincipal" :title="`偿还本金（${$getDictLabel('unit',$store.state.unit)}）`" :edit-render="{autofocus: '.vxe-input--inner',events: {change: columnChange}}">
          <template #edit="{ row }">
            <vxe-input v-model="row.repaymentOfPrincipal " type="text" @blur="countPrincipal"></vxe-input>
          </template>
          <template #default="{row}">
            {{$numberFormat(row.repaymentOfPrincipal)}}
          </template>
        </vxe-column>
        <vxe-column field="oddCorpus" :title="`剩余本金（${$getDictLabel('unit',$store.state.unit)}）`" :edit-render="{autofocus: '.vxe-input--inner'}">
          <template #edit="{ row }">
<!--            <vxe-input v-model="row.oddCorpus" type="number"></vxe-input>-->
            {{$numberFormat(row.oddCorpus)}}
          </template>
          <template #default="{row}">
            {{$numberFormat(row.oddCorpus)}}
          </template>
        </vxe-column>
        <!-- <vxe-column field="remark"  title="说明" v-if="rateType=='1'"></vxe-column> -->
        <vxe-column title="操作" v-if="isDisabled===false">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandler(scope)">{{ $t('delete') }}</el-button>
          </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-table>
    <vxe-toolbar class="vxe-toolbar-class" v-show="isDisabled===false">
      <template v-slot:buttons>
        <el-button type="primary" size="small" class="add-upload-btn" @click="addRowReplay" v-show="isDisabled===false" :disabled="payPlanData.payPlan.length>0&&dueDate==payPlanData.payPlan[payPlanData.payPlan.length - 1].endDate">
          <i class="el-icon-document-add el-icon--left"></i>增行
        </el-button>
        <el-button type="primary" size="small" class="add-upload-btn" @click="downloadTemplate" :disabled="dataForm.isDisabled">
          <i class="el-icon-document-add el-icon--left"></i>下载模板
        </el-button>
        <el-button type="primary" size="small" class="add-upload-btn" @click="importBtn" :disabled="dataForm.isDisabled">
          <i class="el-icon-document-add el-icon--left"></i>一键导入
        </el-button>
        <import-template
          :url="importUrl"
          table-width="100%"
          ref="import-template"
          @successHandle="successHandle"></import-template>
        <!-- <el-button type="primary" size="small" class="add-upload-btn" @click="addAllRow" :disabled="dataForm.isDisabled || !$isNotNull(principalMethod) || principalMethod=='0'">
          <i class="el-icon-document-add el-icon--left"></i>一键生成
        </el-button> -->
        <!-- <el-button type="primary" size="small" class="add-upload-btn" @click="testRate" v-show="isDisabled===false">
          <i class="el-icon-edit el-icon--left"></i>利息测算
        </el-button> -->
      </template>
    </vxe-toolbar>
    <template slot="footer">
      <el-button type="primary" @click="getPlan">{{ $t('confirm') }}</el-button>
    </template>
  </div>

</template>
<script>
/* import MoneyInput from '@/components/money-input' */
import ImportTemplate from '@/components/importTemplate'
import qs from 'qs'
import Cookies from 'js-cookie'
export default {
  name: 'financeRepay',
  /* components: { MoneyInput }, */
  components: { ImportTemplate },
  props: {
    // 表单参数
    dataForm: {
      type: Object
    },
    // 是否禁用编辑
    isDisabled: {
      type: Boolean,
      default: true
    },
    // 付息周期
    interestMethod: {
      type: [String],
      default: ''
    },
    // 还本周期
    principalMethod: {
      type: [String],
      default: ''
    },
    // 调息周期
    lprCycle: {
      type: [String],
      default: ''
    },
    // 起息日
    valueDate: {
      type: [String],
      default: ''
    },
    // 到期日
    dueDate: {
      type: [String],
      default: ''
    },
    // 利率方式
    rateType: {
      type: [String, Number],
      default: '0'
    },
    // 利率
    rate: {
      type: [String, Number],
      default: 12.775
    },
    // 本金
    issueQuota: {
      type: [String, Number],
      default: '10000'
    },
    // 上浮利率
    floatRate: {
      type: [String, Number],
      default: 0
    },
    // 获取的还款计划
    payPlanData: {
      type: Object,
      default: () => {
        return {
          // 还款计划
          payPlan: [],
          // 测算周期
          interestMeasurementCycle: 360,
          // 是否结息日算息
          endNeedCount: 0,
          isPayPrincipalAndInterest: 0
        }
      }
    },
    // 直融1 间融2 政府债券3
    pageType: {
      type: [String, Number],
      default: null
    }
  },
  data () {
    return {
      // 当前选中行
      currentRowIndex: 0,
      // 还款金额-》计息本金
      repaymentAmount: null,
      // 利息总和
      interestSum: 0,
      // 累计还款
      totalPayment: 0,
      importUrl: `${window.SITE_CONFIG.apiURL}/financing/excel/importForm?token=${Cookies.get('token')}&templateType=2`
    }
  },
  computed: {
    tableHeight () {
      // 固定表头及动态高度
      var height
      if (this.payPlanData.payPlan.length === 0) {
        height = 257
      } else if (this.payPlanData.payPlan.length > 0 && this.payPlanData.payPlan.length <= 4) {
        height = 209 + 48 * this.payPlanData.payPlan.length
      } else {
        height = 401
      }
      return height + 'px'
    }
  },
  watch: {
    issueQuota () {
      this.repaymentAmount = this.issueQuota
    },
    dataForm () {
      console.log('dataForm', this.dataForm)
    },
    payPlanData (val) {
      console.log('payPlayData改变', val)
      if (this.$isNotNull(this.payPlanData)) {
        if (!this.$isNotNull(this.payPlanData.interestMeasurementCycle)) {
          this.payPlanData.interestMeasurementCycle = 360
        }
      }
    },
    'payPlanData.payPlan': {
      handler (val) {
        console.log('还本数组', val)
        if (this.$isNotNull(val)) {
          this.getRepaymentMoney()
        }
      },
      deep: true
    }
  },
  methods: {
    // 导入成功后需要回填数据
    successHandle (data) {
      // 处理数据
      // 计算每行数据的开始日期，第一行数据的开始日期为起息日，下面的开始日期为上一周期的结束日期 + 1天
      // 计算每行数据的剩余本金，第一行数据的剩余本金为还款金额（-》计息本金） - 本周期偿还本金，下面的剩余本金为上一周期的剩余本金 - 本周期偿还本金
      data.forEach((item, index) => {
        if (index === 0) {
          item.startDate = this.valueDate
          item.oddCorpus = this.issueQuota - item.repaymentOfPrincipal
        } else {
          const lastEndDate = new Date(data[index - 1].endDate).getTime() + 24 * 60 * 60 * 1000
          item.startDate = this.$formatDate(lastEndDate, 'YYYY-MM-DD')
          item.oddCorpus = data[index - 1].oddCorpus - item.repaymentOfPrincipal
        }
      })
      this.payPlanData.payPlan = data
    },
    downloadTemplate () {
      var params = qs.stringify({
        token: Cookies.get('token'),
        templateType: 2,
        unit: this.$store.state.unit
      })
      window.location.href = `${window.SITE_CONFIG.apiURL}/financing/excel/exportFormTemplate?${params}`
    },
    importBtn () {
      // 显示文件上传组件
      this.$refs['import-template'].fileDialogVisible = true
    },
    getRepaymentMoney () {
      var interestSum = 0
      var totalPayment = 0
      this.payPlanData.payPlan.forEach(item => {
        totalPayment = totalPayment + Number(item.repaymentOfPrincipal ? item.repaymentOfPrincipal : 0)
      })
      /*this.payPlanData.payPlan1.forEach(item => {
        interestSum += Number(item.interest ? item.interest : 0)
      })*/
      this.interestSum = interestSum
      // 由于利息单位固定为元，所以当页面单位为万元时，计算累计还款时需将偿还本金乘以10000，再加上利息
      if (this.$store.state.unit == '2') {
        this.totalPayment = totalPayment * 10000 + interestSum
      } else {
        this.totalPayment = totalPayment + interestSum
      }
    },
    columnChange (val) {
      console.log(this.currentRowIndex)
      const list = this.payPlanData.payPlan
      this.interestSum = 0
      for (let i = 0; i < list.length; i++) {
        if (i === this.currentRowIndex) {
          console.log('更新当前行', i, this.currentRowIndex, val)
          if (this.$isNotNull(val.value)) {
            this.interestSum = this.interestSum + Number(val.value)
            console.log('更新当前行利息汇总', this.interestSum)
          }
        } else {
          if (this.$isNotNull(list[i].interest)) {
            this.interestSum = this.interestSum + Number(list[i].interest)
            console.log('更新其他行', this.interestSum)
          }
        }
        this.totalPayment = Number(this.issueQuota) + Number(this.interestSum)
      }
    },
    // 偿还本金录入值 需要 修改剩余本金
    countPrincipal (val) {
      if (val.value == '') val.value = 0
      const list = this.payPlanData.payPlan
      this.interestSum = 0
      let total = Number(this.issueQuota)
      for (let i = 0; i < list.length; i++) {
        // if (!this.$isNotNull(list[i].repaymentOfPrincipal)) {
        //   continue
        // }
        if (i === this.currentRowIndex) {
          // if (this.$isNotNull(val.value)) {
          list[i].oddCorpus = total - Number(val.value)
          total = total - Number(list[i].repaymentOfPrincipal)
          // }
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
        endNeedCount: 0,
        // 还本付息
        isPayPrincipalAndInterest: 0
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
      // 起息日
      if (this.$isNotNull(this.valueDate) && this.currentRowIndex === 0) {
        const valueDate = new Date(this.valueDate).getTime()
        const startTime = date.getTime()
        return startTime - valueDate + 24 * 60 * 60 * 1000 < 0
      } else if (this.currentRowIndex > 0) {
        console.log('第二行以后的结束时间：', this.payPlanData.payPlan[this.currentRowIndex - 1].endDate)
        const valueDate = new Date(this.payPlanData.payPlan[this.currentRowIndex - 1].endDate).getTime() + 24 * 60 * 60 * 1000
        const startTime = date.getTime()
        return startTime - valueDate + 24 * 60 * 60 * 1000 < 0
      }
      return false
    },
    // 禁用不符合条件的结束日期
    disabledDateMethod ({ date }) {
      const endTime = date.getTime()
      const startDate = this.payPlanData.payPlan[this.currentRowIndex].startDate
      let dueDate = endTime + 365 * 10 * 24 * 60 * 60 * 1000
      if (this.$isNotNull(this.dueDate)) {
        // 到期日
        dueDate = new Date(this.dueDate).getTime()
      }
      if (this.$isNotNull(startDate)) {
        const startTime = new Date(startDate).getTime()
        return endTime - startTime < 0 || dueDate - endTime < 0
      } else {
        return false
      }
    },
    async testRate () {
      console.log(this.dataForm, this.payPlanData.payPlan)
      const text = ['', '直融信息', '间接融资信息', '政府债券信息'][Number(this.pageType)]
      const text2 = ['', '折合人民币金额', '提款金额', '融资金额'][Number(this.pageType)]
      const text3 = ['', '起息日', '起息日', '放款日期'][Number(this.pageType)]
      const text4 = ['', '到期日', '到期日', '还款日期'][Number(this.pageType)]
      if (!this.$isNotNull(this.issueQuota)) {
        return this.$message.error(`请录入${text}中的${text2}`)
      }
      if (!this.$isNotNull(this.rateType)) {
        return this.$message.error(`请录入${text}计息利率`)
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
      if (this.pageType == 2) {
        var params = {}
        params.interestWayRate = this.dataForm.interestRatesWay
        params.rate = this.dataForm.rate
        params.lprCycle = this.dataForm.lprCycle
        params.floatRate = this.dataForm.floatRate
        params.loanDate = this.dataForm.loanDate
        params.repaymentDate = this.dataForm.repaymentDate
        params.withdrawalAmount = this.dataForm.withdrawalAmount
        params.payPlanData = {
          payPlan: this.payPlanData.payPlan,
          interestMeasurementCycle: this.payPlanData.interestMeasurementCycle,
          endNeedCount: this.payPlanData.endNeedCount ? 1 : 0,
          isPayPrincipalAndInterest: this.payPlanData.isPayPrincipalAndInterest ? 1 : 0
        }
        console.log(params)
        const { data } = await this.$http.post('/financing/findirectfinancing/interest', params)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.payPlanData.payPlan = data.data.payPlanData.payPlan
      } else {
        this.testRate1()
      }
    },
    // 测算利息
    testRate1 () {
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
        const remark = []
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
              remark.push(`${step.lpr.startFormat} 至 ${end}： LPR ${numberYear} 年期利率为： ${step.lpr[attr]}% ,上浮利率为：${this.floatRate}%，本次还款计息天数为： ${step.ceilDay}天 ，利息为： ${_interest}元 `)
            }
          }
          // console.log('跨了几个阶段：', stepList, interest)
        }
        item.remark = remark.join('。')
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
          // 总还款金额（-》计息本金）为 总还款-剩余本金+已产生的利息
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
    addRowReplay () {
      console.log('还本计划', this.dataForm)

      const text = ['', '直融信息', '间接融资信息', '政府债券信息'][Number(this.pageType)]
      const text3 = ['', '起息日', '起息日', '放款日期'][Number(this.pageType)]
      const text4 = ['', '到期日', '到期日', '还款日期'][Number(this.pageType)]
      if (!this.$isNotNull(this.valueDate)) {
        return this.$message.error(`请录入${text}中的${text3}`)
      }

      if (!this.$isNotNull(this.dueDate)) {
        return this.$message.error(`请录入${text}中的${text4}`)
      }
      if (!this.$isNotNull(this.payPlanData.payPlan)) {
        this.payPlanData.payPlan = []
      }
      let startDate = ''
      console.log(1,this.payPlanData.payPlan)
      if (this.payPlanData.payPlan.length > 0) {
        if (this.payPlanData.payPlan[this.payPlanData.payPlan.length - 1].endDate == '') {
          this.$message.error('请输入还款日期')
          return
        }
        // 当前周期开始日期默认为上一周期结束日期+一天
        const lastEndDate = new Date(this.payPlanData.payPlan[this.payPlanData.payPlan.length - 1].endDate).getTime() + 24 * 60 * 60 * 1000
        startDate = this.$formatDate(lastEndDate, 'YYYY-MM-DD')
      } else {
        startDate = this.valueDate
      }
      // let startDate = this.payPlanData.payPlan.length===0?this.valueDate: new Date(this.payPlanData.payPlan[this.payPlanData.payPlan.length-1].endDate).getTime()+ 24*60*60*1000
      // 自动计算结束日期
      var endDate = ''
      // 还本方式不为空也不为其他时，结束日期=起息日+（还本方式对应值*（还本阶段数组长度+1））个月
      if (!(!this.dataForm.principalMethod || this.dataForm.principalMethod == 0)) {
        endDate = this.$addMonths(this.valueDate, parseInt(this.dataForm.principalMethod) * (this.payPlanData.payPlan.length + 1))
        // 如果结束日期>还款日期，则结束日期=还款日期
        if (this.pageType == 1) {
          if (parseInt(this.dataForm.dueDate.split('-').join('')) < parseInt(endDate.split('-').join(''))) {
            endDate = this.dataForm.dueDate
          }
        } else {
          console.log('===', parseInt(this.dataForm.repaymentDate.split('-').join('')), parseInt(endDate.split('-').join('')))
          if (parseInt(this.dataForm.repaymentDate.split('-').join('')) < parseInt(endDate.split('-').join(''))) {
            endDate = this.dataForm.repaymentDate
          }
        }
      }
      console.log(this.dataForm.repaymentDate,this.dataForm.dueDate)
      if (this.dataForm.repaymentDate || this.dataForm.dueDate) {
        console.log("endDate",endDate)
        this.payPlanData.payPlan.push(
          {
            startDate: startDate,
            endDate: endDate,
            // 偿还利息
            interest: '',
            // 偿还本金
            repaymentOfPrincipal: '',
            // 剩余本金
            oddCorpus: '',
            // 说明
            remark: ''
          }
        )
      }
    },
    addAllRow () {
      const text = ['', '直融信息', '间接融资信息', '政府债券信息'][Number(this.pageType)]
      const text3 = ['', '起息日', '起息日', '放款日期'][Number(this.pageType)]
      const text4 = ['', '到期日', '到期日', '还款日期'][Number(this.pageType)]
      if (!this.$isNotNull(this.valueDate)) {
        return this.$message.error(`请录入${text}中的${text3}`)
      }

      if (!this.$isNotNull(this.dueDate)) {
        return this.$message.error(`请录入${text}中的${text4}`)
      }
      console.log('起息日', this.valueDate, '到期日', this.dueDate, '还本方式', this.principalMethod)
      this.payPlanData.payPlan = []
      this.getAllPlan()
    },
    // 递归获取所有的还本计划
    getAllPlan () {
      var startDate = ''
      var endDate = ''
      if (this.payPlanData.payPlan.length == 0) {
        // 还本计划数组为空时，开始日期等于起息日，结束日期 = 开始日期 + 还本周期
        startDate = this.valueDate
        endDate = this.$addMonths(startDate, this.principalMethod)
      } else {
        // 还本计划数组不为空时，开始日期 = 上一周期的结束日期 + 1天
        const lastEndDate = new Date(this.payPlanData.payPlan[this.payPlanData.payPlan.length - 1].endDate).getTime() + 24 * 60 * 60 * 1000
        startDate = this.$formatDate(lastEndDate, 'YYYY-MM-DD')
        endDate = this.$addMonths(this.valueDate, this.principalMethod * (this.payPlanData.payPlan.length + 1))
      }
      // 结束日期大于到期日，则到了最后一个周期，结束日期等于到期日，跳出递归
      if (parseInt(this.dueDate.split('-').join('')) <= parseInt(endDate.split('-').join(''))) {
        endDate = this.dueDate
        this.payPlanData.payPlan.push(
          {
            startDate: startDate,
            endDate: endDate,
            // 偿还利息
            interest: '',
            // 偿还本金
            repaymentOfPrincipal: '',
            // 剩余本金
            oddCorpus: '',
            // 说明
            remark: ''
          }
        )
      } else {
        this.payPlanData.payPlan.push(
          {
            startDate: startDate,
            endDate: endDate,
            // 偿还利息
            interest: '',
            // 偿还本金
            repaymentOfPrincipal: '',
            // 剩余本金
            oddCorpus: '',
            // 说明
            remark: ''
          }
        )
        this.getAllPlan()
      }
    },
    // 获取还款计划内容
    getPlan () {
      console.log('测试')
      this.payPlanData.payPlan = this.payPlanData.payPlan.filter(item => !this.$isNotNull(item.startDate) || !this.$isNotNull(item.endDate))

      this.$emit('plan', this.payPlanData)
    },
    // 删除当前行
    deleteHandler (scope) {
      // console.log(this.payPlanData.payPlan)
      if (scope.rowIndex != this.payPlanData.payPlan.length - 1) {
        // 删除前修改下一周期的开始日期为当前删除周期的开始日期
        this.payPlanData.payPlan[scope.rowIndex + 1].startDate = this.payPlanData.payPlan[scope.rowIndex].startDate
        // 删除前修改后面周期的剩余本金：剩余本金 = 原剩余本金 + 当前删除周期的偿还本金
        for (var i = scope.rowIndex + 1; i <= this.payPlanData.payPlan.length - 1; i++) {
          this.payPlanData.payPlan[i].oddCorpus = Number(this.payPlanData.payPlan[i].oddCorpus) + Number(this.payPlanData.payPlan[scope.rowIndex].repaymentOfPrincipal)
        }
      }
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
