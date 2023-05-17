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
      <drag-table ref="drag-table" :data="tableData" :header="tableHeader" :option="tableOption" :merging-rules="mergeRules" :no-drag="[1,2,3]">
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
        exportURL: '/report/credit/export-structure',
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
        maxHeight: 1500
      },
      startTimeOptions: {},
      endTimeOptions: {},
      checkHeader: [],
      baseHeader: [
        {
          prop: 'column2',
          label: '融资主体',
          width: '100',
          n: ' '
        }, {
          prop: 'column3',
          label: '融资渠道',
          width: '50',
          showOverflowTooltip: false,
          n: ' '
        }, {
          prop: 'column4',
          label: '类别',
          width: '105',
          n: ' '
        }, {
          prop: 'column5',
          label: '2020年底融资余额①',
          align: 'center',
          width: '85',
          n: '/'
        }, {
          prop: 'column6',
          label: '2021年新增融资②',
          width: '85',
          n: '/'
        }, {
          prop: 'column7',
          label: '2021年已还金额③',
          width: '85',
          n: '/'
        }, {
          prop: 'column8',
          label: '期末融资余额④=①+②-③',
          n: '/'
        }, {
          prop: 'column9',
          label: '2021年剩余到期',
          width: '80',
          align: 'center',
          n: '/'
        }, {
          prop: 'column10',
          label: '2022年到期',
          width: '70',
          align: 'center'

        },
        {
          prop: 'column11',
          label: '2023年到期',
          width: '70',
          align: 'center',
          n: '/'
        },
        {
          prop: 'column12',
          label: '2024年到期',
          width: '70',
          align: 'center',
          n: '/'
        },
        {
          prop: 'column13',
          label: '2025年到期',
          width: '70',
          align: 'center',
          n: '/'
        },
        {
          prop: 'column14',
          label: '2026年到期',
          width: '70',
          align: 'center',
          n: '/'
        },
        {
          prop: 'column15',
          label: '备注',
          width: '60',
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
        column2: '湖南湘江新区发展集团有限公司',
        column3: '间接融资',
        column4: '流动资金贷款',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '2',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '间接融资',
        column4: '固定资产贷款',
        column5: '52.50',
        column6: '5.25',
        column7: '3.46',
        column8: '54.29',
        column9: '3.72',
        column10: '15.12',
        column11: '8.85',
        column12: '4.21',
        column13: '4.49',
        column14: '17.9',
        column15: ''
      },
      {
        column1: '3',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '间接融资',
        column4: '融资租赁',
        column5: '10.00',
        column6: '',
        column7: '0.50',
        column8: '9.50',
        column9: '0.50',
        column10: '2.25',
        column11: '2.25',
        column12: '2.25',
        column13: '2.25',
        column14: '',
        column15: ''
      },
      {
        column1: '4',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '间接融资',
        column4: '保险债权计划',
        column5: '14.20',
        column6: '',
        column7: '',
        column8: '14.20',
        column9: '',
        column10: '',
        column11: '',
        column12: '14.20',
        column13: '',
        column14: '',
        column15: '期限为5+5和5+2'
      },
      {
        column1: '5',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '间接融资',
        column4: '类永续',
        column5: '',
        column6: '6.000',
        column7: '',
        column8: '6.000',
        column9: '',
        column10: '3.000',
        column11: '3.000',
        column12: '',
        column13: '',
        column14: '',
        column15: ''
      },
      {
        column1: '小计',
        column2: '',
        column3: '',
        column4: '',
        column5: '167.95',
        column6: '59.37',
        column7: '28.66',
        column8: '198.66',
        column9: '14.69',
        column10: '58.17',
        column11: '59.94',
        column12: '40.96',
        column13: '6.78',
        column14: '18.13',
        column15: ''
      },
      {
        column1: '6',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '企业债',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '7',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '中票',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '8',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '公司债',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '9',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '债权融资计划',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '10',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '境外债',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '11',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: 'CMBS',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '12',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: 'PPN',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '13',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '项目收益公司债',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '14',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '政府债务置换',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '15',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '直接融资',
        column4: '政府专项债',
        column5: '91.25',
        column6: '48.12',
        column7: '24.7',
        column8: '114.68',
        column9: '10.47',
        column10: '37.80',
        column11: '45.84',
        column12: '20.30',
        column13: '0.04',
        column14: '0.23',
        column15: ''
      },
      {
        column1: '小计',
        column2: '',
        column3: '',
        column4: '',
        column5: '180.67',
        column6: '19.10',
        column7: '13.72',
        column8: '186.05',
        column9: '23.65',
        column10: '30.25',
        column11: '7.00',
        column12: '26.50',
        column13: '60.58',
        column14: '38.08',
        column15: ''
      },
      {
        column1: '16',
        column2: '湖南湘江新区发展集团有限公司',
        column3: '其他',
        column4: '其他机构借款',
        column5: '0.00',
        column6: '',
        column7: '0.00',
        column8: '',
        column9: '',
        column10: '',
        column11: '',
        column12: '',
        column13: '',
        column14: '',
        column15: ''
      },
      {
        column1: '合计',
        column2: '',
        column3: '',
        column4: '',
        column5: '348.62',
        column6: '78.47',
        column7: '42.38',
        column8: '384.71',
        column9: '38.34',
        column10: '88.41',
        column11: '66.94',
        column12: '67.46',
        column13: '67.36',
        column14: '56.21',
        column15: ''
      }
    ]
    this.$nextTick(() => {
      const tableData = this.$refs['drag-table'].setData(data)
      tableData.map(item => {
        console.log(item)
        if (item.column1 === '小计' || item.column1 === '合计' || item.column1 === '直融合计' || item.column1 === '间融合计') {
          item['column1-span'] = {
            rowspan: 1,
            colspan: 4
          }
          for (let i = 2; i <= item['column1-span'].colspan; i++) {
            item[`column${i}-span`] = {
              rowspan: 0,
              colspan: 0
            }
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
