<template>
<!--  直接融资集团审批-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fdirectfinancing">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.issueQuota" placeholder="审批金额" clearable></el-input>
        </el-form-item>
         <el-form-item>
          <ren-select v-model="dataForm.varieties" dict-type="varieties" placeholder="融资品种"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.issueQuota" placeholder="折合人民币" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.creditMeasures" dict-type="creditMeasures" placeholder="增信措施"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.groupChecked" dict-type="audit_status" placeholder="集团审核状态"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
         <el-form-item label="单位：" prop="unit" class="p-left-80" style="float:right">
          <ren-select v-model="dataForm.unit"
                      :disabled="dataForm.isDisabled"
                      dict-type="unit" class="col-input"></ren-select>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading"
      height="calc(100vh - 280px)"
                :data="dataList"
                border
                style="width: 100%;">
        <el-table-column prop="deptName" label="融资单位" width="200px" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="approveNo" label="批文号" header-align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="issueQuota" :label="`审批金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.issueQuota)}}
          </template>
        </el-table-column>
        <el-table-column prop="varieties" label="融资品种" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("varieties",row.varieties) }}
          </template>
        </el-table-column>
        <el-table-column prop="foreignCurrencyAmount" :label="`发行外币金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.foreignCurrencyAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="issueQuota" :label="`折合人民币（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $numberFormat(row.issueQuota)}}
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="利率（%）" header-align="center" align="center"></el-table-column>
        <el-table-column prop="issueDate" label="发行日" sortable="custom" width="100px" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $formatDate(row.issueDate,'YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="valueDate" label="起息日" sortable="custom" width="100px" header-align="center" align="center" >
          <template slot-scope="{row}">
            {{ $formatDate(row.valueDate,'YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日" sortable="custom" width="100px" header-align="center" align="center" >
          <template slot-scope="{row}">
            {{ $formatDate(row.dueDate,'YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="creditMeasures" label="增信措施" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("creditMeasures", row.creditMeasures) }}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="子公司审核结果" header-align="center" align="center" min-width="100">
          <template slot-scope="{row}">
            {{row.isChecked=='1'?'通过':row.isChecked=='2'?'未通过':'审核中'}}
          </template>
        </el-table-column>
         <el-table-column prop="result" label="集团审核结果" header-align="center" align="center" min-width="100">
          <template slot-scope="{row}">
            {{row.groupChecked=='1'?'通过':row.groupChecked=='2'?'未通过':'审核中'}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fdirectfinancing:group:audit')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">审核</el-button>
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
      <fdirectfinancing-audit-details v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></fdirectfinancing-audit-details>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import FdirectfinancingAuditDetails from '@/views/modules/financing/fdirectfinancing-group-audit-details'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        order: 'desc',
        orderField: 'create_date',
        approvalAmount: '',
        issueQuota: '',
        varieties: '',
        creditMeasures: '',
        groupChecked: '',
        unit: this.$store.state.unit
      },
      mixinViewModuleOptions: {
        deleteIsBatch: true,
        getDataListIsPage: true,
        getDataListURL: '/financing/audit/page',
        deleteURL: '/financing/audit'
      }
    }
  },
  components: {
    FdirectfinancingAuditDetails
  }
}
</script>
