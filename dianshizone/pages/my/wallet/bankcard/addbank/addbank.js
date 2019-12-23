var bankCard = require('../../../../../utils/bankCard.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInputCardNum: '', // 银行卡账号
    cardlen: 0,
    bankName: '', // 银行名字
    cardType: '', // 银行卡类型
    user: '',// 持卡人姓名
    phone: '' // 持卡人手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 账号输入框的监听事件
  bankcardInput: function (e) {
    var card = e.detail.value;


    // 格式
    var len = card.length
    //判断用户是输入还是回删
    if (len > this.data.cardlen) {
      //用户输入
      if ((len + 1) % 5 == 0) {
        card = card + ' '
      }
    } else {
      //用户回删
      card = card.replace(/(^\s*)|(\s*$)/g, "")
    }
    //将处理后的值赋予到输入框
    this.setData({
      userInputCardNum: card
    })
    //将每次用户输入的卡号长度赋予到长度中转站
    this.setData({
      cardlen: len
    });
    let cardNum = this.data.userInputCardNum.replace(/\s*/g, ""); // 格式化字符串的空格
    var temp = bankCard.bankCardAttribution(cardNum);
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    }
    else {
      this.setData({
        cardType: temp.bankName + temp.cardTypeName,
      })
    }
  },
  // 卡类型事件
  bankcardTypeInput: function (e) {
    let cardTypeInput = e.detail.value;
    this.setData({
      cardType: cardTypeInput
    })
  },
  formSubmit: function(e){
    var that = this;
    var arr = e.detail.value;
    if(arr.number == ''){
      wx.showModal({
        content: '请输入银行卡号',
        showCancel: false,
      })
      return false;
    }
    if (arr.type == '') {
      wx.showModal({
        content: '请输入类型',
        showCancel: false,
      })
      return false;
    }
    if (arr.name == '') {
      wx.showModal({
        content: '请输入持卡人姓名',
        showCancel: false,
      })
      return false;
    }
    if (arr.phone == '') {
      wx.showModal({
        content: '请输入预留手机号',
        showCancel: false,
      })
      return false;
    }
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/addbank',
      method: 'POST',
      data:{
        uid: wx.getStorageSync('userinfo').id,
        number: arr.number,
        type: arr.type,
        name: arr.name,
        phone: arr.phone
      },
      success: function(res){
        if(res.data == 1){
          wx.navigateBack({
            delta: 1,  // 返回上一级页面。
          })
        }
      }
    })
  }
})