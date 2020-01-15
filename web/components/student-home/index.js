import { getGlobalData } from '../../utils/util'
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },
  /**
   * 生命周期
   */
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: getGlobalData('userInfo') || {}
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
