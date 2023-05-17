<template>
<!--  直接融资编辑-->
  <el-dialog
      :visible.sync="visible"
      :title="!dataForm.id ? $t('add') : $t('update')"
      :width="width"
      class="form-el-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">

    <el-row class="menu-row">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="form-menu-item">直融信息</el-menu-item>
        <el-menu-item index="2" class="form-menu-item">还本计划</el-menu-item>
        <el-menu-item index="5" class="form-menu-item" :disabled="!$isNotNull(dataForm.id)">实际还本</el-menu-item>
        <el-menu-item index="4" class="form-menu-item">还息计划</el-menu-item>
        <el-menu-item index="6" class="form-menu-item" :disabled="!$isNotNull(dataForm.id)">实际还息</el-menu-item>
        <el-menu-item index="3" class="form-menu-item" :disabled="!$isNotNull(dataForm.approveNo)">批文信息</el-menu-item>

      </el-menu>
    </el-row>
    <el-form v-show="activeIndex=='1'"
             :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
      <el-row>

        <el-col :span="6">

          <el-form-item label="批文号：" prop="approveNo" class="p-left-70">
            <el-select v-model="dataForm.approveNo"
                       :disabled="dataForm.isDisabled"
                       class="col-input"
                       placeholder="批文号"
                       @change="approveChange">
              <el-option v-for="data in approveNos"
                         :key="data.dictValue"
                         :label="data.dictLabel"
                         :value ="data.dictValue">{{data.dictLabel}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="审批单位：" prop="approveOrg"  class="p-left-80">
            <ren-select v-model="audit.approveOrg"
                        :disabled="true"
                        dict-type="approveOrg"
                        placeholder="审批单位"
                        style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="审批金额："  class="p-left-80">
            <money-input :value.sync="audit.issueQuota"
                         :edit-display-value="audit.issueQuotaText"
                         placeholder="审批金额"
                         :suffix="audit.currency=='元'? $getDictLabel('unit',$store.state.unit):audit.currency"
                         :is-disabled="true"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="发行期次：" prop="issue"  class="p-left-80">
            <el-input v-model="dataForm.issue"
                      placeholder="期次"
                      disabled
                      class="el-input-right">
              <template slot="append">期</template>
              <template slot="prepend">第</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="6">
          <el-form-item prop="deptName"
                        label="融资单位："
                        class="p-left-80">
            <!-- <el-input v-if="audit.id != undefined "
                      v-model="audit.deptName"
                      :disabled="true"
                      class="col-input"></el-input>
            <ren-dept-tree v-if="audit.id == undefined"
                           v-model="audit.deptId"
                           placeholder="融资单位"
                           class="col-input"
                           :dept-name.sync="audit.deptName"></ren-dept-tree> -->
                  <el-input v-if="dataForm.isDisabled "
                      v-model="audit.deptName"
                      :disabled="true"
                      class="col-input"></el-input>
            <ren-dept-tree v-else
                           v-model="audit.deptId"
                           placeholder="融资单位"
                           class="col-input"
                           :dept-name.sync="audit.deptName"></ren-dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="融资品种：" prop="issue"  class="p-left-80">
            <el-input v-model="audit.varieties"
                      disabled
                      class="el-input-right">
            </el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6" >
          <el-form-item label="融资品种：" prop="varieties"  class="p-left-80">
            <ren-select :disabled="dataForm.isDisabled"
                        v-model="dataForm.varieties"
                        dict-type="varieties"
                        style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>-->
        <!-- <el-col :span="6">
          <el-form-item label="付息周期：" prop="serviceCycle" class="p-left-70">
            <ren-select v-model="dataForm.serviceCycle"
                        :disabled="dataForm.isDisabled"
                        dict-type="serviceCycle"
                        style="width: 100%"></ren-select>
          </el-form-item>
        </el-col> -->
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
          <el-form-item label="固定利率：" prop="rate" class="p-left-80">
            <el-input v-model="dataForm.rate"
                      :disabled="dataForm.isDisabled"
                      @blur="formatNumber"
                      placeholder="固定利率"><template slot="append">%</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="主承销商：" prop="secComId"  class="p-left-80">
            <el-select v-model="dataForm.secComId"
                       :disabled="dataForm.isDisabled"
                       class="col-input"
                       filterable
                       placeholder="主承销商">
              <el-option v-for="data in secComNames"
                         :key="data.dictValue"
                         :label="data.dictLabel"
                         :value ="data.dictValue">{{data.dictLabel}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="承销费率：" prop="underwritingRate"  class="p-left-90">
            <money-input :value.sync="dataForm.underwritingRate"
                         :edit-display-value="dataForm.underwritingRateText"
                         :is-disabled="dataForm.isDisabled"
                         suffix="‰"
                         placeholder="承销费率" ></money-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="币种：" prop="currency"  class="p-left-50">
            <ren-select v-model="dataForm.currency"
                        dict-type="currency"
                        disabled
                        placeholder="币种"
                        style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="发行外币金额：" prop="foreignCurrencyAmount"  class="p-left-105">
            <money-input @blur="countIssueQuota"
                         :value.sync="dataForm.foreignCurrencyAmount"
                         :edit-display-value="dataForm.foreignCurrencyAmountText"
                         placeholder="外币金额"
                         :is-disabled="dataForm.isDisabled"
                         :suffix="audit.currency=='元'? $getDictLabel('unit',$store.state.unit):audit.currency" ></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="汇率：" prop="exchangeRate"  class="p-left-50">
            <el-input v-model="dataForm.exchangeRate"
                      :disabled="dataForm.isDisabled"
                      placeholder="汇率"
                      @blur="countIssueQuota">
<!--              <template slot="append">%</template>-->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="折合人民币：" prop="issueQuota"  class="p-left-90">
            <money-input :value.sync="dataForm.issueQuota"
                         :edit-display-value="dataForm.issueQuotaText"
                         :is-disabled="dataForm.isDisabled"
                         :suffix="$getDictLabel('unit',$store.state.unit)"
                         placeholder="折合人民币" ></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">

          <el-form-item label="发行日：" prop="issueDate" class="p-left-80">
            <el-date-picker v-model="dataForm.issueDate"
                            type="date"
                            :disabled="dataForm.isDisabled"
                            value-format="yyyy-MM-dd"
                            placeholder="发行日"
                            class="col-input" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起息日：" prop="valueDate" class="p-left-80">
            <el-date-picker v-model="dataForm.valueDate"
                            type="date"
                            :disabled="dataForm.isDisabled"
                            value-format="yyyy-MM-dd"
                            placeholder="起息日"
                            class="col-input" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" prop="dueDate" class="p-left-80">
            <el-date-picker v-model="dataForm.dueDate"
                            type="date"
                            :disabled="dataForm.isDisabled"
                            value-format="yyyy-MM-dd"
                            placeholder="到期日"
                            class="col-input" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="未发行额度：" prop="financingBalance" class="p-left-80">
            <money-input :value.sync="dataForm.financingBalance"
                         :edit-display-value="dataForm.financingBalanceText"
                         placeholder="未发行额度"
                         :is-disabled="true"
                         :suffix="audit.currency=='元'? $getDictLabel('unit',$store.state.unit):audit.currency"></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="实际还款：" prop="financingBalance" class="p-left-80">
            <money-input :value.sync="dataForm.actualRepayment"
                         :edit-display-value="dataForm.actualRepayment"
                         placeholder=""
                         :is-disabled="true"
                         :suffix="audit.currency=='元'? $getDictLabel('unit',$store.state.unit):audit.currency"></money-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">
          <el-form-item label="还本付息：" prop="isPayPrincipalAndInterest" class="p-left-80">
            <ren-radio-group  v-model="dataForm.isPayPrincipalAndInterest"
                              :disabled="dataForm.isDisabled"
                              dict-type="isPayPrincipalAndInterest"></ren-radio-group>
          </el-form-item>
        </el-col>-->
        <el-col :span="6">
          <el-form-item label="其他费用：" prop="otherExpenses" class="p-left-80">
            <money-input :value.sync="dataForm.otherExpenses"
                         :edit-display-value="dataForm.otherExpensesText"
                         :is-disabled="dataForm.isDisabled"
                         :suffix="$getDictLabel('unit',$store.state.unit)"
                         placeholder="其他费用"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否占用授信：" prop="otherExpenses" class="p-left-110">
            <el-radio-group v-model="dataForm.occupancyCreditQuota">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="费用说明：" prop="otherExpensesDesc" class="p-left-80">
            <el-input placeholder="费用说明"
                      v-model="dataForm.otherExpensesDesc"
                      :disabled="dataForm.isDisabled"
                      class="col-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="项目：" prop="project"  class="p-left-50">
            <el-input v-model="dataForm.project"
                      :disabled="dataForm.isDisabled"
                      placeholder="项目"
                      class="col-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="用途：" prop="purpose" class="p-left-50">
          <el-input type="textarea"
                    placeholder="用途"
                    v-model="dataForm.purpose"
                    :disabled="dataForm.isDisabled"
                    maxlength="200"
                    class="col-input"
                    show-word-limi></el-input>
        </el-form-item>
      </el-row>
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
      <finance-credit-reporting-measures :disabled="dataForm.isDisabled" :rmb="this.dataForm.issueQuota" :data-form="dataForm"></finance-credit-reporting-measures>

      <el-divider content-position="left">中介机构</el-divider>

      <template  v-for="(item,index) in dataForm.intermediaryStructureList">
        <el-row>
          <el-col :span="6" >
            <el-form-item label="中介机构类型：" class="p-left-110">
              <ren-select v-model="item.intermediaryValue"
                          dict-type="intermediary"
                          placeholder="中介机构类型"
                          :disabled="dataForm.isDisabled"
                          style="width: 100%"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="中介机构名称：" class="p-left-110">
              <el-input v-model="item.orgName"
                        placeholder="中介机构名称"
                        :disabled="dataForm.isDisabled"
                        class="col-input"></el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="5">
            <el-form-item label="费率：" class="p-left-50">
              <el-input v-model="item.rate"
                        :disabled="dataForm.isDisabled"
                        placeholder="费率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="6">
            <el-form-item label="中介费用：" class="p-left-80">
              <money-input :value.sync="item.amount"
                           :edit-display-value="item.amountText"
                           :is-disabled="dataForm.isDisabled"
                           :suffix="$getDictLabel('unit',$store.state.unit)"
                           placeholder="发行金额" ></money-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <i class="el-icon-delete remove-icon" :class="[disabled===true?'is-disabled':'']" @click="handleRemove('intermediaryStructureList',index)"></i>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-button type="primary"
                 size="small"
                 class="add-upload-btn"
                 :disabled="dataForm.isDisabled"
                 @click="addRow('intermediaryStructureList')">
        <i class="el-icon-document-add el-icon--left"></i>增行
      </el-button>
      <el-divider content-position="left">投资人</el-divider>

      <template  v-for="(item,index) in dataForm.investorList">
        <el-row>
          <el-col :span="6" >
            <el-form-item label="债券购买人：" prop="institution" class="p-left-90">
              <finance-dept-tree
                  @change="changeTreeChoose"
                  :params="item"
                  v-model="item.investorId"
                  :dept-name="item.investorName"
                  :disabled="dataForm.isDisabled"
                  placeholder="债券购买人"
              ></finance-dept-tree>
            </el-form-item>
<!--            <el-form-item label="投资人："  class="p-left-70">
              <el-input v-model="item.investorName"
                        :disabled="dataForm.isDisabled"
                        placeholder="投资人"
                        class="col-input"></el-input>
            </el-form-item>-->
          </el-col>
          <el-col :span="6">
            <el-form-item label="投资金额：" class="p-left-80">
              <money-input :value.sync="item.investorAmount"
                           :edit-display-value="item.investorAmountText"
                           :is-disabled="dataForm.isDisabled"
                           :suffix="$getDictLabel('unit',$store.state.unit)"
                           placeholder="投资金额"></money-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注：" class="p-left-50">
              <el-input v-model="item.remarks"
                        placeholder="备注"
                        :disabled="dataForm.isDisabled"
                        class="col-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <i class="el-icon-delete remove-icon" :class="[disabled===true?'is-disabled':'']" @click="handleRemove('investorList',index)"></i>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-button type="primary"
                 :disabled="dataForm.isDisabled"
                 size="small"
                 class="add-upload-btn"
                 @click="addRow('investorList')">
        <i class="el-icon-document-add el-icon--left"></i>增行
      </el-button>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload :disabled="dataForm.isDisabled"
                      :data-form="dataForm"
                      table-width="100%"
                      ref="finance-upload"></finance-upload>
    </el-form>
    <finance-repay  v-show="activeIndex=='2'"
                    key="interest1"
                    :page-type="1"
                    :value-date="dataForm.valueDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.dueDate"
                    rate-type="0"
                    :issue-quota="dataForm.issueQuota"
                    :data-form="dataForm"
                    :interest-method="dataForm.interestMethod"
                    :principal-method="dataForm.principalMethod"
                    :pay-plan-data="dataForm.payPlanData"
                    :is-disabled="dataForm.isDisabled"
                    ref="paymentTable"></finance-repay>
    <finance-repay-interest  v-show="activeIndex=='4'"
                             key="interest2"
                    :page-type="1"
                    :value-date="dataForm.valueDate"
                    :rate="dataForm.rate"
                    :due-date="dataForm.dueDate"
                    rate-type="0"
                    :issue-quota="dataForm.issueQuota"
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

    <el-form v-show="activeIndex=='3'" class="custom-form">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deptName" label="融资单位：" class="p-left-80">
            {{audit.deptName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="varieties" label="融资品种：" class="p-left-80">
            {{audit.varieties}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="审批单位："  class="p-left-80">
            {{$getDictLabel('approveOrg',audit.approveOrg)}}
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="批文号：" class="p-left-70">
            {{audit.approveNo}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="币种：" class="p-left-80">
            {{$getDictLabel('currency',audit.currency)}}
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="发行金额：" class="p-left-80">
            {{audit.issueQuota}} {{ audit.currency=='元'? $getDictLabel('unit',$store.state.unit):audit.currency }}
          </el-form-item>
        </el-col>

      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload-details :disabled="dataForm.isDisabled" table-width="100%" ref="finance-upload-2"></finance-upload-details>
    </el-form>

    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" :disabled="dataForm.isDisabled" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceUpload from '../../../components/finance-upload'
import MoneyInput from '@/components/money-input'
import FinanceRepay from '@/components/finance-repay'
import FinanceRepayInterest from '@/components/finance-repay-interest'
import FinanceCreditReportingMeasures from '@/components/finance-credit-reporting-measures'
import FinanceUploadDetails from '@/components/finance-upload/details'
import FinanceRepayReal from '@/components/finance-repay-real'
export default {
  components: {
    FinanceUploadDetails,
    FinanceCreditReportingMeasures,
    FinanceRepay,
    MoneyInput,
    FinanceUpload,
    FinanceRepayInterest,
    FinanceRepayReal
  },
  data () {
    return {
      activeIndex: '1',
      visible: false,
      width: '85%',
      // 金融机构
      deptList: [],
      // 初始化数据 中介机构数据
      intermediaryStructureList: {
        id: '',
        // 机构类型值
        intermediaryValue: '',
        // 机构类型文本
        intermediaryLabel: '',
        // 机构名称
        orgName: '',
        // 中介费用
        amount: '',
        amountText: '',
        // 费率
        rate: ''
      },
      // 初始化数据 投资人
      investorList: {
        id: '',
        // 投资人
        investorName: '',
        // 投资金额
        investorAmount: '',
        investorAmountText: '',
        // 备注
        remarks: ''
      },
      // 批文下拉
      approveNos: [],
      // 证券公司下拉-》主承销商
      secComNames: [],
      // 当前批文信息
      audit: {
        // 融资品种
        varieties: '',
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
        issueQuotaText: '',
        // 发行次数 查出来的
        issue: '',
        allUseQuota: 0,
        // 附件列表
        fileList: []
      },
      dataForm: {
        // 是否占用授信
        occupancyCreditQuota: 0,
        // 证券公司id-》主承销商
        secComId: '',
        // 承销费率
        underwritingRate: '',
        // 承销费率回显
        underwritingRateText: '',
        // 审核通过就禁用
        isDisabled: false,
        // 主键id
        id: '',
        // 批文号
        approveNo: '',
        // 发行期次，从数据库统计出来的
        issue: '',
        // 融资单位id
        deptId: '',
        // 融资单位
        deptName: '',
        // 融资品种
        // varieties: '',
        // 付息周期
        serviceCycle: '',
        // 项目
        project: '',
        // 币种
        currency: '元',
        // 发行外币金额
        foreignCurrencyAmount: '',
        // 发行外币金额回显
        foreignCurrencyAmountText: '',
        // 利率
        rate: '',
        // 汇率
        exchangeRate: '',
        // 付息方式
        interestMethod: '0',
        // 还本方式
        principalMethod: '0',

        // 折合人民币
        issueQuota: '',
        // 折合人民币回显
        issueQuotaText: '',
        // 发行日
        issueDate: '',
        // 起息日
        valueDate: '',
        // 到期日
        dueDate: '',

        // 融资余额-》未发行额度
        financingBalance: '',
        // 融资余额回显-》未发行额度
        financingBalanceText: '',
        actualRepayment: '',
        // 用途
        purpose: '',
        // 决策依据
        decisionBasis: '',
        // 其他费用
        otherExpenses: '',
        // 其他费用回显
        otherExpensesText: '',
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
        approveNo: [
          { required: true, message: '请选择批文号', trigger: 'change' }
        ],
        /* deptName: [
          { required: true, message: '请选择融资单位', trigger: 'change' }
        ], */
        /* varieties: [
          { required: true, message: '请选择融资品种', trigger: 'change' }
        ], */
        // 利率
        rate: [
          { required: true, message: '请输入利率', trigger: 'blur' }
        ],
        // 汇率
        exchangeRate: [
          { required: true, message: '请输入汇率', trigger: 'blur' }
        ],
        // 发行外币金额
        foreignCurrencyAmount: [
          { required: true, message: '请输入发行外币金额', trigger: 'blur' }
        ],
        /* issueQuota: [
          { required: true, message: '请输入折合人民币金额', trigger: 'blur' }
        ], */
        // 发行日
        issueDate: [
          { required: true, message: '请输入发行日', trigger: 'change' }
        ],
        // 起息日
        valueDate: [
          { required: true, message: '请输入起息日', trigger: 'change' }
        ],
        // 到期日
        dueDate: [
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
    changeTreeChoose (node, item) {
      item.investorName = node.name
    },
    formatNumber () {
      this.dataForm.rate = this.$isNotNull(this.dataForm.rate) && this.dataForm.rate != 0 ? Number(this.dataForm.rate).toFixed(4) : 0
    },
    // 人民币换算
    countIssueQuota () {
      console.log('blur')
      const { foreignCurrencyAmount, exchangeRate } = this.dataForm
      if (!this.$isNotNull(foreignCurrencyAmount) || foreignCurrencyAmount == 0) {
        return
      }
      if (!this.$isNotNull(exchangeRate) || exchangeRate == 0) {
        return
      }
      this.dataForm.payPlanData = {
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
      this.dataForm.financingBalance = Number(this.audit.issueQuota) - Number(this.audit.allUseQuota) - Number(this.dataForm.foreignCurrencyAmount)
      this.dataForm.financingBalanceText = this.dataForm.financingBalance
      this.dataForm.issueQuota = Number(this.dataForm.foreignCurrencyAmount) * Number(this.dataForm.exchangeRate)
      this.dataForm.issueQuotaText = this.dataForm.issueQuota
    },
    async init () {
      this.activeIndex = '1'
      await this.getDeptList()
      await this.getApprovalList()
      await this.getSecComNameList()
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
        // 是否占用授信
        occupancyCreditQuota: 0,
        // 证券公司id-》主承销商
        secComId: '',
        // 承销费率
        underwritingRate: '',
        // 承销费率回显
        underwritingRateText: '',
        // 审核通过就禁用
        isDisabled: false,
        // 主键id
        id: '',
        // 批文号
        approveNo: '',
        // 发行期次，从数据库统计出来的
        issue: '',
        // 融资单位id
        deptId: '',
        // 融资单位
        deptName: '',
        // 融资品种
        // varieties: '',
        // 付息周期
        serviceCycle: '',
        // 付息方式
        interestMethod: '0',
        principalMethod: '0',
        // 币种
        currency: '美元',
        // 发行外币金额
        foreignCurrencyAmount: '',
        // 发行外币金额回显
        foreignCurrencyAmountText: '',
        actualRepayment: '',
        // 项目
        project: '',
        // 利率
        rate: '',
        // 汇率
        exchangeRate: '',
        // 折合人民币
        issueQuota: '',
        // 折合人民币回显
        issueQuotaText: '',
        // 发行日
        issueDate: '',
        // 起息日
        valueDate: '',
        // 到期日
        dueDate: '',

        // 融资余额-》未发行额度
        financingBalance: '',
        // 融资余额回显-》未发行额度
        financingBalanceText: '',
        // 用途
        purpose: '',
        // 决策依据
        decisionBasis: '',
        // 其他费用
        otherExpenses: '',
        // 其他费用回显
        otherExpensesText: '',
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
      // 当前批文信息
      this.audit = {
        // 融资品种
        varieties: '',
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
        issueQuotaText: '',
        // 发行次数 查出来的
        issue: '',
        allUseQuota: 0,
        // 附件列表
        fileList: []
      }
    },

    // 获取金融机构列表
    async getDeptList () {
      try {
        const { data } = await this.$http.get('/financing/finance-dept/list')
        if (data.code !== 0) {
          console.log('getDeptList', data.msg)
          return this.$message.error(data.msg)
        }
        this.deptList = data.data
      } catch (e) {
        console.log('getDeptList-e:', e)
      }
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
    // 获取证券公司列表-》主承销商
    async getSecComNameList () {
      try {
        const { data } = await this.$http.get('/sys/seccom/list')
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.secComNames = []
        data?.data?.map(item => {
          const object = {
            dictValue: item.id,
            dictLabel: item.secComName
          }
          this.secComNames.push(object)
        })
      } catch (e) {
        console.log('getDeptList-e:', e)
      }
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/fdirectfinancing/' + this.dataForm.id + '/' + this.$store.state.unit)
        console.log('data', data)
        if (data.code !== 0) {
          console.log('getInfo', data.msg)
          return this.$message.error(data.msg)
        }
        const _data = data.data
        // 发行外币金额
        _data.foreignCurrencyAmountText = _data.foreignCurrencyAmount
        // 折合人民币
        _data.issueQuotaText = _data.issueQuota
        // 承销费率
        _data.underwritingRateText = _data.underwritingRate
        // 融资余额-》未发行额度
        _data.financingBalanceText = _data.financingBalance
        // 其他费用
        _data.otherExpensesText = _data.otherExpenses
        _data.intermediaryStructureList?.map(item => {
          item.amountText = item.amount
        })
        _data.investorList?.map(item => {
          item.investorAmountText = item.investorAmount
        })
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
        this.approveChange(_data.approveNo)
        this.dataForm = _data
        this.formatNumber()
        console.log('getinfo', this.dataForm)
      } catch (e) {
        console.log('getInfo-e:', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        if (this.dataForm.isDisabled === true) {
          return
        }
        this.$refs.dataForm.validate(async (valid) => {
          if (!valid) {
            return false
          }
          try {
            // const params = { ...this.dataForm }
            const params = JSON.parse(JSON.stringify(this.dataForm))
            params.creditMeasuresList = params.creditMeasures
            delete params.creditMeasures
            params.payPlanData.endNeedCount = params.payPlanData.endNeedCount === true ? 1 : 0
            params.payPlanData.isPayPrincipalAndInterest = params.payPlanData.isPayPrincipalAndInterest === true ? 1 : 0
            params.unit = this.$store.state.unit
            params.payPlanData.repayPrincipalPlanList = params.payPlanData.payPlan
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
            console.log('直融提交参数', params)
            const { data } = await this.$http[!this.dataForm.id ? 'post' : 'put']('/financing/fdirectfinancing/', params)
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
      console.log(val)
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
      this.width = val == '1' ? '85%' : '80%'
      if (val == 2) this.$refs.paymentTable.getRepaymentMoney()
      if (val == 4) this.$refs.paymentInterestTable.getRepaymentMoney()
    },
    // 批文切换
    approveChange (val) {
      const item = this.approveNos.find(item => item.dictValue == val)
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
    },
    addRow (attrName) {
      if (this.dataForm.isDisabled === true) {
        return
      }
      const object = JSON.parse(JSON.stringify(this[attrName]))
      this.dataForm[attrName].push(object)
    },
    handleRemove (attrName, index) {
      if (this.dataForm.isDisabled === true) {
        return
      }
      this.dataForm[attrName].splice(index, 1)
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
