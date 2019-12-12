<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <el-input
          size="mini"
          placeholder="姓名..."
          suffix-icon="el-icon-search"
          style="width: 200px;margin-right:20px;"
          v-model="query.search"
        ></el-input>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
      <el-button @click="onAdd" type="primary" size="mini">新增</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData" :height="tableHeight">
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" align="center"></el-table-column>
        <el-table-column prop="school.name" label="所属学校" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status? 'success' : 'danger'">{{ scope.row.status?'正常':'停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="onDelete(scope.row._id)" type="text" size="small">删除</el-button>
            <el-button @click="onEdit(scope.row._id)" type="text" size="small">编辑</el-button>
            <el-button @click="resetPwd(scope.row._id)" type="text" size="small">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;padding-top: 10px;">
        <el-pagination
          small
          background
          layout="prev, pager, next, total"
          @current-change="pageChange"
          :total="total"
          :page-size="query.size"
          :current-page="query.page"
        ></el-pagination>
      </div>
    </el-main>
    <!-- 对话框 -->
    <el-dialog
      title="详细信息"
      :visible.sync="dialogVisible"
      center
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form :model="model" :rules="rules" ref="el-form" label-width="80px">
        <el-form-item prop="username" label="姓名">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="model.phone" />
        </el-form-item>
        <el-form-item v-if="!model._id" prop="password" label="密码">
          <el-input type="password" v-model="model.password" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="model.role" placeholder="请选择角色">
            <el-option label="学校管理员" value="admin"></el-option>
            <el-option label="超级管理员" value="superadmin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学校" prop="school">
          <el-select
            v-model="model.school"
            filterable
            remote
            :remote-method="getSchoolList"
            :loading="selectLoading"
            placeholder="请输入关键词搜索"
          >
            <el-option
              v-for="item in schoolList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="model.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" style="margin-right:20px;">取 消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'adminUser',
  data() {
    return {
      tableData: [],
      model: {},
      dialogVisible: false,
      tableHeight: 0,
      schoolList: [],
      rules: {
        username: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      query: {
        search: '',
        page: 1,
        size: 30,
        role: 'admin'
      },
      total: 0,
      selectLoading: false
    }
  },
  methods: {
    // 获取列表
    async getList(){
      const [err, res] = await this.$store.dispatch('GetUserList', this.query)
      if (!err) {
        this.tableData = res.list
        this.total = res.total
      }
    },
    // 获取详情
    async getDetail(id) {
      const [err, res] = await this.$store.dispatch('GetUserInfoById', { resource: 'adminUser', id })
      if (!err) return res
    },
    // 删除
    async onDelete(id) {
      try {
        await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const [err, res] = await this.$store.dispatch('DeleteUser', { id })
        if (!err) {
          this.$message.success('删除成功')
          if (this.tableData.length === 1) {
            this.query.page = this.query.page === 1 ? 1 : this.query.page - 1
          }
          this.getList()
        }
      } catch (error) {
      }
    },
    // 编辑
    async onEdit(id) {
      const res = await this.getDetail(id)
      if (res) {
        this.model = Object.assign({}, this.model, res)
        this.schoolList = res.schoolInfo
        this.dialogVisible = true
      }
    },
    // 添加
    onAdd() {
      this.model = {}
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const [err, res] = await this.$store.dispatch(this.model._id ? 'UpdateUser' : 'AddUser', this.model)
        if (!err) {
          this.$message.success('保存成功')
          this.getList()
          this.dialogVisible = false
        }
      })
    },
    // 对话框关闭
    dialogClose() {
      this.$refs['el-form'].clearValidate()
    },
    // 获取学校列表
    async getSchoolList(search) {
      if (search !== '') {
        this.selectLoading = true
        const [err, res] = await this.$store.dispatch('CrudList', { resource: 'schools', search })
        if (!err) this.schoolList = res.list
        this.selectLoading = false
      } else {
        this.schoolList = []
      }
    },
    // 页码改变
    pageChange(val) {
      this.query.page = val
      this.getList()
    },
    // 搜索
    onSearch() {
      if (this.query.search !== '') {
        this.query.page = 1
        this.getList()
      }
    },
    // 重置密码
    async resetPwd(id) {
      const initPwd = '123456'
      try {
        await this.$confirm('是否将密码重置为123456', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const [err, res] = await this.$store.dispatch( 'UpdateUser', { _id: id, password: initPwd })
        if (!err) {
          this.$message.success('重置成功')
        }
      } catch (error) {
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>