<template>
    <el-row>
      <el-dialog :visible.sync="fileDialogVisible"
                 title="导入模板"
                 append-to-body
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-upload name="file"
                   :action="url"
                   :file-list="dataForm.fileList"
                   drag
                   :limit="1"
                   :on-remove="handleRemove"
                   :on-exceed="handleExceed"
                   :before-upload="beforeUploadHandle"
                   :on-success="successHandle"
                   class="text-center">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" v-html="$t('upload.text')"></div>
        </el-upload>
      </el-dialog>

    </el-row>

</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'financeUpload',
  props: {
    tableWidth: {
      type: String,
      default: '80%'
    },
    url: {
      type: String,
      default: `${window.SITE_CONFIG.apiURL}/financing/excel/importForm?token=${Cookies.get('token')}`
    },
    dataForm: {
      type: Object,
      default: () => {
        return {
          fileList: []
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileDialogVisible: false,
      currentRow: {
        files: []
      }
    }
  },

  methods: {
    init () {
      // this.dataForm.fileList.splice(1, this.dataForm.fileList.length)
    },
    handleRemove (row) {
      if (this.disabled === true) {
        return
      }
      this.$confirm(this.$t('prompt.info', { handle: this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        console.log(row, this.dataForm.fileList)
        const deleteIndex = this.dataForm.fileList.findIndex(item => item.id === row.id)
        if (deleteIndex > -1) {
          this.dataForm.fileList.splice(deleteIndex, 1)
        }
        this.$emit('remove', row, deleteIndex)
      }).catch(() => {})
    },
    close () {
      this.fileDialogVisible = false
      this.dataForm.fileList = []
    },
    // 上传之前
    beforeUploadHandle (file) {
      this.$emit('beforeUploadHandle', file, this.currentRow)
    },
    // 上传成功
    successHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.fileDialogVisible = false
      // 接收返回的数据，并将数据传给父组件
      this.$emit('successHandle', res.data)
      this.dataForm.fileList = []
      this.$message.success(this.$t('prompt.success'))
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  }
}
</script>
