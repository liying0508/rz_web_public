<template>
    <el-row>
      <el-table :data="dataForm.fileList" border style="margin-bottom: 16px;" :style="{width:tableWidth}">
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <i class="el-icon-download upload-icon" @click="downLoadFile(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="上传文件名称">
        </el-table-column>
        <el-table-column prop="desc" label="附件描述">
          <template slot-scope="{row}">
            <span class="color-required">{{row.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="100px"></el-table-column>
      </el-table>
    </el-row>

</template>

<script>
import { uuid } from 'vue-uuid'
export default {
  name: 'financeUploadDetails',
  props: {
    tableWidth: {
      type: String,
      default: '80%'
    },
    dataForm: {
      type: Object,
      default: () => {
        return {
          fileList: [
            {
              id: uuid.v1(),
              fileList: [],
              fileName: '《原始债务协议/合同转贷协议》',
              desc: '*必录附件',
              size: null
            }
          ]
        }
      }
    }
  },
  data () {
    return {
      fileDialogVisible: false
    }
  },

  methods: {
    async downLoadFile (row) {
      console.log('附件下载', row)
      this.currentRow = row
      this.fileDialogVisible = true
      var params = {
        fileName: row.files[0].name,
        url: row.files[0].url
      }
      // window.location.href=row.files[0].url
      const res = await this.$http.get('/sys/oss/downLoad', {
        params: params,
        responseType: 'blob'
      })
      console.log(res)
      this.$downloadFile(res.data, row.files[0].name)
    }
  }
}
</script>
