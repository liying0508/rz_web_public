<template>
<!--  担保信息审核-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fguaranteeinfo__audit">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
        <el-form-item>
          <el-input v-model="dataForm.guarantor" placeholder="保证人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="credit" label="信用" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{dataForm.credit===true || dataForm.credit== '1' ?'信用':''}}
          </template>
        </el-table-column>
        <el-table-column prop="guarantor" label="保证人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ratio" label="合同比例(%)" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contractAmount" label="合同金额（元）" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="collateralName" label="抵押物名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="collateralAmount" label="抵押物评估值（元）" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="collateralContract" label="抵押合同" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mortgager" label="抵押物所有人" header-align="center" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column prop="releaseTime" label="抵押起止日期" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{$isNotNull(row.releaseTime)&& row.releaseTime.length>1?`${$formatDate(row.releaseTime[0],'YYYY-MM-DD')}至 ${$formatDate(row.releaseTime[1],'YYYY-MM-DD')}`:''}}
          </template>
        </el-table-column>
        <el-table-column prop="pledgeType" label="质押标的" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pledgeName" label="质押人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pledgeAmount" label="质押价值（元）" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pledgeReleaseTime" label="抵押起止日期" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{$isNotNull(row.pledgeReleaseTime)&& row.pledgeReleaseTime.length>1?`${$formatDate(row.pledgeReleaseTime[0],'YYYY-MM-DD')}至 ${$formatDate(row.pledgeReleaseTime[1],'YYYY-MM-DD')}`:''}}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="审核结果" header-align="center" align="center" min-width="100">
          <template slot-scope="{row}">
            {{row.isChecked=='1'?'通过':row.isChecked=='2'?'未通过':'审核中'}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fguaranteeinfo:audit')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">审核</el-button>
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
      <fguaranteeinfo-audit-details v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></fguaranteeinfo-audit-details>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import FguaranteeinfoAuditDetails from '@/views/modules/financing/fguaranteeinfo-audit-details'
import { getIndex, queryWithObject } from '@/utils/find-list-data'
import { GUARANTEE_SET } from '@/store/test/fguaranteeinfo'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      tableList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/financing/fguaranteeinfo/page',
        getDataListIsPage: true,
        exportURL: '/financing/fguaranteeinfo/export',
        deleteURL: '/financing/fguaranteeinfo',
        deleteIsBatch: true
      },
      dataForm: {
        guarantor: ''
      }
    }
  },
  components: {
    FguaranteeinfoAuditDetails
  }
}
</script>
