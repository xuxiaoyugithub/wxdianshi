var app = getApp();
Page({
  data: {
    subtypes: []
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/subtypes', //接口
      data:{
        id: options.id
      },
      success: function (res) {
        that.setData({
          subtypes: res.data,
        })
      }
    })
  },
  jump: function(res){
    app.globalData.id = res.currentTarget.dataset.id;
    app.globalData.name = res.currentTarget.dataset.name;
    wx.redirectTo({
      url: '../release'
    })
  }
})