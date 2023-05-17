<template>
<!--  银行授信编辑-->
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
             width="80%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="custom-form"
             @keyup.enter.native="dataFormSubmitHandle()">
      <el-row>
        <el-col :span="10">
          <el-form-item prop="deptName"
                        label="授信单位："
                        class="p-left-80">
            <el-input v-if="dataForm.id != undefined "
                      v-model="dataForm.deptName"
                      :disabled="true"
                      class="col-input"></el-input>
            <ren-dept-tree v-if="dataForm.id == undefined"
                           v-model="dataForm.deptId"
                           placeholder="授信单位"
                           class="col-input"
                           :dept-name.sync="dataForm.deptName"></ren-dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金融机构类型：" prop="institutionType" class="p-left-110">
            <ren-radio-group :disabled="dataForm.isDisabled" v-model="dataForm.institutionType" dict-type="finance_dept_type"></ren-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="金融机构：" prop="institution"  class="p-left-80">
<!--            <el-select v-model="dataForm.institution" placeholder="金融机构" class="col-input">
              <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>-->
            <finance-dept-tree v-model="dataForm.institution"
                               :dept-name="dataForm.institutionName"
                               :disabled="dataForm.isDisabled"
                               placeholder="金融机构">
            </finance-dept-tree>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="额度：" prop="quota"  class="p-left-50">
            <money-input :value.sync="dataForm.quota"
                         :edit-display-value="dataForm.quotaText"
                         :is-disabled="dataForm.isDisabled"
                         :suffix="$getDictLabel('unit',$store.state.unit)"
                         placeholder="额度"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起始日：" prop="startDate" class="p-left-70">
            <el-date-picker v-model="dataForm.startDate"
                            type="date" value-format="yyyy-MM-dd"
                            placeholder="起始日"
                            :picker-options="startDate"
                            :disabled="dataForm.isDisabled"
                            class="col-input"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" prop="endDate" class="p-left-70">
            <el-date-picker v-model="dataForm.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="到期日"
                            :picker-options="endDate"
                            :disabled="dataForm.isDisabled"
                            class="col-input"/>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row>
        <el-form-item label="用途：" prop="purpose"  class="p-left-50">
          <el-input type="textarea"
                    placeholder="用途"
                    v-model="dataForm.purpose"
                    maxlength="200"
                    :disabled="dataForm.isDisabled"
                    show-word-limi></el-input>
        </el-form-item>
      </el-row>
      <finance-credit-reporting-measures :disabled="dataForm.isDisabled" :data-form="dataForm" :rmb="dataForm.quota"></finance-credit-reporting-measures>
      <el-row>
        <el-form-item label="备注：" prop="remarks" class="p-left-50">
          <el-input type="textarea"
                    placeholder="备注"
                    v-model="dataForm.remarks"
                    :disabled="dataForm.isDisabled"
                    maxlength="200"
                    show-word-limi></el-input>
        </el-form-item>
      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload :disabled="dataForm.isDisabled"
                      :data-form="dataForm"
                      table-width="100%"
                      ref="finance-upload"></finance-upload>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" :disabled="dataForm.isDisabled" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceUpload from '@/components/finance-upload'
import FinanceCreditReportingMeasures from '@/components/finance-credit-reporting-measures'
import MoneyInput from '@/components/money-input'
export default {
  components: { MoneyInput, FinanceCreditReportingMeasures, FinanceUpload },
  data () {
    return {
      visible: false,
      // 金融机构
      deptList: [],
      dataForm: {
        // 审核通过就禁用
        isDisabled: false,
        id: '',
        // 授信单位id
        deptId: '',
        // 授信单位名称
        deptName: '',
        // 金融机构类型
        institutionType: '',
        // 金融机构
        institution: '',
        // 金融机构名称
        institutionName: '',
        // 额度
        quota: '',
        // 起始日
        startDate: '',
        // 到期日
        endDate: '',
        // 用途
        purpose: '',
        // 增信措施
        creditMeasures: [],
        // 增信措施详情
        guaranteeInfo: {
          // 保证
          guarantee: [],
          // 抵押
          collateral: [],
          // 质押
          pledge: [],
          // 增信措施详情
          id: ''
        },
        // 备注
        remarks: '',
        // 附件上传
        fileList: []

      },
      startDate: {
        disabledDate: time => {
          if (this.dataForm.startDate) {
            return (
              time.getTime() > new Date(this.dataForm.endDate).getTime()
            )
          } else {
            // 不能大于当前日期
          }
        }
      },
      // 结束时间
      endDate: {
        disabledDate: time => {
          if (this.dataForm.endDate) {
            return (
              time.getTime() < new Date(this.dataForm.startDate).getTime() - 8.64e7 // 加- 8.64e7则表示包当天
            )
          } else {
            return time.getTime() < new Date(this.dataForm.startDate).getTime()
          }
        }
      }

    }
  },

  computed: {
    dataRule () {
      return {
        deptName: [
          { required: true, message: '请选择审批单位', trigger: 'change' }
        ],
        institutionType: [
          { required: true, message: '请选择金融机构类型', trigger: 'change' }
        ],
        institution: [
          { required: true, message: '请选择金融机构', trigger: 'change' }
        ],
        quota: [
          { required: true, message: '请输入额度', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible: function (newVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },
  methods: {
    async init () {
      await this.getDeptList()
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm?.resetFields()
        this.$refs['finance-upload'].init()
        if (this.$isNotNull(this.dataForm.id)) {
          // 修改
          this.getInfo()
        }
      })
    },
    resetData () {
      this.dataForm = {
        // 审核通过就禁用
        isDisabled: false,
        id: '',
        // 授信单位id
        deptId: '',
        // 授信单位名称
        deptName: '',
        // 金融机构类型
        institutionType: '',
        // 金融机构
        institution: '',
        // 金融机构名称
        institutionName: '',
        // 额度
        quota: '',
        // 起始日
        startDate: '',
        // 到期日
        endDate: '',
        // 用途
        purpose: '',
        // 增信措施
        creditMeasures: [],
        // 增信措施详情
        guaranteeInfo: {
          // 保证
          guarantee: [],
          // 抵押
          collateral: [],
          // 质押
          pledge: [],
          // 增信措施详情
          id: ''
        },
        // 备注
        remarks: '',
        // 附件上传
        fileList: []
      }
    },
    // 获取金融机构列表
    async getDeptList () {
      try {
        const { data } = await this.$http.get('/financing/finance-dept/list')
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.deptList = data.data
      } catch (e) {
        console.log('getDeptList-e:', e)
      }
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/fcreditrecord/' + this.dataForm.id + '/' + this.$store.state.unit)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        _data.quotaText = _data.quota
        if (!this.$isNotNull(_data.guaranteeInfo)) {
          _data.guaranteeInfo = {
            // 保证
            guarantee: [],
            // 抵押
            collateral: [],
            // 质押
            pledge: [],
            // 增信措施详情
            id: ''
          }
        }
        // 增信措施详情-保证
        _data.guaranteeInfo?.guarantee?.map(item => {
          item.contractAmountText = item.contractAmount
        })
        // 增信措施详情-抵押
        _data.guaranteeInfo?.collateral?.map(item => {
          item.collateralAmountText = item.collateralAmount
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 0) {
            item.releaseTime[0] = new Date(item.releaseTime[0])
          }
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 1) {
            item.releaseTime[1] = new Date(item.releaseTime[1])
          }
        })
        // 增信措施详情-质押
        _data.guaranteeInfo?.pledge?.map(item => {
          item.pledgeAmountText = item.pledgeAmount
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 0) {
            item.releaseTime[0] = new Date(item.releaseTime[0])
          }
          if (this.$isNotNull(item.releaseTime) && item.releaseTime.length > 1) {
            item.releaseTime[1] = new Date(item.releaseTime[1])
          }
        })
        _data.isDisabled = _data.isChecked == '1'
        _data.creditMeasures = this.$isNotNull(_data.creditMeasures) ? _data.creditMeasures.split(',') : []
        _data.fileList = this.$isNotNull(_data.fileList) ? _data.fileList : []
        this.dataForm = { ...this.dataForm, ..._data }
      } catch (e) {
        console.log('getInfo-e>>>>', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        if (this.dataForm.isDisabled === true) {
          return
        }
        this.$refs.dataForm.validate(async (valid) => {
          if (!valid) {
            return false
          }
          const params = { ...this.dataForm }
          params.creditMeasuresList = params.creditMeasures
          params.unit = this.$store.state.unit
          delete params.creditMeasures
          try {
            const { data } = await this.$http[!this.dataForm.id ? 'post' : 'put']('/financing/fcreditrecord/', params)
            if (data.code !== 0) {
              return this.$message.error(data.msg)
            }
            this.$message.success(this.$t('prompt.success'))
            setTimeout(() => {
              this.visible = false
            }, 500)

            this.$emit('refreshDataList')
          } catch (e) {
            console.log('dataFormSubmitHandle-e>>>>', e)
          }
        })
      },
      1000,
      { leading: true, trailing: false }
    )
  }
}
</script>
<style lang="scss" scoped>

  .sigma-content{
    margin: 50px;
    text-align: center;
    background-color: #fff;
    .sigma-middle-line:before{
      content: '';
      display: block;
      height: 1px;
      width: 100%;
      background-color: #dcdfe6;
      position: relative;
      top: 10px;
      left: 0;
    }
    .sigma-line-text{
      display: inline-block;
      background: #fff;
      padding: 0 18px 0 18px;
      position: relative;
      font-size: 14px;
      font-weight: 500;
    }
  }
</style>
