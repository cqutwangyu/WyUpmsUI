<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-tabs v-model="activeName">
              <el-tab-pane label="系统" name="first">
                <el-tree
                  :data="systemList"
                  :props="{label:'sysName'}"
                  @node-click="handleSysNodeClick"
                />
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
                <el-button disabled>{{ selectdSys.sysName }}</el-button>当前选中的节点：
                <el-button disabled>{{ selectdNode.menuName }}</el-button>
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
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              @node-click="handleMenuTreeNodeClick"
            />
          </el-card>
        </el-container>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" >
      <el-form
        ref="menuForm"
        :model="menuForm"
        label-width="80px"
      >
        <el-col :span="24">
          <el-form-item label="所属系统">
            <el-input v-model="selectdSys.sysName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单父级">
            <el-input v-model="selectdNode.menuName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单层级">
            <el-input v-model="menuForm.menuLevel" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称">
            <el-input v-model="menuForm.menuName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由地址">
            <el-input v-model="menuForm.path" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识">
            <el-input v-model="menuForm.perms" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number style="width:120px" v-model="menuForm.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="组件路径">
          <el-input v-model="menuForm.component" />
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selectedIcon" />
            <el-input slot="reference" v-model="menuForm.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="menuForm.icon"
                slot="prefix"
                :icon-class="menuForm.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('permission.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('permission.confirm') }}</el-button>
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
  clear: both;
}

.box-card {
  width: 280px;
}
</style>
<script>
import IconSelect from "@/components/IconSelect";
import { Msg } from '@/utils/message'
export default {
  components: { IconSelect },
  data() {
    return {
      selected: "",
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      menuForm: {
        flowId: null,
        sysId: null,
        menuName: null,
        menuLevel: null,
        menuParentId: null,
        icon: null,
        component: null,
        perms: null,
        path: null,
        orderNum: null,
        children: null
      },
      menuQueryForm: {
        sysId: "",
        menuLevel: 0,
        menuRootId: "",
        menuParentId: -1
      },
      activeName: "first",
      selectdSys: "",
      selectdNode: "",
      systemList: "",
      roleList: "",
      data: ""
    };
  },
  created() {
    this.getAllSystemAndMenu();
  },
  methods: {
    selectedIcon(name) {
      // 选择图标
      this.menuForm.icon = name;
    },
    listMenuTreeNode() {
      // this.menuQueryForm.sysId = this.selectdSys.flowId;
      if(this.menuQueryForm.sysId==""||this.menuQueryForm.sysId==null){
        Msg.success("请选择系统")
        return
      }
      this.$store.dispatch("menu/getAll", this.menuQueryForm.sysId).then(response => {
        this.data = response.data;
      });
    },
    getAllSystemAndMenu() {
      this.$store.dispatch("system/getAll").then(response => {
        this.systemList = response.data;
        // this.selectdSys = this.systemList[0];
        this.listMenuTreeNode();
      });
    },
    handleCreate: function() {
      /* 打开新增数据窗口*/
      this.resetMenuForm();
      this.menuForm.sysId = this.selectdSys.flowId;
      if (this.selectdNode != "") {
        this.menuForm.menuLevel = this.selectdNode.menuLevel + 1;
        this.menuForm.menuParentId = this.selectdNode.flowId;
      } else {
        this.menuForm.menuLevel = 0;
        this.menuForm.menuParentId = -1;
      }
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["menuForm"].clearValidate();
      });
    },
    handleUpdate() {
      /* 打开编辑数据窗口*/
      this.menuForm = Object.assign({}, this.selectdNode); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["menuForm"].clearValidate();
      });
    },
    handleDelete() {
      /* 删除数据*/
      this.$store
        .dispatch("menu/remove", this.selectdNode.flowId)
        .then(response => {
          this.fetchData();
        });
    },
    createData() {
      // var sendData = {
      // menuForm: {
      //   flowId: null,
      //   sysId: null,
      //   menuName: null,
      //   menuLevel: null,
      //   menuParentId: null,
      //   icon: null,
      //   component: null,
      //   perms: null,
      //   path: null,
      //   orderNum: null,
      //   children: null
      // },
      // }
      this.menuForm.children=[]
      /* 发送新增数据*/
      this.$store.dispatch("menu/add", this.menuForm).then(response => {
        if (response.message === "succeed") {
          this.dialogFormVisible = false;
          this.resetMenuForm();
          this.listMenuTreeNode();
        }
      });
    },
    updateData() {
      this.menuForm.children = []
      /* 发送修改数据*/
      this.$store.dispatch("menu/update", this.menuForm).then(response => {
        if (response.message === "succeed") {
          this.dialogFormVisible = false;
          this.resetMenuForm();
          this.listMenuTreeNode();
        }
      });
    },
    resetMenuForm() {
      /* 表单数据清空*/
      this.menuForm = {
        flowId: null,
        sysId: null,
        menuName: null,
        menuLevel: null,
        menuParentId: null,
        icon: null,
        component: null,
        perms: null,
        path: null,
        orderNum: null,
        children: null
      };
      this.getAllSystemAndMenu();
    },
    handleSysNodeClick(data) {
      this.selectdSys = data;
      this.menuQueryForm.sysId = data.flowId;
      this.selectdNode = "";
      this.listMenuTreeNode();
      this.resetMenuForm();
      console.log(data);
    },
    handleMenuTreeNodeClick(data) {
      this.selectdNode = data;
      this.menuQueryForm.menuParentId = data.flowId;
      this.menuQueryForm.menuLevel = data.menuLevel + 1;
      console.log(data);
    },
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    }
  }
};
</script>
