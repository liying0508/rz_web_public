<template>
  <el-row >
    <el-form-item label="增信措施：" prop="creditMeasures" class="p-left-80">
      <span class="desc-content">
       {{ $getDictLabel("creditMeasures",dataForm.creditMeasuresText) }}
      </span>
    </el-form-item>
    <div v-show="dataForm.creditMeasures.findIndex(item=>item==='2') > -1">
      <!--      <el-divider content-position="left">保证</el-divider>-->
      <div class="el-title-box"><i class="el-icon-position el-title-icon"></i>保证 </div>
      <template  v-for="item in dataForm.guaranteeInfo.guarantee">
        <el-row>
          <el-col :span="6">
            <el-form-item label="保证人：" class="p-left-70">
              <span class="desc-content"> {{item.guarantor}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同比例：" class="p-left-80">
              <span class="desc-content"> {{item.ratio}} %</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="金额：" prop="quota" class="p-left-50">
              <span class="desc-content"> {{$numberFormat(item.contractAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否与被担保方存在产权关系：" class="p-left-200">
              <span class="desc-content"> {{item.propertyRelations==0?"否":"是"}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否为被担保方超股比担保：" class="p-left-200">
              <span class="desc-content"> {{item.shareRatio==0?"否":"是"}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有反担保：" class="p-left-110">
              <span class="desc-content"> {{item.counterGuarantee==0?"否":"是"}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="反担保方式：" class="p-left-110">
              <span class="desc-content">{{item.counterGuaranteeText}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

    </div>
    <div v-show="dataForm.creditMeasures.findIndex(item=>item==='3') > -1">
      <!--      <el-divider content-position="left">抵押</el-divider>-->
      <div class="el-title-box"><i class="el-icon-position el-title-icon"></i>抵押</div>
      <template  v-for="item in dataForm.guaranteeInfo.collateral">
        <el-row>
          <el-col :span="12">
            <el-form-item label="抵押物名称：" class="p-left-90">
              <span class="desc-content"> {{item.collateralName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抵押物所有人：" class="p-left-110">
              <span class="desc-content"> {{item.mortgager}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抵押物估值：" class="p-left-90">
              <span class="desc-content"> {{$numberFormat(item.collateralAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起止日期：" class="p-left-80">
              <span class="desc-content">
                {{$formatDate(item.releaseTime[0],'YYYY-MM-DD')}} 至  {{$formatDate(item.releaseTime[1],'YYYY-MM-DD')}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </template>
    </div>
    <div v-show="dataForm.creditMeasures.findIndex(item=>item==='4') > -1">
      <!--      <el-divider content-position="left">质押</el-divider>-->
      <div class="el-title-box"><i class="el-icon-position el-title-icon"></i>质押</div>
      <template  v-for="(item,index) in dataForm.guaranteeInfo.pledge">
        <el-row>
          <el-col :span="12">
            <el-form-item label="质押标的：" class="p-left-80">
              <span class="desc-content"> {{item.pledgeType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="质押人：" class="p-left-70">
              <span class="desc-content"> {{item.pledgeName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="质押价值：" prop="quota" class="p-left-80">
              <span class="desc-content"> {{$numberFormat(item.pledgeAmount)}} {{$getDictLabel('unit',$store.state.unit)}}</span>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起止日期：" prop="quota" class="p-left-80">
              <span class="desc-content">
                {{$formatDate(item.releaseTime[0],'YYYY-MM-DD')}} 至  {{$formatDate(item.releaseTime[1],'YYYY-MM-DD')}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </template>

    </div>
  </el-row>
</template>

<script>
import { getDictDataList } from '@/utils'

export default {
  name: 'financeCreditReportingMeasuresDetails',
  props: {
    dataForm: {
      type: Object,
      default: () => {
        return {
          // 增信措施 多选结果
          creditMeasures: [],
          creditMeasuresText: '',
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
    }
  },
  data () {
    return {
      // 增信措施枚举
      creditMeasuresList: getDictDataList('creditMeasures')
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
