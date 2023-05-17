<template>
<!--  直接融资-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fdirectfinancing">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <!-- <el-form-item>
          <el-input v-model="dataForm.condition" placeholder="关键字" clearable></el-input>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-input v-model="dataForm.deptName" placeholder="融资单位" clearable></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-input v-model="dataForm.approvalAmount" placeholder="审批金额" clearable></el-input>
        </el-form-item>
         <el-form-item>
           <el-input v-model="dataForm.varieties" placeholder="融资品种" clearable></el-input>
<!--          <ren-select v-model="dataForm.varieties" dict-type="varieties" placeholder="融资品种"></ren-select>-->
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.issueQuota" placeholder="折合人民币" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.creditMeasures" dict-type="creditMeasures" :multiple="true" placeholder="增信措施"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:fdirectfinancing:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('financing:fdirectfinancing:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
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
      <el-table v-loading="dataListLoading"
                :data="dataList"
                row-key="id"
                border
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle"

                height="calc(100vh - 280px)"
                style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="deptName" label="融资单位" width="200px" header-align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="approveNo" label="批文号" header-align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalAmount" :label="`审批金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" >
          <template slot-scope="{row}">
            {{$numberFormat(row.approvalAmount)}}
          </template>

        </el-table-column>
        <el-table-column prop="varieties" label="融资品种" header-align="center" align="center"></el-table-column>
        <el-table-column prop="foreignCurrencyAmount" :label="`发行外币金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $numberFormat(row.foreignCurrencyAmount)}}
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
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fdirectfinancing:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="$hasPermission('financing:fdirectfinancing:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './fdirectfinancing-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        // condition: '',
        // deptName: '',
        approvalAmount: '',
        issueQuota: '',
        varieties: '',
        creditMeasures: '',
        unit: this.$store.state.unit
      },
      mixinViewModuleOptions: {
        deleteIsBatch: true,
        getDataListIsPage: true,
        getDataListURL: '/financing/fdirectfinancing/page',
        exportURL: '/financing/fdirectfinancing/export',
        deleteURL: '/financing/fdirectfinancing'
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
