Page({
  data:{
    res: []
  },
  onLoad: function(e){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/corddetail',
      data: {
        id:e.id
      },
      success: function (res) {
        that.setData({
          res: res.data
        })
      }
    })
  },
})