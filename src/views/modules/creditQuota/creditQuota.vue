<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-lpr__flpr">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(queryToChangeData)">
        <el-form-item>
          <el-button @click="getDataList(queryToChangeData)" v-if="$hasPermission('creditQuota:creditQuota:list')">{{ $t('query') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="$hasPermission('creditQuota:creditQuota:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('creditQuota:creditQuota:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <!-- <el-form-item label="单位：" prop="unit" class="p-left-80" style="float:right">
          <ren-select v-model="dataForm.unit"
                      :disabled="dataForm.isDisabled"
                      dict-type="unit" class="col-input"></ren-select>
        </el-form-item> -->
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index" label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="institutionName" label="银行名称" header-align="center" align="center"></el-table-column>

        <el-table-column prop="creditQuota" label="授信总额度" header-align="center" align="center">
          <el-table-column  prop="creditQuotaIndirect" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="creditQuotaDirect" label="直融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="totalSubtotal" label="小计" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="creditQuota" label="已使用额度" header-align="center" align="center">
          <el-table-column  prop="usedQuotaIndirect" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="usedQuotaDirect" label="直融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="usedSubtotal" label="小计" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="creditQuota" label="未使用额度" header-align="center" align="center">
          <el-table-column  prop="unusedQuotaIndirect" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="unusedQuotaDirect" label="直融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="unusedSubtotal" label="小计" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('creditQuota:creditQuota:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('creditQuota:creditQuota:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList(queryToChangeData)"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './creditQuota-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/creditQuota/list',
        getDataListIsPage: false,
        exportURL: '/creditQuota/export',
        deleteURL: '/creditQuota',
        deleteIsBatch: true,
        createdIsNeed: false
      },
      dataForm: {
        // unit: this.$store.state.unit
        month: ''
      }
    }
  },
  watch: {

  },
  methods: {
    queryToChangeData () {
      console.log('queryToChange', this.dataList)
      this.dataList.map(item => {
        item.creditQuotaIndirect = this.$isNotNull(item.creditQuotaIndirect) ? Number(item.creditQuotaIndirect) : 0
        item.creditQuotaDirect = this.$isNotNull(item.creditQuotaDirect) ? Number(item.creditQuotaDirect) : 0
        item.usedQuotaIndirect = this.$isNotNull(item.usedQuotaIndirect) ? Number(item.usedQuotaIndirect) : 0
        item.usedQuotaDirect = this.$isNotNull(item.usedQuotaDirect) ? Number(item.usedQuotaDirect) : 0
        item.unusedQuotaIndirect = item.creditQuotaIndirect - item.usedQuotaIndirect
        item.unusedQuotaDirect = item.creditQuotaDirect - item.usedQuotaDirect
        item.totalSubtotal = item.creditQuotaIndirect + item.creditQuotaDirect
        item.usedSubtotal = item.usedQuotaIndirect + item.usedQuotaDirect
        item.unusedSubtotal = item.unusedQuotaIndirect + item.unusedQuotaDirect
      })
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    const date = new Date()
    this.dataForm.month = date.getFullYear() + '-' + String((date.getMonth() + 1)).padStart(2, '0') + '-01'
    this.query(this.queryToChangeData)
  }
}
</script>
