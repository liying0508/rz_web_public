<template>
<!--  间接融资-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__findirectfinancing">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="融资单位" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:findirectfinancing:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:findirectfinancing:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList"
                border
                @selection-change="dataListSelectionChangeHandle"
                style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="deptName" label="融资单位" header-align="center" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="institutionType" label="金融机构类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="{row}">
            {{$getDictLabel('finance_dept_type',row.institutionType)}}
          </template>
        </el-table-column>
        <el-table-column prop="institutionName" label="金融机构" show-overflow-tooltip header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="varieties" label="融资品种" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("varieties",row.varieties) }}
          </template>
        </el-table-column>
        <el-table-column prop="marginRatio" label="保证金比例" header-align="center" align="center"></el-table-column>
        <el-table-column prop="discountRate" label="贴现率" header-align="center" align="center"></el-table-column>
        <el-table-column prop="interestRatesWay" label="利率类型" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("interestRatesWay",row.interestRatesWay) }}
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="利率" header-align="center" align="center"></el-table-column>
        <el-table-column prop="contractNo" label="合同编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="contractAmount" label="合同金额" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.contractAmount)}} 元
          </template>
        </el-table-column>
        <el-table-column prop="invoiceAmount" label="开票金额" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.invoiceAmount)}} 元
          </template>
        </el-table-column>
        <el-table-column prop="withdrawalAmount" label="提款金额" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.withdrawalAmount)}} 元
          </template>
        </el-table-column>
        <el-table-column prop="interestMethod" label="付息方式" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("interestMethod",row.interestMethod) }}
          </template>
        </el-table-column>

        <el-table-column prop="loanDate" label="放款日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="repaymentDate" label="还款日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="availableBalance" label="可用余额" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.availableBalance)}} 元
          </template>
        </el-table-column>
        <el-table-column prop="otherExpenses" label="其他费用" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.otherExpenses)}} 元
          </template>
        </el-table-column>
        <el-table-column prop="purpose" label="用途" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="creditMeasures" label="增信措施" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("creditMeasures", row.creditMeasures) }}
          </template>
        </el-table-column>
        <el-table-column prop="decisionBasis" label="决策依据" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:findirectfinancing:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('financing:findirectfinancing:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './findirectfinancing-add-or-update'
import { queryWithObject, getIndex } from '@/utils/find-list-data'
import { DIRECT_SET } from '@/store/test/findirectfinancing'

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
        name: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
