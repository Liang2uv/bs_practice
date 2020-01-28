<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <div>
        <el-input
          size="mini"
          placeholder="圈子名称..."
          suffix-icon="el-icon-search"
          style="width: 200px;margin-right:20px;"
          v-model="query.name"
        ></el-input>
        <el-button @click="onSearch" type="primary" size="mini">搜索</el-button>
      </div>
      <el-button @click="onAdd" type="primary" size="mini">新增</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData.list" :height="tableHeight" border>
        <el-table-column label="序号" type="index" align="center" width="70" />
        <el-table-column prop="name" label="圈子名称" align="center"></el-table-column>
        <el-table-column prop="desc" label="描述" align="center"></el-table-column>
        <el-table-column prop="createrInfo.username" label="创建人" align="center"></el-table-column>
        <el-table-column label="管理员" align="center">
          <template slot-scope="scope">
            <span class="link" @click="onOpenAdmin(scope.row._id, scope.row)" v-if="scope.row.name !== '公共圈子'">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column label="进入方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.enterWay | statusformat(enterWayArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusformat(statusArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.name !== '公共圈子'" @click="onEdit(scope.row._id)" type="text" size="small">编辑</el-button>
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
    <!-- 管理员列表对话框 -->
    <el-dialog title="管理员列表" :visible.sync="adminDialogVisible" center :close-on-click-modal="false">
      <el-select v-model="currentTeachers" multiple style="width: 100%;">
        <el-option
          v-for="item in teacherList"
          :key="item._id"
          :label="item.username"
          :value="item._id"
        >
          <span style="float: left">{{ item.username }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.collegeInfo.name }}</span>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adminDialogVisible = false" style="margin-right:20px;">取 消</el-button>
        <el-button type="primary" @click="editAdmin">保存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑信息对话框 -->
    <el-dialog
      title="详细信息"
      :visible.sync="dialogVisible"
      center
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form :model="model" :rules="rules" ref="el-form" label-width="100px">
        <el-form-item prop="name" label="圈子名称：">
          <el-input v-model="model.name" />
        </el-form-item>
        <el-form-item prop="avatar" label="圈子头像：">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="getAuthHeaders()"
            :on-success="res => $set(model, 'avatar',res.url)"
            :on-error="err => $message.error(err.message)"
          >
            <img v-if="model.avatar" :src="model.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="desc" label="描述：">
          <el-input v-model="model.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <el-form-item prop="enterWay" label="进圈方式：">
          <el-radio-group v-model="model.enterWay">
            <el-radio :label="0">直接进圈</el-radio>
            <el-radio :label="1">审核进圈</el-radio>
          </el-radio-group>
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
  name: 'circles',
  data() {
    return {
      resource: 'circles',
      tableData: { total: 0, list: [] },
      model: {},
      dialogVisible: false,
      tableHeight: 0,
      rules: {
        name: [
          {required: true, message: '请输入圈子名称', trigger: 'blur'}
        ],
        enterWay: [
          {required: true, message: '请选择进圈方式', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择圈子状态', trigger: 'blur'}
        ],
      },
      query: {
        userId: null,
        name: '',
        page: 1,
        size: 30
      },
      statusArr: ['停用', '在用'],
      enterWayArr: ['直接进圈', '审核进圈'],
      adminDialogVisible: false,
      currentCircle: {},
      currentTeachers: [],
      teacherList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 查看某个圈子的管理员
    async onOpenAdmin(id, row) {
      this.currentCircle = row
      const params = {
        resource: 'circle_users',
        data: {
          circle: id,
          userRole: 'teacher'
        }
      }
      const [err, res] = await this.$store.dispatch('CrudListByFilter', params)
      if (!err) {
        this.currentTeachers = res.map(v => v.user)
        this.adminDialogVisible = true
      }
    },
    // 编辑圈子管理员
    async editAdmin() {
      if (this.currentCircle.createrInfo._id !== this.userInfo._id) {
        this.$message.error('您不是圈子创建者，无权添加与移除管理员')
        return
      }
      if (this.currentTeachers.length === 0) {
        this.$message.error('至少需要一个管理员')
        return
      }
      // 批量添加、删除圈子管理员
      const params = {
        circle: this.currentCircle._id,
        userRole: 'teacher',
        users: this.currentTeachers,
        status: 1
      }
      const [err, res] = await this.$store.dispatch('AddCricleUserBulk', { data: params })
      if (!err) {
        this.$message.success('修改成功')
        this.adminDialogVisible = false
      }
    },
    // 获取圈子管理员（老师）列表
    async getTeacherList() {
      const params = { school: `^${this.userInfo.school}$`, role: '^teacher$', refs: 'collegeInfo' }
      const [err, res] = await this.$store.dispatch('CrudListByFilterAndRefs', { resource: 'admin_users', data: params })
      if (!err) {
        this.teacherList = res
      }
    },
    // 获取列表
    async getList(){
      this.query.userId = this.userInfo._id
      const [err, res] = await this.$store.dispatch('GetCircleList', { data: this.query })
      if (!err) {
        this.tableData = res
      }
    },
    // 获取详情
    async getDetail(id) {
      const [err, res] = await this.$store.dispatch('CrudOneById', { resource: this.resource, id })
      if (!err) return res
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
      this.model = {}
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        this.model.creater = this.userInfo._id
        const [err, res] = await this.$store.dispatch(this.model._id ? 'CrudUpdate' : 'AddCircle', { resource: this.resource, id: this.model._id, data: this.model } )
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
    this.getTeacherList()
    this.getList()
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.link {
  text-decoration: underline;
  color: #606266;
  cursor: pointer;
}
</style>
