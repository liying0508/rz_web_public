<template>
<!--  担保信息审核详情-->
  <el-dialog :visible.sync="visible"
             title="湖南湘江新区发展集团有限公司授信200000元 的担保信息审核"
             width="85%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="custom-form"
             @keyup.enter.native="dataFormSubmitHandle()">
      <el-row>
        <el-col :span="6">
          <el-form-item label="保证人：" class="p-left-70">
            <span class="desc-content"> {{dataForm.guarantor}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同比例：" class="p-left-110">
            <span class="desc-content"> {{dataForm.ratio}} %</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金额：" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.contractAmount)}} 元</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="信用：" class="p-left-50">
            <span class="desc-content"> {{dataForm.credit===true || dataForm.credit== '1' ?'信用':''}} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抵押物名称：" class="p-left-100">
            <span class="desc-content"> {{dataForm.collateralName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抵押物所有人：" class="p-left-110">
            <span class="desc-content"> {{dataForm.mortgager}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抵押物评估值：" prop="collateralAmount" class="p-left-110">
            <span class="desc-content"> {{$numberFormat(dataForm.collateralAmount)}} 元</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抵押起止日期：" prop="quota" class="p-left-110">
            <span class="desc-content">
              {{$formatDate(dataForm.releaseTime[0],'YYYY-MM-DD')}} 至 {{$formatDate(dataForm.releaseTime[1],'YYYY-MM-DD')}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="质押标的：" prop="pledgeType" class="p-left-80">
            <span class="desc-content"> {{dataForm.pledgeType}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="质押人：" prop="pledgeName" class="p-left-70">
            <span class="desc-content"> {{dataForm.pledgeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="质押价值：" prop="pledgeAmount" class="p-left-80">
            <span class="desc-content"> {{$numberFormat(dataForm.pledgeAmount)}} 元</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="质押起止日期：" prop="quota" class="p-left-110">
            <span class="desc-content">
              {{$formatDate(dataForm.pledgeReleaseTime[0],'YYYY-MM-DD')}} 至 {{$formatDate(dataForm.pledgeReleaseTime[1],'YYYY-MM-DD')}}
            </span>

          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注：" prop="remarks" class="p-left-50">
          <div class="desc-content" v-html="dataForm.remarks"> </div>
        </el-form-item>
      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload-details table-width="100%" ref="finance-upload"></finance-upload-details>
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
  name: 'fguaranteeinfoAuditDetails',
  components: { FinanceUploadDetails },
  data () {
    return {
      visible: false,
      dataForm: {
        // 审批结果
        result: '1',
        // 审批意见
        opinion: '',
        // 主键
        id: '',
        credit: false,
        // 保证人
        guarantor: '',
        // 合同比例
        ratio: '',
        // 金额
        contractAmount: '',
        // 抵押物名称
        collateralName: '',
        // 抵押物估值
        collateralAmount: '',
        // 抵押物所有人
        mortgager: '',
        // 抵押起止日期
        releaseTime: [],
        // 质押标的
        pledgeType: '',
        // 质押人
        pledgeName: '',
        // 质押价值
        pledgeAmount: '',
        // 质押起止日期
        pledgeReleaseTime: [],
        // 备注
        remarks: '',
        // 附件上传
        fileList: []
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
    // 初始化数据
    async init () {
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
        const { data } = await this.$http.get('/financing/fguaranteeinfo/' + this.dataForm.id)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        data.data.result = data.data.checked
        data.data.opinion = data.data.checkedDes
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
        const { result, opinion, id } = this.dataForm
        const { data } = await this.$http.post('/financing/fguaranteeinfo/check', {
          checked: result,
          checkedDes: opinion,
          id: id
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
