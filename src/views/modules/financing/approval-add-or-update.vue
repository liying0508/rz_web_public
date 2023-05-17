<template>
  <!--  直融批文编辑-->
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
             width="50%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form ref="dataForm"
             :model="dataForm"
             :rules="dataRule"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deptName"
                        label="融资单位："
                        class="p-left-80">
            <el-input v-if="dataForm.id != undefined "
                      v-model="dataForm.deptName"
                      :disabled="true"
                      class="col-input"></el-input>
            <ren-dept-tree v-if="dataForm.id == undefined"
                           v-model="dataForm.deptId"
                           placeholder="融资单位"
                           class="col-input"
                           :dept-name.sync="dataForm.deptName"></ren-dept-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="融资品种：" prop="varieties"  class="p-left-80">
            <el-input v-model="dataForm.varieties"
                      :disabled="dataForm.isDisabled"
                      :placeholder="dataForm.isDisabled?'':'融资品种'"
                      class="col-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="审批单位：" prop="approveOrg"  class="p-left-80">
            <ren-select v-model="dataForm.approveOrg"
                        :disabled="dataForm.isDisabled"
                        dict-type="approveOrg"
                        placeholder="审批单位"
                        style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="批文号：" prop="approveNo"  class="p-left-80">
            <el-input v-model="dataForm.approveNo"
                      :disabled="dataForm.isDisabled"
                      placeholder="批文号"
                      class="col-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="币种：" prop="currency"  class="p-left-50">
            <ren-select v-model="dataForm.currency"
                        dict-type="currency"
                        placeholder="币种"
                        :disabled="dataForm.isDisabled"
                        style="width: 100%"></ren-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="审批金额：" prop="issueQuota"  class="p-left-80">
            <money-input :value.sync="dataForm.issueQuota"
                         :edit-display-value="dataForm.issueQuotaText"
                         :is-disabled="dataForm.isDisabled"
                         placeholder="发行金额" :suffix="dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency"></money-input>
          </el-form-item>
        </el-col>
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
import FinanceUpload from '../../../components/finance-upload'
import MoneyInput from '@/components/money-input'
export default {
  components: { MoneyInput, FinanceUpload },
  data () {
    return {
      visible: false,
      activeIndex: '1',
      dataForm: {
        // 审核通过就禁用
        isDisabled: false,
        // id
        id: '',
        // 融资单位id
        deptId: '',
        // 融资品种：
        varieties: '',
        // 融资单位
        deptName: '',
        // 审批单位
        approveOrg: '',
        // 批文号
        approveNo: '',
        // 币种
        currency: '元',
        // 审批金额
        issueQuota: '',
        // 审批金额回显
        issueQuotaText: '',
        // 附件上传
        fileList: []
      }
    }
  },
  computed: {
    dataRule () {
      return {
        deptName: [
          { required: true, message: '请选择融资单位', trigger: 'change' }
        ],
        approveOrg: [
          { required: true, message: '请选择审批单位', trigger: 'change' }
        ],
        currency: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ],
        approveNo: [
          { required: true, message: '请输入批文号', trigger: 'blur' }
        ],
        issueQuota: [
          { required: true, message: '请输入审批金额', trigger: 'blur' }
        ],
        varieties: [
          { required: true, message: '请输入融资品种', trigger: 'blur' }
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
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm?.resetFields()
        this.$refs['finance-upload'].init()
        console.log(this.dataForm)
        if (this.$isNotNull(this.dataForm.id)) {
          // 修改
          this.getInfo()
        }
      })
    },
    // 重置表单数据
    resetData () {
      this.dataForm = {
        // 审核通过就禁用
        isDisabled: false,
        // id
        id: '',
        // 融资单位id
        deptId: '',
        // 融资单位
        deptName: '',
        // 审批单位
        approveOrg: '',
        // 批文号
        approveNo: '',
        // 币种
        currency: '元',
        // 审批金额
        issueQuota: '',
        // 审批金额回显
        issueQuotaText: '',
        // 附件上传
        fileList: []
      }
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/approval/' + this.dataForm.id + '/' + this.$store.state.unit)
        console.log('data>>>', data)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        _data.issueQuotaText = _data.issueQuota
        _data.isDisabled = _data.isChecked == '1'
        _data.fileList = this.$isNotNull(_data.fileList) ? _data.fileList : []
        this.dataForm = { ...this.dataForm, ..._data }
        console.log('getInfo', this.dataForm, data.data)
      } catch (e) {
        console.log('getInfo-e>>>>', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs.dataForm.validate(async (valid) => {
          if (!valid) {
            return false
          }
          const params = { ...this.dataForm }
          params.unit = this.$store.state.unit
          try {
            const { data } = await this.$http[!this.dataForm.id ? 'post' : 'put']('/financing/approval/', params)
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

</style>
