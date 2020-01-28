import {
  crudOneByIdAndRefs,
  crudListByFilterAndRefs
} from '../../api/crud'
import { addTopic } from '../../api/topic'
import {
  getCircleJoinList
} from '../../api/circle'
import {
  getGlobalData,
  assert
} from '../../utils/util'
import {
  uploadImage
} from '../../utils/file'
import {
  $wuxToast
} from '../../components/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isEdit: true,
    model: {
      content: '',
      imgs: [],
      user: '',
      tags: [],
      type: 'normal',
      views: 0,
      likes: 0,
      circles: []
    },
    circlesDisplay: '',
    circlesList: [],
    topicId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      type,
      id
    } = options
    this.setData({
      userInfo: getGlobalData('userInfo') || {}
    })
    if (id) { // 非编辑，只做浏览
      this.setData({
        isEdit: false,
        topicId: id
      })
      this.getDetail()
    } else { // 编辑添加
      this.setData({
        ['model.type']: type
      })
      // 获取圈子列表
      this.getCircleList()
    }
  },
  // 获取详情信息
  getDetail() {
    const params = {
      id: this.data.topicId,
      resource: 'topics',
      data: {
        refs: 'userInfo'
      }
    }
    crudOneByIdAndRefs(params).then(res => {
      this.setData({
        model: res
      })
    }, err => {
      $wuxToast().show({
        type: 'cancel',
        text: err.message,
        success: () => wx.navigateBack()
      })
    })
  },
  // 获取圈子列表
  getCircleList() {
    if (this.data.model.type !== 'notice') {  // 获取加入的圈子列表
      const data = {
        userId: this.data.userInfo._id,
        name: '',
        page: 1,
        size: 50
      }
      getCircleJoinList({ data }).then(res => {
        this.setData({
          circlesList: res.list.map(v => ({ title: v.name, value: v._id }))
        })
      }, err => {
        wx.showToast({
          title: err.message,
          icon: 'nonw'
        })
      })
    } else {  // 获取管理的圈子列表
      const params = {
        resource: 'circleusers',
        data: {
          user: this.data.userInfo._id,
          userRole: 'teacher',
          refs: 'circleInfo'
        }
      }
      crudListByFilterAndRefs(params).then(res => {
        this.setData({
          circlesList: res.map(v => ({ title: v.circleInfo.name, value: v.circleInfo._id }))
        })
      })
    }
  },
  // 同步的圈子选择器发生改变
  circlesPickerChange(e) {
    this.setData({
      ['model.circles']: e.detail.value,
      circlesDisplay: e.detail.label
    })
  },
  // 输入框选择状态改变
  inputChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      ['model.' + key]: e.detail.value
    })
  },
  // 选择图片上传
  chooseImage(e) {
    uploadImage().then(res => {
      const imgs = this.data.model.imgs
      imgs.push(res.url)
      this.setData({
        ['model.imgs']: imgs
      })
    }, err => {
      $wuxToast().show({
        type: 'cancel',
        text: err.message
      })
    })
  },
  // 查看图片
  viewImage(e) {
    const {
      imgurl
    } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.model.imgs,
      current: imgurl
    });
  },
  // 删除图片
  delImg(e) {
    const {
      index
    } = e.currentTarget.dataset
    const imgs = this.data.model.imgs
    imgs.splice(index, 1)
    this.setData({
      [`model.imgs`]: imgs
    })
  },
  // 提交表单
  submit() {
    try {
      this.formValidate()
      const params = {
        content: this.data.model.content,
        imgs: this.data.model.imgs,
        user: this.data.userInfo._id,
        tags: this.data.model.tags,
        type: this.data.model.type,
        views: this.data.model.views,
        likes: this.data.model.likes,
        circles: this.data.model.circles
      }
      addTopic({
        data: params
      }).then(res => {
        $wuxToast().show({
          text: '提交成功',
          success: () => wx.navigateBack()
        })
      }, error => {
        $wuxToast().show({
          type: 'cancel',
          text: error.message
        })
      })
    } catch (error) {
      $wuxToast().show({
        text: error.message
      })
    }
  },
  // 数据校验
  formValidate() {
    assert(this.data.model.content, '请填写内容')
    assert(this.data.model.circles && this.data.model.circles.length > 0, '请选择发布到的圈子')
  }
})