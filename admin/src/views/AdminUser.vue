<template>
  <el-container>
    <el-header class="d-flex ai-center jc-between border-bottom">
      <h3>管理员</h3>
      <el-button @click="onAdd" type="primary">新增</el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="_id" label="ID" width="220px"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="username" label="手机号"></el-table-column>
        <el-table-column prop="username" label="角色"></el-table-column>
        <el-table-column prop="school" label="所属学校"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="onDelete(scope.row._id)" type="text" size="small">删除</el-button>
            <el-button @click="onEdit(scope.row._id)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 对话框 -->
    <el-dialog title="详细信息" :visible.sync="dialogVisible">
      <el-form label-width="120px" @submit.native.prevent="onSave">
        <el-form-item label="姓名">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="model.phone" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="model.password" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="model.role" />
        </el-form-item>
        <el-form-item label="所属学校">
          <el-input v-model="model.school" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="model.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">保存</el-button>
        </el-form-item>
      </el-form>
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
      dialogVisible: false
    }
  },
  methods: {
    getList(){
      console.log('获取列表')
    },
    onDelete(id) {
      console.log('删除', id)
    },
    onEdit(id) {
      console.log('编辑', id)
      this.dialogVisible = true
    },
    onAdd() {
      console.log('新增')
      this.dialogVisible = true
    },
    onSave() {
      console.log('保存更改')
      this.dialogVisible = false
    }
  },
  create() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>

</style>