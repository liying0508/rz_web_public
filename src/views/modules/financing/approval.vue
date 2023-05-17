<template>
  <!--  直融批文-->
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
          <el-button v-if="$hasPermission('financing:approval:page')" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:approval:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:approval:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item label="单位：" prop="unit" class="p-left-80" style="float:right">
          <ren-select v-model="dataForm.unit"
                      :disabled="dataForm.isDisabled"
                      dict-type="unit" class="col-input"></ren-select>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%;"
                @selection-change="dataListSelectionChangeHandle"
                height="calc(100vh - 280px)"
                @sort-change="dataListSortChangeHandle">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
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
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:approval:save')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="$hasPermission('financing:approval:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './approval-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        order: 'desc',
        orderField: 'create_date',
        approveOrg: '',
        approveNo: '',
        issueQuota: '',
        unit: this.$store.state.unit
      },
      mixinViewModuleOptions: {
        deleteIsBatch: true,
        getDataListIsPage: true,
        getDataListURL: 'financing/approval/page',
        // getDataListURL: '/financing/approval/list',
        exportURL: '/financing/approval/export',
        deleteURL: '/financing/approval'
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
