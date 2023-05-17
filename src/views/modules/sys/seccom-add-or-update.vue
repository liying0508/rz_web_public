<template>
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
             :close-on-click-modal="false"
             width="50%"
             class="form-el-dialog"
             :close-on-press-escape="false">
    <el-form :model="dataForm"
             :rules="dataRule"
             class="custom-form"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="公司名称" prop="secComName">
        <el-input v-model="dataForm.secComName"
                  placeholder="公司名称">
        </el-input>
          </el-form-item>
      <el-form-item label="辖区" prop="area">
        <el-input v-model="dataForm.area"
                  placeholder="辖区">
        </el-input>
        <!-- <money-input :value.sync="dataForm.creditQuota"
                         :edit-display-value="dataForm.creditQuotaText"
                         :is-disabled="dataForm.isDisabled"
                         :suffix="$getDictLabel('unit',$store.state.unit)"
                         placeholder="授信总额"></money-input> -->
      </el-form-item>
    </el-form>
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
      visible: false,
      dataForm: {
        id: '',
        secComName: '',
        area: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        secComName: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请输入辖区', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm.secComName = ''
      this.dataForm.area = ''
      this.$nextTick(() => {
        this.$refs.dataForm?.resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 重置表单数据
    resetData () {
      this.dataForm = {
        id: '',
        secComName: '',
        area: ''
      }
    },
    // 获取信息
    getInfo () {
      // this.$http.get('/creditQuota/' + this.dataForm.id + '/' + this.$store.state.unit).then(({ data: res }) => {
      this.$http.get('/sys/seccom/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        const data = res.data
        data.creditQuotaText = data.creditQuota
        this.dataForm = {
          ...this.dataForm,
          ...data
        }
        console.log('getInfo', this.dataForm)
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        const params = JSON.parse(JSON.stringify(this.dataForm))
        // params.unit = this.$store.state.unit
        this.$http[!this.dataForm.id ? 'post' : 'put']('/sys/seccom/', params).then(({ data: res }) => {
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
