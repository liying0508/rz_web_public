<template>
<!--  间接融资集团审批详情-->
  <el-dialog :visible.sync="visible"
             title="湖南湘江新区发展集团有限公司授信200000元 的间接融资审核"
             width="80%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-row class="menu-row">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="form-menu-item">融资信息</el-menu-item>
        <el-menu-item index="2" class="form-menu-item">还本计划</el-menu-item>
        <el-menu-item index="3" class="form-menu-item">还息计划</el-menu-item>
      </el-menu>
    </el-row>
    <el-form :model="dataForm"
             :rules="dataRule"
             v-show="activeIndex=='1'"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="融资单位："  class="p-left-80">
            <span class="desc-content">{{dataForm.deptName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金融机构类型：" class="p-left-110">
            <span class="desc-content"> {{$getDictLabel('finance_dept_type',dataForm.institutionType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金融机构：" class="p-left-80">
            <span class="desc-content">{{dataForm.institutionName}}</span>
           </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="融资品种：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('varieties',dataForm.varieties)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dataForm.varieties==2||dataForm.varieties==3">
          <el-form-item label="保证金比例：" class="p-left-80">
            <span class="desc-content">{{dataForm.marginRatio}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dataForm.varieties==2||dataForm.varieties==3">
          <el-form-item label="贴现率：" class="p-left-70">
            <span class="desc-content">{{dataForm.discountRate}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目：" class="p-left-50">
            <span class="desc-content">{{dataForm.project}} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="利率类型：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('interestRatesWay',dataForm.interestRatesWay)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-show="dataForm.interestRatesWay=='1'" label="调息周期：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('lpr',dataForm.lprCycle)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-show="dataForm.interestRatesWay=='0'" label="基准利率：" class="p-left-80">
            <span class="desc-content">{{dataForm.rate}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="浮动利率" class="p-left-80">
            <span class="desc-content"> {{dataForm.floatRate}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-show="dataForm.interestRatesWay=='1'" label="lpr利息周期：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('lprInterestCycle',dataForm.lprInterestCycle)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-show="dataForm.interestRatesWay=='0'" label="执行利率：" class="p-left-80">
            <span class="desc-content">{{dataForm.strikeRate}} %</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="合同编号：" class="p-left-80">
            <span class="desc-content">{{dataForm.contractNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同金额：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.contractAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dataForm.varieties==2||dataForm.varieties==3">
          <el-form-item label="开票金额：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.invoiceAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提款金额：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.withdrawalAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="付息方式：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('interestMethod',dataForm.interestMethod)}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="起息日：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.loanDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.repaymentDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="可用余额：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.availableBalance)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际还款：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.actualRepayment)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还本付息：" class="p-left-80">
            <span class="desc-content">{{$getDictLabel('isPayPrincipalAndInterest',dataForm.isPayPrincipalAndInterest)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="其他费用：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.otherExpenses)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="费用说明：" class="p-left-80">
            <span class="desc-content">{{dataForm.otherExpensesDesc}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="用途：" class="p-left-80">
          <div class="desc-content" v-html="dataForm.purpose"> </div>
        </el-form-item>
      </el-row>

      <finance-credit-reporting-measures-details :data-form="dataForm"></finance-credit-reporting-measures-details>
      <el-row>
        <el-form-item label="决策依据：" class="p-left-80">
          <div class="desc-content" v-html="dataForm.decisionBasis"> </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：" class="p-left-80">
          <div class="desc-content" v-html="dataForm.remarks"> </div>
        </el-form-item>
      </el-row>
      <el-divider>附件上传</el-divider>
      <finance-upload-details :data-form="dataForm" table-width="100%" ref="finance-upload"></finance-upload-details>
       <div style="margin-top:20px;">
          <el-divider>子公司审核</el-divider>
        </div>
      <el-row>
        <el-form-item label="审核结果：" class="p-left-80">
          {{$getDictLabel("audit_result", dataForm.isChecked)}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="审核意见：" class="p-left-80">
          {{dataForm.checkedDes?dataForm.checkedDes:'无'}}
        </el-form-item>
      </el-row>
      <el-divider>集团审核</el-divider>
      <el-row>
        <el-form-item label="审核结果：" prop="result" class="p-left-80">
          <ren-radio-group v-model="dataForm.result" dict-type="audit_result"></ren-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="审核意见：" prop="opinion" class="p-left-80">
          <el-input type="textarea" placeholder="审核意见" v-model="dataForm.opinion" maxlength="200" show-word-limi class="col-input" ></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <finance-repay  v-show="activeIndex=='2'"
                    :value-date="dataForm.loanDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.repaymentDate"
                    :rate-type="dataForm.interestRatesWay"
                    :issue-quota="dataForm.invoiceAmount"
                    :data-form="dataForm"
                    :service-cycle="dataForm.serviceCycle"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="true"></finance-repay>
    <finance-repay-interest  v-show="activeIndex=='3'"
                    :value-date="dataForm.loanDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.repaymentDate"
                    :rate-type="dataForm.interestRatesWay"
                    :issue-quota="dataForm.invoiceAmount"
                    :data-form="dataForm"
                    :service-cycle="dataForm.serviceCycle"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="true"></finance-repay-interest>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceRepay from '@/components/finance-repay'
import FinanceRepayInterest from '@/components/finance-repay-interest'
import FinanceCreditReportingMeasuresDetails from '@/components/finance-credit-reporting-measures/details'
import FinanceUploadDetails from '@/components/finance-upload/details'
export default {
  name: 'findirectfinancingAuditDetails',
  components: { FinanceUploadDetails, FinanceCreditReportingMeasuresDetails, FinanceRepay, FinanceRepayInterest },
  data () {
    return {
      activeIndex: '1',
      visible: false,
      dataForm: {
        // 审批结果
        result: '1',
        // 审批意见
        opinion: '',
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
        interestRatesWay: '浮动利率',
        // 浮动利率周期
        lprCycle: '',
        // 利率
        rate: '',
        // 合同编号
        contractNo: '',
        // 合同金额
        contractAmount: '',
        // 开票金额
        invoiceAmount: '',
        // 提款金额
        withdrawalAmount: '',
        // 付息方式
        interestMethod: '',
        // 放款日期
        loanDate: '',
        // 还款日期
        repaymentDate: '',
        // 是否还本付息
        isPayPrincipalAndInterest: '0',
        // 可用余额
        availableBalance: '',
        actualRepayment: '',
        // 其他费用
        otherExpenses: '',
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
          // 还款计划
          payPlan: [],
          payPlan1: [],
          // 测算周期
          interestMeasurementCycle: '',
          // 是否结息日算息
          endNeedCount: 0
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
      }
    }
  },
  watch: {
    'dataForm.contractAmount' () {
      this.dataForm.availableBalance = Number(this.dataForm.contractAmount) - Number(this.dataForm.withdrawalAmount)
    },
    'dataForm.withdrawalAmount' () {
      this.dataForm.availableBalance = Number(this.dataForm.contractAmount) - Number(this.dataForm.withdrawalAmount)
    },
    'dataForm.rate' () {
      this.dataForm.strikeRate = (Number(this.dataForm.rate) + Number(this.dataForm.floatRate)).toFixed(4)
    },
    'dataForm.floatRate' () {
      this.dataForm.strikeRate = (Number(this.dataForm.rate) + Number(this.dataForm.floatRate)).toFixed(4)
    }
  },
  methods: {
    formatNumber () {
      this.dataForm.rate = this.$isNotNull(this.dataForm.rate) && this.dataForm.rate != 0 ? Number(this.dataForm.rate).toFixed(4) : 0
      this.dataForm.floatRate = this.$isNotNull(this.dataForm.floatRate) && this.dataForm.floatRate != 0 ? Number(this.dataForm.floatRate).toFixed(4) : 0
      this.dataForm.strikeRate = this.$isNotNull(this.dataForm.strikeRate) && this.dataForm.strikeRate != 0 ? Number(this.dataForm.strikeRate).toFixed(4) : 0
    },
    // 初始化数据
    async init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },

    // 获取信息回填
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/findirectfinancing/' + this.dataForm.id + '/' + this.$store.state.unit)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        _data.result = _data.groupChecked
        _data.opinion = _data.groupCheckedDes
        _data.creditMeasuresText = _data.creditMeasures
        _data.creditMeasures = this.$isNotNull(_data.creditMeasures) ? _data.creditMeasures.split(',') : []

        console.log('data.creditMeasures', data.creditMeasures)
        if (this.$isNotNull(_data.payPlanData)) {
          _data.payPlanData.endNeedCount = _data.payPlanData.endNeedCount !== 0
        } else {
          _data.payPlanData = {
            // 还款计划
            payPlan: [],
            payPlan1: [],
            // 测算周期
            interestMeasurementCycle: '',
            // 是否结息日算息
            endNeedCount: 0
          }
        }
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
        _data.fileList = this.$isNotNull(_data.fileList) ? _data.fileList : []
        this.dataForm = { ...this.dataForm, ..._data }
        this.dataForm.payPlanData.payPlan = this.dataForm.payPlanData.repayPrincipalPlanList
        this.dataForm.payPlanData.payPlan1 = this.dataForm.payPlanData.repayInterestPlanList
        this.formatNumber()
      } catch (e) {
        console.log('getInfo-e', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { result, opinion, id } = this.dataForm
        const { data } = await this.$http.post('/financing/findirectfinancingaudit/groupcheck', {
          groupChecked: result,
          groupCheckedDes: opinion,
          indirectId: id
        })
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.$message.success(this.$t('prompt.success'))
        setTimeout(() => {
          this.visible = false
        }, 500)
        this.$emit('refreshDataList')
      })
    }, 1000, { leading: true, trailing: false }),

    // 切换tab
    handleSelect (val) {
      console.log(val)
      this.activeIndex = val
    }
  }
}
</script>
