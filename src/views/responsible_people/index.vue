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

    <el-dialog
      title="警告"
      :visible.sync="deleteVisible"
      width="30%"
      :before-close="handleDeleteClose"
    >
      <span>确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteClose">取 消</el-button>
        <el-button type="danger" @click="handleDeleteResponsiblePerson">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { index, show, store, update, destroy } from '@/api/responsible_people'

export default {
  filters: {
  },
  data() {
    return {
      responsiblePeople: [
        {
          id: 0,
          name: '',
          phone: ''
        }
      ],
      responsiblePeopleVersion: 0,
      dialogResponsiblePerson: {
        id: 0,
        name: '',
        phone: ''
      },
      listLoading: true,
      dialogVisible: false,
      dialogDisable: false,
      deleteVisible: false,
      deleteLoading: false,
      deleteResponsiblePersonID: 0,
      deleteResponsiblePersonName: ''
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
    deleteResponsiblePerson(id, name) {
      this.deleteResponsiblePersonID = id
      this.deleteResponsiblePersonName = name
      this.deleteVisible = true
    },
    handleDeleteResponsiblePerson() {
      destroy(this.deleteResponsiblePersonID).then(response => {
        this.deleteListItem(this.deleteResponsiblePersonID)
        this.handleDeleteClose()
      })
    },
    handleDialogClose() {
      this.dialogResponsiblePerson = {
        id: 0,
        name: '',
        phone: ''
      }
      this.dialogVisible = false
      this.dialogDisable = false
    },
    handleDeleteClose() {
      this.deleteVisible = false
      this.deleteResponsiblePersonID = 0
      this.deleteResponsiblePersonName = ''
      this.deleteLoading = false
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
