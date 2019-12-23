Page({
  data: {
    record: [],
    hide: 0
  },
  onLoad: function(){
    this.record();
  },
  record: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/record',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        that.setData({
          record: res.data
        })
      }
    })
  },
  // longTap: function (e) {
  //   this.setData({
  //     id: e.currentTarget.dataset.id,
  //     hide: 1
  //   })
  //   return false;
  //   wx.showModal({
  //     title: '提示',
  //     content: '长按事件被触发',
  //     showCancel: false
  //   })
  // }
})