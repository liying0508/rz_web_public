<template>
<!--  直接融资集团审批详情-->
  <el-dialog
      :visible.sync="visible"
      title="直接融资集团审核"
      :width="width"
      class="form-el-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
    <el-row class="menu-row">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="form-menu-item">直融信息</el-menu-item>
       <el-menu-item index="2" class="form-menu-item">还本计划</el-menu-item>
        <el-menu-item index="4" class="form-menu-item">还息计划</el-menu-item>
        <el-menu-item index="3" class="form-menu-item">批文信息</el-menu-item>
      </el-menu>
    </el-row>
    <el-form v-show="activeIndex=='1'"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="批文号：" class="p-left-70">
            <span class="desc-content">{{dataForm.approveNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="审批单位：" class="p-left-80">
<!--            <span class="desc-content"> {{$getDictLabel('approveOrg',audit.approveOrg)}}</span>-->
            <span class="desc-content">{{dataForm.approveOrg}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="审批金额：" class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.issueQuota)}}{{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
           </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="发行期次：" class="p-left-80">
            <span class="desc-content">第 {{dataForm.issue}} 期</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="融资单位：" class="p-left-80">
            <span class="desc-content">{{dataForm.deptName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="融资品种：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('varieties',dataForm.varieties)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="付息周期：" class="p-left-70">
            <span class="desc-content"> {{$getDictLabel('serviceCycle',dataForm.serviceCycle)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="利率："  class="p-left-70">
            <span class="desc-content">{{dataForm.rate}} %</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="币种：" class="p-left-50">
            <span class="desc-content"> {{$getDictLabel('currency',audit.currency)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="发行外币金额：" class="p-left-105">
            <span class="desc-content">{{$numberFormat(dataForm.foreignCurrencyAmount)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="汇率：" class="p-left-50">
            <span class="desc-content">{{dataForm.exchangeRate}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="折合人民币：" class="p-left-90">
            <span class="desc-content">{{$numberFormat(dataForm.issueQuota)}}{{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">

          <el-form-item label="发行日：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.issueDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起息日：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.valueDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" class="p-left-80">
            <span class="desc-content">{{$formatDate(dataForm.dueDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
           <el-form-item label="还本付息：" class="p-left-80">
            <span class="desc-content">{{$getDictLabel('isPayPrincipalAndInterest',dataForm.isPayPrincipalAndInterest)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="融资余额："  class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.financingBalance)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际还款："  class="p-left-80">
            <span class="desc-content">{{$numberFormat(dataForm.actualRepayment)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="其他费用：" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.otherExpenses)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>

          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="费用说明：" prop="purpose" class="p-left-80">
            <span class="desc-content"> {{dataForm.otherExpensesDesc}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="项目：" prop="project" class="p-left-50">
          <div class="desc-content" v-html="dataForm.project"> </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="用途：" prop="purpose" class="p-left-50">
          <div class="desc-content" v-html="dataForm.purpose"> </div>
        </el-form-item>
      </el-row>

      <finance-credit-reporting-measures-details :data-form="dataForm"></finance-credit-reporting-measures-details>

      <el-divider>中介机构</el-divider>
      <template  v-for="item in dataForm.intermediaryStructureList">
        <el-row>
          <el-col :span="6" >
            <el-form-item label="中介机构类型：" class="p-left-110">
              <span class="desc-content"> {{$getDictLabel('intermediary',item.intermediaryValue)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="中介机构名称：" prop="orgName" class="p-left-110">
              <span class="desc-content"> {{item.orgName}} </span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="费率：" prop="rate" class="p-left-50">
              <span class="desc-content"> {{item.rate}} %</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="中介费用：" prop="interestCycle" class="p-left-80">
              <span class="desc-content"> {{$numberFormat(item.amount)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="1">
          </el-col>
        </el-row>
      </template>
      <el-divider>投资人</el-divider>
      <template  v-for="item in dataForm.investorList">
        <el-row>
          <el-col :span="6" >
            <el-form-item label="投资人："  prop="investorName" class="p-left-70">
              <span class="desc-content"> {{item.investorName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投资金额：" prop="interestCycle" class="p-left-80">
              <span class="desc-content"> {{$numberFormat(item.investorAmount)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注：" prop="remarks" class="p-left-50">
              <span class="desc-content"> {{item.remarks}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="1">
          </el-col>
        </el-row>
      </template>
      <el-divider>附件上传</el-divider>
      <finance-upload-details table-width="100%" ref="finance-upload" :data-form="dataForm"></finance-upload-details>
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
        <el-form-item label="审核结果：" prop="result"  class="p-left-80">
          <ren-radio-group v-model="dataForm.result" dict-type="audit_result"></ren-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="审核意见：" prop="opinion" class="p-left-80">
          <el-input type="textarea" placeholder="审核意见" v-model="dataForm.opinion" maxlength="200" show-word-limi  class="col-input" ></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <finance-repay  v-show="activeIndex=='2'"
                    :value-date="dataForm.valueDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.dueDate"
                    rate-type="固定利率"
                    :issue-quota="dataForm.issueQuota"
                    :data-form="dataForm"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="true"></finance-repay>
    <finance-repay-interest  v-show="activeIndex=='4'"
                    :value-date="dataForm.valueDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.dueDate"
                    rate-type="固定利率"
                    :issue-quota="dataForm.issueQuota"
                    :data-form="dataForm"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="true"></finance-repay-interest>
    <el-form v-show="activeIndex=='3'" class="custom-form">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="deptName" label="融资单位：" class="p-left-80">
            <span class="desc-content"> {{audit.deptName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="审批单位："  class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('approveOrg',audit.approveOrg)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="批文号：" class="p-left-70">
            <span class="desc-content"> {{audit.approveNo}}</span>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="币种：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('currency',audit.currency)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="发行金额：" class="p-left-80">
            <span class="desc-content">  {{$numberFormat(audit.issueQuota)}}{{audit.currency=='元'? $getDictLabel('unit',$store.state.unit):audit.currency}}</span>
          </el-form-item>
        </el-col>

      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload-details :data-form="dataForm" table-width="100%" ref="finance-upload"></finance-upload-details>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceUploadDetails from '@/components/finance-upload/details'
import FinanceRepay from '@/components/finance-repay'
import FinanceRepayInterest from '@/components/finance-repay-interest'
import FinanceCreditReportingMeasuresDetails from '@/components/finance-credit-reporting-measures/details'
export default {
  name: 'fdirectfinancingAuditDetails',
  components: { FinanceCreditReportingMeasuresDetails, FinanceRepay, FinanceUploadDetails, FinanceRepayInterest },
  data () {
    return {
      approveNos: [],
      activeIndex: '1',
      visible: false,
      width: '80%',
      // 金融机构
      deptList: [],
      // 当前批文信息
      audit: {
        // 融资单位
        deptName: '',
        // 审批单位
        approveOrg: '',
        // 批文号
        approveNo: '',
        // 币种
        currency: '元',
        // 审批金额
        issueQuota: '',
        // 发行次数 查出来的
        issue: ''
      },
      dataForm: {
        // 审批结果
        result: '1',
        // 审批意见
        opinion: '',
        // 主键id
        id: '',
        // 批文号
        approveNo: '',
        // 发行期次，从数据库统计出来的
        issue: '5',
        // 融资单位id
        deptId: '',
        // 融资单位
        deptName: '',

        // 融资品种
        varieties: '',
        // 付息周期
        serviceCycle: '',
        // 付息方式
        interestMethod: '',
        // 币种
        currency: '元',
        // 发行外币金额
        foreignCurrencyAmount: '',
        // 利率
        rate: '',
        // 汇率
        exchangeRate: '',

        // 折合人民币
        issueQuota: '',
        // 发行日
        issueDate: '',
        // 起息日
        valueDate: '',
        // 到期日
        dueDate: '',
        // 融资余额
        financingBalance: '',
        actualRepayment:'',
        // 项目
        project: '',
        // 用途
        purpose: '',
        // 其他费用
        otherExpenses: '',
        // 其他费用描述
        otherExpensesDesc: '',
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
        // 中介机构数组
        intermediaryStructureList: [],
        // 投资人数组
        investorList: [],
        // 附件上传
        fileList: [],
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
  methods: {
    formatNumber () {
      this.dataForm.rate = this.$isNotNull(this.dataForm.rate) && this.dataForm.rate != 0 ? Number(this.dataForm.rate).toFixed(4) : 0
    },
    // 初始化数据
    async init () {
      await this.getDeptList()
      await this.getApprovalList()
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取批文列表
    async getApprovalList () {
      try {
        const { data } = await this.$http.get('/financing/approval/list')
        if (data.code !== 0) {
          console.log('getApprovalList', data.msg)
          return this.$message.error(data.msg)
        }
        this.approveNos = []
        data?.data?.map(item => {
          const object = {
            dictValue: item.approveNo,
            dictLabel: `${item.deptName} - ${item.approveNo} 批文`,
            approveOrg: item.approveOrg,
            // 批文信息
            audit: item
          }
          object.audit.issue = this.$isNotNull(object.audit.issue) ? object.audit.issue : 0
          this.approveNos.push(object)
        })
      } catch (e) {
        console.log('getDeptList-e:', e)
      }
    },
    // 获取金融机构列表
    async getDeptList () {
      try {
        const { data } = await this.$http.get('/financing/finance-dept/list')
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.deptList = data.data
      } catch (e) {
        console.log('getDeptList-e', e)
      }
    },
    // 获取信息回填
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/audit/' + this.dataForm.id +'/'+this.$store.state.unit)
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
        const item = this.approveNos.find(item => item.dictValue == _data.approveNo)
        if (this.$isNotNull(item)) { 
          this.dataForm.approveOrg = item.approveOrg
          this.audit = item.audit
          this.audit.issueQuotaText = item.audit.issueQuota
          this.dataForm.issue = parseInt(item.audit.issue) + 1
          this.dataForm.deptId = item.audit.deptId
          this.dataForm.deptName = item.audit.deptName
          this.dataForm.currency = item.audit.currency
          this.dataForm.financingBalance = Number(item.issueQuota) - Number(item.audit.allUseQuota) - Number(this.dataForm.foreignCurrencyAmount)
          this.dataForm.financingBalanceText = this.dataForm.financingBalance
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
        console.log(this.dataForm)
        const { data } = await this.$http.post('/financing/audit/groupcheck', {
          groupChecked: result,
          groupCheckedDes: opinion,
          financingId: id
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
    // tab切换
    handleSelect (val) {
      console.log(val)
      this.activeIndex = val
      this.width = val == '1' ? '80%' : '80%'
    }
  }
}
</script>

<style lang="scss" scoped>
.sigma-content {
  margin: 50px;
  text-align: center;
  background-color: #fff;
  .sigma-middle-line:before {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    background-color: #dcdfe6;
    position: relative;
    top: 10px;
    left: 0;
  }
  .sigma-line-text {
    display: inline-block;
    background: #fff;
    padding: 0 18px 0 18px;
    position: relative;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
