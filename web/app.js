App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMTgyMmMzMThkMjliMmExMDM0ZDg1ZCIsImlhdCI6MTU3OTQwMjQ2MywiZXhwIjoxNTc5NTc1MjYzfQ.Xe9-64mmWDj7T4s9oclwgC5hsGZW0Tv91t8A5eEMyXA',
    userInfo: {"_id":"5e1822c318d29b2a1034d85d","status":1,"phone":"13768131090","username":"李小刚","role":"student","school":"5e18218c18d29b2a1034d84b","number":"201612700247","college":"5e1821c618d29b2a1034d84f","grade":"5e1821cb18d29b2a1034d850","major":"5e1821d418d29b2a1034d851","class":"5e1821d818d29b2a1034d852","createdAt":"2020-01-10T07:07:47.457Z","updatedAt":"2020-01-15T02:06:42.526Z","__v":0,"openid":"oC6Q_5YcQ6UQpC3IdTrNpJWK2KGg","majorInfo":{"_id":"5e1821d418d29b2a1034d851","name":"电子科学与技术","pid":"5e1821cb18d29b2a1034d850","path":",0,5e18218c18d29b2a1034d84b,5e1821c618d29b2a1034d84f,5e1821cb18d29b2a1034d850,","layer":3,"type":"major","createdAt":"2020-01-10T07:03:48.724Z","updatedAt":"2020-01-10T07:03:48.724Z","__v":0},"classInfo":{"_id":"5e1821d818d29b2a1034d852","name":"电科班","pid":"5e1821d418d29b2a1034d851","path":",0,5e18218c18d29b2a1034d84b,5e1821c618d29b2a1034d84f,5e1821cb18d29b2a1034d850,5e1821d418d29b2a1034d851,","layer":4,"type":"class","createdAt":"2020-01-10T07:03:52.814Z","updatedAt":"2020-01-10T07:03:52.814Z","__v":0},"gradeInfo":{"_id":"5e1821cb18d29b2a1034d850","name":"2016级","pid":"5e1821c618d29b2a1034d84f","path":",0,5e18218c18d29b2a1034d84b,5e1821c618d29b2a1034d84f,","layer":2,"type":"grade","createdAt":"2020-01-10T07:03:39.851Z","updatedAt":"2020-01-10T07:03:39.851Z","__v":0},"collegeInfo":{"_id":"5e1821c618d29b2a1034d84f","name":"电子工程学院","pid":"5e18218c18d29b2a1034d84b","path":",0,5e18218c18d29b2a1034d84b,","layer":1,"type":"college","createdAt":"2020-01-10T07:03:34.083Z","updatedAt":"2020-01-10T07:03:34.083Z","__v":0},"schoolInfo":{"_id":"5e18218c18d29b2a1034d84b","name":"广西师范大学","path":",0,","layer":0,"type":"school","createdAt":"2020-01-10T07:02:36.114Z","updatedAt":"2020-01-10T07:02:36.114Z","__v":0}},
    currentTask: null
  }
})