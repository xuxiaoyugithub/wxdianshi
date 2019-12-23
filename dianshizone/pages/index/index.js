const util = require('../../utils/util.js')
Page({
  data:{
    banner: [],
    page: 0,
    limit: 5,
    space: [],
    uid: 0,
    hiden: 0
  },
  onShow: function(){
    var that = this;
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 2000)
    if (wx.getStorageSync('userinfo') != []){
      that.setData({
        uid: wx.getStorageSync('userinfo').id
      })
      that.interrupt();
    }
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/banner', //接口
      success: function (res) {
        that.setData({
          banner: res.data
        })
      }
    })
    that.space();
  },
  space: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index',
      data: {
        page: that.data.page,
        limit: that.data.limit,
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        that.setData({
          space: res.data
        })
      }
    })
  },
  //点赞
  likes: util.throttle(function (that, e) {
    wx.request({
      url: "https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/likes",
      data: {
        uid: wx.getStorageSync('userinfo').id,
        sid: e.currentTarget.dataset.sid
      },
      success: function (res) {
        var space = that.data.space;
        if (res.data == 1) {
          for(var i=0;i<=space.length-1;i++){
            if (e.currentTarget.dataset.index == i){
              space[i].islike = 1;
              space[i].dznum = space[i].dznum + 1;
            }
          }
          that.setData({
            space: space
          })
        }
      }
    })
  }, 1000),
  //取消点赞
  cancleLike: util.throttle(function (that, e) {
    wx.request({
      url: "https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/cancleLike",
      data: {
        uid: wx.getStorageSync('userinfo').id,
        sid: e.currentTarget.dataset.sid
      },
      success: function (res) {
        var space = that.data.space;
        if (res.data == 1) {
          for (var i = 0; i <= space.length - 1; i++) {
            if (e.currentTarget.dataset.index == i) {
              space[i].islike = null;
              space[i].dznum = space[i].dznum - 1;
            }
          }
          that.setData({
            space: space
          })
        }
      }
    })
  }, 1000),
  //检查用户是否中断连续签到
  interrupt: function(){
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/sign/interrupt',
      data:{
        uid: wx.getStorageSync('userinfo').id,
      },
      success: function(res){
        if(res.data == 1){
          console.log('已中断');
        }else{
          console.log('未中断');
        }
      }
    })
  },
  jump: function () {
    if (this.data.uid == 0) {
      wx.showToast({
        title: '请先登录'
      })
    }
  },
  jump1: function(){
    wx.navigateTo({
      url: './sign/sign'
    })
  },
  jump2: function () {
    wx.navigateTo({
      url: './hottask/hottask'
    })
  },
  jump3: function () {
    wx.navigateTo({
      url: './fealty/fealty'
    })
  },
  jump4: function () {
    wx.navigateTo({
      url: './course/course'
    })
  }
})
