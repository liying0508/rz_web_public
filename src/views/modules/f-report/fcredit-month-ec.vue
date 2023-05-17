<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-financing__fcreditrecord-report">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item  label="授信单位">
          <ren-dept-tree v-model="dataForm.deptId" placeholder="授信单位" :dept-name.sync="dataForm.deptName"></ren-dept-tree>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.startDate" :picker-options="startTimeOptions" type="month" value-format="yyyy-MM" placeholder="起始月份" @focus="clickStartTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dataForm.endDate" :picker-options="endTimeOptions" type="month" value-format="yyyy-MM" placeholder="结束月份" @focus="clickEndTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <div id="echartsWrapper"></div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import * as echarts from 'echarts'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/report/credit/credit-moth-list',
        exportURL: ''
      },
      dataForm: {
        deptId: '',
        startDate: '',
        endDate: ''
      },
      myCharts: null,
      chartsOpt: {}
    }
  },
  mounted () {
    this.echartsInit()
  },
  watch: {
    dataList: function (newVal) {
      this.updateEcharts()
    }
  },
  methods: {
    echartsInit: function () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('echartsWrapper'))
      // 绘制图表
      this.myChart.setOption(this.chartsOpt)
    },
    updateEcharts: function () {
      let xData = []
      let quotaList = []
      let usedQuotaList = []
      let unUsedQuotaList = []
      let capitalList = []
      let interestList = []
      let sumList = []
      this.dataList.forEach((item) => {
        xData.push(item.date)
        capitalList.push(item.capital)
        interestList.push(item.interest)
        quotaList.push(item.quota)
        sumList.push(item.sum)
        unUsedQuotaList.push(item.unUsedQuota)
        usedQuotaList.push(item.usedQuota)
      })
      this.chartsOpt = {
        title: {
          text: '月度报表'
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 'bottom',
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 元',
            align: 'center'
          }
        },
        dataZoom: [
          { // 第一个 dataZoom 组件
            yAxisIndex: [0, 2] // 表示这个 dataZoom 组件控制 第一个 和 第三个 yAxis
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            formatter: '{b} : {c}'
          }
        },
        series: [
          {
            name: '授信额度',
            data: quotaList,
            type: 'line',
            label: {
              show: true
            }
          },
          {
            name: '已使用额度',
            data: usedQuotaList,
            type: 'line',
            label: {
              show: true
            }
          },
          {
            name: '剩余额度',
            data: unUsedQuotaList,
            type: 'line',
            label: {
              show: true
            }
          },
          {
            name: '当月应还本金',
            data: capitalList,
            type: 'line',
            label: {
              show: true,
              position: "bottom"
            }
          },
          {
            name: '当月应还利息',
            data: interestList,
            type: 'line',
            label: {
              show: true
            }
          },
          {
            name: '本息合计',
            data: sumList,
            type: 'line',
            label: {
              show: true
            }
          }
        ]
      }
      this.myChart.setOption(this.chartsOpt)
    }
  }
}
</script>

<style lang="scss">
  #echartsWrapper {
    width: 100%;
    height: 500px;
  }
</style>