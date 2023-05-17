<template>
  <el-row >
    <el-form-item label="增信措施：" prop="creditMeasures" class="p-left-80">
      <el-checkbox-group v-model="dataForm.creditMeasures">
        <el-checkbox v-for="data in creditMeasuresList"
                     :key="data.dictValue"
                     :label ="data.dictValue">{{data.dictLabel}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <div v-show="dataForm.creditMeasures.findIndex(item=>item==='2') > -1">
<!--      <el-divider content-position="left">保证</el-divider>-->
      <div class="el-title-box"><i class="el-icon-position el-title-icon"></i>保证</div>

      <template  v-for="(item,index) in dataForm.guaranteeInfo.guarantee">
        <el-row>
          <el-col :span="6">
            <el-form-item label="保证人：" class="p-left-70">
              <el-input :disabled="disabled" v-model="item.guarantor" placeholder="保证人" class="col-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="担保比例：" class="p-left-80">
              <el-input v-model="item.ratio"
                        class="el-input-right"
                        :disabled="disabled"
                        @blur="changeRatio(item)"
                        placeholder="担保比例"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发行金额：" class="p-left-80">
              <money-input :value.sync="item.contractAmount"
                           :edit-display-value="item.contractAmountText"
                           :is-disabled="disabled"
                           :suffix="$getDictLabel('unit',$store.state.unit)"
                           placeholder="发行金额"></money-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <i class="el-icon-delete remove-icon" :class="[disabled===true?'is-disabled':'']" @click="handleRemove('guarantee',index)"></i>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否与被担保方存在产权关系：" class="p-left-200">
              <el-checkbox v-model="item.propertyRelations" :true-label="1" :false-label="0"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否为被担保方超股比担保：" class="p-left-200">
              <el-checkbox v-model="item.shareRatio" :true-label="1" :false-label="0"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有反担保：" class="p-left-110">
              <el-checkbox v-model="item.counterGuarantee" :true-label="1" :false-label="0"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="item.counterGuarantee==1">
            <el-form-item label="反担保方式：" class="p-left-110">
              <el-input v-model="item.counterGuaranteeText"
                        :disabled="disabled"
                        placeholder="反担保方式"></el-input>
            </el-form-item>

          </el-col>
        </el-row>
      </template>
      <el-button type="primary"
                 size="small"
                 class="add-upload-btn"
                 :disabled="disabled"
                 @click="addRow('guarantee')">
        <i class="el-icon-document-add el-icon--left"></i>增行
      </el-button>
    </div>
    <div v-show="dataForm.creditMeasures.findIndex(item=>item==='3') > -1">
<!--      <el-divider content-position="left">抵押</el-divider>-->
      <div class="el-title-box"><i class="el-icon-position el-title-icon"></i>抵押</div>

      <template  v-for="(item,index) in dataForm.guaranteeInfo.collateral">
        <el-row>
          <el-col :span="12">
            <el-form-item label="抵押物名称："  class="p-left-90">
              <el-input :disabled="disabled" v-model="item.collateralName" placeholder="抵押物名称" class="col-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抵押物所有人：" class="p-left-110">
              <el-input :disabled="disabled" v-model="item.mortgager" placeholder="抵押物所有人" class="col-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抵押物估值：" class="p-left-90">
              <money-input :value.sync="item.collateralAmount"
                           :edit-display-value="item.collateralAmountText"
                           :is-disabled="disabled"
                           :suffix="$getDictLabel('unit',$store.state.unit)"
                           placeholder="抵押物估值"></money-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起止日期：" prop="quota" class="p-left-80">
              <el-date-picker v-model="item.releaseTime"
                              type="daterange"
                              style="width: 100%"
                              value-format="yyyy-MM-dd"
                              :disabled="disabled"
                              range-separator="至"
                              start-placeholder="抵押日期"
                              end-placeholder="解押日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <i class="el-icon-delete remove-icon" :class="[disabled===true?'is-disabled':'']" @click="handleRemove('collateral',index)"></i>
            </el-form-item>

          </el-col>
        </el-row>
      </template>
      <el-button type="primary"
                 size="small"
                 class="add-upload-btn"
                 :disabled="disabled"
                 @click="addRow('collateral')">
        <i class="el-icon-document-add el-icon--left"></i>增行
      </el-button>
    </div>
    <div v-show="dataForm.creditMeasures.findIndex(item=>item==='4') > -1">
<!--      <el-divider content-position="left">质押</el-divider>-->
      <div class="el-title-box"><i class="el-icon-position el-title-icon"></i>质押</div>

        <template  v-for="(item,index) in dataForm.guaranteeInfo.pledge">
          <el-row>
            <el-col :span="12">
              <el-form-item label="质押标的：" class="p-left-80">
                <el-input :disabled="disabled" v-model="item.pledgeType" placeholder="质押标的" class="col-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出质人：" class="p-left-70">
                <el-input v-model="item.pledgeName"
                          placeholder="出质人"
                          :disabled="disabled"
                          class="col-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="质押价值：" class="p-left-80">
                <money-input :value.sync="item.pledgeAmount"
                             :edit-display-value="item.pledgeAmountText"
                             :is-disabled="disabled"
                             :suffix="$getDictLabel('unit',$store.state.unit)"
                             placeholder="质押价值"></money-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起止日期：" class="p-left-80">
                <el-date-picker v-model="item.releaseTime"
                                :disabled="disabled"
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
              <el-form-item>
                <i class="el-icon-delete remove-icon" :class="[disabled===true?'is-disabled':'']" @click="handleRemove('pledge',index)"></i>
              </el-form-item>

            </el-col>
          </el-row>
        </template>
        <el-button type="primary"
                 size="small"
                 class="add-upload-btn"
                 :disabled="disabled"
                 @click="addRow('pledge')">
        <i class="el-icon-document-add el-icon--left"></i>增行
      </el-button>

    </div>
  </el-row>
</template>

<script>
import MoneyInput from '@/components/money-input'
import { getDictDataList } from '@/utils'
export default {
  name: 'financeCreditReportingMeasures',
  components: { MoneyInput },
  props: {
    dataForm: {
      type: Object,
      default: () => {
        return {
          // 增信措施 多选结果
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
          }

        }
      }
    },
    // 直融取折合人民币，间融
    rmb: {
      type: [Number, String],
      default: 0
    },
    isDefaultAdd: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 增信措施枚举
      creditMeasuresList: getDictDataList('creditMeasures'),
      guarantee: {
        // 保证人
        guarantor: '',
        // 合同比例-》担保比例
        ratio: '',
        // 金额-》发行金额
        contractAmount: '',
        // 是否与被担保方存在产权关系
        propertyRelations: 0,
        // 是否为被担保方超股比担保
        shareRatio: 0,
        // 是否有反担保，注明反担保方式
        counterGuarantee: 0,
        // 反担保的方式
        counterGuaranteeText: 0
      },
      // 抵押
      collateral: {
        // 抵押物名称
        collateralName: '',
        // 抵押物估值
        collateralAmount: '',
        // 抵押物所有人
        mortgager: '',
        // 抵押起止日期
        releaseTime: []
      },
      // 质押
      pledge: {
        // 质押标的
        pledgeType: '',
        // 质押权人
        pledgeName: '',
        // 质押金额
        pledgeAmount: '',
        // 质押起止日期
        releaseTime: []
      },
      startDate: {
        disabledDate: (time) => {
          if (this.dataForm.startDate) {
            return time.getTime() > new Date(this.dataForm.endDate).getTime()
          } else {
            // 不能大于当前日期
          }
        }
      }
    }
  },
  watch: {
    rmb () {
      console.log('rmb变化了', this.rmb)
      if (this.$isNotNull(this.dataForm.guaranteeInfo?.guarantee)) {
        this.dataForm.guaranteeInfo.guarantee.map(item => {
          item.contractAmount = Number(this.rmb) * (Number(item.ratio) / 100)
          item.contractAmountText = item.contractAmount
          console.log(item.contractAmount)
        })
      }
    }
  },
  methods: {
    // 修改保证。担保比例
    changeRatio (item) {
      item.contractAmount = Number(this.rmb) * (Number(item.ratio) / 100)
      item.contractAmountText = item.contractAmount
    },
    addRow (attrName) {
      if (this.disabled === true) {
        return
      }
      const object = JSON.parse(JSON.stringify(this[attrName]))
      console.log('object>>', object)
      if (this.isDefaultAdd === true) {
        this.dataForm.guaranteeInfo[attrName].push(object)
      }
      this.$emit('add', attrName, object)
    },
    handleRemove (attrName, index) {
      if (this.disabled === true) {
        return
      }
      this.dataForm.guaranteeInfo[attrName].splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
.el-title-box{
  margin-bottom: 16px;
  color:#409EFF;
}
.el-title-icon{
  margin-right: 10px;
  color:#409EFF;
  font-size: 16px;
  position: relative;
  top:1px;
  transform:rotate(45deg)
}
</style>
