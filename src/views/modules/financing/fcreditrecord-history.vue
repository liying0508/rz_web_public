<template>
<!--  银行授信-->
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <!-- <el-form-item>
          <el-input v-model="dataForm.condition" placeholder="关键字" clearable></el-input>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-input v-model="dataForm.name" placeholder="授信单位" clearable></el-input>
        </el-form-item> -->
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
          <ren-select v-model="dataForm.creditMeasures" dict-type="creditMeasures" :multiple="true" placeholder="增信措施"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button v-if="$hasPermission('financing:fcreditrecord:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="$hasPermission('financing:fcreditrecord:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item> -->
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
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle"
                style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
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
        <el-table-column prop="createDate" label="创建日" sortable="custom" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="startDate" label="起始日" sortable="custom" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="endDate" label="到期日" sortable="custom" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="creditMeasures" label="增信措施" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("creditMeasures", scope.row.creditMeasures) }}
          </template>
        </el-table-column>
        <el-table-column :label="`已使用额度（${$getDictLabel('unit',dataForm.unit)}）`" header-align="center" align="center">
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
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fcreditrecord-history:info')" type="text" size="small" @click="addOrUpdateHandle(scope.row.creditId)">查看</el-button>
            <el-button v-if="$hasPermission('financing:fcreditrecord-history:delete')" type="text" size="small" @click="deleteHandle(scope.row.creditId)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './fcreditrecord-history-detail'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        // condition: '',
        // name: '',
        deptName: '',
        quota: '',
        creditMeasures: '',
        unit: this.$store.state.unit
      },
      mixinViewModuleOptions: {
        deleteIsBatch: true,
        getDataListIsPage: false,
        getDataListURL: '/financing/fcreditrecordhistory/list',
        deleteURL: '/financing/fcreditrecordhistory'
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
