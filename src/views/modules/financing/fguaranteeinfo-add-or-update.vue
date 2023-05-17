<template>
<!--  担保信息编辑-->
  <el-dialog :visible.sync="visible"
             :title="!dataForm.id ? $t('add') : $t('update')"
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
          <el-form-item label="保证人：" prop="guarantor" class="p-left-70">
            <el-input v-model="dataForm.guarantor" placeholder="保证人" class="col-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同比例：" prop="ratio" class="p-left-110">
            <el-input v-model="dataForm.ratio" class="el-input-right" placeholder="比例">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金额：" prop="contractAmount" class="p-left-80">
            <money-input :value.sync="dataForm.contractAmount"
                         :edit-display-value="dataForm.contractAmountText"
                         placeholder="合同金额"></money-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="信用：" prop="creditText" class="p-left-50">
            <el-checkbox-group v-model="dataForm.credit">
              <el-checkbox value="信用"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抵押物名称：" prop="collateralName" class="p-left-100">
            <el-input v-model="dataForm.collateralName" placeholder="抵押物名称" class="col-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抵押物所有人：" prop="quota" class="p-left-110">
            <el-input v-model="dataForm.mortgager" placeholder="抵押物所有人" class="col-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抵押物估值：" prop="collateralAmount" class="p-left-110">
            <money-input :value.sync="dataForm.collateralAmount"
                         :edit-display-value="dataForm.collateralAmountText"
                         placeholder="抵押物评估值"></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抵押起止日期：" prop="quota" class="p-left-110">
            <el-date-picker v-model="dataForm.releaseTime"
                            type="daterange"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="抵押日期"
                            end-placeholder="解押日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="质押标的：" prop="pledgeType" class="p-left-80">
            <el-input v-model="dataForm.pledgeType" placeholder="质押标的" class="col-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="质押人：" prop="pledgeName" class="p-left-70">
            <el-input v-model="dataForm.pledgeName" placeholder="质押人" class="col-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="质押价值：" prop="pledgeAmount" class="p-left-80">
            <money-input :value.sync="dataForm.pledgeAmount"
                         :edit-display-value="dataForm.pledgeAmountText"
                         placeholder="质押价值"></money-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="质押起止日期：" prop="quota" class="p-left-110">
            <el-date-picker v-model="dataForm.pledgeReleaseTime"
                            type="daterange"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="抵押日期"
                            end-placeholder="解押日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注：" prop="remarks" class="p-left-50">
          <el-input type="textarea" placeholder="备注" v-model="dataForm.remarks" maxlength="200" show-word-limi></el-input>
        </el-form-item>
      </el-row>
      <el-divider content-position="left">附件上传</el-divider>
      <finance-upload table-width="100%" ref="finance-upload"></finance-upload>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import FinanceUpload from '@/components/finance-upload'
import MoneyInput from '@/components/money-input'
export default {
  components: { MoneyInput, FinanceUpload },
  data () {
    return {
      visible: false,
      dataForm: {
        // 主键
        id: '',
        credit: false,
        // 保证人
        guarantor: '',
        // 合同比例
        ratio: '',
        // 金额
        contractAmount: '',
        // 金额回显
        contractAmountText: '',
        // 抵押物名称
        collateralName: '',
        // 抵押物估值
        collateralAmount: '',
        // 抵押物估值回显
        collateralAmountText: '',
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
        // 质押价值回显
        pledgeAmountText: '',
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
  watch: {
    visible: function (newVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },
  methods: {
    // 初始化数据
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.$refs['finance-upload'].init()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    resetData () {
      this.dataForm = {
        // 主键
        id: '',
        credit: false,
        // 保证人
        guarantor: '',
        // 合同比例
        ratio: '',
        // 金额
        contractAmount: '',
        // 金额回显
        contractAmountText: '',
        // 抵押物名称
        collateralName: '',
        // 抵押物估值
        collateralAmount: '',
        // 抵押物估值回显
        collateralAmountText: '',
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
        // 质押价值回显
        pledgeAmountText: '',
        // 质押起止日期
        pledgeReleaseTime: [],
        // 备注
        remarks: '',
        // 附件上传
        fileList: []
      }
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/fguaranteeinfo/' + this.dataForm.id)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        const _data = data.data
        // 金额回显
        _data.contractAmountText = _data.contractAmount
        // 抵押物估值回显
        _data.collateralAmountText = _data.collateralAmount
        // 质押价值回显
        _data.pledgeAmountText = _data.pledgeAmount
        this.dataForm = { ...this.dataForm, ..._data }
      } catch (e) {
        console.log('getInfo-e:', e)
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs.dataForm.validate(async (valid) => {
          if (!valid) {
            return false
          }
          try {
            const { data } = await this.$http[!this.dataForm.id ? 'post' : 'put']('/financing/fguaranteeinfo/', this.dataForm)
            if (data.code !== 0) {
              return this.$message.error(data.msg)
            }
            this.$message.success(this.$t('prompt.success'))
            setTimeout(() => {
              this.visible = false
            }, 500)

            this.$emit('refreshDataList')
          } catch (e) {

          }
        })
      },
      1000,
      { leading: true, trailing: false }
    )
  }
}
</script>
