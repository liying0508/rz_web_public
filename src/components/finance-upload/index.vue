<template>
    <el-row>
      <el-dialog :visible.sync="fileDialogVisible"
                 title="附件上传"
                 append-to-body
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-upload name="file"
                   :action="url"
                   :file-list="dataForm.fileList"
                   drag
                   multiple
                   :limit="10"
                   :on-remove="handleRemove"
                   :on-exceed="handleExceed"
                   :before-upload="beforeUploadHandle"
                   :on-success="successHandle"
                   class="text-center">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" v-html="$t('upload.text')"></div>
        </el-upload>
      </el-dialog>

      <el-table :data="dataForm.fileList" border style="margin-bottom: 16px;" :style="{width:tableWidth}">
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <i class="el-icon-upload upload-icon" :class="[disabled===true?'is-disabled':'']" @click="addFile(scope.row)"></i>
            <i class="el-icon-delete remove-icon" :class="[disabled===true?'is-disabled':'']" @click="handleRemove(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="上传文件名称">
        </el-table-column>
        <el-table-column prop="desc" label="附件描述">
          <template slot-scope="{row}">
            <span class="color-required">
                <el-input type="textarea"
                          placeholder="备注"
                          v-model="row.desc"
                          maxlength="200"
                          show-word-limi></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="100px"></el-table-column>
      </el-table>
      <el-button type="primary"
                 :disabled="disabled"
                 size="small"
                 class="add-upload-btn"
                 @click="addRow">
        <i class="el-icon-document-add el-icon--left"></i>增行
      </el-button>
    </el-row>

</template>

<script>
import Cookies from 'js-cookie'
import { uuid } from 'vue-uuid'
export default {
  name: 'financeUpload',
  props: {
    tableWidth: {
      type: String,
      default: '80%'
    },
    url: {
      type: String,
      default: `${window.SITE_CONFIG.apiURL}/sys/oss/upload?token=${Cookies.get('token')}`
    },
    dataForm: {
      type: Object,
      default: () => {
        return {
          fileList: [
            {
              id: uuid.v1(),
              files: [],
              fileName: '',
              desc: '',
              size: null
            }
          ]
        }
      }
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
    addRow () {
      if (this.disabled === true) {
        return
      }
      if (this.isDefaultAdd === true) {
        this.dataForm.fileList.forEach(item => {
          if (!item.name) item.name = item.fileName
        })
        this.fileDialogVisible = true
      }
      this.$emit('add')
    },
    addFile (row) {
      if (this.disabled === true) {
        return
      }
      this.dataForm.fileList.forEach(item => {
        if (!item.name) item.name = item.fileName
      })
      this.fileDialogVisible = true
    },
    close () {
      this.fileDialogVisible = false
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
      var arr = []
      fileList.forEach(item => {
        if (item.id) {
          arr.push(item)
        } else {
          var obj = {}
          obj.id = uuid.v1()
          obj.files = [{
            name: item.name,
            url: item.response.data.src
          }]
          obj.desc = ''
          obj.fileName = item.name
          obj.name = item.name
          obj.size = item.size
          arr.push(obj)
        }
      })
      this.dataForm.fileList = arr
      // this.currentRow.fileName = file.name
      // this.currentRow.size = file.size
      this.fileDialogVisible = false
      this.$emit('successHandle', file, this.currentRow, this.dataForm.fileList)
      this.$message({
        message: this.$t('prompt.success'),
        type: 'success',
        duration: 500,
        onClose: () => {
          this.visible = false
          this.$emit('refreshDataList')
        }
      })
    },
    // 上传成功
    // successHandle1 (res, file, fileList) {
    //   if (res.code !== 0) {
    //     return this.$message.error(res.msg)
    //   }
    //   console.log('fileList', fileList)
    //   console.log('this.dataForm.fileList1:', this.dataForm.fileList)
    //   const names = []
    //   fileList.map(_file => {
    //     names.push(`《${_file.name}》`)
    //     this.currentRow.files.push({
    //       name: _file.name,
    //       url: _file.response.data.src
    //     })
    //   })
    //   this.currentRow.fileName = names.join(',')
    //   this.currentRow.size = file.size
    //   this.fileDialogVisible = false
    //   console.log(this.currentRow)
    //   console.log('fileList2:', this.dataForm.fileList)
    //   this.$emit('successHandle', file, this.currentRow, this.dataForm.fileList)
    //   this.$message({
    //     message: this.$t('prompt.success'),
    //     type: 'success',
    //     duration: 500,
    //     onClose: () => {
    //       this.visible = false
    //       this.$emit('refreshDataList')
    //     }
    //   })
    // },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
    /* handlePreview (file) {
      console.log(file)
      this.$emit('preview',file,this.currentRow)
    },

    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
       this.$emit('beforeRemove',file, fileList,this.currentRow)
    }, */
  }
}
</script>
