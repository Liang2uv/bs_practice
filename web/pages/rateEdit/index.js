import { crudOneByIdAndRefs, crudUpdate } from '../../api/crud'
import { assert } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    model: {
      content: '',
      score: 0,
      studentInfo: { username: '' },
      taskInfo: { name: '' },
      status: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    // 获取详细信息
    this.getDetail()
  },
  // 获取详细信息
  getDetail() {
    const params = {
      resource: 'rates',
      id: this.data.id,
      data: {
        refs: 'taskInfo|studentInfo'
      }
    }
    crudOneByIdAndRefs(params).then(res => {
      this.setData({
        model: res
      })
    }, err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  // 表单提交
  formSubmit(e) {
    try {
      const { value } = e.detail
      const score = parseInt(value.score)
      assert(!isNaN(score) && score >= 0 && score <= 100, '分数不合法')
      assert(value.content && value.content !== '' && value.content.length >= 100, '评价意见不完整')
      const params = {
        resource: 'rates',
        id: this.data.id,
        data: {
          content: value.content,
          score,
          status: 1
        }
      }
      crudUpdate(params).then(() => {
        wx.showToast({
          title: '评价成功',
          icon: 'none'
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      })
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }
})