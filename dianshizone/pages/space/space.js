const util = require('../../utils/util.js')
Page({
  data:{
    res:[],
    focusInput: false,
    height: '',
    isInput: false,
    value: '',
    message: [],
    reply: [],
    uid: 0,
    plnum: 0,
    tips:'说点什么吧',
    rid: 0,
    likes: 0,
    isLike: false,
    hiden: 0
  },
  onLoad:function(e){
    var that = this;
    if (wx.getStorageSync('userinfo') != []){
      that.setData({
        uid: wx.getStorageSync('userinfo').id
      })
    }
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/details', //接口
      data: {
        id: e.id,
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          res: res.data.res,
          message: res.data.message,
          plnum: res.data.plnum,
          reply: res.data.reply,
          likes: res.data.likes,
          isLike: res.data.isLike
        })
      }
    })
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)
  },
  //转发文章
  onShareAppMessage: function (e) {
    if (e.from === 'button') {

    }
    return {
      title: '转发 ' + this.data.res.title,
      path: 'pages/space/space?id='+this.data.res.id,
      success: function (res) {
        console.log('成功', res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  share:function(options){
    console.log(options.target.dataset.url);
    wx.navigateTo({
      url: '../share/share?id=1',
    })
  },
  inputFocus(e) {
    this.setData({
      height: e.detail.height,
      isInput: true
    })
  },
  blur: function(e){
    this.setData({
      isInput: false,
      value: '',
      tips: '说点什么吧',
    })
  },
  inputBlur(e) {
    var that = this;
      wx.request({
        url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/message',
        method: 'post',
        data:{
          uid: wx.getStorageSync('userinfo').id,
          sid: that.data.res.id,
          content: e.detail.value.content
        },
        success: function(res){
          if(res.data){
            that.setData({
              message: res.data.message,
              plnum: res.data.plnum,
              reply: res.data.reply,
              isInput: false,
              value: '',
              tips: '说点什么吧',
              rid: 0
            })
          }
        }
      })
  },
  //回复
  reply: function(e){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/reply',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userinfo').id,
        rid: that.data.rid,
        sid: that.data.res.id,
        mid: that.data.mid,
        reid: that.data.reid,
        content: e.detail.value.content
      },
      success: function (res) {
        console.log(res);
        if (res.data) {
          that.setData({
            reply: res.data,
            isInput: false,
            value: '',
            tips: '说点什么吧',
            rid: 0
          })
        }
      }
    })
  },

  focusButn: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.reid == undefined){
      this.setData({
        focusInput: true,
        isInput: true,
        rid: e.currentTarget.dataset.uid,
        mid: e.currentTarget.dataset.id,
        reid: 0,
        tips: '回复' + e.currentTarget.dataset.nickname
      })
    } else if (e.currentTarget.dataset.reid != undefined) {
      this.setData({
        focusInput: true,
        isInput: true,
        rid: e.currentTarget.dataset.uid,
        mid: e.currentTarget.dataset.id,
        reid: e.currentTarget.dataset.reid,
        tips: '回复' + e.currentTarget.dataset.nickname
      })
    }else{
      this.setData({
        focusInput: true,
        isInput: true
      })
    }
  },
  login: function(){
    this.setData({
      isInput: false,
    })
  },
  logins: function(){
    wx.navigateTo({

      url: "/pages/login/login"

    })
  },
  //点赞
  likes: util.throttle(function (that, e) {
    wx.request({
      url:"https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/likes",
      data:{
        uid: wx.getStorageSync('userinfo').id,
        sid: that.data.res.id
      },
      success: function(res){
        if(res.data == 1){
          that.setData({
            likes: that.data.likes+1,
            isLike: !that.data.isLike
          })
        }
      }
    })
  },1000),
  //取消点赞
  cancleLike: util.throttle(function (that,e) {
    wx.request({
      url: "https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/cancleLike",
      data: {
        uid: wx.getStorageSync('userinfo').id,
        sid: that.data.res.id
      },
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            likes: that.data.likes - 1,
            isLike: !that.data.isLike
          })
        }
      }
    })
  }, 1000),
  jump: function () {
    if (this.data.uid == 0) {
      wx.showToast({
        title: '请先登录'
      })
    }
  },
  del: function(e){
    var id = e.currentTarget.dataset.id;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/del',
      data:{
        id: id
      },
      success: function(res){
        if(res.data == 1){
          wx.showToast({
            title: '删除成功'
          })
          wx.navigateBack({
            delta: 1,  // 返回上一级页面。
          })
        }else{
          wx.showToast({
            title: '删除失败'
          })
        }
      }
    })
  },
  delMessage: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/delMessage',
      data:{
        id: e.currentTarget.dataset.id
      },
      success: function(res){
        if(res.data == 1){
          for (var i = 0; i < that.data.message.length; i++) {
            if (i == index) {
              that.data.message.splice(i, 1);
            }
          }
          that.setData({
            message: that.data.message,
            plnum: that.data.plnum - 1
          })
        }
      }
    })
  },
  delReply: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/delReply',
      data: {
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        if (res.data == 1) {
          for (var i = 0; i < that.data.reply.length; i++) {
            if (i == index) {
              that.data.reply.splice(i, 1);
            }
          }
          that.setData({
            reply: that.data.reply,
          })
        }
      }
    })
  }
})