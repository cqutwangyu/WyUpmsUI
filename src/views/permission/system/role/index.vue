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
      <el-table-column label="所属系统" width="190">
        <template slot-scope="scope">{{ scope.row.sysName }}</template>
      </el-table-column>
      <el-table-column label="角色名" width="190">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>
      <el-table-column label="角色编号" width="190">
        <template slot-scope="scope">{{ scope.row.flowId }}</template>
      </el-table-column>
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
    />-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="roleForm"
        :model="roleForm"
        label-width="80px"
        style="width: 400px; margin-left:150px;"
      >
        <el-form-item label="角色名">
          <el-input v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item label="所属系统">
          <el-select
            v-model="roleForm.sysId"
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
          <el-select v-model="roleForm.depId" placeholder="请选择部门" clearable class="filter-item">
            <el-option
              v-for="item in departmentList"
              :key="item.flowId"
              :label="item.depName"
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
      departmentList: "",
      departmentListAll: "",
      systemList: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      roleForm: {
        flowId: "",
        roleName: "",
        sysId: "",
        depId: ""
      },
      list: null,
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
    this.fetchData();
    this.getAllSystem();
    this.getAllDepartment();
  },
  methods: {
    handleFilterDep() {
      if (this.roleForm.sysId == null || this.roleForm.sysId == "") {
        this.roleForm.depId = null;
      }
      var departmentList = [];
      Object.assign(departmentList, this.departmentListAll);
      for (let i = departmentList.length - 1; i >= 0; i--) {
        if (departmentList[i].sysId != this.roleForm.sysId) {
          departmentList.splice(i, 1);
        }
      }
      this.departmentList = departmentList;
    },
    getAllDepartment() {
      this.$store.dispatch("department/getAll").then(response => {
        this.departmentList = response.data;
        this.departmentListAll = response.data;
      });
    },
    getAllSystem() {
      this.$store.dispatch("system/getAll").then(response => {
        this.systemList = response.data;
      });
    },
    fetchData() {
      /* 从后台获取数据*/
      this.listLoading = true;
      this.$store.dispatch("role/getAll", this.pageQueryDTO).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    handleDelete(roleId) {
      /* 删除数据*/
      this.listLoading = true;
      this.$store.dispatch("role/remove", roleId).then(response => {
        this.fetchData();
        this.listLoading = false;
      });
    },
    handleCreate() {
      /* 打开新增数据窗口*/
      this.resetroleForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["roleForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      /* 打开编辑数据窗口*/
      this.roleForm = Object.assign({}, row); // copy obj
      if (row.depId == 0) {
        this.roleForm.depId = null;
      }
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["roleForm"].clearValidate();
      });
    },
    createData() {
      /* 发送新增数据*/
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("role/add", this.roleForm).then(response => {
            if (response.message === "succeed") {
              this.dialogFormVisible = false;
              this.fetchData();
            }
          });
        }
      });
    },
    updateData() {
      /* 发送修改数据*/
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("role/update", this.roleForm).then(response => {
            if (response.message === "succeed") {
              this.dialogFormVisible = false;
              this.fetchData();
            }
          });
        }
      });
    },
    resetroleForm() {
      /* 表单数据清空*/
      this.roleForm = {
        flowId: "",
        roleName: "",
        sysId: "",
        depId: ""
      };
    }
  }
};
</script>
