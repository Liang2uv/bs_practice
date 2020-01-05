Page({
  data: {
    curTab: '1',
    role: 'student'
  },
  tabChange(e) {
    this.setData({
      curTab: e.currentTarget.dataset.tab
    })
  }
})