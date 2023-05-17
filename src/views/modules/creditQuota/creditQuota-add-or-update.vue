<template>
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
             :close-on-click-modal="false"
             width="70%"
             class="form-el-dialog"
             :close-on-press-escape="false">
    <el-form :model="dataForm"
             :rules="dataRule"
             class="custom-form"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '160px' : '120px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="金融机构" prop="institution">
            <finance-first-dept-tree v-model="dataForm.institution"
                                     ref="firstDept"
                                     :dept-name="dataForm.institutionName"
                                     :disabled="dataForm.isDisabled"
                                     placeholder="金融机构">
            </finance-first-dept-tree>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="直融授信总额" prop="creditQuotaDirect">
            <money-input :value.sync="dataForm.creditQuotaDirect"
                         :edit-display-value="dataForm.creditQuotaDirectText"
                         suffix="元"
                         ref="creditQuotaDirect"
                         placeholder="直融授信总额"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="间融授信总额" prop="creditQuotaIndirect">
            <money-input :value.sync="dataForm.creditQuotaIndirect"
                         :edit-display-value="dataForm.creditQuotaIndirectText"
                         suffix="元"
                         ref="creditQuotaIndirect"
                         placeholder="间融授信总额"></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="isEdit">
        <el-col :span="12">
          <el-form-item label="已使用直融额度" prop="creditQuotaDirect">
            <money-input :value.sync="dataForm.usedQuotaDirect"
                         :edit-display-value="dataForm.usedQuotaDirectText"
                         :is-disabled="true"
                         suffix="元"

                         placeholder="已使用直融额度"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已使用间融额度" prop="creditQuotaIndirect">
            <money-input :value.sync="dataForm.usedQuotaIndirect"
                         :edit-display-value="dataForm.usedQuotaIndirectText"
                         :is-disabled="true"
                         suffix="元"
                         placeholder="已使用间融额度"></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="isEdit">
        <el-col :span="12">
          <el-form-item label="未使用直融额度" prop="creditQuotaDirect">
            <money-input :value.sync="dataForm.unusedQuotaDirect"
                         :edit-display-value="dataForm.unusedQuotaDirectText"
                         :is-disabled="true"
                         suffix="元"
                         placeholder="未使用直融额度"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="未使用间融额度" prop="creditQuotaIndirect">
            <money-input :value.sync="dataForm.unusedQuotaIndirect"
                         :edit-display-value="dataForm.unusedQuotaIndirectText"
                         :is-disabled="true"
                         suffix="元"
                         placeholder="未使用间融额度"></money-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <el-row v-show="isEdit">
      <el-table v-loading="dataListLoading" :data="dataForm.creditQuotaHistoryList" border style="width: 100%;">
        <el-table-column type="index" label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>

        <el-table-column prop="creditQuota" label="授信总额度" header-align="center" align="center">
          <el-table-column  prop="creditQuotaIndirect" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="creditQuotaDirect" label="直融" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="creditQuota" label="已使用额度" header-align="center" align="center">
          <el-table-column  prop="usedQuotaIndirect" label="间融" header-align="center" align="center"></el-table-column>
          <el-table-column  prop="usedQuotaDirect" label="直融" header-align="center" align="center"></el-table-column>
         </el-table-column>
      </el-table>

    </el-row>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import MoneyInput from '@/components/money-input'
export default {
  components: {
    MoneyInput
  },
  data () {
    return {
      dataListLoading: false,
      visible: false,
      isEdit: false,
      dataForm: {
        id: '',
        institution: '',
        institutionName: '',
        // 授信总额直融
        creditQuotaDirect: 0,
        creditQuotaDirectText: 0,
        // 授信总额间融
        creditQuotaIndirect: 0,
        creditQuotaIndirectText: 0,

        // 已使用间融
        usedQuotaIndirect: 0,
        usedQuotaIndirectText: 0,
        // 已使用直融
        usedQuotaDirect: 0,
        usedQuotaDirectText: 0,
        // 未使用间融
        unusedQuotaIndirect: 0,
        unusedQuotaIndirectText: 0,
        // 未使用直融
        unusedQuotaDirect: 0,
        unusedQuotaDirectText: 0,
        isDisabled: false,
        creditQuotaHistoryList: []
      }
    }
  },
  computed: {
    dataRule () {
      return {
        institution: [
          { required: true, message: '请选择金融机构', trigger: 'change' }
        ],
        creditQuota: [
          { required: true, message: '请输入额度', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm.institutionName = ''
      this.isEdit = false
      this.dataForm.isDisabled = false
      this.resetData()
      console.log('我打开了')
      console.log(this.dataForm)
      this.$nextTick(() => {
        this.$refs.dataForm?.resetFields()
        this.$refs.firstDept.showDeptName = ''
        this.$refs.creditQuotaIndirect.handleValueBlur(this.dataForm.creditQuotaIndirectText, true)
        this.$refs.creditQuotaDirect.handleValueBlur(this.dataForm.creditQuotaDirectText, true)
        if (this.dataForm.id) {
          this.isEdit = true
          this.getInfo()
        }
      })
    },
    // 重置表单数据
    resetData () {
      this.dataForm = {
        id: this.dataForm.id,
        institution: '',
        institutionName: '',
        // 授信总额直融
        creditQuotaDirect: 0,
        creditQuotaDirectText: 0,
        // 授信总额间融
        creditQuotaIndirect: 0,
        creditQuotaIndirectText: 0,

        // 已使用间融
        usedQuotaIndirect: 0,
        usedQuotaIndirectText: 0,
        // 已使用直融
        usedQuotaDirect: 0,
        usedQuotaDirectText: 0,
        // 未使用间融
        unusedQuotaIndirect: 0,
        unusedQuotaIndirectText: 0,
        // 未使用直融
        unusedQuotaDirect: 0,
        unusedQuotaDirectText: 0,
        isDisabled: false,
        creditQuotaHistoryList: []
      }
    },
    // 获取信息
    getInfo () {
      // this.$http.get('/creditQuota/' + this.dataForm.id + '/' + this.$store.state.unit).then(({ data: res }) => {
      this.$http.get('/creditQuota/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        const data = res.data
        data.creditQuotaIndirect = this.$isNotNull(data.creditQuotaIndirect) ? Number(data.creditQuotaIndirect) : 0
        data.creditQuotaDirect = this.$isNotNull(data.creditQuotaDirect) ? Number(data.creditQuotaDirect) : 0
        data.usedQuotaIndirect = this.$isNotNull(data.usedQuotaIndirect) ? Number(data.usedQuotaIndirect) : 0
        data.usedQuotaDirect = this.$isNotNull(data.usedQuotaDirect) ? Number(data.usedQuotaDirect) : 0
        data.unusedQuotaIndirect = data.creditQuotaIndirect - data.usedQuotaIndirect
        data.unusedQuotaDirect = data.creditQuotaDirect - data.usedQuotaDirect
        data.creditQuotaIndirectText = data.creditQuotaIndirect
        data.creditQuotaDirectText = data.creditQuotaDirect
        data.unusedQuotaDirectText = data.unusedQuotaDirect
        data.unusedQuotaIndirectText = data.unusedQuotaIndirect
        data.usedQuotaDirectText = data.usedQuotaDirect
        data.usedQuotaIndirectText = data.usedQuotaIndirect
        this.dataForm = data
        this.dataForm.isDisabled = true
        console.log('getInfo', this.dataForm)
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        const params = {
          id: this.dataForm.id,
          institution: this.dataForm.institution,
          // 授信总额直融
          creditQuotaDirect: this.dataForm.creditQuotaDirect,
          // 授信总额间融
          creditQuotaIndirect: this.dataForm.creditQuotaIndirect
        }
        // params.unit = this.$store.state.unit
        this.$http[!this.dataForm.id ? 'post' : 'put']('/creditQuota/', params).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { leading: true, trailing: false })
  }
}
</script>
<style scoped>
::v-deep .money-input .el-input__inner{
  text-align: left;
}
</style>
