<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-tabs v-model="activeName">
              <el-tab-pane label="部门" name="first">
                <el-tree
                  :data="departmentList"
                  :props="{label:'depName'}"
                  @node-click="handleDepNodeClick"
                ></el-tree>
              </el-tab-pane>
              <el-tab-pane label="角色" name="second">
                <el-tree
                  :data="roleList"
                  :props="{label: 'roleName'}"
                  @node-click="handleRoleNodeClick"
                ></el-tree>
              </el-tab-pane>
              <el-tab-pane label="用户" name="third">
                <el-tree
                  :data="userList"
                  :props="{label:'petName'}"
                  @node-click="handleUserNodeClick"
                ></el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>

        <el-container>
          <el-card style="width: 100%;">
            <div slot="header" class="clearfix">
              <el-select
                v-model="systemId"
                filterable
                placeholder="请选择系统"
                @change="listMenuTreeNode"
              >
                <el-option
                  v-for="item in systemList"
                  :key="item.flowId"
                  :label="item.sysName"
                  :value="item.flowId"
                ></el-option>
              </el-select>
              <span v-if="selectName">{{selectName}}的目录列表</span>
            </div>
            <el-tree
              :data="data"
              default-expand-all="true"
              :props="{label:'menuName',children:'children'}"
              @node-click="handleMenuNodeClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-checkbox @change="updateQuery(data)" v-model="data.query" label="查看"></el-checkbox>
                  <el-checkbox @change="updateEdit(data)" v-model="data.edit" label="编辑"></el-checkbox>
                  <el-checkbox @change="updateExport(data)" v-model="data.export" label="导出"></el-checkbox>
                  <el-checkbox @change="updateImPower(data)" v-model="data.impower" label="授权"></el-checkbox>
                </span>
              </span>
            </el-tree>
          </el-card>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 280px;
}
</style>
<script>
export default {
  data() {
    return {
      checkList: ["查看", "编辑"],
      activeName: "second",
      selectName: "",
      userId: "",
      userList: "",
      systemId: "",
      systemList: "",
      departmentId: "",
      departmentList: "",
      roleId: "",
      roleList: "",
      data: [],
      menuForm: {
        userId: null,
        sysId: null,
        depId: null,
        roleId: null,
        menuId: null,
        menuParentId: null,
        query: null,
        edit: null,
        export: null,
        impower: null
      }
    }
  },
  created() {
    this.getAllSystem()
    this.getAllUser()
    this.getAllDepartment()
    this.getAllRole()
  },
  methods: {
    getAllUser() {
      this.$store.dispatch("user/getAll").then(response => {
        this.userList = response.data
      })
    },
    getAllSystem() {
      this.$store.dispatch("system/getAll").then(response => {
        this.systemList = response.data
        this.systemId = this.systemList[0].flowId
        this.listMenuTreeNode()
      })
    },
    listMenuTreeNode() {
      this.menuForm.sysId = this.systemId
      this.$store.dispatch("menu/list", this.menuForm).then(response => {
        this.data = response.data
      })
    },
    getAllDepartment() {
      this.$store.dispatch("department/getAll").then(response => {
        this.departmentList = response.data
      })
    },
    getAllRole() {
      this.$store.dispatch("role/getAll").then(response => {
        this.roleList = response.data
      })
    },
    handleDepNodeClick(data) {
      this.menuForm.depId = data.flowId
      this.menuForm.depId = data.flowId
      this.menuForm.userId = ""
      this.menuForm.roleId = ""
      this.selectName = data.depName
      this.listMenuTreeNode()
      console.log("handleDepNodeClick", data)
    },
    handleMenuNodeClick(data) {
      this.menuForm.menuId = data.flowId
      this.menuForm.menuParentId = data.menuParentId
      this.menuForm.sysId = data.sysId
      console.log("handleMenuNodeClick", data)
    },
    handleRoleNodeClick(data) {
      this.menuForm.roleId = data.flowId
      this.menuForm.userId = ""
      this.menuForm.depId = ""
      this.selectName = data.roleName
      this.listMenuTreeNode()
      console.log("handleRoleNodeClick", data)
    },
    handleUserNodeClick(data) {
      this.menuForm.userId = data.flowId
      this.menuForm.roleId = ""
      this.menuForm.depId = ""
      this.selectName = data.petName
      this.listMenuTreeNode()
      console.log("handleUserNodeClick", data)
    },
    updateQuery(data) {
      data.query = data.query
      data.edit = false
      data.export = false
      data.impower = false
      this.updatePower(data)
    },
    updateEdit(data) {
      if (data.edit) {
        data.query = true
        data.export = false
        data.impower = false
      } else {
        data.export = false
        data.impower = false
      }
      this.updatePower(data)
    },
    updateExport(data) {
      if (data.export) {
        data.edit = true
        data.query = true
        data.impower = false
      } else {
        data.edit = true
        data.query = true
        data.impower = false
      }
      this.updatePower(data)
    },
    updateImPower(data) {
      data.export = true
      data.edit = true
      data.query = true
      this.updatePower(data)
    },
    updatePower(data) {
      this.menuForm.sysId = this.systemId
      this.menuForm.menuId = data.flowId
      this.menuForm.query = data.query
      this.menuForm.edit = data.edit
      this.menuForm.export = data.export
      this.menuForm.impower = data.impower
      this.$store
        .dispatch("allocation/update", this.menuForm)
        .then(response => {
          this.resetMenuForm()
          this.listMenuTreeNode()
        })
    },
    resetMenuForm() {
      this.menuForm = {
        userId: this.menuForm.userId,
        sysId: this.menuForm.sysId,
        depId: this.menuForm.depId,
        roleId: this.menuForm.roleId,
        menuId: null,
        menuParentId: null,
        query: null,
        edit: null,
        export: null,
        impower: null
      }
    }
  }
}
</script>
