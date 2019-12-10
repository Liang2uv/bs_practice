<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="手机号">
          <el-input v-model="model.phone" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      model: {}
    }
  },
  methods: {
    async login() {
      const [err, res] = await this.$store.dispatch('LoginByPhone', this.model)
      if (res) this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 25rem;
  margin: 10rem auto;
}
</style>