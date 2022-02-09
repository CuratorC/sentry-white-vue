<template>
  <div class="app-container">
    <el-button type="primary" plain @click="addOriginal">新建</el-button>
    <el-table
      :key="originalsVersion"
      v-loading="listLoading"
      :data="originals"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          {{ scope.row.account_name }}
        </template>
      </el-table-column>
      <el-table-column label="密码">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="editOriginal(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="deleteOriginal(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="组织信息"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleDialogClose"
    >
      <el-form ref="form" :model="dialogOriginal" label-width="120px">

        <el-form-item label="名称">
          <el-input v-model="dialogOriginal.name" />
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="dialogOriginal.account_name" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="dialogOriginal.password" />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :disabled="dialogDisable" type="primary" @click="handleSaveOriginal">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="警告"
      :visible.sync="deleteVisible"
      width="30%"
      :before-close="handleDeleteClose"
    >
      <span>确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteClose">取 消</el-button>
        <el-button type="danger" @click="handleDeleteOriginal">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getList, show, store, update, destroy } from '@/api/originals'

const DialogOriginData = {
  id: 0,
  name: '',
  account_name: '',
  password: ''
}

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      originals: [
        DialogOriginData
      ],
      originalsVersion: 0,
      dialogOriginal: DialogOriginData,
      listLoading: true,
      dialogVisible: false,
      dialogDisable: false,
      deleteVisible: false,
      deleteLoading: false,
      deleteOriginalID: 0,
      deleteOriginalName: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.dialogLoading = true
      getList().then(response => {
        this.originals = response.data
        this.listLoading = false
      })
    },
    getOriginal(id) {
      show(id).then(response => {
        this.dialogOriginal = response.data
      })
    },
    addOriginal() {
      this.dialogVisible = true
    },
    editOriginal(id) {
      this.dialogVisible = true
      this.getOriginal(id)
    },
    handleSaveOriginal() {
      this.dialogDisable = true
      if (this.dialogOriginal.id === 0) {
        store(this.dialogOriginal).then(response => {
          this.addListItem(response.data)
          this.handleDialogClose()
        })
      } else {
        update(this.dialogOriginal).then(response => {
          this.updateListItem(response.data)
          this.handleDialogClose()
        })
      }
    },
    deleteOriginal(id, name) {
      this.deleteOriginalID = id
      this.deleteOriginalName = name
      this.deleteVisible = true
    },
    handleDeleteOriginal() {
      destroy(this.deleteOriginalID).then(response => {
        this.deleteListItem(this.deleteOriginalID)
        this.handleDeleteClose()
      })
    },
    handleDialogClose() {
      this.dialogOriginal = DialogOriginData
      this.dialogVisible = false
      this.dialogDisable = false
    },
    handleDeleteClose() {
      this.deleteVisible = false
      this.deleteOriginalID = 0
      this.deleteOriginalName = ''
      this.deleteLoading = false
    },
    addListItem(original) {
      this.originals.push(original)
      this.originalsVersion++
    },
    updateListItem(original) {
      this.originals.forEach((o, i) => {
        if (o.id === original.id) {
          this.originals[i] = original
        }
      })
      this.originalsVersion++
    },
    deleteListItem(id) {
      this.originals.forEach((o, i) => {
        if (o.id === id) {
          delete this.originals[i]
        }
      })
      this.originalsVersion++
    }
  }
}
</script>
