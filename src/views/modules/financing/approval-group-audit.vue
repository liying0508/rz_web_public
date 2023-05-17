<template>
<!--  直融批文集团审批-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fdirectfinancing">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <ren-select v-model="dataForm.approveOrg" dict-type="approveOrg" placeholder="审批单位"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.approveNo" placeholder="批文号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.issueQuota" placeholder="审批金额" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.groupChecked" dict-type="audit_status" placeholder="集团审核状态"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item :label="`单位：`" prop="unit" class="p-left-80" style="float:right">
          <ren-select v-model="dataForm.unit"
                      :disabled="dataForm.isDisabled"
                      dict-type="unit" class="col-input"></ren-select>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" height="calc(100vh - 280px)">
        <el-table-column prop="deptName" label="融资单位" header-align="center" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="approveOrg" label="审批单位" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("approveOrg",row.approveOrg) }}
          </template>
        </el-table-column>
        <el-table-column prop="approveNo" label="批文号" header-align="center" min-width="150"></el-table-column>
        <el-table-column prop="currency" label="币种" header-align="center" min-width="150">
          <template slot-scope="{row}">
            {{ $getDictLabel("currency",row.currency) }}
          </template>
        </el-table-column>
        <el-table-column prop="issueQuota" :label="`审批金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.issueQuota)}}
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
            <el-button v-if="$hasPermission('financing:approval:group:audit')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <approval-audit-details  v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></approval-audit-details>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import ApprovalAuditDetails from '@/views/modules/financing/approval-group-audit-details'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        approveOrg: '',
        approveNo: '',
        issueQuota: '',
        groupChecked: '',
        unit: this.$store.state.unit
      },
      mixinViewModuleOptions: {
        deleteIsBatch: true,
        getDataListIsPage: true,
        getDataListURL: 'financing/approval/page',
        // getDataListURL: '/financing/approval/list',
        deleteURL: '/financing/approval'
      }
    }
  },
  components: {
    ApprovalAuditDetails
  }
}
</script>
