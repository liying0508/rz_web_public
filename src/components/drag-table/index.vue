<template>
  <div class="drag-table" :class="{'w-table_moving': dragState.dragging}">
    <el-table :data="data"
              :border="option.border"
              :height="option.height"
              :span-method="objectSpanMethod"
              :max-height="option.maxHeight"
              :style="{ width: parseInt(option.width)+'px' }"
              :header-cell-class-name="headerCellClassName"
    >
      <slot name="fixed"></slot>
<!--      <el-table-column v-for="(col, index) in tableHeader" :key="index"
                       :prop="col.prop"
                       :label="col.label"
                       :width="col.width"
                       :min-width="col.minWidth"
                       :type="col.type"
                       :header-align="col.headerAlign"
                       :column-key="index.toString()"
                       :render-header="renderHeader"
      >
      </el-table-column>-->
      <el-table-column v-for="(parent,index) in tableHeader"
                       :key="`${parent.prop}_${index}`"
                       :label="parent.label"
                       :prop="parent.prop"
                       :width="parent.width"
                       :render-header="renderHeader"
                       :column-key="index.toString()"
                       :fixed="parent.fixed!==undefined? parent.fixed:false"
                       :align="parent.align!==undefined?parent.align:'left'"
                       :class-name="`has-line-${index+2} last-nth-child-${tableHeader.length+1-index}`"
                       :show-overflow-tooltip="parent.showOverflowTooltip !==undefined ?parent.showOverflowTooltip:showOverflowTooltip"
      >
        <template  slot-scope="{row}">
          <span  v-if="parent.children===null || parent.children === undefined || parent.children.length===0" >
             {{row[parent.prop]!==null && row[parent.prop]!==undefined&&row[parent.prop]!==''?row[parent.prop]:($isNotNull(parent.n)?parent.n:'/')}}
          </span>

        </template>
        <el-table-column v-if="parent.children!==null && parent.children !== undefined && parent.children.length>0"
                         v-for="(_parent,_pIndex) in parent.children"
                         :key="`${_parent.prop}_${_pIndex}`"
                         :label="_parent.label"
                         :prop="_parent.prop"
                         :width="_parent.width"
                         :render-header="renderHeader"
                         :column-key="String(index+_pIndex)"
                         :fixed="_parent.fixed!==undefined? _parent.fixed:false"
                         :align="_parent.align!==undefined?_parent.align:'left'"
                         :class-name="`has-line-${index+2}-${_pIndex+1} last-nth-child-${tableHeader.length+1-index}-${parent.children.length-_pIndex}`"
                         :show-overflow-tooltip="_parent.showOverflowTooltip !==undefined ?_parent.showOverflowTooltip:showOverflowTooltip">
          <template  slot-scope="{row}">
            <span  v-if="_parent.children===null || _parent.children === undefined || _parent.children.length===0" >
               {{row[_parent.prop]!==null && row[_parent.prop]!==undefined&&row[_parent.prop]!==''?row[_parent.prop]:($isNotNull(_parent.n)?_parent.n:'/')}}
            </span>
          </template>
          <el-table-column v-if="_parent.children!==null && _parent.children !== undefined && _parent.children.length>0"
                           v-for="(child,cIndex) in _parent.children"
                           :key="`${child.prop}_${cIndex}`"
                           :label="child.label"
                           :prop="child.prop"
                           :width="child.width"
                           :render-header="renderHeader"
                           :column-key="String(index+_pIndex+cIndex)"
                           :fixed="child.fixed!==undefined? child.fixed:false"
                           :align="child.align!==undefined?child.align:'left'"
                           :class-name="`has-line-${index+2}-${_pIndex+1}-${cIndex+1} last-nth-child-${tableHeader.length+1-index}-${parent.children.length-_pIndex}-${_parent.children.length-cIndex}`"
                           :show-overflow-tooltip="child.showOverflowTooltip !==undefined ?child.showOverflowTooltip:showOverflowTooltip"
          >
            <template slot-scope="{row}">
              {{row[child.prop]!==null && row[child.prop]!==undefined&&row[child.prop]!==''?row[child.prop]:($isNotNull(child.n)?child.n:'/')}}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'dragTable',
  props: {
    data: {
      default: function () {
        return []
      },
      type: Array
    },
    header: {
      default: function () {
        return []
      },
      type: Array
    },
    option: {
      default: function () {
        return {}
      },
      type: Object
    },
    // 合并规则
    mergingRules: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格是否显示...
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    noDrag: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableHeader: this.header,
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      }
    }
  },
  watch: {
    header (val, oldVal) {
      this.tableHeader = val
    }
  },
  methods: {
    // 设置数据
    setData (data = [], uniqueAttr = 'id', mergeCol, colNum) {
      return this.mergeTableRow(data, this.mergingRules, uniqueAttr)
    },
    /**
     *
     * @param data  表格数据
     * @param merge 需要合并的列字段名称数组
     * @returns {*}
     */
    mergeTableRow (data, merge, uniqueAttr = 'id', mergeCol, colNum) {
      if (!merge || merge.length === 0) {
        return data
      }
      // 合并 单元格
      merge.forEach((m) => {
        const mList = {}
        data = data.map((v, index) => {
          // console.log(v[uniqueAttr] + v[m], uniqueAttr, m)
          const rowVal = v[uniqueAttr] + v[m]
          if (mList[rowVal] && mList[rowVal].newIndex === index) {
            mList[rowVal].num++
            mList[rowVal].newIndex++
            data[mList[rowVal].index][m + '-span'].rowspan++
            v[m + '-span'] = {
              rowspan: 0,
              colspan: 0
            }
            // console.log('rowspan0-0>>>', m)
          } else {
            // console.log("rowspan1-1>>>",m)
            mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
            v[m + '-span'] = {
              rowspan: 1,
              colspan: 1
            }
          }
          return v
        })
      })
      return data
    },

    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      const span = column.property + '-span'
      if (row[span]) {
        return row[span]
      }
    },
    renderHeader (createElement, params) {
      /* console.log('params', params) */
      const { column, $index } = params
      return createElement(
        'div', {
          class: ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column, $index) },
            mouseup: ($event) => { this.handleMouseUp($event, column, $index) },
            mousemove: ($event) => { this.handleMouseMove($event, column, $index) }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('span', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            class: ['virtual']
          })
        ])
    },
    // 按下鼠标开始拖动
    handleMouseDown (e, column, $index) {
      console.log('handleMouseDown', $index)
      const _index = this.noDrag.findIndex(index => index === $index)
      if (_index > -1) {
        return
      }
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      const table = document.getElementsByClassName('drag-table')[0]
      const virtual = document.getElementsByClassName('virtual')
      for (const item of virtual) {
        item.style.height = table.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.parentElement.clientWidth + 'px'
      }
    },

    // 鼠标放开结束拖动
    handleMouseUp (e, column, $index) {
      console.log('handleMouseUp', $index)
      const _index = this.noDrag.findIndex(index => index === $index)
      if (_index > -1) {
        return
      }
      this.dragState.end = parseInt(column.columnKey) // 记录起始列
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -1,
        end: -1,
        move: -1,
        dragging: false,
        direction: undefined
      }
    },

    // 拖动中
    handleMouseMove (e, column, $index) {
      if (this.dragState.dragging) {
        const index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.move = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },

    // 拖动易位
    dragColumn ({ start, end, direction }) {
      const tempData = []
      const left = direction === 'left'
      const min = left ? end : start - 1
      const max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[left ? i - 1 : i + 1])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      console.log('tempData', tempData)
      this.tableHeader = tempData
    },
    headerCellClassName ({ column, columnIndex }) {
      return (columnIndex - 1 === this.dragState.move ? `darg_active_${this.dragState.direction}` : '')
    },
    getSummaries () {

    }
  }
}
</script>
<style lang="scss">
.drag-table {
  .el-table th {
    .virtual{
      position: fixed;
      display: block;
      width: 0;
      height: 0;
      margin-left: -10px;
      z-index: 99;
      background: none;
      border: none;
    }
    &.darg_active_left {
      .virtual {
        border-left: 2px dotted #DCDFE6;
      }
    }
    &.darg_active_right {
      .virtual {
        border-right: 2px dotted #DCDFE6;
      }
    }
  }
  .thead-cell {
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  &.w-table_moving {
    .el-table th .thead-cell{
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}
</style>
