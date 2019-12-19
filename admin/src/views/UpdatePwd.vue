<template>
  <div class="con-profile">
    <el-form
      :model="model"
      status-icon
      :rules="rules"
      ref="el-form"
      label-width="100px"
    >
      <el-form-item label="新密码：" prop="pass">
        <el-input type="password" v-model="model.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkPass">
        <el-input type="password" v-model="model.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="text-align: center;">
          <el-button @click="onSave()">保存修改</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'update-pwd',
  data() {
     let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.model.checkPass !== '') {
          this.$refs['el-form'].validateField('checkPass');
        }
        callback();
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.model.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      model: {},
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    onSave() {
      this.$refs['el-form'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const [err, res] = await this.$store.dispatch('UpdateUser', { _id: this.userInfo._id, password: this.model.pass })
        if (!err) {
          this.$message.success('修改密码成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.con-profile {
  background: #fff;
  padding: 30px 20px;
}
</style>