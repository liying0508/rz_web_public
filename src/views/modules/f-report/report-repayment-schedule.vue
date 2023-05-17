<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord-report">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item  label="融资主体">
          <ren-dept-tree v-model="dataForm.deptId" placeholder="融资主体" :dept-name.sync="dataForm.deptName"></ren-dept-tree>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.startDate" :picker-options="startTimeOptions" type="month" value-format="yyyy-MM" placeholder="起始月份" @focus="clickStartTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.endDate" :picker-options="endTimeOptions" type="month" value-format="yyyy-MM" placeholder="结束月份" @focus="clickEndTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <drag-table ref="drag-table" :data="tableData" :header="tableHeader" :option="tableOption" :merging-rules="mergeRules">
        <el-table-column slot="fixed"
                         fixed
                         prop="column1"
                         label="序号"
                         align="left"
                         width="70">
          <template slot="header" slot-scope="{row}">
            <div><span>序号</span>
              <el-tooltip class="item" effect="dark" content="报表头管理" placement="bottom">
                <i class="el-icon-edit-outline like-btn" @click="tableHeaderManager" ></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </drag-table>
    </div>
    <el-dialog :visible.sync="tableHeaderManagerVisible"
               title="报表头管理"
               append-to-body
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-checkbox-group v-model="checkHeader">
        <el-checkbox v-for="data in baseHeader"
                     :key="data.dictValue"
                     :label ="data">{{data.label}}</el-checkbox>
      </el-checkbox-group>
      <template slot="footer">
        <el-button @click="tableHeaderManagerVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submitTableHeader">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import DragTable from '@/components/drag-table'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'Table',
  mixins: [mixinViewModule],
  data () {
    return {
      tableHeaderManagerVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/financing/findirectfinancing/page',
        getDataListIsPage: true,
        exportURL: '/report/credit/export-schedule',
        deleteURL: '/financing/findirectfinancing',
        deleteIsBatch: true,
        createdIsNeed: false
      },
      dataForm: {
        deptId: '',
        startDate: '',
        endDate: ''
      },
      tableOption: {
        border: true,
        maxHeight: 1000
      },
      startTimeOptions: {},
      endTimeOptions: {},
      checkHeader: [],
      baseHeader: [
        {
          prop: 'column2',
          label: '金融机构',
          width: '120',
          sortable: true,
          sortMethod: this.handleNameSort,
          n: ' '
        }, {
          prop: 'column3',
          label: '融资主体/合同',
          width: '120',
          n: '/'
        }, {
          prop: 'column4',
          label: '产品名称',
          width: '85',
          n: '/'
        }, {
          prop: 'column5',
          label: '授信规模',
          width: '80',
          n: '/'
        },
        {
          prop: 'column6',
          label: '提款规模',
          width: '80',
          n: '/'
        },
        {
          prop: 'column7',
          label: '提款时间/置换时间',
          width: '80',
          n: '/'
        },
        {
          prop: 'column8',
          label: '2016年提款/置换金额',
          width: '80',
          n: '/'
        },
        {
          prop: 'column9',
          label: '2017年新增',
          width: '80',
          n: '/'
        },
        {
          prop: 'column10',
          label: '2018年新增',
          width: '80',
          n: '/'
        },
        {
          prop: 'column11',
          label: '累计提款/置换金额',
          width: '80',
          n: '/'
        },
        {
          prop: 'column12',
          label: '2016年累计已还本金',
          width: '80',
          n: '/'
        },
        {
          prop: 'column13',
          label: '2016年贷款余额',
          width: '80',
          n: '/'
        },
        {
          prop: 'column14',
          label: '2017年截止6月偿还本金',
          width: '80',
          n: '/'
        },
        {
          prop: 'column15',
          label: '2017年6月最新贷款余额',
          width: '80',
          n: '/'
        },
        {
          prop: 'column16',
          label: '2017年偿还本金',
          width: '80',
          n: '/'
        },
        {
          prop: 'column18',
          label: '2017年底贷款余额',
          width: '80',
          n: '/'
        },
        {
          prop: 'column19',
          label: '2018年还本',
          width: '80',
          n: '/'
        },
        {
          prop: 'column20',
          label: '2018年底余额',
          width: '80',
          n: '/'
        },
        {
          prop: 'column21',
          label: '利率',
          width: '80',
          n: '/'
        },
        {
          prop: 'column22',
          label: '到期日期',
          width: '80',
          n: '/'
        },
        {
          prop: 'column23',
          label: '2017年累计需还款（万元）',
          width: '80',
          n: '/'
        },
        {
          prop: 'column24',
          label: '1月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column25',
          label: '2月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column26',
          label: '3月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column27',
          label: '4月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column28',
          label: '5月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column29',
          label: '6月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column30',
          label: '7月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column31',
          label: '8月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column32',
          label: '9月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column33',
          label: '10月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column34',
          label: '11月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column35',
          label: '12月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column36',
          label: '2018年/还款',
          width: '80',
          n: '/'
        },
        {
          prop: 'column37',
          label: '1月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column38',
          label: '2月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column39',
          label: '3月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column40',
          label: '4月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column41',
          label: '5月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column42',
          label: '6月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column43',
          label: '7月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column44',
          label: '8月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column45',
          label: '9月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column46',
          label: '10月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column47',
          label: '11月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column48',
          label: '12月',
          width: '80',
          n: '/'
        },
        {
          prop: 'column49',
          label: '合计',
          width: '80',
          n: '/'
        }
      ],
      tableHeader: [],

      tableData: [],
      mergeRules: ['column2', 'column3']
    }
  },
  methods: {
    clickStartTime () {
      this.startTimeOptions.disabledDate = time => {
        if (this.dataForm.endDate) {
          if (time.getTime() > new Date(this.dataForm.endDate).getTime()) {
            return true
          }
        }
      }
    },
    clickEndTime () {
      this.endTimeOptions.disabledDate = time => {
        if (this.dataForm.beginDate) {
          return (
            time.getTime() < new Date(this.dataForm.beginDate).getTime()
          )
        }
      }
    },
    handleNameSort () {
      console.log('handleNameSort')
    },
    tableHeaderManager () {
      this.tableHeaderManagerVisible = true
    },
    submitTableHeader () {
      console.log('checkHeader选中', this.checkHeader)
      this.tableHeader = this.checkHeader
      this.tableHeaderManagerVisible = false
    }
  },
  created () {
    this.tableHeader = this.baseHeader
    const data = [
      {
        column1: '1',
        column2: '中国工商银行枫林支行',
        column3: '集团公司',
        column4: '流动资金贷款',
        column5: '100000',
        column6: '20000',
        column7: '2018/1/1',
        column8: '',
        column9: '',
        column10: '20000',
        column11: '20000',
        column12: '',
        column13: '',
        column14: '',
        column15: '',
        column16: '',
        column17: '',
        column18: '',
        column19: '0',
        column20: '20000',
        column21: '6.55',
        column22: '2020/8/2',
        column23: '',
        column24: '',
        column25: '',
        column26: '',
        column27: '',
        column28: '',
        column29: '',
        column30: '',
        column31: '',
        column32: '',
        column33: '',
        column34: '',
        column35: '',
        column36: '',
        column37: '',
        column38: '',
        column39: '',
        column40: '',
        column41: '',
        column42: '',
        column43: '',
        column44: '',
        column45: '',
        column46: '',
        column47: '',
        column48: '',
        column49: '24000'
      }]
    this.$nextTick(() => {
      this.tableData = this.$refs['drag-table'].setData(data,'column1')
    })
  },
  components: {
    DragTable
  }
}
</script>
<style lang="scss" scoped>
.like-btn{
  font-size: 20px;
  color: #409eff;
  float: right;
  cursor: pointer;
  &:after{
    clear: both;
  }
}
</style>
