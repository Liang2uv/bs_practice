Component({
  properties: {
    active: String,
    name: String
  },
  options: {
    addGlobalClass: true,
  },
  observers: {
    'active': function (val) {
      if (!this.data.cpLoad && val === this.data.name) {
        this.setData({
          cpLoad: true
        })
      }
      this.setData({
        cpShow: val === this.data.name
      })
    }
  },
  data: {
    cpLoad: false,
    cpShow: false,
    windowHeight: wx.getSystemInfoSync().windowHeight
  },
  methods: {
  }
})