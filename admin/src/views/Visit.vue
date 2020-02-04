<template>
  <el-container class="con-mainplan">
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
      </div>
      <el-button @click="onAdd" type="primary" size="mini">新增记录</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData.list" :height="tableHeight" border>
        <el-table-column label="序号" type="index" align="center" width="70" />
        <el-table-column label="走访时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date | dateformat('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="走访学生" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.student.map(v => v.username).toString() }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="onDelete(scope.row._id)" type="text" size="small">删除</el-button>
            <el-button @click="onEdit(scope.row._id)" type="text" size="small">编辑</el-button>
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
        <el-form-item prop="date" label="走访时间：">
          <el-date-picker
            v-model="model.date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="student" label="走访学生：">
          <el-select v-model="model.student" multiple>
            <el-option
              v-for="item in studentList"
              :key="item._id"
              :label="item.username"
              :value="item._id"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.number }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="content" label="走访心得：">
          <el-input v-model="model.content" type="textarea" :rows="5"/>
        </el-form-item>
        <el-form-item prop="avatar" label="走访照片：">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="getAuthHeaders()"
            :on-success="res => model.imgs.push(res.url)"
            :on-error="err => $message.error(err.message)"
          >
            <img v-for="img in model.imgs" :key="img" :src="img" class="avatar" />
            <i v-if="model.imgs.length < 10" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  name: 'visit',
  data() {
    return {
      resource: 'visits',
      tableData: { total: 0, list: [] },
      model: { imgs: [] },
      dialogVisible: false,
      tableHeight: 0,
      rules: {
        student: [
          {required: true, message: '请选择走访学生', trigger: 'blur'}
        ],
        date: [
          {required: true, message: '请选择走访时间', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请填写走访心得', trigger: 'blur'}
        ]
      },
      query: {
        teacher: '',
        refs: 'student',
        page: 1,
        size: 30
      },
      studentList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取学生列表
    async getStudentList() {
      const params = { school: `^${this.userInfo.school}$`, role: '^student$' }
      const [err, res] = await this.$store.dispatch('CrudListByFilter', { resource: 'admin_users', data: params })
      if (!err) {
        this.studentList = res
      }
    },
    // 获取列表
    async getList(){
      this.query.teacher = this.userInfo._id
      const [err, res] = await this.$store.dispatch('CrudListByFilterAndRefsPaging', { resource: this.resource, data: this.query })
      if (!err) {
        this.tableData = res
      }
    },
    // 获取详情
    async getDetail(id) {
      const [err, res] = await this.$store.dispatch('CrudOneById', { resource: this.resource, id })
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
        this.dialogVisible = true
      }
    },
    // 添加
    onAdd() {
      this.model = { imgs: [] }
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        this.model.teacher = this.userInfo._id
        const [err, res] = await this.$store.dispatch(this.model._id ? 'CrudUpdate' : 'CrudAdd', { resource: this.resource, id: this.model._id, data: this.model })
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
    // 页码改变
    pageChange(val) {
      this.query.page = val
      this.getList()
    },
    // 搜索
    onSearch() {
      this.query.page=1
      this.getList()
    }
  },
  created() {
    this.getList()
    this.getStudentList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.avatar {
  width: 100px;
  height: 100px;
}
.link {
  text-decoration: underline;
  color: #606266;
  cursor: pointer;
}
</style>