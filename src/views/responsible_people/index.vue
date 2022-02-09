<template>
  <div class="app-container">
    <el-button type="primary" plain @click="addResponsiblePerson">新建</el-button>
    <el-table
      :key="responsiblePeopleVersion"
      v-loading="listLoading"
      :data="responsiblePeople"
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
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
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
          <el-button size="mini" type="primary" plain @click="editResponsiblePerson(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="deleteResponsiblePerson(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="负责人信息"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleDialogClose"
    >
      <el-form ref="form" :model="dialogResponsiblePerson" label-width="120px">

        <el-form-item label="名称">
          <el-input v-model="dialogResponsiblePerson.name" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="dialogResponsiblePerson.phone" />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :disabled="dialogDisable" type="primary" @click="handleSaveResponsiblePerson">保存</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { index, show, store, update, destroy } from '@/api/responsible_people'

const ResponsiblePersonOriginData = {
  id: 0,
  name: '',
  phone: ''
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
      responsiblePeople: [
        ResponsiblePersonOriginData
      ],
      responsiblePeopleVersion: 0,
      dialogResponsiblePerson: ResponsiblePersonOriginData,
      listLoading: true,
      dialogVisible: false,
      dialogDisable: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.dialogLoading = true
      index().then(response => {
        this.responsiblePeople = response.data
        this.listLoading = false
      })
    },
    getResponsiblePerson(id) {
      show(id).then(response => {
        this.dialogResponsiblePerson = response.data
      })
    },
    addResponsiblePerson() {
      this.dialogVisible = true
    },
    editResponsiblePerson(id) {
      this.dialogVisible = true
      this.getResponsiblePerson(id)
    },
    handleSaveResponsiblePerson() {
      this.dialogDisable = true
      if (this.dialogResponsiblePerson.id === 0) {
        store(this.dialogResponsiblePerson).then(response => {
          this.addListItem(response.data)
          this.handleDialogClose()
        })
      } else {
        update(this.dialogResponsiblePerson).then(response => {
          this.updateListItem(response.data)
          this.handleDialogClose()
        })
      }
    },
    deleteResponsiblePerson(id) {
      destroy(id).then(response => {
        this.deleteListItem(id)
        this.handleDialogClose()
      })
    },
    handleDialogClose() {
      this.dialogResponsiblePerson = ResponsiblePersonOriginData
      this.dialogVisible = false
      this.dialogDisable = false
    },
    addListItem(responsiblePerson) {
      if (this.responsiblePeople === null) {
        this.responsiblePeople = [
          responsiblePerson
        ]
      } else {
        this.responsiblePeople.push(responsiblePerson)
      }
      this.responsiblePeopleVersion++
    },
    updateListItem(responsiblePerson) {
      this.responsiblePeople.forEach((o, i) => {
        if (o.id === responsiblePerson.id) {
          this.responsiblePeople[i] = responsiblePerson
        }
      })
      this.responsiblePeopleVersion++
    },
    deleteListItem(id) {
      this.responsiblePeople.forEach((o, i) => {
        if (o.id === id) {
          delete this.responsiblePeople[i]
        }
      })
      this.responsiblePeopleVersion++
    }
  }
}
</script>
