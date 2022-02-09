<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="阿里云 Access Key">
        <el-input v-model="form.aliyun_access_id" />
      </el-form-item>

      <el-form-item label="阿里云 Access Secret">
        <el-input v-model="form.aliyun_access_secret" />
      </el-form-item>

      <el-form-item label="OSS Endpoint">
        <el-input v-model="form.aliyun_access_oss_endpoint" />
      </el-form-item>

      <el-form-item label="OSS Bucket">
        <el-input v-model="form.aliyun_access_oss_bucket" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get, set } from '@/api/setting'

export default {
  data() {
    return {
      form: {
        aliyun_access_id: '',
        aliyun_access_secret: '',
        aliyun_access_oss_endpoint: '',
        aliyun_access_oss_bucket: ''
      },
      dialogVisible: false
    }
  },
  created() {
    this.loadSetting()
  },
  methods: {
    loadSetting() {
      get().then(response => {
        this.form = response.data
      })
    },
    onSubmit() {
      set(this.form).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

