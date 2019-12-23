var app = getApp();
import WxValidate from '../../../../utils/WxValidate.js';
Page({
  data: {
    
  },
  onLoad: function () {
    var that = this;
    this.initValidate();
    
  },
  formSubmit: function (e) {
    var that = this;
    var info = wx.getStorageSync('userinfo');
    let issueInfo = e.detail.value;
    if (!that.WxValidate.checkForm(issueInfo)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/honor',
      data:{
        uid: wx.getStorageSync('userinfo').id,
        content: e.detail.value.content
      },
      success: function(res){
        if (res.data == 1) {
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000) //延迟时间
            }
          })
        }
      }
    })
  },
  //表单验证
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      content: {
        required: true,
        maxlength: 128
      },
    }
    const messages = {
      content: {
        required: '请输入内容',
        minlength: '最多只能输入128个字符'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

})