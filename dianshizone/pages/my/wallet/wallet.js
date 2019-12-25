Page({
  data:{
    userListInfo: [
      {
        icon: "../../../images/sm.png",
        text: '实名认证',
        url: "./realname/realname",
        hidden: true
      },
      {
        icon: "../../../images/yhk.png",
        text: '银行卡',
        url: "./bankcard/bankcard",
        hidden: false
      },
      {
        icon: "../../../images/jy.png",
        text: '交易记录',
        url: "./record/record",
        hidden: true
      },
      ,
      {
        icon: "../../../images/hy.png",
        text: '开通会员',
        url: "./record/record",
        hidden: true
      },
      {
        icon: "../../../images/zz.png",
        text: '转账',
        url: "./record/record",
        hidden: true
      },
      {
        icon: "../../../images/lq.png",
        text: '税费缴纳明细',
        url: "./record/record",
        hidden: true
      }
    ],
    balance: 0,
    integral: 0
  },
  onLoad: function(){
    this.isreal();
    this.balance();
  },
  onShow: function(){
    this.isreal();
    this.balance();
  },
  //查询用户余额
  balance: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/wallet',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        that.setData({
          balance: res.data.balance,
          integral: res.data.integral
        })
      }
    })
  },
  //查询用户是否已实名认证
  isreal: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/isreal',
      data: {
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        if(res.data == 1){
          var list = that.data.userListInfo;
          list[0].hidden = false;
          list[1].hidden = true;
          that.setData({
            userListInfo: list
          })
        }
      }
    })
  }
})