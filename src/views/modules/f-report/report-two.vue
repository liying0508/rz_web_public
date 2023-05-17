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
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" :span-method="objectSpanMethod" style="width: 100%;">
        <!-- <el-table-column type="selection"  header-align="center" align="center" width="50"></el-table-column> -->
        <!-- <el-table-column type="index" hidden label="序号" width="50"></el-table-column> -->
        <!-- <el-table-column prop="val1" label="授信单编号" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="val2" label="融资单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="val3" label="融资品种" header-align="center" align="center"></el-table-column>
        <el-table-column prop="val4" label="金融机构" header-align="center" align="center"></el-table-column>
        <el-table-column prop="val5" label="审批额度" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field1" label="发行期次" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field2" label="合同金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field3" label="融资金额" header-align="center" align="center"></el-table-column>
        <el-table-column label="融资金额" header-align="center" align="center">
          <el-table-column prop="field4" label="利率" header-align="center" align="center"></el-table-column>
          <el-table-column prop="field5" label="其他费用" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="field6" label="放款日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field7" label="期限" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field8" label="还款日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field9" label="融资余额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field10" label="用款项目" header-align="center" align="center"></el-table-column>
        <el-table-column label="增信情况" header-align="center" align="center">
          <el-table-column prop="field11" label="担保方式" header-align="center" align="center"></el-table-column>
          <el-table-column prop="field12" label="担保单位/抵押物所有权人" header-align="center" align="center"></el-table-column>
          <el-table-column prop="field13" label="担保比例" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="field14" label="付息方式" header-align="center" align="center"></el-table-column>
        <el-table-column label="初始投资人认购情况" header-align="center" align="center">
          <el-table-column prop="field15" label="名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="field16" label="金额" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="还本付息计划" header-align="center" align="center">
          <el-table-column label="2021年1月" header-align="center" align="center">
            <el-table-column prop="field17" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field18" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="2021年2月" header-align="center" align="center">
            <el-table-column prop="field19" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field20" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="2021年3月" header-align="center" align="center">
            <el-table-column prop="field21" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field22" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="小计" header-align="center" align="center">
            <el-table-column prop="field23" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field24" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="已还本付息" header-align="center" align="center">
          <el-table-column label="2021年1月" header-align="center" align="center">
            <el-table-column prop="field25" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field26" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="2021年2月" header-align="center" align="center">
            <el-table-column prop="field27" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field28" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="2021年3月" header-align="center" align="center">
            <el-table-column prop="field29" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field30" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="小计" header-align="center" align="center">
            <el-table-column prop="field31" label="本金" header-align="center" align="center"></el-table-column>
            <el-table-column prop="field32" label="利息" header-align="center" align="center"></el-table-column>
          </el-table-column>
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
        { val1: 'No.1001', val2: '集团本部', val3: '21湘江01项目收益公司债', val4: '东莞证券', val5: 150000, field1: '第1次', field2: '', field3: 30000, field4: '3.70%', field5: '', field6: '2021-06-15', field7: '3+2', field8: '2024-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '华融湘江银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1001', val2: '集团本部', val3: '21湘江01项目收益公司债', val4: '东莞证券', val5: 150000, field1: '第1次', field2: '', field3: 30000, field4: '3.70%', field5: '', field6: '2021-06-15', field7: '3+2', field8: '2024-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '中国光大银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1001', val2: '集团本部', val3: '21湘江01项目收益公司债', val4: '东莞证券', val5: 150000, field1: '第1次', field2: '', field3: 30000, field4: '3.70%', field5: '', field6: '2021-06-15', field7: '3+2', field8: '2024-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '中信银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1001', val2: '集团本部', val3: '21湘江01项目收益公司债', val4: '东莞证券', val5: 150000, field1: '第1次', field2: '', field3: 30000, field4: '3.70%', field5: '', field6: '2021-06-15', field7: '3+2', field8: '2024-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '兴业银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1001', val2: '集团本部', val3: '21湘江01项目收益公司债', val4: '东莞证券', val5: 150000, field1: '第1次', field2: '', field3: 30000, field4: '3.70%', field5: '', field6: '2021-06-15', field7: '3+2', field8: '2024-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '农业银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1001', val2: '集团本部', val3: '21湘江02项目收益公司债', val4: '东莞证券', val5: 150000, field1: '第1次', field2: '', field3: 31000, field4: '4.10%', field5: '', field6: '2021-06-15', field7: '5', field8: '2021-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '建设银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1002', val2: '集团外部', val3: '21湘江01项目收益公司债', val4: '深圳证券', val5: 50000, field1: '第2次', field2: '', field3: 10000, field4: '3.70%', field5: '', field6: '2022-06-15', field7: '3+2', field8: '2025-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '中国光大银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1002', val2: '集团外部', val3: '21湘江01项目收益公司债', val4: '深圳证券', val5: 50000, field1: '第2次', field2: '', field3: 10000, field4: '3.70%', field5: '', field6: '2022-06-15', field7: '3+2', field8: '2025-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '中信银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1002', val2: '集团外部', val3: '21湘江01项目收益公司债', val4: '深圳证券', val5: 50000, field1: '第2次', field2: '', field3: 10000, field4: '3.70%', field5: '', field6: '2022-06-15', field7: '3+2', field8: '2025-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '兴业银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1002', val2: '集团外部', val3: '21湘江01项目收益公司债', val4: '深圳证券', val5: 50000, field1: '第2次', field2: '', field3: 10000, field4: '3.70%', field5: '', field6: '2022-06-15', field7: '3+2', field8: '2025-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '农业银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1002', val2: '集团外部', val3: '21湘江01项目收益公司债', val4: '深圳证券', val5: 50000, field1: '第2次', field2: '', field3: 10000, field4: '3.70%', field5: '', field6: '2022-06-15', field7: '3+2', field8: '2025-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '建设银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 },
        { val1: 'No.1002', val2: '集团外部', val3: '21湘江02项目收益公司债', val4: '深圳证券', val5: 50000, field1: '第2次', field2: '', field3: 13333, field4: '4.10%', field5: '', field6: '2022-06-15', field7: '5', field8: '2022-06-14', field9: '', field10: '医疗公司基因谷二期', field11: '信用', field12: '', field13: '', field14: '季度付息、到期还本', field15: '建设银行', field16: 9000, field17: 8500, field18: 425, field19: 8000, field20: 400, field21: 7500, field22: 375, field23: 7000, field24: 350, field25: 6500, field26: 325, field27: 6000, field28: 300, field29: 5500, field30: 275, field31: 50000, field32: 250 }
      ],
      spanObj: {},      
      startTimeOptions:{}, 
      endTimeOptions:{},
    }
  },
  watch: {
  },
  components: {
  },
  mounted: function () {
    this.getSpanArr(this.dataList)
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
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14 || columnIndex === 15 || columnIndex === 16 || columnIndex === 17 || columnIndex === 0) {
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
