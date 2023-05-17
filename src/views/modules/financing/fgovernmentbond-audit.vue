<template>
<!--  政府债券审批-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fgovernmentbond">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
        <el-form-item>
          <el-input v-model="dataForm.financingAmount" placeholder="融资金额" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.project" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.isChecked" dict-type="audit_status" placeholder="审核状态"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item label="单位：" prop="unit" class="p-left-80" style="float:right">
          <ren-select v-model="dataForm.unit"
                      :disabled="dataForm.isDisabled"
                      dict-type="unit" class="col-input"></ren-select>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading"
                :data="dataList"
                height="calc(100vh - 280px)"
                border
                style="width: 100%;">
        <el-table-column prop="varieties" label="融资品种" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("varieties",row.varieties) }}
          </template>
        </el-table-column>
        <el-table-column prop="financingAmount" :label="`融资金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.financingAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="利率(%)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="loanDate" label="起息日" header-align="center" align="center"></el-table-column>
        <el-table-column prop="repaymentDate" label="到期日" header-align="center" align="center"></el-table-column>
        <el-table-column prop="financingBalance" :label="`融资余额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.financingBalance)}}
          </template>
        </el-table-column>
        <el-table-column prop="project" label="用款项目" header-align="center" align="center"></el-table-column>
        <el-table-column prop="interestMethod" label="付息方式" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("serviceCycle",row.interestMethod) }}
          </template>
        </el-table-column>
        <el-table-column prop="principalMethod" label="还本方式" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("serviceCycle",row.principalMethod) }}
          </template>
        </el-table-column>
        <el-table-column prop="creditMeasures" label="增信措施" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("creditMeasures", row.creditMeasures) }}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="审核结果" header-align="center" align="center" min-width="100">
          <template slot-scope="{row}">
            {{row.isChecked=='1'?'通过':row.isChecked=='2'?'未通过':'审核中'}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fgovernmentbond:audit')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">审核</el-button>
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
      <fgovernmentbond-audit-details v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></fgovernmentbond-audit-details>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import FgovernmentbondAuditDetails from '@/views/modules/financing/fgovernmentbond-audit-details'
import { getIndex, queryWithObject } from '@/utils/find-list-data'
import { GIC_SET } from '@/store/test/fgovernmentbond'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      tableList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/financing/governmentbondaudit/page',
        getDataListIsPage: true,
        exportURL: '/financing/fgovernmentbond/export',
        deleteURL: '/financing/fgovernmentbond',
        deleteIsBatch: true
      },
      dataForm: {
        order: 'desc',
        orderField: 'create_date',
        financingAmount: '',
        project: '',
        unit: this.$store.state.unit,
        isChecked: ''
      }
    }
  },
  components: {
    FgovernmentbondAuditDetails
  }
}
</script>
