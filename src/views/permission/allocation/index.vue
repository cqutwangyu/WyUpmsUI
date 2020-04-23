<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-tabs v-model="activeName" >
              <el-tab-pane label="部门" name="first">
                <el-tree :data="departmentList" show-checkbox :props="{label:'depName'}"
                         @node-click="handleNodeClick"></el-tree>
              </el-tab-pane>
              <el-tab-pane label="角色" name="second">
                <el-tree :data="roleList" show-checkbox :props="{label: 'roleName'}"
                         @node-click="handleNodeClick"></el-tree>
              </el-tab-pane>
              <el-tab-pane label="用户" name="third">
                <el-tree :data="userList" show-checkbox :props="{label:'petName'}"
                         @node-click="handleNodeClick"></el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>

        <el-container>
          <el-card style="width: 100%;">
            <div slot="header" class="clearfix">
              <el-select v-model="systemId" filterable placeholder="请选择系统">
                <el-option
                  v-for="item in systemList"
                  :key="item.flowId"
                  :label="item.sysName"
                  :value="item.flowId">
                </el-option>
              </el-select>
              <span>所有列表</span>
            </div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-checkbox v-model="data.query" label="查看"></el-checkbox>
                  <el-checkbox v-model="data.edit" label="编辑"></el-checkbox>
                  <el-checkbox v-model="data.export" label="导出"></el-checkbox>
                  <el-checkbox v-model="data.impower" label="授权"></el-checkbox>
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
    clear: both
  }

  .box-card {
    width: 280px;
  }
</style>
<script>
  import system from '../../../store/modules/system'

  export default {
    data() {
      return {
        checkList: ['查看', '编辑'],
        activeName: 'second',
        userId: '',
        userList: '',
        systemId: '',
        systemList: '',
        departmentId: '',
        departmentList: '',
        roleId: '',
        roleList: '',
        data: [{
          label: '一级 1',
          query: true,
          edit: true,
          export: true,
          impower: true,
          children: [{
            label: '二级 1-1',
            query: false,
            edit: false,
            export: false,
            impower: false,
            children: [{
              label: '三级 1-1-1',
              query: true,
              edit: true,
              export: false,
              impower: false
            }]
          }]
        }, {
          label: '一级 2',
          query: true,
          edit: true,
          export: true,
          impower: true
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
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
        this.$store.dispatch('user/getAll').then(response => {
          this.userList = response.data
        })
      },
      getAllSystem() {
        this.$store.dispatch('system/getAll').then(response => {
          this.systemList = response.data
          this.systemId = this.systemList[0].flowId
        })
      },
      getAllDepartment() {
        this.$store.dispatch('department/getAll').then(response => {
          this.departmentList = response.data
        })
      },
      getAllRole() {
        this.$store.dispatch('role/getAll').then(response => {
          this.roleList = response.data
        })
      },
      handleNodeClick(data) {
        console.log(data)
      }
    }
  }
</script>
