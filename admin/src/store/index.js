import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// 引入store模块
import adminUser from './modules/adminUser'
import crud from './modules/crud'
import organization from './modules/organization'
import dayRecord from './modules/dayRecord'
import dayOff from './modules/dayOff'
import note from './modules/note'
import circle from './modules/circle'
import circleUser from './modules/circleUser'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    adminUser,
    crud,
    organization,
    dayRecord,
    dayOff,
    note,
    circle,
    circleUser
  },
  getters
})
