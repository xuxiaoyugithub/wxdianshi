const app = getApp();
Page({
  data:{
    name: app.globalData.gsname,
    industry: app.globalData.industry
  },
  onLoad: function(){
    var that = this;
    that.setData({
      name: app.globalData.gsname,
      industry: app.globalData.industry
    })
  },
  formBindsubmit: function(e){
    if (e.detail.value.name == '') {
      const error = { param: 'title', msg: '请输入公司名称', value: "" }
      this.showModal(error)
      return false
    }
    if (e.detail.value.industry == '') {
      const error = { param: 'title', msg: '请输入行业', value: "" }
      this.showModal(error)
      return false
    }
    app.globalData.gsname = e.detail.value.name;
    app.globalData.industry = e.detail.value.industry;
    wx.redirectTo({
      url: '../fillin/fillin',
    })
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  }
})