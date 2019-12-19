<template>
  <el-container class="main-container">
    <el-aside width="200px">
      <div class="bg-dark-2 text-white aside-logo">实习管理后台</div>
      <el-menu
        router
        :default-active="$route.path"
        unique-opened
        background-color="#3b3a40"
        text-color="#efefef"
        active-text-color="#13cc9e"
      >
        <el-menu-item index="/home">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-eleme"></i>实习配置
          </template>
          <el-menu-item-group>
            <el-menu-item index="/practice-files">实习材料</el-menu-item>
            <el-menu-item index="/main-plan">实习计划</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>基础配置
          </template>
          <el-menu-item-group>
            <el-menu-item index="/admin-user">管理员</el-menu-item>
            <el-menu-item index="/school">学校管理</el-menu-item>
            <el-menu-item index="/organization">组织架构</el-menu-item>
            <el-menu-item index="/teacher">教师管理</el-menu-item>
            <el-menu-item index="/student">学生管理</el-menu-item>
            <el-menu-item index="/test">测试</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-user"></i>个人中心
          </template>
          <el-menu-item-group>
            <el-menu-item index="/profile">修改信息</el-menu-item>
            <el-menu-item index="/update-pwd">修改密码</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="main-header d-flex jc-between bg-white-2 border-bottom ai-center px-4">
        <div class="flex-1">
        </div>
        <div class="d-flex ai-center">
          <el-avatar
            src="https://img.zcool.cn/community/031191c5db0fbe3a8012163babf39e8.jpg@80w_80h_1c_1e_1o_100sh.jpg"
            class="mx-2"
          ></el-avatar>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              欢迎您，{{ userInfo.username }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:block;" @click="onLoginOut">退出登录</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link tag="span" to="/profile" style="display:block;">修改资料</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="px-2">
        <router-view :key="$route.path" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { clearToken } from '@/utils/auth.js'
import { mapGetters } from 'vuex'

export default {
  name: "layout",
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    onLoginOut() {
      clearToken()
      this.$store.commit('CLEAR_TOKEN')
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variable.scss";
.main-container {
  height: 100vh;
  min-width: 1280px;
  overflow: auto;
}
.el-aside {
  background-color: map-get($colors, "dark-1");
  .aside-logo {
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 23px;
    font-weight: bold;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  padding: 0;
  .main-header {
    height: 60px;
  }
  .el-dropdown {
    cursor: pointer;
  }
}
</style>