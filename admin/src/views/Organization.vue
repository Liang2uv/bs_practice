<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <el-button @click="onAdd('college', null, '添加院（系）')" type="primary" size="mini">添加院（系）</el-button>
    </el-header>
    <el-main>
      <el-tree node-key="_id" :props="props" :data="treeData" :expand-on-click-node="false" default-expand-all>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button v-if="data.type === 'college'" type="text" size="mini" @click="onAdd('grade', node, '添加年级')">添加年级</el-button>
            <el-button v-if="data.type === 'grade'" type="text" size="mini" @click="onAdd('major', node, '添加专业')">添加专业</el-button>
            <el-button v-if="data.type === 'major'" type="text" size="mini" @click="onAdd('class', node, '添加班级')">添加班级</el-button>
            <el-button type="text" size="mini" @click="onEdit(data)">修改</el-button>
            <el-button type="text" size="mini" @click="onDelete(data._id)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </el-main>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      center
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form :model="model" :rules="rules" ref="el-form" label-width="80px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="model.name" />
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
  name: 'organization',
  data() {
    return {
      props: {
        label: 'name',
        children: 'children'
      },
      treeData: [],
      dialogTitle: '',
      dialogVisible: false,
      model: {},
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    schoolId() {
      return this.$store.getters.userInfo.school
    }
  },
  methods: {
    // 获取树级列表
    async getTreeList() {
      const [err, res] = await this.$store.dispatch("GetOrgList", { type: "tree" })
      if (!err) {
        this.treeData = res
      }
    },
    // 添加
    onAdd(type, node, title) {
      this.model = {}
      this.dialogTitle = title
      if (type === 'college') {
        this.model.pid = this.schoolId
      } else {
        this.model.pid = node.data._id
      }
      this.dialogVisible = true
    },
    // 删除
    async onDelete(id) {
      try {
        await this.$confirm('将会删除这条数据和它的下级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const [err, res] = await this.$store.dispatch('DeleteOrg', { id })
        if (!err) {
          this.$message.success('删除成功')
          this.getTreeList()
        }
      } catch (error) {
      }
    },
    // 对话框关闭
    dialogClose() {
      this.$refs['el-form'].clearValidate()
    },
    // 编辑
    async onEdit(data) {
      this.dialogTitle = '修改信息'
      this.model = Object.assign({}, this.model, data)
      this.dialogVisible = true
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const params = { name: this.model.name }
        if (this.model._id) {
          params._id = this.model._id
        } else {
          params.pid = this.model.pid
        }
        const [err, res] = await this.$store.dispatch(this.model._id ? 'UpdateOrg' : 'AddOrg', params)
        if (!err) {
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.getTreeList()
        }
      })
    }
  },
  created() {
    this.getTreeList()
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>