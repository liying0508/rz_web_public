<template>
  <!--  间接融资集团审核-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__findirectfinancing">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item>
          <ren-dept-tree
            v-model="dataForm.deptId"
            placeholder="金融机构"
            class="col-input"
            :dept-name.sync="dataForm.deptName"
            :query="true"
          ></ren-dept-tree>
        </el-form-item>
        <el-form-item>
          <ren-select
            v-model="dataForm.varieties"
            dict-type="varieties"
            placeholder="融资品种"
          ></ren-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="dataForm.contractAmount"
            placeholder="合同金额"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="dataForm.withdrawalAmount"
            placeholder="提款金额"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="dataForm.deadLine"
            placeholder="期限"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select
            v-model="dataForm.creditMeasures"
            :multiple="true"
            dict-type="creditMeasures"
            placeholder="增信措施"
          ></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select
            v-model="dataForm.groupChecked"
            dict-type="audit_status"
            placeholder="集团审核状态"
          ></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item
          label="单位："
          prop="unit"
          class="p-left-80"
          style="float:right"
        >
          <ren-select
            v-model="dataForm.unit"
            :disabled="dataForm.isDisabled"
            dict-type="unit"
            class="col-input"
          ></ren-select>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        height="calc(100vh - 280px)"
        border
        style="width: 100%;"
      >
        <el-table-column
          prop="deptName"
          label="融资单位"
          header-align="center"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="institutionType"
          label="金融机构类型"
          show-overflow-tooltip
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $getDictLabel('finance_dept_type', row.institutionType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="institutionName"
          label="金融机构"
          show-overflow-tooltip
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="varieties"
          label="融资品种"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $getDictLabel('varieties', row.varieties) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="marginRatio"
          label="保证金比例"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="discountRate"
          label="贴现率"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{
              row.varieties == 2 || row.varieties == 3 ? row.discountRate : '/'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="interestRatesWay"
          label="利率类型"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $getDictLabel('interestRatesWay', row.interestRatesWay) }}
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="执行利率" width="100" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ row.rate?row.rate + '%':0 }}
          </template>
        </el-table-column>
         <el-table-column prop="floatRate" label="浮动利率" width="100" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ row.floatRate!=='0'?row.floatRate + '%':0 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="contractNo"
          label="合同编号"
          header-align="center"
          align="center"
          show-overflow-tooltip
          width="300"
        ></el-table-column>
        <el-table-column
          prop="contractAmount"
          :label="`合同金额(${$getDictLabel('unit', dataForm.unit)})`"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $numberFormat(row.contractAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceAmount"
          :label="`开票金额(${$getDictLabel('unit', dataForm.unit)})`"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $numberFormat(row.invoiceAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawalAmount"
          :label="`提款金额(${$getDictLabel('unit', dataForm.unit)})`"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $numberFormat(row.withdrawalAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="interestMethod"
          label="付息方式"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $getDictLabel('serviceCycle', row.interestMethod) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="loanDate"
          label="放款日期"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deadLine"
          label="期限(月)"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="repaymentDate"
          label="还款日期"
          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="availableBalance"
          :label="`可用余额(${$getDictLabel('unit', dataForm.unit)})`"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $numberFormat(row.availableBalance) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="otherExpenses"
          :label="`其他费用(${$getDictLabel('unit', dataForm.unit)})`"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $numberFormat(row.otherExpenses) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="purpose"
          label="用途"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="creditMeasures"
          label="增信措施"
          show-overflow-tooltip
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ $getDictLabel('creditMeasures', row.creditMeasures) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="decisionBasis"
          label="决策依据"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="result"
          label="审核结果"
          header-align="center"
          align="center"
          min-width="150"
        >
          <template slot-scope="{ row }">
            {{
              row.isChecked == '1'
                ? '通过'
                : row.isChecked == '2'
                ? '未通过'
                : '审核中'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="result"
          label="集团审核结果"
          header-align="center"
          align="center"
          min-width="100"
        >
          <template slot-scope="{ row }">
            {{
              row.groupChecked == '1'
                ? '通过'
                : row.groupChecked == '2'
                ? '未通过'
                : '审核中'
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              v-if="$hasPermission('financing:findirectfinancing:group:audit')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <findirectfinancing-audit-details
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></findirectfinancing-audit-details>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import FindirectfinancingAuditDetails from '@/views/modules/financing/findirectfinancing-group-audit-details'
import { queryWithObject } from '@/utils/find-list-data'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      tableList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/financing/findirectfinancing/page',
        getDataListIsPage: true,
        exportURL: '/financing/findirectfinancing/export',
        deleteURL: '/financing/findirectfinancing',
        deleteIsBatch: true
      },
      dataForm: {
        deptName: '',
        varieties: '',
        contractAmount: '',
        withdrawalAmount: '',
        deadLine: '',
        creditMeasures: '',
        groupChecked: '',
        unit: this.$store.state.unit
      }
    }
  },
  components: {
    FindirectfinancingAuditDetails
  }
}
</script>
