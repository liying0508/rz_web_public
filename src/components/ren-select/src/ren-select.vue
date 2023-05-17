<template>
    <el-select :value="value1" :multiple="multiple" @input="$emit('input', $event)" :disabled="disabled" :placeholder="placeholder" clearable>
        <el-option :label="data.dictLabel" v-for="data in dataList" :key="data.dictValue" :value ="data.dictValue">{{data.dictLabel}}</el-option>
    </el-select>
</template>
<script>
import { getDictDataList } from '@/utils'
export default {
  name: 'RenSelect',
  data () {
    return {
      dataList: getDictDataList(this.dictType),
      value1: ''
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: [Number, String, Array],
    dictType: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 前端处理：字典表中返回的都是字符串，而页面返回的都是整形，需要转化处理
    // 后端处理：只需将字典接口的值返回为整形即可
    // value (val) {
    //   if (typeof (val) === 'number') {
    //     this.value1 = val + ''
    //   } else this.value1 = val
    // }
    value: {
      handler (val) {
        if (typeof (val) === 'number') {
          this.value1 = val + ''
        } else this.value1 = val
      },
      immediate: true
    }
  }
}
</script>
