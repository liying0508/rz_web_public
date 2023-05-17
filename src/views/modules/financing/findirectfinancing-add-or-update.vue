<template>
  <!--  间接融资编辑-->
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
    width="80%"
    class="form-el-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-row class="menu-row">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1" class="form-menu-item"
          >间接融资信息</el-menu-item
        >
        <el-menu-item index="2" class="form-menu-item">还本计划</el-menu-item>
        <el-menu-item index="5" class="form-menu-item" :disabled="!$isNotNull(dataForm.id)">实际还本</el-menu-item>
        <el-menu-item index="3" class="form-menu-item">还息计划</el-menu-item>
        <el-menu-item index="6" class="form-menu-item" :disabled="!$isNotNull(dataForm.id)">实际还息</el-menu-item>

      </el-menu>
    </el-row>
    <el-form
      :model="dataForm"
      :rules="dataRule"
      v-show="activeIndex == '1'"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      class="custom-form"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="融资单位：" prop="deptName" class="p-left-80">
            <el-input
              v-if="dataForm.id != undefined"
              v-model="dataForm.deptName"
              :disabled="true"
              class="col-input"
            ></el-input>
            <ren-dept-tree
              v-if="dataForm.id == undefined"
              v-model="dataForm.deptId"
              placeholder="融资单位"
              class="col-input"
              :dept-name.sync="dataForm.deptName"
            ></ren-dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="金融机构类型："
            prop="institutionType"
            class="p-left-110"
          >
            <ren-radio-group
              v-model="dataForm.institutionType"
              :disabled="dataForm.isDisabled"
              dict-type="finance_dept_type"
            ></ren-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="金融机构：" prop="institution" class="p-left-80">
            <finance-dept-tree
              v-model="dataForm.institution"
              :dept-name="dataForm.institutionName"
              :disabled="dataForm.isDisabled"
              placeholder="金融机构"
            ></finance-dept-tree>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="融资品种：" prop="varieties" class="p-left-80">
            <ren-select
              v-model="dataForm.varieties"
              :disabled="dataForm.isDisabled"
              dict-type="varieties"
              class="col-input"
            ></ren-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="6"
          v-if="dataForm.varieties == 2 || dataForm.varieties == 3"
        >
          <el-form-item
            label="保证金比例："
            prop="marginRatio"
            class="p-left-80"
          >
            <el-input
              v-model="dataForm.marginRatio"
              :disabled="dataForm.isDisabled"
              class="el-input-right"
              placeholder="保证金比例"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          v-if="dataForm.varieties == 2 || dataForm.varieties == 3"
        >
          <el-form-item label="贴现率：" prop="discountRate" class="p-left-70">
            <el-input
              v-model="dataForm.discountRate"
              :disabled="dataForm.isDisabled"
              class="el-input-right"
              placeholder="贴现率"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目：" prop="project" class="p-left-50">
            <el-input
              v-model="dataForm.project"
              :disabled="dataForm.isDisabled"
              placeholder="项目"
              class="col-input"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="利率类型："
            prop="interestRatesWay"
            class="p-left-80"
          >
            <ren-radio-group
              v-model="dataForm.interestRatesWay"
              :disabled="dataForm.isDisabled"
              dict-type="interestRatesWay"
            ></ren-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-show="dataForm.interestRatesWay == '1'"
            label="调息周期："
            prop="lprCycle"
            class="p-left-80"
          >
            <ren-select
              v-model="dataForm.lprCycle"
              :disabled="dataForm.isDisabled"
              dict-type="lpr"
              class="col-input"
            ></ren-select>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">
          <el-form-item
            v-show="dataForm.interestRatesWay == '0'"
            label="基准利率："
            prop="rate"
            class="p-left-80"
          >
            <el-input
              v-model="dataForm.rate"
              :disabled="dataForm.isDisabled"
              class="el-input-right"
              @blur="formatNumber"
              placeholder="基准利率"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="浮动利率：" prop="floatRate" class="p-left-80">
            <el-input
              v-model="dataForm.floatRate"
              :disabled="dataForm.isDisabled"
              class="el-input-right"
              @blur="formatNumber"
              placeholder="浮动利率"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>-->
        <el-col :span="6" v-show="dataForm.interestRatesWay == '1'">
          <el-form-item
            label="lpr利息周期："
            prop="lprInterestCycle"
            class="p-left-80"
          >
            <ren-select
              v-model="dataForm.lprInterestCycle"
              :disabled="dataForm.isDisabled"
              dict-type="lprInterestCycle"
              class="col-input"
            ></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-show="dataForm.interestRatesWay == '0'"
            label="执行利率："
            prop="rate"
            class="p-left-80"
          >
            <el-input
              v-model="dataForm.rate"
              :disabled="dataForm.isDisabled"
              class="el-input-right"
              @blur="formatNumber"
              placeholder="执行利率"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="合同编号：" prop="contractNo" class="p-left-80">
            <el-input
              v-model="dataForm.contractNo"
              :disabled="dataForm.isDisabled"
              placeholder="合同编号"
              class="col-input"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="合同金额："
            prop="contractAmount"
            class="p-left-80"
          >
            <money-input
              :value.sync="dataForm.contractAmount"
              :edit-display-value="dataForm.contractAmountText"
              :is-disabled="dataForm.isDisabled"
              @blur="countBalance"
              :suffix="$getDictLabel('unit', $store.state.unit)"
              placeholder="合同金额"
            ></money-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          v-if="dataForm.varieties == 2 || dataForm.varieties == 3"
        >
          <el-form-item
            label="开票金额："
            prop="invoiceAmount"
            class="p-left-80"
          >
            <money-input
              :value.sync="dataForm.invoiceAmount"
              :edit-display-value="dataForm.invoiceAmountText"
              :is-disabled="dataForm.isDisabled"
              @blur="countBalance"
              :suffix="$getDictLabel('unit', $store.state.unit)"
              placeholder="开票金额"
            ></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="提款金额："
            prop="withdrawalAmount"
            class="p-left-80"
          >
            <money-input
              :value.sync="dataForm.withdrawalAmount"
              :edit-display-value="dataForm.withdrawalAmountText"
              :is-disabled="dataForm.isDisabled"
              :suffix="$getDictLabel('unit', $store.state.unit)"
              placeholder="提款金额"
            ></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="还本方式："
            prop="principalMethod"
            class="p-left-80"
          >
            <ren-select
              v-model="dataForm.principalMethod"
              :disabled="dataForm.isDisabled"
              dict-type="serviceCycle"
              style="width: 100%"
            ></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="付息方式："
            prop="interestMethod"
            class="p-left-80"
          >
            <ren-select
              v-model="dataForm.interestMethod"
              :disabled="dataForm.isDisabled"
              dict-type="serviceCycle"
              style="width: 100%"
            ></ren-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="付息周期：" prop="serviceCycle"  class="p-left-80">
            <ren-select v-model="dataForm.serviceCycle"
                        :disabled="dataForm.isDisabled"
                        dict-type="serviceCycle" style="width: 100%"></ren-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="起息日：" prop="loanDate" class="p-left-80">
            <el-date-picker
              v-model="dataForm.loanDate"
              :disabled="dataForm.isDisabled"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="起息日"
              class="col-input"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" prop="repaymentDate" class="p-left-80">
            <el-date-picker
              v-model="dataForm.repaymentDate"
              :disabled="dataForm.isDisabled"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="到期日"
              class="col-input"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
<!--        <el-col :span="6">
          <el-form-item
            label="还本付息："
            prop="isPayPrincipalAndInterest"
            class="p-left-80"
          >
            <ren-radio-group
              v-model="dataForm.isPayPrincipalAndInterest"
              :disabled="dataForm.isDisabled"
              dict-type="isPayPrincipalAndInterest"
            ></ren-radio-group>
          </el-form-item>
        </el-col>-->
        <!-- <el-col :span="6">
          <el-form-item
            label="循环额度："
            prop="isForMoney"
            class="p-left-80"
          >
            <ren-radio-group
              v-model="dataForm.isForMoney"
              :disabled="dataForm.isDisabled"
              dict-type="isPayPrincipalAndInterest"
            ></ren-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item
            label="未提金额："
            prop="availableBalance"
            class="p-left-80"
          >
            <money-input
              :value.sync="dataForm.availableBalance"
              :edit-display-value="dataForm.availableBalanceText"
              :is-disabled="dataForm.isDisabled"
              :suffix="$getDictLabel('unit', $store.state.unit)"
              placeholder="未提金额"
            ></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="实际还款："
            prop="actualRepayment"
            class="p-left-80"
          >
            <money-input
              :value.sync="dataForm.actualRepayment"
              :edit-display-value="dataForm.actualRepaymentText"
              :is-disabled="true"
              :suffix="$getDictLabel('unit', $store.state.unit)"
              placeholder=""
            ></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="其他费用："
            prop="otherExpenses"
            class="p-left-80"
          >
            <money-input
              :value.sync="dataForm.otherExpenses"
              :edit-display-value="dataForm.otherExpensesText"
              :is-disabled="dataForm.isDisabled"
              :suffix="$getDictLabel('unit', $store.state.unit)"
              placeholder="其他费用"
            ></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="费用说明："
            prop="otherExpensesDesc"
            class="p-left-80"
          >
            <el-input
              placeholder="费用说明"
              v-model="dataForm.otherExpensesDesc"
              :disabled="dataForm.isDisabled"
              class="col-input"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="用途：" prop="purpose" class="p-left-80">
          <el-input
            type="textarea"
            placeholder="用途"
            v-model="dataForm.purpose"
            :disabled="dataForm.isDisabled"
            maxlength="200"
            class="col-input"
            show-word-limi
          ></el-input>
        </el-form-item>
      </el-row>

      <finance-credit-reporting-measures
        :disabled="dataForm.isDisabled"
        :data-form="dataForm"
        :rmb="dataForm.withdrawalAmount"
      ></finance-credit-reporting-measures>
      <el-row>
        <el-form-item label="决策依据：" prop="decisionBasis" class="p-left-80">
          <el-input
            type="textarea"
            maxlength="200"
            v-model="dataForm.decisionBasis"
            :disabled="dataForm.isDisabled"
            placeholder="决策依据"
            class="col-input"
            show-word-limi
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：" prop="remarks" class="p-left-80">
          <el-input
            type="textarea"
            placeholder="备注"
            v-model="dataForm.remarks"
            :disabled="dataForm.isDisabled"
            maxlength="200"
            class="col-input"
            show-word-limi
          ></el-input>
        </el-form-item>
      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload
        :disabled="dataForm.isDisabled"
        :data-form="dataForm"
        table-width="100%"
        ref="finance-upload"
      ></finance-upload>
    </el-form>
    <finance-repay
      v-show="activeIndex == '2'"
      key="finance-repay"
      :page-type="2"
      :value-date="dataForm.loanDate"
      :rate="dataForm.rate"
      :due-date="dataForm.repaymentDate"
      :rate-type="dataForm.interestRatesWay"
      :issue-quota="dataForm.withdrawalAmount"
      :data-form="dataForm"
      :float-rate="dataForm.floatRate"
      :interest-method="dataForm.interestMethod"
      :principal-method="dataForm.principalMethod"
      :pay-plan-data="dataForm.payPlanData"
      :is-disabled="dataForm.isDisabled"
      ref="paymentTable"
    ></finance-repay>
    <finance-repay-interest
      v-show="activeIndex == '3'"
      key="finance-repay-interest"
      :page-type="2"
      :value-date="dataForm.loanDate"
      :rate="dataForm.rate"
      :due-date="dataForm.repaymentDate"
      :rate-type="dataForm.interestRatesWay"
      :issue-quota="dataForm.withdrawalAmount"
      :data-form="dataForm"
      :float-rate="dataForm.floatRate"
      :interest-method="dataForm.interestMethod"
      :principal-method="dataForm.principalMethod"
      :pay-plan-data="dataForm.payPlanData"
      :is-disabled="dataForm.isDisabled"
      ref="paymentInterestTable"
    ></finance-repay-interest>
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
      <el-button
        type="primary"
        :disabled="dataForm.isDisabled"
        @click="dataFormSubmitHandle()"
        >{{ $t('confirm') }}</el-button
      >
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
import { number } from 'echarts'
import FinanceRepayReal from '@/components/finance-repay-real'
export default {
  components: {
    MoneyInput,
    FinanceRepay,
    FinanceUpload,
    FinanceCreditReportingMeasures,
    FinanceRepayInterest,
    FinanceRepayReal
  },
  data () {
    return {
      activeIndex: '1',
      visible: false,
      dataForm: {
        // 执行利率
        // strikeRate: 0,
        // 审核通过就禁用
        isDisabled: false,
        floatRate: 0,
        // 唯一键
        id: '',
        // 融资单位id
        deptId: '',
        // 融资单位
        deptName: '',
        // 金融机构类型
        institutionType: '',
        // 金融机构
        institution: '',
        // 金融机构名称
        institutionName: '',
        // 项目
        project: '',
        // 融资品种
        varieties: '',
        // 保证金比例
        marginRatio: '',
        // 贴现率
        discountRate: '',
        // 利率类型
        interestRatesWay: 1,
        // 浮动利率周期
        lprCycle: '0',
        // lpr利息周期：1年期、5年期
        lprInterestCycle: '',
        // 付息周期
        serviceCycle: '0',
        // 利率
        rate: 0,
        // 合同编号
        contractNo: '',
        // 合同金额
        contractAmount: '',
        // 合同金额回显
        contractAmountText: '',
        // 开票金额
        invoiceAmount: '',
        // 开票金额回显
        invoiceAmountText: '',
        // 提款金额
        withdrawalAmount: '',
        // 提款金额回显
        withdrawalAmountText: '',
        // 付息方式
        interestMethod: '0',
        // 还本方式
        principalMethod: '0',
        // 起息日
        loanDate: '',
        // 到期日
        repaymentDate: '',

        // isForMoney: '0',
        // 可用余额-》未提金额
        availableBalance: '',
        // 可用余额回显-》未提金额
        availableBalanceText: '',
        actualRepayment: '',
        actualRepaymentText: '',
        // 其他费用
        otherExpenses: '',
        // 其他费用回显
        otherExpensesText: '',
        // 其他费用描述
        otherExpensesDesc: '',
        // 用途
        purpose: '',

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
        // 决策依据
        decisionBasis: '',
        // 附件列表
        fileList: [],
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
        },
        // 备注
        remarks: '',
        // 创建人（应该是全局的 谁操作的）
        creator: '',
        // 创建日期（应该是全局的 谁操作的）
        createDate: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        deptName: [
          { required: true, message: '请选择融资单位', trigger: 'change' }
        ],
        institutionType: [
          { required: true, message: '请选择金融机构类型', trigger: 'change' }
        ],
        institution: [
          { required: true, message: '请选择金融机构', trigger: 'change' }
        ],
        interestRatesWay: [
          { required: true, message: '请选择利率类型', trigger: 'change' }
        ],
        varieties: [
          { required: true, message: '请选择融资品种', trigger: 'change' }
        ],
        // 合同编号
        contractNo: [
          { required: true, message: '请输入合同编号', trigger: 'blur' }
        ],
        // 合同金额
        contractAmount: [
          { required: true, message: '请输入合同金额', trigger: 'blur' }
        ],
        // 开票金额
        invoiceAmount: [
          { required: true, message: '请输入开票金额', trigger: 'blur' }
        ],
        // 提款金额
        withdrawalAmount: [
          { required: true, message: '请输入提款金额', trigger: 'blur' }
        ],
        // 起息日
        loanDate: [
          { required: true, message: '请输入起息日', trigger: 'change' }
        ],
        // 到期日
        repaymentDate: [
          { required: true, message: '请输入到期日', trigger: 'change' }
        ]
        // creditMeasures: [
        //   { required: true, message: '请选择增信措施', trigger: 'change' }
        // ]
      }
    }
  },
  watch: {
    visible: function (newVal) {
      if (!newVal) {
        this.resetData()
      }
    },
    'dataForm.contractAmount' () {
      this.dataForm.availableBalance =
        Number(this.dataForm.contractAmount) -
        Number(this.dataForm.withdrawalAmount)
      this.dataForm.availableBalanceText =
        Number(this.dataForm.contractAmount) -
        Number(this.dataForm.withdrawalAmount)
    },
    'dataForm.withdrawalAmount' () {
      this.dataForm.availableBalance =
        Number(this.dataForm.contractAmount) -
        Number(this.dataForm.withdrawalAmount)
      this.dataForm.availableBalanceText =
        Number(this.dataForm.contractAmount) -
        Number(this.dataForm.withdrawalAmount)
    }
    // 'dataForm.rate' () {
    //   this.dataForm.strikeRate = (
    //     Number(this.dataForm.rate) + Number(this.dataForm.floatRate)
    //   ).toFixed(4)
    // },
    // 'dataForm.floatRate' () {
    //   this.dataForm.strikeRate = (
    //     Number(this.dataForm.rate) + Number(this.dataForm.floatRate)
    //   ).toFixed(4)
    // }
  },
  methods: {
    formatNumber () {
      this.dataForm.rate =
        this.$isNotNull(this.dataForm.rate) && this.dataForm.rate != 0
          ? Number(this.dataForm.rate).toFixed(4)
          : 0
      this.dataForm.floatRate =
        this.$isNotNull(this.dataForm.floatRate) && this.dataForm.floatRate != 0
          ? Number(this.dataForm.floatRate).toFixed(4)
          : 0
      // this.dataForm.strikeRate =
      //   this.$isNotNull(this.dataForm.strikeRate) &&
      //   this.dataForm.strikeRate != 0
      //     ? Number(this.dataForm.strikeRate).toFixed(4)
      //     : 0
    },
    // 初始化数据
    init () {
      console.log(this.$store.state.unit)
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
        // 执行利率
        // strikeRate: 0,
        // 审核通过就禁用
        isDisabled: false,
        // 唯一键
        id: '',
        // 融资单位id
        deptId: '',
        // 融资单位
        deptName: '',
        // 上浮利率
        floatRate: '',
        // 金融机构类型
        institutionType: '',
        // 金融机构
        institution: '',
        // 金融机构名称
        institutionName: '',
        // 融资品种
        varieties: '',
        // 保证金比例
        marginRatio: '',
        // 贴现率
        discountRate: '',
        // 利率类型
        interestRatesWay: '浮动利率',
        // 浮动利率周期
        lprCycle: '0',
        // 项目
        project: '',
        // 利率
        rate: 0,
        // 合同编号
        contractNo: '',
        // 合同金额
        contractAmount: '',
        // 合同金额回显
        contractAmountText: '',
        // 开票金额
        invoiceAmount: '',
        // 开票金额回显
        invoiceAmountText: '',
        // 提款金额
        withdrawalAmount: '',
        // 提款金额回显
        withdrawalAmountText: '',
        // 付息方式
        interestMethod: '0',
        principalMethod: '0',
        // 起息日
        loanDate: '',
        // 到期日
        repaymentDate: '',
        // 可用余额-》未提金额
        availableBalance: '',
        // 可用余额回显-》未提金额
        availableBalanceText: '',
        actualRepayment: '',
        actualRepaymentText: '',
        // 其他费用
        otherExpenses: '',
        // 其他费用回显
        otherExpensesText: '',
        // 其他费用描述
        otherExpensesDesc: '',
        // 用途
        purpose: '',

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
        // 决策依据
        decisionBasis: '',
        // 附件列表
        fileList: [],
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
        },
        // 备注
        remarks: '',
        // 创建人（应该是全局的 谁操作的）
        creator: '',
        // 创建日期（应该是全局的 谁操作的）
        createDate: ''
      }
    },
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
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get(
          '/financing/findirectfinancing/' +
            this.dataForm.id +
            '/' +
            this.$store.state.unit
        )
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        console.log('_data>>>>', _data)
        // 合同金额
        _data.contractAmountText = _data.contractAmount
        // 开票金额回显
        _data.invoiceAmountText = _data.invoiceAmount
        // 提款金额回显
        _data.withdrawalAmountText = _data.withdrawalAmount
        // 可用余额回显-》未提金额
        _data.availableBalanceText = _data.availableBalance
        _data.actualRepaymentText = _data.actualRepayment
        // 其他费用回显
        _data.otherExpensesText = _data.otherExpenses
        _data.lprInterestCycle = _data.lprInterestCycle
          ? _data.lprInterestCycle
          : ''
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
        _data.guaranteeInfo?.guarantee?.map((item) => {
          item.contractAmountText = item.contractAmount
        })
        // 增信措施详情-抵押
        _data.guaranteeInfo?.collateral?.map((item) => {
          item.collateralAmountText = item.collateralAmount
          if (
            this.$isNotNull(item.releaseTime) &&
            item.releaseTime.length > 0
          ) {
            item.releaseTime[0] = new Date(item.releaseTime[0])
          }
          if (
            this.$isNotNull(item.releaseTime) &&
            item.releaseTime.length > 1
          ) {
            item.releaseTime[1] = new Date(item.releaseTime[1])
          }
        })
        // 增信措施详情-质押
        _data.guaranteeInfo?.pledge?.map((item) => {
          item.pledgeAmountText = item.pledgeAmount
          if (
            this.$isNotNull(item.releaseTime) &&
            item.releaseTime.length > 0
          ) {
            item.releaseTime[0] = new Date(item.releaseTime[0])
          }
          if (
            this.$isNotNull(item.releaseTime) &&
            item.releaseTime.length > 1
          ) {
            item.releaseTime[1] = new Date(item.releaseTime[1])
          }
        })
        _data.creditMeasures = this.$isNotNull(_data.creditMeasures)
          ? _data.creditMeasures.split(',')
          : []
        console.log('data.payPlanData', data.payPlanData)
        if (this.$isNotNull(_data.payPlanData)) {
          _data.payPlanData.endNeedCount = _data.payPlanData.endNeedCount !== 0
          _data.payPlanData.isPayPrincipalAndInterest = _data.payPlanData.isPayPrincipalAndInterest !== 0
          /* _data.payPlanData.payPlan1 = _data.payPlanData.payPlan1
            ? _data.payPlanData.payPlan1
            : [] */
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
            endNeedCount: false,
            isPayPrincipalAndInterest: false
          }
        }
        _data.isDisabled = _data.isChecked == '1'
        _data.fileList = this.$isNotNull(_data.fileList) ? _data.fileList : []
        this.dataForm = _data
        this.dataForm.lprCycle = this.dataForm.lprCycle
          ? this.dataForm.lprCycle
          : '0'
        this.formatNumber()
        console.log('getInfo>>>>>>', this.dataForm)
      } catch (e) {
        console.log('getInfo-e:', e)
      }
    },
    countBalance () {
      console.log('blur')
      if (
        this.$isNotNull(this.dataForm.invoiceAmount) &&
        this.$isNotNull(this.dataForm.contractAmount)
      ) {
        this.dataForm.withdrawalAmount =
          Number(this.dataForm.contractAmount) -
          Number(this.dataForm.invoiceAmount)
      } else {
        this.dataForm.withdrawalAmount = null
      }
      this.dataForm.withdrawalAmountText = this.dataForm.withdrawalAmount
      console.log(this.dataForm.withdrawalAmount)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        console.log('submit')
        this.$refs.dataForm.validate(async (valid) => {
          if (!valid) {
            return false
          }
          try {
            // const params = { ...this.dataForm }
            const params = JSON.parse(JSON.stringify(this.dataForm))
            params.creditMeasuresList = params.creditMeasures
            if (params.interestRatesWay == 0) {
              params.lprCycle = null
            } else {
              params.rate = null
            }
            delete params.creditMeasures
            params.payPlanData.endNeedCount = params.payPlanData.endNeedCount === true ? 1 : 0
            params.payPlanData.isPayPrincipalAndInterest = params.payPlanData.isPayPrincipalAndInterest === true ? 1 : 0
            params.unit = this.$store.state.unit
            params.payPlanData.repayPrincipalPlanList =
              params.payPlanData.payPlan
            // 循环repayPrincipalPlanList数组，删除对象的desc、interset属性
            params.payPlanData.repayPrincipalPlanList.forEach((item) => {
              delete item.desc
              delete item.interest
              delete item.remark
            })
            // 还息数组只需要传给后台planType=2的数据，planType=1是还本付息产生的利息，只是展示作用
            params.payPlanData.repayInterestPlanList = params.payPlanData.payPlan1.filter(
              (item) => item.planType != 1
            )
            // 循环repayInterestPlanList数组，删除对象的desc、interest属性
            params.payPlanData.repayInterestPlanList.forEach((item) => {
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
            console.log('间融提交参数', params)
            const { data } = await this.$http[
              !this.dataForm.id ? 'post' : 'put'
            ]('/financing/findirectfinancing/', params)
            if (data.code !== 0) {
              return this.$message.error(data.msg)
            }
            this.$message.success(this.$t('prompt.success'))
            setTimeout(() => {
              this.visible = false
            }, 500)

            this.$emit('refreshDataList')
          } catch (e) {}
        })
      },
      1000,
      { leading: true, trailing: false }
    )
  }
}
</script>
<style lang="scss">
.p-left-80{
  ::v-deep .el-radio{
    margin-right: 15px;
  }
}
</style>
