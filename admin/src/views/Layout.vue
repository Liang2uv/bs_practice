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
        <div v-for="(item, index) in filterRoutes" :key="index">
          <el-menu-item v-if="!item.hidden && item.children.length !== 0 && !item.meta" :index="item.children[0].path">
            <i :class="item.children[0].meta.icon"></i>
            <span slot="title">{{ item.children[0].meta.title }}</span>
          </el-menu-item>
          <el-submenu
            v-else-if="!item.hidden && item.children.length !== 0 "
            :index="index.toString()"
          >
            <template slot="title">
              <i :class="item.meta.icon"></i>
              {{ item.meta.title }}
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="child.path"
              >{{ child.meta.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="main-header d-flex jc-between bg-white-2 border-bottom ai-center px-4">
        <div class="flex-1"></div>
        <div class="d-flex ai-center">
          <el-avatar
            :src="userInfo.avatar"
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
import { mapGetters } from 'vuex'

export default {
  name: "layout",
  computed: {
    ...mapGetters(['userInfo', 'filterRoutes'])
  },
  methods: {
    onLoginOut() {
      this.$store.commit('CLEAR_LOGIN')
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variable.scss";
.main-container {
  height: 100vh;
  min-width: 700px;
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