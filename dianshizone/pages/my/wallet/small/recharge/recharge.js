Page({
  data:{
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
    total_fee: 0
  },
  // onLoad: function () {
  //   this.showInputLayer();
  // },
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function () {
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {
    /**获取输入的密码**/
    var val = this.data.pwdVal;
    /**在这调用支付接口**/
    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
      /**弹框**/
      wx.showToast({
        title: val,
      })
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });

    if (e.detail.value.length >= 6) {
      this.hidePayLayer();
    }
  },
  submit: function(e){
    var that = this;
    that.setData({
      total_fee: e.detail.value.money
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/payment/pay',
      method: "POST",
      data: {
        total_fee: e.detail.value.money,
        openid: wx.getStorageSync('userinfo').openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {  //后端返回的数据
        var data = res.data;
        console.log(data);
        console.log(data["timeStamp"]);
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function (res) {
            that.addBalance();
            wx.showModal({
              title: '充值成功',
              content: '',
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },
  //充值成功后添加余额
  addBalance: function(){
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/addBalance',
      data:{
        uid: wx.getStorageSync('userinfo').id,
        total_fee: that.data.total_fee
      },
      success: function(res){
        console.log(res.data);
        if (res.data == 1) {
          wx.navigateBack({
            delta: 1,  // 返回上一级页面。
          })
        }
      }
    })
  }
})