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
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border :span-method="objectSpanMethod" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="金融机构" header-align="center" align="center">
          <el-table-column prop="institutionType" label="类别" header-align="center" align="center"></el-table-column>
          <el-table-column prop="orgName" label="机构名称" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="debtorOrg" label="被授信单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="purpose" label="用途" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startDate" label="起始日" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endDate" label="到期日" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creditMeasures" label="增信措施" header-align="center" align="center"></el-table-column>
        <el-table-column label="授信情况" header-align="center" align="center">
          <el-table-column prop="creditrSum" label="额度小计" header-align="center" align="center"></el-table-column>
          <el-table-column label="间接融资" header-align="center" align="center">
            <el-table-column prop="iVarieties" label="品种" header-align="center" align="center"></el-table-column>
            <el-table-column prop="iAmount" label="额度" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="直接融资" header-align="center" align="center">
            <el-table-column prop="dVarieties" label="品种" header-align="center" align="center"></el-table-column>
            <el-table-column prop="dAmount" label="额度" header-align="center" align="center"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="已用信情况" header-align="center" align="center">
          <el-table-column prop="usedSum" label="小计" header-align="center" align="center"></el-table-column>
          <el-table-column prop="iUsedAmount" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column prop="dUsedAmount" label="直融" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="未用信情况" header-align="center" align="center">
          <el-table-column prop="unUsedSum" label="小计" header-align="center" align="center"></el-table-column>
          <el-table-column prop="iUnUsedAmount" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column prop="dUnUsedAmount" label="直融" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" header-align="center" align="center"></el-table-column>
        <!-- <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('financing:fcreditrecord:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('financing:fcreditrecord:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column> -->
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
        // getDataListURL: '/financing/fcreditrecord/page',
        getDataListURL: '',
        getDataListIsPage: true,
        // exportURL: '/financing/fcreditrecord/export',
        exportURL: '',
        deleteIsBatch: true
      },
      dataList:[
        { orgName: '东莞证券', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '非银机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '东莞证券', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '非银机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '东莞证券', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '非银机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '东莞证券', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '非银机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '东莞证券', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '非银机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '东莞证券', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '非银机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '深圳银行', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '银行机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '深圳银行', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '银行机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '深圳银行', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '银行机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '深圳银行', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '银行机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '深圳银行', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '银行机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' },
        { orgName: '深圳银行', creditMeasures: '', creditrSum: '50000.00', dAmount: '20000.00', dUnUsedAmount: '6000.00', dUsedAmount: '5000.00', dVarieties: '品种二', debtorOrg: '张三', endDate: '2023-05-15', iAmount: '30000.00', iUnUsedAmount: '4000.00', iUsedAmount: '5000.00', iVarieties: '品种一', institutionType: '银行机构', no: '20220515', purpose: '旅游', startDate: '2022-5-15', usedSum: '10000.00', unUsedSum: '10000.00' }
      ],
      dataForm: {
      },
      spanObj: {},
      startTimeOptions:{}, 
      endTimeOptions:{},
    }
  },
  mounted: function () {
    this.getSpanArr(this.dataList)
  },
  watch: {
    // dataList(){
    //   this.getSpanArr(this.dataList)
    // }
  },
  components: {
  },
  methods: {
    getSpanArr (data) {
      // data就是我们从后台拿到的数据
      const obj = data[0]
      // eslint-disable-next-line no-unused-vars
      for (const key in obj) {
        const spanArr = []
        let pos = 0
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            spanArr.push(1)
            pos = 0
          } else {
            if (data[i][key] === data[i - 1][key] && data[i].val2 === data[i - 1].val2) {
              spanArr[pos] += 1
              spanArr.push(0)
            } else {
              spanArr.push(1)
              pos = i
            }
          }
          this.spanObj[key] = spanArr
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'institutionType') {
        const _row = this.spanObj[column.property][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
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
