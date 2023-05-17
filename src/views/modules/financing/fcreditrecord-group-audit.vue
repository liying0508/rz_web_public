<template>
<!--  银行授信集团审批-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
         <el-form-item>
            <ren-dept-tree v-model="dataForm.deptId"
                           placeholder="授信单位"
                           class="col-input"
                           :dept-name.sync="dataForm.deptName"  :query="true"></ren-dept-tree>
          </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.quota" placeholder="授信额度" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <ren-select :multiple="true" v-model="dataForm.creditMeasures" dict-type="creditMeasures" placeholder="增信措施"></ren-select> -->
          <ren-select v-model="dataForm.creditMeasures" :multiple="true" dict-type="creditMeasures" placeholder="增信措施"></ren-select>
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
      <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" height="calc(100vh - 280px)">
        <el-table-column prop="deptName" label="授信单位" header-align="center" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="institutionType" label="金融机构类型" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$getDictLabel('finance_dept_type',row.institutionType)}}
          </template>
        </el-table-column>
        <el-table-column prop="institutionName" label="金融机构" header-align="center" align="center"></el-table-column>
        <el-table-column prop="quota" :label="`授信额度（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.quota)}}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="起始日" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="endDate" label="到期日" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="creditMeasures" label="增信措施" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("creditMeasures", scope.row.creditMeasures) }}
          </template>
        </el-table-column>
        <el-table-column :label="`已使用额度（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
<!--          <el-table-column prop="directQuota" label="直接融资" header-align="center" align="center"></el-table-column>-->
          <el-table-column prop="indirectQuota" label="间接融资" header-align="center" align="center">
            <template slot-scope="{row}">
              {{$numberFormat(row.indirectQuota)}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="unUsedQuota" :label="`未使用额度（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{$numberFormat(row.unUsedQuota)}}
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
            <el-button v-if="$hasPermission('financing:fcreditrecord:group:audit')" type="text" size="small" @click="addOrUpdateHandle(scope.row.creditId)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <fcreditrecord-audit-details v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></fcreditrecord-audit-details>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import FcreditrecordAuditDetails from '@/views/modules/financing/fcreditrecord-group-audit-details'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        order: 'desc',
        orderField: 'create_date',
        deptName: '',
        quota: '',
        creditMeasures: '',
        groupChecked: '',
        unit: this.$store.state.unit

      },
      mixinViewModuleOptions: {
        getDataListURL: '/financing/recordgroupaudit/list',
        // getDataListURL: '',
        deleteURL: '/financing/fcreditrecord'
      }
    }
  },
  components: {
    FcreditrecordAuditDetails
  }
}
</script>
