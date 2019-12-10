<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom">
      <h3>学校管理</h3>
      <el-button @click="onAdd" type="primary">新增</el-button>
    </el-header>
    <el-main>
      <!-- 表格 -->
      <el-table :data="tableData" :height="tableHeight">
        <el-table-column prop="_id" label="ID" width="220px" align="center"></el-table-column>
        <el-table-column prop="name" label="学校名称" align="center"></el-table-column>
        <el-table-column prop="code" label="学校代码" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="onDelete(scope.row._id)" type="text" size="small">删除</el-button>
            <el-button @click="onEdit(scope.row._id)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 对话框 -->
    <el-dialog title="详细信息" :visible.sync="dialogVisible" center :close-on-click-modal="false" @close="dialogClose">
      <el-form :model="model" :rules="rules" ref="el-form" label-width="80px">
        <el-form-item prop="name" label="学校名称">
          <el-input v-model="model.name" />
        </el-form-item>
        <el-form-item prop="code" label="学校代码">
          <el-input v-model="model.code" />
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
  name: 'school',
  data() {
    return {
      resource: 'schools',
      tableData: [],
      model: {},
      dialogVisible: false,
      tableHeight: 0,
      rules: {
        name: [
          {required: true, message: '请输入学校名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入学校代码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 获取列表
    async getList(){
      const [err, res] = await this.$store.dispatch('CrudList', { resource: this.resource })
      if (!err) this.tableData = res
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
      this.model = {}
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate((valid) => {
        if (valid) {
          this.$store.dispatch(this.model._id ? 'CrudUpdate' : 'CrudAdd', { resource: this.resource, data: this.model })
            .then(res => {
              this.$message.success('保存成功')
              this.getList()
              this.dialogVisible = false
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 对话框关闭
    dialogClose() {
      this.$refs['el-form'].clearValidate()
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 60 - 60 - 40
    })
  }
}
</script>