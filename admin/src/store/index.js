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
import mainPlan from './modules/mainPlan'
import score from './modules/score'
import daySummary from './modules/daySummary'
import other from './modules/other'

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
    circleUser,
    mainPlan,
    score,
    daySummary,
    other
  },
  getters
})
