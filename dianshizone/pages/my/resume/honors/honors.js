var app = getApp();
Page({
  data: {
    id: 0,
    res: [],
    hide: 0,
    hides: 0,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/catHonor',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        id: that.data.id,
      },
      success: function (res) {
        that.setData({
          res: res.data,
        })
      },
      fail: function () {
        app.consoleLog("请求数据失败");
      },
      complete: function () {
        // complete 
      }
    })
  },
  formSubmit: function (e) {
    var that = this;
    //提交

  },
  hide: function () {
    this.setData({
      hide: 1
    })
  },
  hides: function () {
    this.setData({
      hides: 1
    })
  }
})