<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-mp__account">
      <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.appId" placeholder="AppID" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="appId" label="AppID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="appSecret" label="AppSecret" header-align="center" align="center"></el-table-column>
        <el-table-column prop="token" label="Token" header-align="center" align="center"></el-table-column>
        <el-table-column prop="aesKey" label="EncodingAESKey" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
            <el-button type="text" size="small" @click="mpHandle(scope.row.appId)">接入</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from './account-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/mp/account/page',
        getDataListIsPage: true,
        deleteURL: '/mp/account',
        deleteIsBatch: true
      },
      dataForm: {
        name: '',
        appId: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    mpHandle (appId) {
      this.$alert(`${window.SITE_CONFIG.apiURL}/mp/portal/` + appId, '公众号配置的URL', {
        confirmButtonText: '关闭'
      })
    }
  }
}
</script>
