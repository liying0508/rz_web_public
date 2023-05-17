<template>
<!--  政府债券-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fgovernmentbond">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
        <el-form-item>
          <el-input v-model="dataForm.financingAmount" placeholder="融资金额" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.project" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <ren-select v-model="dataForm.varieties" dict-type="varieties" placeholder="融资品种"></ren-select>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="getDataList">{{ $t('query') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button v-if="$hasPermission('financing:fgovernmentbond:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:fgovernmentbond:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
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
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;" height="calc(100vh - 280px)">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
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
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fgovernmentbond:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('financing:fgovernmentbond:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './fgovernmentbond-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      tableList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/financing/fgovernmentbond/page',
        getDataListIsPage: true,
        exportURL: '/financing/fgovernmentbond/export',
        deleteURL: '/financing/fgovernmentbond',
        deleteIsBatch: true
      },
      dataForm: {
        financingAmount: '',
        project: '',
        // varieties: '',
        unit: this.$store.state.unit
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
