<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord-report">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.no" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.beginDate" :picker-options="startTimeOptions" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" @focus="clickStartTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.endDate" :picker-options="endTimeOptions" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" @focus="clickEndTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button v-if="$hasPermission('financing:fcreditrecord:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
        <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
        <!-- <el-table-column prop="val1" label="授信单编号" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="val2" label="融资渠道" header-align="center" align="center"></el-table-column>
        <el-table-column prop="val3" label="类别" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field1" label="2020年底融资余额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field2" label="2021年新增融资" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field3" label="2021年已还金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field4" label="期末融资余额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field5" label="2021年剩余到期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field6" label="2022年剩余到期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field7" label="2023年剩余到期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field8" label="2024年剩余到期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field9" label="2025年剩余到期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field10" label="2026年及以后" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field11" label="备注" header-align="center" align="center"></el-table-column>
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
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '',
        getDataListIsPage: true,
        exportURL: '',
        deleteIsBatch: true
      },
      dataForm: {
      },
      dataList: [
        {val1: 'No.1001', val2: '直融', val3: '银行机构', field1: 8000, field2: 10000, field3: 5000, field4: 13000, field5: 13000, field6: 11000, field7: 9000, field8: 7000, field9: 5000, field10: 3000, field11: '备注1' },
        {val1: 'No.1002', val2: '间融', val3: '非银机构', field1: 5000, field2: 20000, field3: 8000, field4: 17000, field5: 17000, field6: 15000, field7: 13000, field8: 11000, field9: 9000, field10: 7000, field11: '备注2' }
      ],      
      startTimeOptions:{}, 
      endTimeOptions:{},
    }
  },
  
  mounted: function () {
    this.getSpanArr(this.dataList)
  },
  watch: {
  },
  components: {
  },
  methods: {    
    clickStartTime() {
      this.startTimeOptions.disabledDate = time => {
        if (this.dataForm.endDate) {
          if (time.getTime() > new Date(this.dataForm.endDate).getTime()) {
            return true
          }
        }
      }
    },
    clickEndTime(){
      this.endTimeOptions.disabledDate = time => {
        if (this.dataForm.beginDate) {
          return (
            time.getTime() < new Date(this.dataForm.beginDate).getTime()
          )
        }
      }
    },
  }
}
</script>
