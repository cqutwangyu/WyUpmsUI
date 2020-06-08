/* eslint-disable indent */
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" :label="$t('serialNumber')" width="50">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="用户昵称" width="190">
        <template slot-scope="scope">{{ scope.row.petName }}</template>
      </el-table-column>
      <el-table-column label="用户编号" width="190">
        <template slot-scope="scope">{{ scope.row.flowId }}</template>
      </el-table-column>
      <!-- <el-table-column label="所属系统" width="190">
        <template slot-scope="scope">
          {{ scope.row.roles }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="190">
        <template slot-scope="scope">
          {{ scope.row.roles }}
        </template>
      </el-table-column>
      <el-table-column label="用户角色" width="190">
        <template slot-scope="scope">
          {{ scope.row.roles }}
        </template>
      </el-table-column>-->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row.flowId)"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageQueryDTO.page"
      :limit.sync="pageQueryDTO.limit"
      @pagination="fetchData"
    /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="userForm"
        :model="userForm"
        label-width="80px"
        style="width: 400px; margin-left:150px;"
      >
        <el-form-item label="用户名">
          <el-input v-model="userForm.userName"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password" type="password"/>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userForm.petName" />
        </el-form-item>
        <el-form-item label="所属系统">
          <el-select
            v-model="userForm.sysId"
            placeholder="请选择系统"
            clearable
            class="filter-item"
            @change="handleFilterDep"
          >
            <el-option
              v-for="item in systemList"
              :key="item.flowId"
              :label="item.sysName"
              :value="item.flowId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select
            v-model="userForm.depId"
            placeholder="请选择部门"
            clearable
            class="filter-item"
            @change="handleFilterRole"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.flowId"
              :label="item.depName"
              :value="item.flowId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="selectRole" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.flowId"
              :label="item.roleName"
              :value="item.flowId"
            />
          </el-select>
        </el-form-item>
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

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      userForm: {
        flowId: "",
        sysId: "",
        roleIds: "",
        depId: "",
        userName: "",
        petName: "",
        password: ""
      },
      list: null,
      roleList: null,
      roleListAll: [],
      departmentList: null,
      departmentListAll: [],
      systemList: null,
      selectRole: null,
      total: 0,
      listLoading: true,
      pageQueryDTO: {
        page: 1,
        limit: 10,
        columnsName: [],
        columnsValue: []
      }
    };
  },
  created() {
    this.getAllSystem()
    this.getAllDepartment();
    this.getAllRole();
    this.getAllUser();
  },
  methods: {
    getAllUser() {
      /* 从后台获取数据*/
      this.listLoading = true;
      this.$store.dispatch("user/getAll", this.pageQueryDTO).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    handleFilterDep() {
      if(this.userForm.sysId==null||this.userForm.sysId==""){
        this.userForm.depId=null
      }
      var departmentList=[]
      Object.assign(departmentList,this.departmentListAll) 
      for(let i=departmentList.length-1;i>=0;i--){
        if (departmentList[i].sysId != this.userForm.sysId) {
          departmentList.splice(i, 1);
        }
      }
      this.departmentList=departmentList
      this.handleFilterRole()
    },
    handleFilterRole() {
      if(this.userForm.depId==null||this.userForm.depId==""){
        this.selectRole=null
      }
      var roleList=[]
      Object.assign(roleList,this.roleListAll) 
      for(let i=roleList.length-1;i>=0;i--){
        if (roleList[i].depId != this.userForm.depId) {
          roleList.splice(i, 1);
        }
      }
      this.roleList=roleList
    },
    handleDelete(userId) {
      /* 删除数据*/
      this.listLoading = true;
      this.$store.dispatch("user/remove", userId).then(response => {
        this.getAllUser();
        this.listLoading = false;
      });
    },
    handleCreate() {
      /* 打开新增数据窗口*/
      this.resetUserForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      /* 打开编辑数据窗口*/
      this.userForm = Object.assign({}, row); // copy obj
      this.selectRole = [];
      this.userForm.depId = row.roles[0].depId;
      for (let i = 0; i < row.roles.length; i++) {
        this.selectRole.push(row.roles[i].flowId);
      }
      this.handleFilterDep()
      this.handleFilterRole()
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userForm"].clearValidate();
      });
    },
    createData() {
      let roleIds = "";
      for (let i = 0; i < this.selectRole.length; i++) {
        roleIds += this.selectRole[i] + ",";
      }
      this.userForm.roleIds = roleIds;
      let sendData = {
        flowId: this.userForm.flowId,
        depId: this.userForm.depId,
        roleIds: this.userForm.roleIds,
        userName: this.userForm.userName,
        petName: this.userForm.petName,
        password: this.userForm.password
      };
      /* 发送新增数据*/
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("user/register", this.userForm)
            .then(response => {
              if (response.message === "succeed") {
                this.dialogFormVisible = false;
                this.getAllUser();
              }
            });
        }
      });
    },
    updateData() {
      let roleIds = "";
      for (let i = 0; i < this.selectRole.length; i++) {
        roleIds += this.selectRole[i] + ",";
      }
      this.userForm.roleIds = roleIds;
      let sendData = {
        flowId: this.userForm.flowId,
        depId: this.userForm.depId,
        roleIds: this.userForm.roleIds,
        userName: this.userForm.userName,
        petName: this.userForm.petName,
        password: this.userForm.password
      };
      /* 发送修改数据*/
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("user/update", sendData).then(response => {
            if (response.message === "succeed") {
              this.dialogFormVisible = false;
              this.getAllUser();
            }
          });
        }
      });
    },
    getAllRole() {
      this.$store.dispatch("role/getAll").then(response => {
        this.roleList = response.data;
        this.roleListAll = response.data;
      });
    },
    getAllDepartment() {
      this.$store.dispatch("department/getAll").then(response => {
        this.departmentList = response.data;
        this.departmentListAll = response.data;
      });
    },
    getAllSystem() {
      this.$store.dispatch("system/getAll").then(response => {
        this.systemList = response.data
      })
    },
    resetUserForm() {
      /* 表单数据清空*/
      this.userForm = {
        flowId: "",
        depId: "",
        sysId: "",
        roleIds: "",
        userName: "",
        petName: "",
        password: ""
      };
    }
  }
};
</script>
