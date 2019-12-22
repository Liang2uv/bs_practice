<template>
  <el-container class="con-mainplan">
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <el-input
          size="mini"
          placeholder="实习计划名称..."
          suffix-icon="el-icon-search"
          style="width: 200px;margin-right:20px;"
          v-model="query.search"
        ></el-input>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
      <el-button @click="onAdd" type="primary" size="mini">新建计划</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData" :height="tableHeight">
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="startAt" label="开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endAt" label="截止时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endAt | dateformat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="times" label="至少实习天数(天)" align="center"></el-table-column>
        <el-table-column prop="createAt" label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createAt | dateformat }}</span>
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
      <el-form :model="model" :rules="rules" ref="el-form" label-width="100px">
        <el-tabs type="border-card" value="basic">
          <el-tab-pane label="基础信息" name="basic">
            <el-form-item prop="name" label="计划名称：">
              <el-input v-model="model.name" />
            </el-form-item>
            <el-form-item prop="datespan" label="起始日期：">
              <el-date-picker
                v-model="model.datespan"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="times" label="实习天数：">
              至少
              <el-input-number
                v-model="model.times"
                controls-position="right"
                :min="1"
                style="width:100px;margin: 0 10px;"
              ></el-input-number>天
            </el-form-item>
            <el-form-item prop="teacher" label="指导老师：">
              <el-select v-model="model.teacher" multiple>
                <el-option
                  v-for="item in teacherList"
                  :key="item._id"
                  :label="item.username"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="实习材料" name="files">
            <el-button size="small" @click="model.files.push({})">
              <i class="el-icon-plus"></i>添加材料
            </el-button>
            <el-row type="flex" style="flex-wrap: wrap;">
              <el-col :span="24" v-for="(item,index) in model.files" :key="index" class="file-item">
                <el-form-item :prop="`files[${index}].name`" :rules="[{ required: true, message: '材料名不能为空'}]" label="名称：">
                  <el-input v-model="item.name" />
                </el-form-item>
                <el-form-item label="文件：">
                  <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :headers="getAuthHeaders()"
                    :show-file-list="false"
                    :disabled="item.filename !== undefined"
                    :on-success="res => {$set(item, 'fileurl',res.url);$set(item, 'filename',res.originalname)}"
                    :on-error="err => $message.error(err.message)"
                  >
                    <el-button size="mini" v-if="!item.filename">点击上传</el-button>
                    <span @click="onDownload(item.fileurl, item.filename)">{{ item.filename }}</span>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" type="danger" @click="model.files.splice(index, 1)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
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
import { getDateDiff } from 'utils/index.js'
import { download } from 'utils/download.js'
export default {
  name: 'main-plan',
  data() {
    return {
      resource: 'main_plans',
      tableData: [],
      model: { files: [] },
      dialogVisible: false,
      tableHeight: 0,
      rules: {
        name: [
          {required: true, message: '请输入计划名称', trigger: 'blur'}
        ],
        datespan: [
          {required: true, message: '请选择开始日期和截止日期', trigger: 'blur'}
        ],
        times: [
          {required: true, message: '请输入至少实习天数', trigger: 'blur'}
        ],
        teacher: [
          {required: true, message: '请选择指导老师', trigger: 'blur'}
        ],
      },
      query: {
        search: '',
        page: 1,
        size: 30,
        key: 'name'
      },
      total: 0,
      teacherList: [],
      queryTeacher: {
        search: '',
        page: 1,
        size: 30,
        role: 'teacher',
        key: 'username'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取指导老师列表
    async getTeacherList() {
      const [err, res] = await this.$store.dispatch('GetUserList', this.queryTeacher)
      if (!err) {
        this.teacherList = res.list
      }
    },
    // 获取列表
    async getList(){
      const [err, res] = await this.$store.dispatch('CrudList', { resource: this.resource, ...this.query })
      if (!err) {
        this.tableData = res.list
        this.total = res.total
      }
    },
    // 获取详情
    async getDetail(id) {
      const [err, res] = await this.$store.dispatch('CrudDetail', { resource: this.resource, id })
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
        this.model.datespan = [res.startAt, res.endAt]
        this.dialogVisible = true
      }
    },
    // 添加
    onAdd() {
      this.model = { files: [] }
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid || !this.formValidate()) {
          return false
        }
        this.model.startAt = this.model.datespan[0]
        this.model.endAt = this.model.datespan[1]
        this.model.school = this.userInfo.school
        delete this.model.datespan
        const [err, res] = await this.$store.dispatch(this.model._id ? 'CrudUpdate' : 'CrudAdd', { resource: this.resource, data: this.model })
        if (!err) {
          this.$message.success('保存成功')
          this.getList()
          this.dialogVisible = false
        }
      })
    },
    // 表单校验
    formValidate() {
      if (this.model.times > getDateDiff(this.model.datespan[0], this.model.datespan[1], 'days')) {
        this.$message.error('实习天数不能大于起始时间天数')
        return false
      }
      return true
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
    },
    // 下载文件
    onDownload(url, name) {
      download(url, name)
    }
  },
  created() {
    this.getList()
    this.getTeacherList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 180
    })
  }
}
</script>

<style lang="scss" scoped>
.con-mainplan {
  .file-item{
    padding-top: 15px;
    &:nth-of-type(n + 2) {
      border-top: 1px dashed #ccc;
    }
  }
}
</style>