Page({
  data:{
    balance: 0,
    money: 0
  },
  onLoad: function(){
    this.balance();
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
          balance: res.data
        })
      }
    })
  },
  submit: function(e){
    var that = this;
    if(e.detail.value.money > that.data.balance){
      wx.showModal({
        title: '余额不足',
        content: '余额不足请重新输入提现金额',
      })
    }else{
      if (e.detail.value.money < 20){
        wx.showModal({
          title: '提现额度过小',
          content: '提现金额必须大于20',
        })
      }else{
        that.setData({
          money: e.detail.value.money
        })
        that.withdraw();
      }
    }
  },
  //提现余额方法
  withdraw: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/wallet',
      data:{
        openid: wx.getStorageSync('userinfo').openid,
        money: that.data.money
      },
      success: function (res){
        console.log(res);
        that.reduce();
      }
    })
  },
  //提现成功后余额减少
  reduce: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/reduce',
      data:{
        uid: wx.getStorageSync('userinfo').id,
        money: that.data.money
      },
      success: function(res) {
        if(res.data == 1){
          wx.navigateBack({
            delta: 1,  // 返回上一级页面。
          })
        }
      }
    })
  }
})