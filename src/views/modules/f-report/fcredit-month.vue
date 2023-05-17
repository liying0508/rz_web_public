<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord-report">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
<!--        <el-form-item  label="被授信单位">
          <ren-dept-tree v-model="dataForm.deptId" placeholder="被授信单位" :dept-name.sync="dataForm.deptName"></ren-dept-tree>
        </el-form-item>-->
        <el-form-item>
          <el-date-picker v-model="startDate" @change="changeDate" type="month" value-format="yyyy-MM" placeholder="起始月份"></el-date-picker>
        </el-form-item>
<!--        <el-form-item>
          <el-date-picker v-model="dataForm.endDate" :picker-options="endTimeOptions" type="month" value-format="yyyy-MM" placeholder="结束月份" @focus="clickEndTime"></el-date-picker>
        </el-form-item>-->
        <!-- <el-form-item>
          <el-date-picker v-model="dataForm.month" :picker-options="endTimeOptions" type="month" value-format="yyyy-MM" placeholder="月份" @focus="clickEndTime"></el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
              v-loading="dataListLoading"
              :data="dataList"
              border
              @selection-change="dataListSelectionChangeHandle"
              @sort-change="dataListSortChangeHandle"
              :show-summary="true"
              style="width: 100%">
              <!-- <el-table-column :label="`授信明细表${dataForm.month?dataForm.month:''}`" header-align="center" align="center">
                <el-table-column type="index" width="50" label="序号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="name" label="银行名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="quota" label="授信额度" header-align="center" align="center"></el-table-column>
                <el-table-column prop="usedQuota" label="已使用额度" header-align="center" align="center"></el-table-column>
                <el-table-column prop="unUsedQuota" label="剩余额度" header-align="center" align="center"></el-table-column>
              </el-table-column> -->
        <el-table-column prop="institutionName" label="银行名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creditTotalAmount" label="授信额度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="usedAmount" label="已使用额度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="surplusAmount" label="剩余额度" header-align="center" align="center"></el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/report/credit/list',
        exportURL: '',
        createdIsNeed: false
      },
      startDate: '',
      dataForm: {
        month: ''
      },
      myCharts: null,
      chartsOpt: {},
      dataList: []
      // dataList: [{ name: '光大银行', date: '2022-10-22', quota: 20000, usedQuota: 500, unUsedQuota: 1500 }, { name: '建设银行', date: '2022-10-22', quota: 20000, usedQuota: 500, unUsedQuota: 1500 }]
    }
  },
  methods: {
    changeDate () {
      console.log('this', this.startDate)
      this.dataForm.month = this.startDate + '-01'
    }
  },
  created () {
    const month = this.$formatDate(new Date(), 'YYYY-MM')
    this.dataForm.month = month + '-01'
    this.startDate = month
    this.getDataList()
  }
}
</script>
