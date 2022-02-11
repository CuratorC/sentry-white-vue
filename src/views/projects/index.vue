<template>
  <div class="app-container">
    <el-button type="primary" plain @click="addProject">新建</el-button>
    <el-table
      :key="projectsVersion"
      v-loading="listLoading"
      :data="projects"
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
      <el-table-column label="项目名（中文）">
        <template slot-scope="scope">
          {{ scope.row.substitute_name }}
        </template>
      </el-table-column>
      <el-table-column label="项目名（英文）">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="robot" label="机器人" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="editRobot(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="editProject(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="deleteProject(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="项目信息"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleDialogClose"
    >
      <el-form ref="form" :model="dialogProject" label-width="200px">

        <el-form-item label="项目名（中文）">
          <el-input v-model="dialogProject.substitute_name" />
        </el-form-item>

        <el-form-item label="项目名（英文）">
          <el-input v-model="dialogProject.name" />
        </el-form-item>

        <el-form-item label="项目负责人">
          <el-select
            v-model="dialogProject.responsible_people_id"
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="responsiblePerson in responsiblePeople"
              :key="responsiblePerson.id"
              :label="responsiblePerson.name"
              :value="responsiblePerson.id"
            />
          </el-select>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :disabled="dialogDisable" type="primary" @click="handleSaveProject">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="机器人信息"
      :visible.sync="robotVisible"
      width="80%"
      :before-close="handleRobotClose"
    >
      <el-form ref="form" :model="dialogProject.robot" label-width="200px">

        <el-form-item label="群名称">
          <el-input v-model="dialogProject.robot.name" />
        </el-form-item>

        <el-form-item label="AccessToken">
          <el-input v-model="dialogProject.robot.access_token" />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="robotVisible = false">取消</el-button>
        <el-button :disabled="robotLoading" type="primary" @click="handleSaveRobot">保存</el-button>
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
        <el-button type="danger" @click="handleDeleteProject">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getListOnOriginal, show, store, update, destroy } from '@/api/projects'
import { index } from '@/api/responsible_people'
import { show as robotShow, store as robotStore, update as robotUpdate } from '@/api/robots'

export default {
  filters: {
  },
  data() {
    return {
      originalID: 0,
      projects: [
        {
          id: 0,
          name: '',
          account_name: '',
          password: '',
          robot: {
            id: 0,
            access_token: ''
          },
          responsible_people: []
        }
      ],
      responsiblePeople: [
        {
          id: 0,
          name: '',
          phone: ''
        }
      ],
      projectsVersion: 0,
      dialogProject: {
        id: 0,
        name: '',
        account_name: '',
        password: '',
        robot: {
          id: 0,
          name: '',
          access_token: ''
        },
        responsible_people: []
      },
      dialogRobot: {
        id: 0,
        access_token: ''
      },
      listLoading: true,
      dialogVisible: false,
      dialogDisable: false,
      deleteVisible: false,
      deleteLoading: false,
      deleteProjectID: 0,
      deleteProjectName: '',
      robotVisible: false,
      robotLoading: false,
      robotProjectID: 0
    }
  },
  created() {
    this.fetchData()
    this.getResponsiblePeopleList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.dialogLoading = true
      // 获取组织ID
      this.originalID = parseInt(this.$route.params.original_id)

      getListOnOriginal(this.originalID).then(response => {
        this.projects = response.data.projects
        this.listLoading = false
      })
    },
    getResponsiblePeopleList() {
      index().then(response => {
        this.responsiblePeople = response.data
      })
    },
    getProject(id) {
      show(id).then(response => {
        this.dialogProject = response.data
        if (this.dialogProject.robot === null) {
          this.dialogProject.robot = {
            id: 0,
            name: '',
            access_token: ''
          }
        }
      })
    },
    getProjectAndRobot(id) {
      show(id).then(response => {
        this.dialogProject = response.data
        if (this.dialogProject.robot === null) {
          this.dialogProject.robot = {
            id: 0,
            name: '',
            access_token: ''
          }
        } else {
          robotShow(this.dialogProject.robot.id).then(response => {
            this.dialogProject.robot = response.data
          })
        }
      })
    },
    addProject() {
      this.dialogVisible = true
    },
    editProject(id) {
      this.dialogVisible = true
      this.getProject(id)
    },
    handleSaveProject() {
      this.dialogDisable = true
      if (this.dialogProject.id === 0) {
        store(this.dialogProject, this.originalID).then(response => {
          this.addListItem(response.data)
          this.handleDialogClose()
        })
      } else {
        update(this.dialogProject, this.originalID).then(response => {
          this.updateListItem(response.data)
          this.handleDialogClose()
        })
      }
    },
    handleSaveRobot() {
      this.robotLoading = true
      if (this.dialogProject.robot.id === 0) {
        robotStore(this.dialogProject.robot, this.dialogProject.id).then(response => {
          this.handleRobotClose()
        })
      } else {
        robotUpdate(this.dialogProject.robot, this.dialogProject.id).then(response => {
          this.handleRobotClose()
        })
      }
    },
    deleteProject(id, name) {
      this.deleteProjectID = id
      this.deleteProjectName = name
      this.deleteVisible = true
    },
    handleDeleteProject() {
      destroy(this.deleteProjectID).then(response => {
        this.deleteListItem(this.deleteProjectID)
        this.handleDeleteClose()
      })
    },
    handleDialogClose() {
      this.dialogProject = {
        id: 0,
        name: '',
        account_name: '',
        password: '',
        robot: {
          id: 0,
          name: '',
          access_token: ''
        },
        responsible_people_id: []
      }
      this.dialogVisible = false
      this.dialogDisable = false
    },
    handleDeleteClose() {
      this.deleteVisible = false
      this.deleteProjectID = 0
      this.deleteProjectName = ''
      this.deleteLoading = false
    },
    handleRobotClose() {
      this.robotVisible = false
      this.dialogProject = {
        id: 0,
        name: '',
        account_name: '',
        password: '',
        robot: {
          id: 0,
          name: '',
          access_token: ''
        },
        responsible_people_id: []
      }
      this.robotLoading = false
    },
    addListItem(project) {
      if (this.projects === null) {
        this.projects = [
          project
        ]
      } else {
        this.projects.push(project)
      }
      this.projectsVersion++
    },
    updateListItem(project) {
      this.projects.forEach((o, i) => {
        if (o.id === project.id) {
          this.projects[i] = project
        }
      })
      this.projectsVersion++
    },
    deleteListItem(id) {
      this.projects.forEach((o, i) => {
        if (o.id === id) {
          delete this.projects[i]
        }
      })
      this.projectsVersion++
    },

    editRobot(id) {
      // 1.获取项目信息
      this.getProjectAndRobot(id)
      this.robotVisible = true
    }
  }
}
</script>
