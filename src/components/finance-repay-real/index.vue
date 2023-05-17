<template>
  <div>

    <vxe-table border show-overflow :data="list"
               :column-config="{resizable: true}"
               @cell-click="cellClick"
               ref="real-table"
               :height="tableHeight"
               :edit-config="{trigger: 'click', mode: 'cell',activeMethod: targetCellDisable}"
               style="margin-bottom:20px;">
      <vxe-colgroup>
        <template #header>
          <el-row class="table-row">
            <el-col :span="6">
              <span class="item-label">总实际还款：</span>
              <span v-html="totalRepaymentActual"></span>
            </el-col>
            <el-col :span="6">
              <span class="item-label">总实际还本：</span>
              <span v-html="totalRepayPrincipalActual"></span>
            </el-col>
            <el-col :span="6">
              <span class="item-label">总实际还息：</span>
              <span v-html="totalRepayInterestActual"></span>
            </el-col>
          </el-row>
        </template>
        <!-- <vxe-column field="startDate" title="开始日期" ></vxe-column> -->
        <vxe-column field="repaymentDate"
                    title="还款日期"
                    show-overflow
                    :edit-render="{
                                    name: `$input`,
                                    props: {clearable: true, type:'date',disabledMethod:disabledDateMethod},
                                    placeholder:'还款日期'
                                  }">
        </vxe-column>
        <vxe-column v-if="String(type)==='1'" field="actualRepayPrincipal" :title="`实际还本（${$getDictLabel('unit',$store.state.unit)}）`" :edit-render="{}">
          <template #edit="{ row,rowIndex}">
            <vxe-input v-model="row.actualRepayPrincipal " type="text" @blur="columnChange({row,rowIndex})"></vxe-input>
          </template>
          <template #default="{row}">
            {{row.actualRepayPrincipal}}
          </template>
        </vxe-column>
        <vxe-column v-if="String(type)==='2'" field="actualRepayInterest" :title="`实际还息（${$getDictLabel('unit',$store.state.unit)}）`" :edit-render="{}">
          <template #edit="{ row,rowIndex}">
            <vxe-input v-model="row.actualRepayInterest " type="text" @blur="columnChange({row,rowIndex})"></vxe-input>
          </template>
          <template #default="{row}">
            {{row.actualRepayInterest}}
          </template>
        </vxe-column>
        <vxe-column v-if="String(type)==='2'" field="rate" title="利率（%）" :edit-render="{}">
          <template #edit="{ row,rowIndex}">
            <vxe-input v-model="row.rate " type="text" @blur="columnChange({row,rowIndex})"></vxe-input>
          </template>
          <template #default="{row}">
            {{row.rate}}
          </template>
        </vxe-column>
        <vxe-column field="remark" title="说明" :edit-render="{autofocus: '.vxe-input--inner',
                                   name: `$input`,
                                   props:{clearable: true, type:'text'},
                                   }">
        </vxe-column>
        <vxe-column title="操作" v-if="dataForm.isDisabled===false">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandler(scope)">{{ $t('delete') }}</el-button>
          </template>
        </vxe-column>
      </vxe-colgroup>
    </vxe-table>
    <vxe-toolbar class="vxe-toolbar-class" v-show="dataForm.isDisabled===false">
      <template v-slot:buttons>
        <el-button type="primary" size="small" class="add-upload-btn" @click="addRowReplay" v-show="dataForm.isDisabled===false">
          <i class="el-icon-document-add el-icon--left"></i>增行
        </el-button>
        <el-button type="primary" size="small" class="add-upload-btn" @click="downloadTemplate" :disabled="dataForm.isDisabled">
          <i class="el-icon-document-add el-icon--left"></i>下载模板
        </el-button>
        <el-button type="primary" size="small" class="add-upload-btn" @click="importBtn" :disabled="dataForm.isDisabled">
          <i class="el-icon-document-add el-icon--left"></i>一键导入
        </el-button>
        <import-template
            :url="importUrl"
            table-width="100%"
            ref="import-template"
            @successHandle="successHandle"></import-template>
      </template>
    </vxe-toolbar>
    <template slot="footer">
<!--      <el-button type="primary" @click="getPlan">{{ $t('confirm') }}</el-button>-->
    </template>
  </div>

</template>
<script>
/* import MoneyInput from '@/components/money-input' */
import ImportTemplate from '@/components/importTemplate'
import qs from 'qs'
import Cookies from 'js-cookie'
export default {
  name: 'financeRepayReal',
  /* components: { MoneyInput }, */
  components: { ImportTemplate },
  props: {
    dataForm: {
      type: Object,
      default: () => {
        return {
          isDisabled: false
        }
      }
    },
    totalPrincipalActual: {
      type: [String, Number],
      default: 0
    },
    // 总实际还息
    totalInterestActual: {
      type: [String, Number],
      default: 0
    },
    // 初始化的数据列表
    paramsList: {
      type: Array,
      default: () => []
    },
    // 1直融 2、间融 3、政府债券
    financingType: {
      type: [String, Number],
      default: '1'
    },
    // 起息日
    valueDate: {
      type: [String, Number, Date],
      default: 0
    },
    // 1 偿还本金
    // 2 偿还利息
    type: {
      type: [String, Number],
      default: '1'
    }

  },
  data () {
    return {
      list: [],
      totalRepayPrincipalActual: 0,
      totalRepaymentActual: 0,
      totalRepayInterestActual: 0,
      // 当前选中行
      currentRowIndex: 0,
      importUrl: `${window.SITE_CONFIG.apiURL}/financing/excel/importForm?token=${Cookies.get('token')}&templateType=2`
    }
  },
  computed: {
    tableHeight () {
      // 固定表头及动态高度
      var height
      if (this.list.length === 0) {
        height = 167
      } else if (this.list.length > 0 && this.list.length <= 4) {
        height = 119 + 48 * this.list.length
      } else {
        height = 311
      }
      return height + 'px'
    }
  },
  methods: {
    // 导入成功后需要回填数据
    successHandle (data) {
    },
    downloadTemplate () {
      var params = qs.stringify({
        token: Cookies.get('token'),
        templateType: 2,
        unit: this.$store.state.unit
      })
      window.location.href = `${window.SITE_CONFIG.apiURL}/financing/excel/exportFormTemplate?${params}`
    },
    importBtn () {
      // 显示文件上传组件
      this.$refs['import-template'].fileDialogVisible = true
    },
    columnChange ({ row, rowIndex }) {
      if (String(this.type) === '1') {
        this.list[rowIndex].actualRepayPrincipal = row.actualRepayPrincipal
        this.totalRepayPrincipalActual = 0
      } else {
        this.list[rowIndex].actualRepayInterest = row.actualRepayInterest
        this.totalRepayInterestActual = 0
      }

      this.list.map(item => {
        if (String(this.type) === '1' && this.$isNotNull(item.actualRepayPrincipal)) {
          this.totalRepayPrincipalActual = this.totalRepayPrincipalActual + Number(item.actualRepayPrincipal)
        } else if (String(this.type) === '2' && this.$isNotNull(item.actualRepayInterest)) {
          this.totalRepayInterestActual = this.totalRepayInterestActual + Number(item.actualRepayInterest)
        }
      })
      this.totalRepaymentActual = Number(this.totalRepayPrincipalActual) + Number(this.totalRepayInterestActual)
    },
    // 禁用编辑
    targetCellDisable () {
      return !this.isDisabled
    },
    // 初始化数据
    init (attr) {
      this.totalRepaymentActual = 0
      console.log('init')
      if (String(this.type) === '1') {
        this.totalRepayPrincipalActual = 0
        if (!this.$isNotNull(attr)) {
          this.totalRepayInterestActual = this.totalInterestActual
        }
      } else {
        this.totalRepayInterestActual = 0
        if (!this.$isNotNull(attr)) {
          this.totalRepayPrincipalActual = this.totalPrincipalActual
        }
      }
      const list = this.$isNotNull(attr) ? attr : 'paramsList'
      this[list].map(item => {
        if (String(this.type) === '1' && this.$isNotNull(item.actualRepayPrincipal)) {
          this.totalRepayPrincipalActual = this.totalRepayPrincipalActual + Number(item.actualRepayPrincipal)
        } else if (String(this.type) === '2' && this.$isNotNull(item.actualRepayInterest)) {
          this.totalRepayInterestActual = this.totalRepayInterestActual + Number(item.actualRepayInterest)
        }
      })
      this.totalRepaymentActual = Number(this.totalRepayPrincipalActual) + Number(this.totalRepayInterestActual)

      console.log(String(this.type) === '1' ? '实际还本-总额' : '实际还息-总额', this.totalRepaymentActual, '实际还本', this.totalRepayPrincipalActual, '实际还息', this.totalRepayInterestActual)
      if (!this.$isNotNull(attr)) {
        this.list = this.paramsList
      }
    },
    // 获取当前选中的行
    cellClick ({ row, rowIndex }) {
      this.currentRowIndex = rowIndex
    },
    // 禁用不符合条件的结束日期
    disabledDateMethod ({ date }) {
      const valueDate = new Date(this.valueDate).getTime()
      if (this.$isNotNull(valueDate)) {
        return valueDate - date.getTime() > 0
      } else {
        return false
      }
    },
    // 增加一行还款计划
    addRowReplay () {
      if (!this.$isNotNull(this.list)) {
        this.list = []
      }
      const object = {
        actualRepayPrincipal: '',
        actualRepayInterest: '',
        financingType: this.financingType,
        id: '',
        remark: '',
        repaymentDate: ''
      }
      if (String(this.type) === '1') {
        delete object.actualRepayInterest
      } else {
        object.rate = ''
        delete object.actualRepayPrincipal
      }
      this.list.push(object)
    },
    // 获取还款计划内容
    getRealList () {
      const params = {
        totalRepayInterestActual: this.totalRepayInterestActual,
        totalRepayPrincipalActual: this.totalRepayPrincipalActual,
        totalRepaymentActual: this.totalRepaymentActual,
        repayPrincipalActualList: String(this.type) === '2' ? this.dataForm.payActualData.repayPrincipalActualList : this.list,
        repayInterestActualList: String(this.type) === '1' ? this.dataForm.payActualData.repayInterestActualList : this.list
      }
      console.log('保存的', params)
      return params
    },
    // 删除当前行
    deleteHandler (scope) {
      this.list.splice(scope.rowIndex, 1)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-radio{
  font-weight: 400;
  .el-radio__inner{
    position: relative;
    top:-1px;
  }

}
.table-row{
  padding-bottom: 5px;
  line-height: 40px;
  ::v-deep .el-switch{
    line-height: 16px;
  }
  ::v-deep .el-switch__core{
    top:-2px;
  }
}
.item-label{
  margin-right: 5px;
  display: inline-block;
  line-height: 40px;
}
</style>
