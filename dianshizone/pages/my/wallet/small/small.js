Page({
  data:{
    balance: 0
  },
  onLoad: function(){
    this.balance();
  },
  onShow:function(){
    this.balance();
  },
  jump: function(){
    wx.navigateTo({
      url:'./recharge/recharge',
    })
  },
  jumps: function () {
    wx.navigateTo({
      url: './withdraw/withdraw',
    })
  },
  //查询用户余额
  balance: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/wallet',
      data: {
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        that.setData({
          balance: res.data.balance
        })
      }
    })
  }
})