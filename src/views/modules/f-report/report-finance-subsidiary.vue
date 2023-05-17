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
      <drag-table ref="drag-table" :data="tableData" :header="tableHeader" :option="tableOption" :merging-rules="mergeRules" :no-drag="[1]">
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
        exportURL: '/report/credit/export-subsidiary',
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
          prop: 'column3',
          label: '融资主体',
          minWidth: '120',
          n: ''
        }, {
          prop: 'column4',
          label: '合作机构',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'column5',
          label: '授信项目',
          minWidth: '150',
          n: '/'
        }, {
          prop: 'column14',
          label: '利率',
          align: 'center',
          minWidth: '120',
          n: '/',
          children: [
            {
              prop: 'column6',
              label: '',
              minWidth: '120',
              n: '/'
            },
            {
              prop: 'column15',
              label: '',
              minWidth: '120',
              n: '/'
            }
          ]
        }, {
          prop: 'column7',
          label: '放款时间',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'column8',
          label: '期限/月',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'column9',
          label: '到期日',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'column10',
          label: '贷款余额',
          minWidth: '120',
          n: '/'
        }, {
          prop: 'column11',
          label: '增信措施',
          minWidth: '120',
          align: 'center',
          children: [
            {
              prop: 'column12',
              label: '增信内容',
              minWidth: '120',
              n: '/'
            },
            {
              prop: 'column13',
              label: '担保主体',
              minWidth: '120',
              n: '/'
            }
          ]
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
        column2: '品种1',
        column3: '集团公司',
        column4: '浦发银行',
        column5: '流动资金贷款',
        column6: '一年期LPR+0.5%',
        column7: '2021/3/31',
        column8: '3',
        column9: '2024/3/30',
        column10: '10000',
        column11: '',
        column12: '信用',
        column13: '',
        column14: '',
        column15: '4.35%'
      },
      {
        column1: '2',
        column2: '品种2',
        column3: '集团公司',
        column4: '工商银行',
        column5: '类永续',
        column6: '',
        column7: '2021/5/28',
        column8: '2',
        column9: '2023/5/27',
        column10: '60000',
        column11: '',
        column12: '信用',
        column13: '',
        column14: '',
        column15: '4.95%'
      },
      {
        column1: '3',
        column2: '品种3',
        column3: '集团公司',
        column4: '国开行',
        column5: '流动资金贷款',
        column6: '',
        column7: '2021/6/16',
        column8: '3',
        column9: '2024/6/15',
        column10: '74000',
        column11: '',
        column12: '信用',
        column13: '',
        column14: '',
        column15: '3.7%'
      },
      {
        column1: '小计',
        column2: '',
        column3: '',
        column4: '',
        column5: '',
        column6: '',
        column7: '',
        column8: '',
        column9: '',
        column10: '144000.00',
        column11: '',
        column12: '',
        column13: ''
      },
      {
        column1: '间融合计',
        column2: '',
        column3: '',
        column4: '',
        column5: '',
        column6: '',
        column7: '',
        column8: '',
        column9: '',
        column10: '144000.00',
        column11: '',
        column12: '',
        column13: ''
      },
      {
        column1: '4',
        column2: '',
        column3: '中盈投资',
        column4: '进出口',
        column5: '流动资金贷款',
        column6: '',
        column7: '2020/10/19',
        column8: '1',
        column9: '2021/10/18',
        column10: '3000',
        column11: '',
        column12: '保证担保',
        column13: '集团公司',
        column14: '',
        column15: '2.7%'
      },
      {
        column1: '5',
        column2: '',
        column3: '中盈投资',
        column4: '农业银行',
        column5: '流动资金贷款',
        column6: '',
        column7: '2020/9/7',
        column8: '1',
        column9: '2021/9/6',
        column10: '3200',
        column11: '',
        column12: '保证担保',
        column13: '集团公司',
        column14: '',
        column15: '3.8%'
      },
      {
        column1: '小计',
        column2: '',
        column3: '',
        column4: '',
        column5: '',
        column6: '',
        column7: '',
        column8: '',
        column9: '',
        column10: '144000.00',
        column11: '',
        column12: '',
        column13: ''
      },
      {
        column1: '直融合计',
        column2: '',
        column3: '',
        column4: '',
        column5: '',
        column6: '',
        column7: '',
        column8: '',
        column9: '',
        column10: '144000.00',
        column11: '',
        column12: '',
        column13: ''
      },
      {
        column1: '合计',
        column2: '',
        column3: '',
        column4: '',
        column5: '',
        column6: '',
        column7: '',
        column8: '',
        column9: '',
        column10: '150400.00',
        column11: '',
        column12: '',
        column13: ''
      }
    ]
    this.$nextTick(() => {
      const tableData = this.$refs['drag-table'].setData(data)
      tableData.map(item => {
        if (item.column1 === '小计' || item.column1 === '合计' || item.column1 === '直融合计' || item.column1 === '间融合计') {
          item['column1-span'] = {
            rowspan: 1,
            colspan: 2
          }
          item['column3-span'] = {
            rowspan: 0,
            colspan: 0
          }
        }
      })
      console.log(tableData)
      this.tableData = tableData
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
