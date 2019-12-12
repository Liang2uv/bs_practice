<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom" height="40px">
      <el-button @click="onAdd('college')" type="primary" size="mini">添加学院</el-button>
    </el-header>
    <el-main>
      <el-tree ref="eltree" node-key="_id" :props="props" :load="loadNode" lazy></el-tree>
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
        children: 'zones',
        isLeaf: 'leaf'
      },
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
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const list = await this.getNodeList(this.schoolId)
        return resolve(list);
      }
      if (node.data.type === 'class') return resolve([])
      const list = await this.getNodeList(node.data._id)
      resolve(list)
    },
    // 获取某个节点的列表
    async getNodeList(pid) {
      const [err, res] = await this.$store.dispatch('CrudList', { resource: 'organizations', key: 'pid', search: pid })
      if (!err) {
        return res.list
      } else {
        return []
      }
    },
    // 添加
    onAdd(type) {
      this.model = {}
      this.model.type = type
      this.dialogVisible = true
    },
    // 对话框关闭
    dialogClose() {
      this.$refs['el-form'].clearValidate()
    },
    // 编辑
    async onEdit(id) {
      const res = await this.getDetail(id)
      if (res) {
        this.model = Object.assign({}, this.model, res)
        this.dialogVisible = true
      }
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        if (this.model.type === 'college') {
          this.model.pid = this.schoolId
        }
        const node = this.$refs.eltree.getNode('5df219b2aa21830f23a9a434')
        // this.$refs.eltree.insertAfter({name: '呵呵'}, null)
        // console.log(node);
        // console.log(this.$refs.eltree);
        // node.insertAfter({name: '呵呵', _id: '421477773', type: 'college'})
        // this.$refs.eltree.insertAfter({name: '呵呵', _id: '421477773', type: 'college'}, node)
        // this.dialogVisible = false
        // const [err, res] = await this.$store.dispatch(this.model._id ? 'CrudUpdate' : 'CrudAdd', { resource: this.resource, data: this.model })
        // if (!err) {
        //   this.$message.success('保存成功')
        //   this.dialogVisible = false
        // }
      })
    }
  }
}
</script>

<style>
</style>