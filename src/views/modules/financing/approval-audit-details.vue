<template>
  <!--  直融批文审批编辑-->
  <el-dialog
      :visible.sync="visible"
      title="直融批文审核"
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
          <el-form-item label="融资单位："
                        class="p-left-80">
            <el-tooltip class="item" effect="dark" :content="dataForm.deptName" placement="top-start">
              <span class="desc-content ellipsis"> {{dataForm.deptName}}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="融资品种：" class="p-left-80">
            <span class="desc-content"> {{dataForm.varieties}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="审批单位：" class="p-left-80">
            <span class="desc-content"> {{$getDictLabel('approveOrg',dataForm.approveOrg)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="批文号：" class="p-left-80">
            <span class="desc-content"> {{dataForm.approveNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="币种：" class="p-left-50">
            <span class="desc-content"> {{$getDictLabel('currency',dataForm.currency)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="审批金额：" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.issueQuota)}} {{dataForm.currency=='元'? $getDictLabel('unit',$store.state.unit):dataForm.currency}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload-details :data-form="dataForm" table-width="100%" ref="finance-upload"></finance-upload-details>
      <el-row>
        <el-form-item label="审核结果：" prop="result"  class="p-left-80">
          <ren-radio-group v-model="dataForm.result" dict-type="audit_result"></ren-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="审核意见：" prop="opinion" class="p-left-80">
          <el-input type="textarea" placeholder="审核意见" v-model="dataForm.opinion" maxlength="200" show-word-limi  class="col-input"></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceUploadDetails from '@/components/finance-upload/details'
export default {
  name: 'approvalAuditDetails',
  components: {
    FinanceUploadDetails
  },
  data () {
    return {
      visible: false,
      activeIndex: '1',
      dataForm: {
        // 审批结果
        result: '1',
        // 审批意见
        opinion: '',
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
        // 附件上传
        fileList: []
      }
    }
  },
  computed: {
    dataRule () {
      return {}
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息回填
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/approval/' + this.dataForm.id+'/'+this.$store.state.unit)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        data.data.result = data.data.isChecked
        data.data.opinion = data.data.checkedDes
        data.fileList = this.$isNotNull(data.fileList) ? data.fileList : []
        this.dataForm = { ...this.dataForm, ...data.data }
      } catch (e) {
        console.log('getInfo-e', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { approveNo, result, opinion, id } = this.dataForm
        const { data } = await this.$http.post('/financing/approval/check', {
          approvalNo: approveNo,
          checked: result,
          checkedDes: opinion,
          approvalId: id
        })
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.$message.success(this.$t('prompt.success'))
        setTimeout(() => {
          this.visible = false
        }, 500)

        this.$emit('refreshDataList')
      })
    }, 1000, { leading: true, trailing: false })
  }
}
</script>

<style lang="scss" scoped>

</style>
