<template>
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
             :close-on-click-modal="false"
             width="25%"
             class="form-el-dialog"
             :close-on-press-escape="false">
    <el-form :model="dataForm"
             :rules="dataRule"
             class="custom-form"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
<!--      <el-form-item label="编号" prop="id">
        <el-input v-model="dataForm.id" placeholder="编号"></el-input>
      </el-form-item>-->
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="dataForm.startTime"
                        type="date"
                        class="col-input"
                        value-format="yyyy-MM-dd"
                        placeholder="开始时间" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="dataForm.endTime"
                        type="date"
                        class="col-input"
                        value-format="yyyy-MM-dd"
                        placeholder="结束时间" />
      </el-form-item>
      <el-form-item label="1年期利率" prop="rate">
        <el-input v-model="dataForm.rate"
                  placeholder="1年期利率">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="5年期利率" prop="fiveRate">
        <el-input v-model="dataForm.fiveRate"
                  placeholder="5年期利率">
          <template slot="append">%</template>
        </el-input>
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
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        startTime: '',
        endTime: '',
        rate: '',
        fiveRate: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/lpr/flpr/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        const data = res.data
        data.startTime = this.$formatDate(data.startTime, 'YYYY-MM-DD')
        data.endTime = this.$formatDate(data.endTime, 'YYYY-MM-DD')
        this.dataForm = {
          ...this.dataForm,
          ...data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/lpr/flpr/', this.dataForm).then(({ data: res }) => {
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
