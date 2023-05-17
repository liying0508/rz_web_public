<template>
<!--  间接融资-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__findirectfinancing">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <ren-dept-tree v-model="dataForm.deptId"
                           placeholder="融资单位"
                           class="col-input"
                           :dept-name.sync="dataForm.deptName"  :query="true"></ren-dept-tree>
        </el-form-item>
        <el-form-item>
          <finance-dept-tree v-model="dataForm.institutionId"
                               :dept-name.sync="dataForm.institutionName"
                               :query="true"
                               placeholder="金融机构">
            </finance-dept-tree>
        </el-form-item>
         <el-form-item>
          <ren-select v-model="dataForm.varieties" dict-type="varieties" placeholder="融资品种"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList">{{ $t('query') }}</el-button>
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
      <el-table v-loading="dataListLoading" :data="dataList"
                border
                height="calc(100vh - 280px)"
                @selection-change="dataListSelectionChangeHandle"
                style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="deptName" label="融资单位" header-align="center" show-overflow-tooltip align="center" width="300px">
           <template slot-scope="{row}">
            {{row.deptName?row.deptName:'/'}}
          </template>
        </el-table-column>
        <el-table-column prop="institutionName" label="机构名称" header-align="center" show-overflow-tooltip align="center" width="200px">
          <template slot-scope="{row}">
            {{row.institutionName?row.institutionName:'/'}}
          </template>
        </el-table-column>
        <el-table-column prop="varieties" label="融资品种" header-align="center" align="center">
          <template slot-scope="{row}">
            {{ $getDictLabel("varieties", row.varieties) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" :label="`提款金额（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" show-overflow-tooltip align="center" width="150px">
          <template slot-scope="{row}">
            {{$numberFormat(row.totalAmount)}}
          </template>
        </el-table-column>
        <el-table-column prop="principalRepay" :label="`已还本金（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" show-overflow-tooltip align="center" width="150px">
          <template slot-scope="{row}">
            {{$numberFormat(row.principalRepay)}}
          </template>
        </el-table-column>
        <el-table-column prop="outstandingPrincipal" :label="`未还本金（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" show-overflow-tooltip align="center" width="150px">
          <template slot-scope="{row}">
            {{$numberFormat(row.outstandingPrincipal)}}
          </template>
        </el-table-column>
        <el-table-column prop="interestRepay" label="已付利息（元）" header-align="center" show-overflow-tooltip align="center" width="150px">
          <template slot-scope="{row}">
            {{$numberFormat(row.interestRepay)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:repaymentinfo:repayment')" type="text" size="small" @click="addOrUpdateHandle1(scope.row)">还款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination> -->
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './repaymentinfo-add-or-update'
import { queryWithObject, getIndex } from '@/utils/find-list-data'
import { DIRECT_SET } from '@/store/test/findirectfinancing'

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      tableList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/financing/repaymentinfo/list',
        getDataListIsPage: false,
        exportURL: '/financing/repaymentinfo/export',
        deleteURL: '',
        deleteIsBatch: true
      },
      dataForm: {
        deptName: '',
        institutionName: '',
        varieties: '',
        // financingType: '',
        // condition: '',
        unit: this.$store.state.unit
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    addOrUpdateHandle1 (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        try {
          this.$refs.addOrUpdate.dataForm.financingId = row.financingId
          this.$refs.addOrUpdate.dataForm.financingType = row.financingType
          this.$refs.addOrUpdate.init()
        } catch (e) {

        }
      })
    }
  }
}
</script>
