<template>
  <div>
    <el-input
        v-show="isEdit"
        v-model="currentValue"
        ref="validInput"
        :disabled="isDisabled"
        @blur="handleValueBlur"
    >
      <template slot="prepend" v-if="prefix">{{ prefix }}</template>
      <template slot="append" v-if="suffix">{{ suffix }}</template>
    </el-input>
    <el-input
        v-show="!isEdit"
        v-model="displayValue"
        class="money-input"
        :disabled="isDisabled"
        :placeholder="placeholder"
        @focus="handleDisplayfocus"
    >
      <template slot="prepend" v-if="prefix">{{ prefix }}</template>
      <template slot="append" v-if="suffix">{{ suffix }}</template>
    </el-input>
  </div>
</template>
<script>
/** 金额编辑组件 */
export default {
  name: 'moneyInput',
  /**
   * 属性参数
   * @member props
   * @property {number|string} [value] 原始值
   * @property {number} [precision=0] 精度，保留几位小数
   * @property {string} [separator=,] 分隔值的符号，默认值为‘,’（英文逗号）
   * @property {string} [prefix] 前缀内容，也可以用插槽定义
   * @property {string} [suffix] 后缀内容，也可以用插槽定义
   * @property {boolean} [percentage] 按百分比计算显示, 如value=0.2, 显示为 20%
   */
  props: {
    // 数字
    value: [Number, String],
    // 精度，保留几位小数
    precision: {
      type: Number,
      default: 2
    },
    // 分隔符
    separator: {
      type: String,
      default: ','
    },
    // 前缀
    prefix: {
      type: String,
      default: ''
    },
    // 后缀
    suffix: {
      type: String,
      default: '元'
    },
    // 按百分比显示
    percentage: {
      type: Boolean,
      default: false
    },
    // 提示
    placeholder: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 用于回显的数据
    editDisplayValue: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      isEdit: false, // 默认显示格式化后内容
      currentValue: this.value, // 绑定值
      displayValue: this.value // 显示的值
    }
  },
  watch: {
    value (val) {
      this.currentValue = val || ''
      if (this.$isNotNull(val)) {
        this.currentValue = val
      } else {
        this.currentValue = ''
        this.displayValue = ''
      }
    },
    editDisplayValue () {
      console.log('editdisplay', this.editDisplayValue)
      if (this.$isNotNull(this.editDisplayValue)) {
        this.handleValueBlur(this.editDisplayValue, true)
      }
    },
    currentValue (val) {
      this.$emit('update:value', val)
    }
  },
  methods: {
    // 显示格式化的值
    handleValueBlur (val, hasVal) {
      // if (this.currentValue.includes(',')) {
      //   this.currentValue = this.currentValue.replaceAll(',', '');
      // }
      let value = this.currentValue
      if (hasVal === true) {
        value = val
      }
      let thousandsFormate = this.numberFormat(
        value,
        this.precision,
        this.separator
      )
      if (this.percentage) {
        thousandsFormate = value * 100 + '%'
      }
      this.displayValue = thousandsFormate
      this.isEdit = false
      if (!hasVal) {
        this.$emit('blur')
      }
    },
    // 开启编辑
    handleDisplayfocus () {
      const me = this
      this.isEdit = true
      setTimeout(() => {
        me.$refs.validInput.focus()
      }, 100)
    },
    /*
     * 金额格式化：
     * number：要格式化的数字
     * decimals：保留几位小数
     * thousandsSep：千分位符号
     * tdecPoint：小数点符号
     * */
    numberFormat (number, decimals = 2, thousandsSep = ',', tdecPoint = '.') {
      number = (number + '').replace(/[^0-9+-Ee.]/g, '')
      if (number.indexOf(',') > -1) {
        return number
      }
      const n = !isFinite(+number) ? 0 : +number
      const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
      const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep
      const dec = typeof tdecPoint === 'undefined' ? '.' : tdecPoint
      let s = ''
      const toFixedFix = function (n, prec) {
        const k = Math.pow(10, prec)
        return '' + Math.ceil(n * k) / k
      }

      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      const re = /(-?\d+)(\d{3})/
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2')
      }

      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    }
  }
}
</script>
<style lang="scss" scoped>
.money-input{
 ::v-deep .el-input__inner{
   text-align: right;
 }
}
</style>
