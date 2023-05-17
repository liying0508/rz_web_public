<template>
<!--  还款信息集团审核详情-->
  <el-dialog :visible.sync="visible"
             title="还款审核"
             width="80%"
             class="form-el-dialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
             <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmitHandle()"
             class="custom-form">
             <el-row class="menu-row">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="form-menu-item">偿还本金</el-menu-item>
        <el-menu-item index="2" class="form-menu-item">偿还利息</el-menu-item>

      </el-menu>
    </el-row>
              <repayment-info  v-show="activeIndex=='1'" :data-form="dataForm" ref="paymentTable"></repayment-info>
              <repayment-interest-info  v-show="activeIndex=='2'" :data-form="dataForm" ref="paymentInterestTable"></repayment-interest-info>
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
                <el-form-item label="审核结果：" prop="groupChecked"  class="p-left-80">
                  <ren-radio-group v-model="dataForm.groupChecked" dict-type="audit_result"></ren-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="审核意见：" prop="groupCheckedDes" class="p-left-80">
                  <el-input type="textarea" placeholder="审核意见" v-model="dataForm.groupCheckedDes" maxlength="200" show-word-limi  class="col-input"></el-input>
                </el-form-item>
              </el-row>
             </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary"
                 :disabled="dataForm.isDisabled"
                 @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import RepaymentInfo from '@/components/repaymentinfo-audit'
import RepaymentInterestInfo from '@/components/repaymentinfo-audit/interest'
export default {
  components: { RepaymentInfo, RepaymentInterestInfo },
  data () {
    return {
      activeIndex: '1',
      visible: false,
      dataForm: {
        financingId: '',
        financingType: '',
        repaymentInfo: {
          repayPrincipalInfoList: [],
          repayInterestInfoList: []
        }
      }
    }
  },
  computed: {
    dataRule () {
      return {}
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
      console.log(this.dataForm)
      this.getInfo()
    },
    resetData () {
      this.dataForm = {
        financingId: '',
        financingType: '',
        repaymentInfo: {
          repayPrincipalInfoList: [],
          repayInterestInfoList: []
        }
      }
    },
    // tab切换
    handleSelect (val) {
      this.activeIndex = val
      if (val == 1) this.$refs.paymentTable.getRepaymentMoney()
      if (val == 2) this.$refs.paymentInterestTable.getRepaymentMoney()
    },
    // 获取信息
    async getInfo () {
      try {
        const { data } = await this.$http.get('/financing/repaymentinfo', {
          params: {
            financingId: this.dataForm.financingId,
            financingType: this.dataForm.financingType,
            unit: this.$store.state.unit
          }
        })
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.dataForm = data.data
      } catch (e) {
        console.log('getInfo-e:', e)
      }
    },
    countBalance () {
      console.log('blur')
      if (this.$isNotNull(this.dataForm.invoiceAmount) && this.$isNotNull(this.dataForm.contractAmount)) {
        this.dataForm.withdrawalAmount = Number(this.dataForm.contractAmount) - Number(this.dataForm.invoiceAmount)
      } else {
        this.dataForm.withdrawalAmount = null
      }
      this.dataForm.withdrawalAmountText = this.dataForm.withdrawalAmount
      console.log(this.dataForm.withdrawalAmount)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      async function () {
        try {
          var params = {
            id: null,
            groupChecked: this.dataForm.groupChecked,
            groupCheckedDes: this.dataForm.groupCheckedDes,
            repaymentId: this.dataForm.id
          }
          console.log(params)
          const { data } = await this.$http.post('/financing/repaymentinfo/groupcheck', params)
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
      },
      1000,
      { leading: true, trailing: false }
    )
  }
}

</script>
