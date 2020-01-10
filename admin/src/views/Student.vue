<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <el-input
          size="mini"
          placeholder="姓名..."
          suffix-icon="el-icon-search"
          style="width: 200px;margin-right:20px;"
          v-model="query.username"
        ></el-input>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
      <el-button @click="onAdd" type="primary" size="mini">新增</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData.list" :height="tableHeight" border>
        <el-table-column label="序号" type="index" align="center" width="70" />
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" align="center"></el-table-column>
        <el-table-column prop="collegeInfo.name" label="学院" align="center"></el-table-column>
        <el-table-column prop="gradeInfo.name" label="年级" align="center"></el-table-column>
        <el-table-column prop="majorInfo.name" label="专业" align="center"></el-table-column>
        <el-table-column prop="classInfo.name" label="班级" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.status? 'success' : 'danger'"
            >{{ scope.row.status?'正常':'停用' }}</el-tag>
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
          :total="tableData.total"
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
      <el-form :model="model" :rules="rules" ref="el-form" label-width="100px">
        <el-form-item prop="username" label="姓名：">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item prop="number" label="学号：">
          <el-input v-model="model.number" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号：">
          <el-input v-model="model.phone" />
        </el-form-item>
        <el-form-item v-if="!model._id" prop="password" label="密码：">
          <el-input type="password" v-model="model.password" />
        </el-form-item>
        <el-form-item label="所在组织：" prop="orgna">
          <el-cascader
            v-model="model.orgna"
            :options="selectList"
            :props="selectProps"
            style="width:450px;"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="status" label="状态：">
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
import { mapGetters } from 'vuex'
export default {
  name: 'student',
  data() {
    return {
      resource: 'admin_users',
      tableData: { total: 0, list: [] },
      model: {},
      dialogVisible: false,
      tableHeight: 0,
      selectList: [],
      rules: {
        username: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        orgna: [
          { required: true, message: '请选择班级', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      query: {
        username: '',
        school: null,
        role: '^student$',
        page: 1,
        size: 30,
        refs: 'schoolInfo|collegeInfo|gradeInfo|majorInfo|classInfo'
      },
      selectProps: {
        value: "_id",
        label: "name"
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取列表
    async getList(){
      this.query.school = `^${this.userInfo.school}$`
      const [err, res] = await this.$store.dispatch('CrudListByFilterAndRefsPaging', { resource: this.resource, data: this.query })
      if (!err) {
        this.tableData = res
      }
    },
    // 获取详情
    async getDetail(id) {
      const [err, res] = await this.$store.dispatch('CrudOneByIdAndRefs', { resource: this.resource, id })
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
        const [err, res] = await this.$store.dispatch('CrudDelete', { resource: this.resource, id })
        if (!err) {
          this.$message.success('删除成功')
          if (this.tableData.list.length === 1) {
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
        this.model.orgna = [this.model.college, this.model.grade, this.model.major, this.model.class]
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
        if (!valid || !this.formValidate()) {
          return false
        }
        const params = {
          phone: this.model.phone,
          password: this.model.password,
          username: this.model.username,
          role: 'student',
          status: this.model.status,
          school: this.userInfo.school,
          number: this.model.number,
          college: this.model.orgna[0],
          grade: this.model.orgna[1],
          major: this.model.orgna[2],
          class: this.model.orgna[3]
        }
        const [err, res] = await this.$store.dispatch(this.model._id ? 'UpdateUser' : 'AddUser', { id: this.model._id, data: params })
        if (!err) {
          this.$message.success('保存成功')
          this.getList()
          this.dialogVisible = false
        }
      })
    },
    // 表单验证
    formValidate() {
      if (!this.model.orgna[0]) {
        this.$message.error('请具体到学院')
        return false
      }
      if (!this.model.orgna[1]) {
        this.$message.error('请具体到年级')
        return false 
      }
      if (!this.model.orgna[2]) {
        this.$message.error('请具体到专业')
        return false 
      }
      if (!this.model.orgna[3]) {
        this.$message.error('请具体到班级')
        return false 
      }
      return true
    },
    // 对话框关闭
    dialogClose() {
      this.$refs['el-form'].clearValidate()
    },
    // 获取组织树级列表
    async getSelectList() {
      const [err, res] = await this.$store.dispatch('GetOrgTreeList', { data: { startLayer: 1, endLayer: 4, pid: this.userInfo.school } })
      if (!err) this.selectList = res
    },
    // 页码改变
    pageChange(val) {
      this.query.page = val
      this.getList()
    },
    // 搜索
    onSearch() {
      this.query.page = 1
      this.getList()
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
        const [err, res] = await this.$store.dispatch( 'UpdateUser', { id, data: { password: initPwd } })
        if (!err) {
          this.$message.success('重置成功')
        }
      } catch (error) {
      }
    }
  },
  created() {
    this.getList()
    this.getSelectList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>