<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
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
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="所属系统" width="190">
        <template slot-scope="scope">
          {{ scope.row.sysName }}
        </template>
      </el-table-column>
      <el-table-column label="部门名称" width="190">
        <template slot-scope="scope">
          {{ scope.row.depName }}
        </template>
      </el-table-column>
      <el-table-column label="部门编号" width="190">
        <template slot-scope="scope">
          {{ scope.row.flowId }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.flowId)">
            {{ $t('table.delete') }}
          </el-button>
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
        ref="depForm"
        :model="depForm"
        label-width="80px"
        style="width: 400px; margin-left:150px;"
      >
        <el-form-item label="部门名称">
          <el-input v-model="depForm.depName"/>
        </el-form-item>
        <el-form-item label="所属系统">
          <el-select v-model="depForm.sysId" placeholder="所属系统" clearable class="filter-item" @change="handleFilter">
            <el-option v-for="item in systemList" :key="item.flowId" :label="item.sysName" :value="item.flowId"/>
          </el-select>
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

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import waves from '@/directive/waves' // waves directive

  export default {
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        dialogFormVisible: false,
        dialogStatus: '',
        systemList:'',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        depForm: {
          flowId: '',
          depName: '',
          sysId: ''
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
      }
    },
    created() {
      this.fetchData()
      this.getAllSystem()
    },
    methods: {
      handleFilter(){}
      ,
      getAllSystem() {
        this.$store.dispatch('system/getAll').then(response => {
          this.systemList = response.data
        })
      },
      fetchData() {
        /* 从后台获取数据*/
        this.listLoading = true
        this.$store.dispatch('department/getAll', this.pageQueryDTO).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      handleDelete(userId) {
        /* 删除数据*/
        this.listLoading = true
        this.$store.dispatch('department/remove', userId).then(response => {
          this.fetchData()
          this.listLoading = false
        })
      },
      handleCreate() {
        /* 打开新增数据窗口*/
        this.resetdepForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['depForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        /* 打开编辑数据窗口*/
        this.depForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['depForm'].clearValidate()
        })
      },
      createData() {
        /* 发送新增数据*/
        this.$refs.depForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('department/add', this.depForm).then(response => {
              if (response.message === 'succeed') {
                this.dialogFormVisible = false
                this.fetchData()
              }
            })
          }
        })
      },
      updateData() {
        /* 发送修改数据*/
        this.$refs.depForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('department/update', this.depForm).then(response => {
              if (response.message === 'succeed') {
                this.dialogFormVisible = false
                this.fetchData()
              }
            })
          }
        })
      },
      resetdepForm() {
        /* 表单数据清空*/
        this.depForm = {
          flowId: '',
          depName: '',
          sysId: ''
        }
      }
    }
  }
</script>
