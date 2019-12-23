Page({
  data:{
    type:0,
    res: []
  },
  onLoad:function(e){
    var that = this;
    this.setData({
      type: e.type
    })
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/news',
      data:{
        type: e.type,
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        console.log(res.data);
        if(res.data != 2){
          that.setData({
            res: res.data
          })
          wx.createSelectorQuery().select('.all').boundingClientRect(function (rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
              scrollTop: rect.bottom
            })
          }).exec()
        }
      }
    })
  }
})