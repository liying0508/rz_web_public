<template>
<!--  银行授信集团审批详情-->
  <el-dialog :visible.sync="visible"
             title="湖南湘江新区发展集团有限公司授信200000元 的银行授信审核"
             width="80%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm"
             ref="dataForm"
             class="custom-form"
             @keyup.enter.native="dataFormSubmitHandle()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="授信单位：" class="p-left-80">
            <el-tooltip class="item" effect="dark" :content="dataForm.deptName" placement="top-start">
              <span class="desc-content ellipsis"> {{dataForm.deptName}}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="6"  >
          <el-form-item label="金融机构类型：" class="p-left-110">
            <span class="desc-content"> {{$getDictLabel('finance_dept_type',dataForm.institutionType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="金融机构：" class="p-left-80">
            <span class="desc-content"> {{dataForm.institutionName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="额度：" class="p-left-50">
            <span class="desc-content"> {{$numberFormat(dataForm.quota)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起始日：" class="p-left-70">
            <span class="desc-content">{{$formatDate(dataForm.startDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到期日：" class="p-left-70">
            <span class="desc-content">{{$formatDate(dataForm.endDate,'YYYY-MM-DD')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row>
        <el-form-item label="用途：" prop="purpose"  class="p-left-50">
          <div class="desc-content" v-html="dataForm.purpose"> </div>
        </el-form-item>
      </el-row>
      <finance-credit-reporting-measures-details :data-form="dataForm"></finance-credit-reporting-measures-details>
      <el-row>
        <el-form-item label="备注：" prop="remarks"  class="p-left-50">
          <div class="desc-content" v-html="dataForm.remarks"> </div>
        </el-form-item>
      </el-row>
      <el-divider>附件上传</el-divider>
      <finance-upload-details :data-form="dataForm" table-width="100%" ref="finance-upload"></finance-upload-details>
      <div style="margin-top:20px;">
        <el-divider>子公司审核</el-divider>
      </div>
      <el-row>
        <el-form-item label="审核结果：" class="p-left-80">
          {{$getDictLabel("audit_result", dataForm.isChecked)}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="审核意见：" class="p-left-80">
          {{dataForm.checkedDes?dataForm.checkedDes:'无'}}
        </el-form-item>
      </el-row>
      <el-divider>集团审核</el-divider>
      <el-row>
        <el-form-item label="审核结果：" prop="result"  class="p-left-80">
          <ren-radio-group v-model="dataForm.result" dict-type="audit_result"></ren-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="审核意见：" prop="opinion" class="p-left-80">
          <el-input type="textarea" placeholder="审核意见" v-model="dataForm.opinion" maxlength="200" show-word-limi  class="col-input" ></el-input>
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
import FinanceCreditReportingMeasuresDetails from '@/components/finance-credit-reporting-measures/details'
import FinanceUploadDetails from '@/components/finance-upload/details'
export default {
  name: 'fcreditrecordAuditDetails',
  components: { FinanceUploadDetails, FinanceCreditReportingMeasuresDetails },
  data () {
    return {
      visible: false,
      // 金融机构
      deptList: [],
      dataForm: {
        // 审批结果
        result: '1',
        // 审批意见
        opinion: '',
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
    }
  },
  methods: {
    // 初始化数据
    async init () {
      await this.getDeptList()
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
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
        console.log('getDeptList-e', e)
      }
    },
    // 获取信息回填
    async getInfo () {
      try {
        const { data } = await this.$http.get('financing/recordgroupaudit/' + this.dataForm.id + '/' + this.$store.state.unit)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        _data.result = _data.groupChecked
        _data.opinion = _data.groupCheckedDes
        _data.creditMeasuresText = _data.creditMeasures
        _data.creditMeasures = this.$isNotNull(_data.creditMeasures) ? _data.creditMeasures.split(',') : []
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
        console.log(_data)
        _data.fileList = this.$isNotNull(_data.fileList) ? _data.fileList : []
        this.dataForm = { ...this.dataForm, ..._data }
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
        const { result, opinion, id } = this.dataForm
        const { data } = await this.$http.post('/financing/recordgroupaudit/groupcheck', {
          groupChecked: result,
          groupCheckedDes: opinion,
          id: id,
          creditId: id
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
