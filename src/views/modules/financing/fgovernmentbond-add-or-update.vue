<template>
<!--  政府债券编辑-->
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
             width="80%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-row class="menu-row">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="form-menu-item">政府债券信息</el-menu-item>
        <el-menu-item index="2" class="form-menu-item">还本计划</el-menu-item>
        <el-menu-item index="5" class="form-menu-item" :disabled="!$isNotNull(dataForm.id)">实际还本</el-menu-item>
        <el-menu-item index="3" class="form-menu-item">还息计划</el-menu-item>
        <el-menu-item index="6" class="form-menu-item" :disabled="!$isNotNull(dataForm.id)">实际还息</el-menu-item>
      </el-menu>
    </el-row>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             v-show="activeIndex=='1'"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
      <el-row>

        <el-col :span="6">
          <el-form-item label="融资品种：" prop="varieties" class="p-left-80">
            <ren-select v-model="dataForm.varieties"
                        :disabled="dataForm.isDisabled"
                        dict-type="varieties" placeholder="融资品种"  class="col-input"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- <el-form-item label="融资主体：" prop="deptName"  class="p-left-80">
            <el-input v-model="dataForm.deptName"
                      :disabled="dataForm.isDisabled"
                      placeholder="融资主体" class="col-input"></el-input>
          </el-form-item> -->
          <el-form-item label="金融机构（银行）：" prop="institution" class="p-left-110">
            <finance-dept-tree
                v-model="dataForm.institution"
                :dept-name="dataForm.institutionName"
                :disabled="dataForm.isDisabled"
                placeholder="金融机构"
            ></finance-dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用款主体：" prop="deptName" class="p-left-80">
            <el-input
                v-if="dataForm.id != undefined"
                v-model="dataForm.deptName"
                :disabled="true"
                class="col-input"
            ></el-input>
            <ren-dept-tree
                v-if="dataForm.id == undefined"
                v-model="dataForm.deptId"
                placeholder="用款主体"
                class="col-input"
                :dept-name.sync="dataForm.deptName"
            ></ren-dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="融资金额：" prop="financingAmount" class="p-left-80">
            <money-input  :value.sync="dataForm.financingAmount"
                          :edit-display-value="dataForm.financingAmountText"
                          :is-disabled="dataForm.isDisabled"
                          :suffix="$getDictLabel('unit',$store.state.unit)"
                          placeholder="融资金额"></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="6">
          <el-form-item label="利率：" prop="rate"  class="p-left-50">
            <el-input v-model="dataForm.rate"
                      :disabled="dataForm.isDisabled"
                      class="el-input-right" placeholder="利率"
                      @blur="formatNumber">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起息日：" prop="loanDate"  class="p-left-80">
            <el-date-picker v-model="dataForm.loanDate"
                            :disabled="dataForm.isDisabled"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="起息日"
                            class="col-input"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" prop="repaymentDate" class="p-left-80">
            <el-date-picker v-model="dataForm.repaymentDate"
                            :disabled="dataForm.isDisabled"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="到期日"
                            class="col-input"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还本付息：" prop="isPayPrincipalAndInterest" class="p-left-80">
            <ren-radio-group  v-model="dataForm.isPayPrincipalAndInterest"
                              :disabled="dataForm.isDisabled"
                              dict-type="isPayPrincipalAndInterest"></ren-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

         <el-col :span="6">
          <el-form-item label="还本方式：" prop="principalMethod"  class="p-left-80">
            <ren-select v-model="dataForm.principalMethod"
                        :disabled="dataForm.isDisabled"
                        dict-type="serviceCycle" style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付息方式：" prop="interestMethod"  class="p-left-80">
            <ren-select v-model="dataForm.interestMethod"
                        :disabled="dataForm.isDisabled"
                        dict-type="serviceCycle" style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="融资余额：" prop="financingBalance" class="p-left-80">
            <money-input :value.sync="dataForm.financingBalance"
                         :edit-display-value="dataForm.financingBalanceText"
                         :is-disabled="dataForm.isDisabled"
                          :suffix="$getDictLabel('unit',$store.state.unit)"
                         placeholder="融资余额"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际还款：" prop="actualRepayment" class="p-left-80">
            <money-input :value.sync="dataForm.actualRepayment"
                         :edit-display-value="dataForm.actualRepayment"
                         :is-disabled="true"
                          :suffix="$getDictLabel('unit',$store.state.unit)"
                         placeholder=""></money-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="用款项目：" prop="project" class="p-left-50">
            <el-input v-model="dataForm.project"
                      :disabled="dataForm.isDisabled"
                      placeholder="用款项目"
                      class="col-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <finance-credit-reporting-measures :disabled="dataForm.isDisabled" :data-form="dataForm" :rmb="dataForm.financingAmount"></finance-credit-reporting-measures>
      <el-row>
        <el-form-item label="决策依据：" prop="decisionBasis" class="p-left-80">
          <el-input type="textarea"
                    placeholder="决策依据"
                    v-model="dataForm.decisionBasis"
                    :disabled="dataForm.isDisabled"
                    maxlength="200"
                    class="col-input"
                    show-word-limi></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：" prop="remarks" class="p-left-50">
          <el-input type="textarea"
                    placeholder="备注"
                    v-model="dataForm.remarks"
                    :disabled="dataForm.isDisabled"
                    maxlength="200"
                    show-word-limi
                    class="col-input"></el-input>
        </el-form-item>
      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload :disabled="dataForm.isDisabled"
                      :data-form="dataForm"
                      table-width="100%"
                      ref="finance-upload"></finance-upload>
    </el-form>
    <!-- <finance-repay  v-show="activeIndex=='2'"
                    :page-type="3"
                    :value-date="dataForm.loanDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.repaymentDate"
                    rate-type="0"
                    :issue-quota="dataForm.financingAmount"
                    :data-form="dataForm"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="dataForm.isDisabled"></finance-repay> -->
    <finance-repay  v-show="activeIndex=='2'"
                    :page-type="3"
                    :value-date="dataForm.loanDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.repaymentDate"
                    rate-type="0"
                    :issue-quota="dataForm.financingAmount"
                    :data-form="dataForm"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="dataForm.isDisabled"
                    ref="paymentTable"></finance-repay>
    <finance-repay-interest  v-show="activeIndex=='3'"
                    :page-type="3"
                    :value-date="dataForm.loanDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.repaymentDate"
                    rate-type="0"
                    :issue-quota="dataForm.financingAmount"
                    :data-form="dataForm"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="dataForm.isDisabled"
                    ref="paymentInterestTable"></finance-repay-interest>
    <finance-repay-real v-show="activeIndex=='5'"
                        ref="finance-repay-real"
                        :data-form="dataForm"
                        :total-principal-actual="dataForm.payActualData.totalRepayPrincipalActual"
                        :total-interest-actual="dataForm.payActualData.totalRepayInterestActual"
                        :params-list="dataForm.payActualData.repayPrincipalActualList"
                        :value-date="dataForm.valueDate"
                        type="1"
                        financing-type="1"></finance-repay-real>
    <finance-repay-real v-show="activeIndex=='6'"
                        ref="finance-Interest-real"
                        :data-form="dataForm"
                        :total-principal-actual="dataForm.payActualData.totalRepayPrincipalActual"
                        :total-interest-actual="dataForm.payActualData.totalRepayInterestActual"
                        :params-list="dataForm.payActualData.repayInterestActualList"
                        :value-date="dataForm.valueDate"
                        type="2"
                        financing-type="1"></finance-repay-real>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" :disabled="dataForm.isDisabled" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceCreditReportingMeasures from '@/components/finance-credit-reporting-measures'
import FinanceUpload from '@/components/finance-upload'
import FinanceRepay from '@/components/finance-repay'
import FinanceRepayInterest from '@/components/finance-repay-interest'
import MoneyInput from '@/components/money-input'
import FinanceRepayReal from '@/components/finance-repay-real'
export default {
  components: { MoneyInput, FinanceRepay, FinanceUpload, FinanceCreditReportingMeasures, FinanceRepayInterest, FinanceRepayReal },
  data () {
    return {
      visible: false,
      activeIndex: '1',
      dataForm: {
        // 审核通过就禁用
        isDisabled: false,
        // 主键
        id: '',
        // 用款主体Id
        deptId: '',
        // 用款主体名称
        deptName: '',
        // 融资主体-》金融机构（银行）Id
        institution: '',
        // 融资主体-》金融机构（银行）
        institutionName: '',
        // 融资品种
        varieties: '',
        // 融资金额
        financingAmount: '',
        // 融资金额回显
        financingAmountText: '',
        // 利率
        rate: '',
        // 放款日期-》起息日
        loanDate: '',
        // 还款日期-》到期日
        repaymentDate: '',
        // 付息方式
        interestMethod: '',
        // 还本方式
        principalMethod: '',
        // 融资余额
        financingBalance: '',
        // 融资余额
        financingBalanceText: '',
        actualRepayment: '',
        // 项目-》用款项目
        project: '',
        // 决策依据
        decisionBasis: '',
        // 备注
        remarks: '',
        // 附件上传
        fileList: [],
        // 增信措施
        creditMeasures: [],
        // 增信措施详情
        guaranteeInfo: {
          // 保证
          guarantee: [],
          // 抵押
          collateral: [],
          // 质押
          pledge: [],
          // 增信措施详情
          id: ''
        },
        // 还款计划
        payPlanData: {
          // 还本计划
          payPlan: [],
          // 还息计划
          payPlan1: [],
          // 测算周期
          interestMeasurementCycle: 360,
          // 是否结息日算息
          endNeedCount: 0,
          // 是否还本付息
          isPayPrincipalAndInterest: 0
        },
        // 实际还款信息
        payActualData: {
          totalRepayInterestActual: 0,
          totalRepayPrincipalActual: 0,
          totalRepaymentActual: 0,
          repayPrincipalActualList: [],
          repayInterestActualList: []
        }

      }
    }
  },
  computed: {
    dataRule () {
      return {
        varieties: [
          { required: true, message: '请选择融资品种', trigger: 'change' }
        ],
        financingAmount: [
          { required: true, message: '请输入融资余额', trigger: 'blur' }
        ],
        rate: [
          { required: true, message: '请输入年利率', trigger: 'blur' }
        ],
        loanDate: [
          { required: true, message: '请输入起息日', trigger: 'change' }
        ],
        repaymentDate: [
          { required: true, message: '请输入到期日', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    visible: function (newVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },
  methods: {
    formatNumber () {
      this.dataForm.rate = this.$isNotNull(this.dataForm.rate) && this.dataForm.rate != 0 ? Number(this.dataForm.rate).toFixed(4) : 0
    },
    async init () {
      this.activeIndex = '1'
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.$refs['finance-upload'].init()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    resetData () {
      this.dataForm = {
        // 审核通过就禁用
        isDisabled: false,
        // 主键
        id: '',
        // 用款主体Id
        deptId: '',
        // 用款主体名称
        deptName: '',
        // 融资品种
        varieties: '',
        // 融资主体-》金融机构（银行）Id
        institution: '',
        // 融资主体-》金融机构（银行）
        institutionName: '',
        // 融资金额
        financingAmount: '',
        // 融资金额回显
        financingAmountText: '',
        // 利率
        rate: '',
        // 放款日期-》起息日
        loanDate: '',
        // 还款日期-》到期日
        repaymentDate: '',
        // 付息方式
        interestMethod: '',
        // 还本方式
        principalMethod: '',
        // 融资余额
        financingBalance: '',
        actualRepayment: '',
        // 融资余额
        financingBalanceText: '',
        // 项目-》用款项目
        project: '',
        // 决策依据
        decisionBasis: '',
        // 备注
        remarks: '',
        // 附件上传
        fileList: [],
        // 增信措施
        creditMeasures: [],
        // 增信措施详情
        guaranteeInfo: {
          // 保证
          guarantee: [],
          // 抵押
          collateral: [],
          // 质押
          pledge: [],
          // 增信措施详情
          id: ''
        },
        // 还款计划
        payPlanData: {
          // 还本计划
          payPlan: [],
          // 还息计划
          payPlan1: [],
          // 测算周期
          interestMeasurementCycle: 360,
          // 是否结息日算息
          endNeedCount: 0,
          // 是否还本付息
          isPayPrincipalAndInterest: 0
        },
        // 实际还款信息
        payActualData: {
          totalRepayInterestActual: 0,
          totalRepayPrincipalActual: 0,
          totalRepaymentActual: 0,
          repayPrincipalActualList: [],
          repayInterestActualList: []
        }
      }
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/fgovernmentbond/' + this.dataForm.id + '/' + this.$store.state.unit)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        // 融资金额
        _data.financingAmountText = _data.financingAmount
        // 融资余额
        _data.financingBalanceText = _data.financingBalance
        if (!this.$isNotNull(_data.guaranteeInfo)) {
          _data.guaranteeInfo = {
            // 保证
            guarantee: [],
            // 抵押
            collateral: [],
            // 质押
            pledge: [],
            // 增信措施详情
            id: ''
          }
        }
        // 增信措施详情-保证
        _data.guaranteeInfo?.guarantee?.map(item => {
          item.contractAmountText = item.contractAmount
        })
        // 增信措施详情-抵押
        _data.guaranteeInfo?.collateral?.map(item => {
          item.collateralAmountText = item.collateralAmount
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 0) {
            item.releaseTime[0] = new Date(item.releaseTime[0])
          }
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 1) {
            item.releaseTime[1] = new Date(item.releaseTime[1])
          }
        })
        // 增信措施详情-质押
        _data.guaranteeInfo?.pledge?.map(item => {
          item.pledgeAmountText = item.pledgeAmount
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 0) {
            item.releaseTime[0] = new Date(item.releaseTime[0])
          }
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 1) {
            item.releaseTime[1] = new Date(item.releaseTime[1])
          }
        })
        _data.creditMeasures = this.$isNotNull(_data.creditMeasures) ? _data.creditMeasures.split(',') : []
        if (this.$isNotNull(_data.payPlanData)) {
          _data.payPlanData.endNeedCount = _data.payPlanData.endNeedCount !== 0
          _data.payPlanData.isPayPrincipalAndInterest = _data.payPlanData.isPayPrincipalAndInterest !== 0
          _data.payPlanData.payPlan = this.$isNotNull(_data.payPlanData.repayPrincipalPlanList) ? _data.payPlanData.repayPrincipalPlanList : []
          _data.payPlanData.payPlan1 = this.$isNotNull(_data.payPlanData.repayInterestActualList) ? _data.payPlanData.repayInterestActualList : []
        } else {
          _data.payPlanData = {
            // 还本计划
            payPlan: [],
            // 还息计划
            payPlan1: [],
            // 测算周期
            interestMeasurementCycle: 360,
            // 是否结息日算息
            endNeedCount: 0,
            isPayPrincipalAndInterest: 0
          }
        }
        _data.isDisabled = _data.isChecked == '1'
        _data.fileList = this.$isNotNull(_data.fileList) ? _data.fileList : []
        this.dataForm = _data
        this.formatNumber()
      } catch (e) {
        console.log('getInfo-e:', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs.dataForm.validate(async (valid) => {
          if (!valid) {
            return false
          }
          try {
            // const params = { ...this.dataForm }
            const params = JSON.parse(JSON.stringify(this.dataForm))
            console.log(params)
            params.creditMeasuresList = params.creditMeasures
            delete params.creditMeasures
            params.payPlanData.endNeedCount = params.payPlanData.endNeedCount === true ? 1 : 0
            params.payPlanData.isPayPrincipalAndInterest = params.payPlanData.isPayPrincipalAndInterest === true ? 1 : 0
            params.unit = this.$store.state.unit
            params.payPlanData.repayPrincipalPlanList = params.payPlanData.payPlan ? params.payPlanData.payPlan : []
            // 循环repayPrincipalPlanList数组，删除对象的desc、interset属性
            params.payPlanData.repayPrincipalPlanList.forEach(item => {
              delete item.desc
              delete item.interest
              delete item.remark
            })
            // 还息数组只需要传给后台planType=2的数据，planType=1是还本付息产生的利息，只是展示作用
            params.payPlanData.repayInterestPlanList = params.payPlanData.payPlan1.filter(item => item.planType != 1)
            // 循环repayInterestPlanList数组，删除对象的desc、interest属性
            params.payPlanData.repayInterestPlanList.forEach(item => {
              delete item.oddCorpus
              delete item.repaymentOfPrincipal
            })
            // 删除payPlanData的payPlan、payPlan1对象
            delete params.payPlanData.payPlan
            delete params.payPlanData.payPlan1
            this.$nextTick(() => {
              if (this.activeIndex == '5') {
                const object = this.$refs['finance-repay-real'].getRealList()
                params.payActualData = object
              } else if (this.activeIndex == '6') {
                const object = this.$refs['finance-Interest-real'].getRealList()
                params.payActualData = object
              }
            })
            console.log('政府债券提交参数', params)
            const { data } = await this.$http[!this.dataForm.id ? 'post' : 'put']('/financing/fgovernmentbond/', params)
            if (data.code !== 0) {
              return this.$message.error(data.msg)
            }
            this.$message.success(this.$t('prompt.success'))
            setTimeout(() => {
              this.visible = false
            }, 500)
            this.$emit('refreshDataList')
          } catch (e) {

          }
        })
      },
      1000,
      { leading: true, trailing: false }
    ),
    // tab切换
    handleSelect (val) {
      if (this.activeIndex == 5 && val != 5) {
        const list = this.$refs['finance-repay-real'].getRealList()
        if (this.$isNotNull(this.dataForm.id) && this.$isNotNull(list.repayPrincipalActualList)) {
          this.dataForm.payActualData = list
        }
      }
      if (this.activeIndex == 6 && val != 6) {
        const list = this.$refs['finance-Interest-real'].getRealList()
        if (this.$isNotNull(this.dataForm.id) && this.$isNotNull(list.repayInterestActualList)) {
          this.dataForm.payActualData = list
        }
      }
      if (val == 5) {
        console.log('实际还本')
        this.$nextTick(() => {
          this.$refs['finance-repay-real'].init()
        })
      }
      if (val == 6) {
        console.log('实际还息')
        this.$nextTick(() => {
          this.$refs['finance-Interest-real'].init()
        })
      }
      this.activeIndex = val
      if (val == 2) this.$refs.paymentTable.getRepaymentMoney()
      if (val == 3) this.$refs.paymentInterestTable.getRepaymentMoney()
    }
  }
}
</script>
