<template>
<!--  政府债券集团审核详情-->
  <el-dialog :visible.sync="visible"
             :title="`${dataForm.project}-${dataForm.financingAmount}元 的政府债券审核`"
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
             ref="dataForm"
             v-show="activeIndex=='1'"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="融资品种：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('varieties',dataForm.varieties)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金融机构（银行）：" class="p-left-110">
            <span class="desc-content"> {{dataForm.deptName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用款主体：" class="p-left-80">
            <span class="desc-content"> {{dataForm.institutionName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="融资金额：" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.financingAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="利率：" class="p-left-50">
            <span class="desc-content"> {{dataForm.rate}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="放款日期：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.loanDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还款日期：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.repaymentDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="还本方式：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('serviceCycle',dataForm.principalMethod)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付息方式：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('serviceCycle',dataForm.interestMethod)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="融资余额：" prop="financingBalance" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.financingBalance)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际还款：" prop="actualRepayment" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.actualRepayment)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目：" prop="project" class="p-left-50">
            <span class="desc-content"> {{dataForm.project}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <finance-credit-reporting-measures-details :data-form="dataForm"></finance-credit-reporting-measures-details>
      <el-row>
        <el-form-item label="备注：" prop="remarks" class="p-left-50">
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
          <el-input type="textarea" placeholder="审核意见" v-model="dataForm.opinion" maxlength="200" show-word-limi  class="col-input" ></el-input>
        </el-form-item>
      </el-row>
    </el-form>
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
  name: 'fgovernmentbondAuditDetails',
  components: { FinanceUploadDetails, FinanceCreditReportingMeasuresDetails, FinanceRepay, FinanceRepayInterest },
  data () {
    return {
      visible: false,
      activeIndex: '1',
      dataForm: {
        // 审批结果
        result: '1',
        // 审批意见
        opinion: '',
        // 主键
        id: '',
        // 融资品种
        varieties: '',
        // 用款主体Id
        deptId: '',
        // 用款主体名称
        deptName: '',
        // 融资主体-》金融机构（银行）Id
        institution: '',
        // 融资主体-》金融机构（银行）
        institutionName: '',
        // 融资金额
        financingAmount: '',
        // 利率
        rate: '',
        // 放款日期
        loanDate: '',
        // 还款日期
        repaymentDate: '',
        // 付息方式
        interestMethod: '',
        // 融资余额
        financingBalance: '',
        actualRepayment: '',
        // 项目
        project: '',
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
          interestMeasurementCycle: '',
          // 是否结息日算息
          endNeedCount: 0
        }

      }
    }
  },
  computed: {
    dataRule () {
      return {
      }
    }
  },
  methods: {
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
        const { data } = await this.$http.get('/financing/fgovernmentbond/' + this.dataForm.id + '/' + this.$store.state.unit)
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
        const { data } = await this.$http.post('/financing/governmentbondaudit/groupcheck', {
          groupChecked: result,
          groupCheckedDes: opinion,
          bondId: id
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
