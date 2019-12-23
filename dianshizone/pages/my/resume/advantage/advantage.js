var app = getApp();
import WxValidate from '../../../../utils/WxValidate.js';
Page({
  data:{
    id: 0,
    res: []
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    that.initValidate();
    that.setData({
      id: options.id
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/advantage',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'Cookie': 'SESSION=' + wx.getStorageSync("sessionId")
      }, // 设置请求的 header
      data: {
        id: id,
      },
      success: function (res) {
        that.setData({
          res: res.data
        })
      },
      fail: function () {
        app.consoleLog("请求数据失败");
      },
      complete: function () {
        // complete 
      }
    })
  },
  formSubmit:function(e){
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
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/doAdvantage',
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': "application/x-www-form-urlencoded",
        'Cookie': 'SESSION=' + wx.getStorageSync("sessionId")
      }, // 设置请求的 header
      data: {
        id:that.data.id,
        content: e.detail.value.advantage,
        uid: info.id
      },
      success: function (res) {
        if(res.data){
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
      },
      fail: function () {
        app.consoleLog("请求数据失败");
      },
      complete: function () {
        // complete 
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
      advantage: {
        required: true,
        maxlength: 128
      }
    }
    const messages = {
      advantage: {
        required: '请输入个人优势',
        minlength: '最多只能输入128个字符'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
})