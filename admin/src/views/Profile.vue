<template>
  <div class="con-profile">
    <el-form :model="model" :rules="rules" ref="el-form" label-width="100px" @submit.native.prevent="onSave">
      <el-form-item prop="username" label="姓名：">
        <el-input v-model="model.username" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号：">
        <el-input v-model="model.phone" />
      </el-form-item>
      <el-form-item prop="role" label="角色：">
        <div>{{ model.role }}</div>
      </el-form-item>
      <el-form-item
        v-if="model.role === 'teacher' || model.role === 'student'"
        prop="number"
        :label="model.role === 'student'? '学号：' : '工号：'"
      >
        <div>{{ model.number }}</div>
      </el-form-item>
      <el-form-item v-if="model.role !== 'superadmin'" prop="school" label="学校：">
        <div>{{ model.schoolInfo.name }}</div>
      </el-form-item>
      <el-form-item
        v-if="model.role === 'teacher' || model.role === 'student'"
        prop="role"
        label="学院："
      >
        <div>{{ model.collegeInfo.name }}</div>
      </el-form-item>
      <el-form-item v-if="model.role === 'student'" prop="role" label="年级：">
        <div>{{ model.gradeInfo.name }}</div>
      </el-form-item>
      <el-form-item v-if="model.role === 'student'" prop="role" label="专业：">
        <div>{{ model.majorInfo.name }}</div>
      </el-form-item>
      <el-form-item v-if="model.role === 'student'" prop="role" label="班级：">
        <div>{{ model.classInfo.name }}</div>
      </el-form-item>
      <el-form-item>
        <div style="text-align: center;">
          <el-button native-type="submit">保存修改</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'profile',
  data() {
    return {
      model: {},
      rules: {
        username: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 获取个人信息
    fetch() {
      this.model = Object.assign({}, this.model, this.userInfo)
    },
    // 保存
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        delete this.model.schoolInfo
        delete this.model.collegeInfo
        delete this.model.gradeInfo
        delete this.model.majorInfo
        delete this.model.classInfo
        const [err, res] = await this.$store.dispatch('UpdateUser', { id: this.model._id, data: this.model })
        if (!err) {
          this.$message.success('修改成功')
          this.$store.commit('SET_USERINFO', res)
        }
      })
    }
  },
  created() {
    this.fetch()
  }
}
</script>

<style lang="scss" scoped>
.con-profile {
  background: #fff;
  padding: 30px 20px;
}
</style>