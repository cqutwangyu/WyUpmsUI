<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-tabs v-model="activeName">
              <el-tab-pane label="系统" name="first">
                <el-tree :data="systemList" :props="{label:'sysName'}"
                         @node-click="handleSysNodeClick"></el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>

        <el-container>
          <el-card style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>目录列表</span>
              <span style="float: right">
                当前选中的系统：
                <el-button disabled>{{selectdSys.sysName}}</el-button>
                当前选中的节点：
                <el-button disabled>{{selectdNode.label}}</el-button>
                <el-button type="primary" @click="handleCreate">添加菜单</el-button>
                <el-button type="success" @click="handleUpdate">修改菜单</el-button>
                <el-button type="danger" @click="handleDelete">删除菜单</el-button>
              </span>
            </div>
            <el-tree
              :data="data"
              node-key="id"
              :props="{label:'menuName',children:'children'}"
              default-expand-all
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              @node-click="handleMenuTreeNodeClick"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag">
            </el-tree>
          </el-card>
        </el-container>

      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="menuForm"
        :model="menuForm"
        label-width="80px"
        style="width: 400px; margin-left:150px;"
      >
        <el-form-item label="所属系统">
          <el-input disabled v-model="selectdSys.sysName"/>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="menuForm.menuName"/>
        </el-form-item>
        <el-form-item label="菜单层级">
          <el-input disabled v-model="menuForm.menuLevel"/>
        </el-form-item>
        <el-form-item label="菜单父级">
          <el-input disabled v-model="selectdNode.menuName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>

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

  export default {
    data() {
      return {
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        menuForm: {
          flowId: '',
          sysId: '',
          menuName: '',
          menuLevel: '',
          menuParentId: ''
        },
        menuQueryForm: {
          sysId: '',
          menuLevel: 0,
          menuRootId: '',
          menuParentId: -1
        },
        activeName: 'first',
        selectdSys: '',
        selectdNode: '',
        systemList: '',
        roleList: '',
        data: ''
      }
    },
    created() {
      this.getAllSystemAndMenu()
    },
    methods: {
      listMenuTreeNode() {
        this.menuQueryForm.sysId=this.selectdSys.flowId
        this.$store.dispatch('menu/list', this.menuQueryForm).then(response => {
          this.data = response.data
        })
      },
      getAllSystemAndMenu() {
        this.$store.dispatch('system/getAll').then(response => {
          this.systemList = response.data
          this.selectdSys = this.systemList[0]
          this.listMenuTreeNode()
        })
      },
      handleCreate: function() {
        /* 打开新增数据窗口*/
        this.resetMenuForm()
        this.menuForm.sysId = this.selectdSys.flowId
        if (this.selectdNode != '') {
          this.menuForm.menuLevel = this.selectdNode.menuLevel + 1
          this.menuForm.menuParentId = this.selectdNode.flowId
        }else {
          this.menuForm.menuLevel = 0
          this.menuForm.menuParentId = -1
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['menuForm'].clearValidate()
        })
      },
      handleUpdate() {
        /* 打开编辑数据窗口*/
        this.menuForm = Object.assign({}, this.selectdNode) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['menuForm'].clearValidate()
        })
      },
      handleDelete() {
        /* 删除数据*/
        this.$store.dispatch('menu/remove', this.selectdNode.flowId).then(response => {
          this.fetchData()
        })
      },
      createData() {
        /* 发送新增数据*/
        this.$store.dispatch('menu/add', this.menuForm).then(response => {
          if (response.message === 'succeed') {
            this.dialogFormVisible = false
            this.resetMenuForm()
            this.listMenuTreeNode()
          }
        })
      },
      updateData() {
        /* 发送修改数据*/
        this.$store.dispatch('menu/update', this.menuForm).then(response => {
          if (response.message === 'succeed') {
            this.dialogFormVisible = false
            this.resetMenuForm()
            this.listMenuTreeNode()
          }
        })
      },
      resetMenuForm() {
        /* 表单数据清空*/
        this.menuForm = {
          flowId: '',
          sysId: '',
          menuName: '',
          menuLevel: '',
          menuParentId: ''
        }
      },
      handleSysNodeClick(data) {
        this.selectdSys = data
        this.menuQueryForm.sysId=data.flowId
        this.selectdNode = ''
        this.listMenuTreeNode()
        this.resetMenuForm()
        console.log(data)
      },
      handleMenuTreeNodeClick(data) {
        this.selectdNode = data
        this.menuQueryForm.menuParentId=data.flowId
        this.menuQueryForm.menuLevel=data.menuLevel+1
        console.log(data)
      },
      handleDragStart(node, ev) {
        console.log('drag start', node)
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label)
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label)
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label)
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType)
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType)
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner'
        } else {
          return true
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1
      }
    }
  }
</script>
