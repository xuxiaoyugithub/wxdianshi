//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [
      {
        text: '候选人'
      },
      {
        text: '录取'
      },
      {
        text: '完成'
      },
      {
        text: '放弃'
      },
    ],
    currentTab: 0,
    navScrollLeft: 0,
    list: [],
    oid: 0
  },
  onLoad: function(e){
    this.setData({
      oid: e.id
    })
  },
  //事件处理函数
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/candidate',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        oid: that.data.oid,
        status: that.data.currentTab
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          list: res.data,
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  switchNav: util.throttle(function (that, event) {
    var cur = event.currentTarget.dataset.current;
    var status = event.currentTarget.dataset.id;
    //每个tab选项宽度占1/5
    var singleNavWidth = that.data.windowWidth / 5;
    //tab选项居中                            
    that.setData({
      navScrollLeft: (cur - 2) * singleNavWidth,
    })

    if (that.data.currentTab == cur) {
      return false;
    } else {
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/candidate', //接口
        data: {
          oid: that.data.oid,
          status: cur
        },
        success: function (res) {
          that.setData({
            list: res.data,
            currentTab: cur
          })
        }
      })
    }
  },1000),
  switchTab: util.throttle(function (that, event) {
    var that = that;
    var cur = event.detail.current;
    var singleNavWidth = that.data.windowWidth / 5;
    that.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/candidate', //接口
      data: {
        oid: that.data.oid,
        status: cur
      },
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data,
          currentTab: cur
        })
      }
    })
  },1000),
  completion: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '要确定完成该任务吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/completion',
            data: {
              id: e.currentTarget.id
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已确认',
                  icon: 'success',
                  duration: 2000
                })
                that.onShow();
              } else {
                wx.showToast({
                  title: '失败,请重试',
                  icon: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },
  refuses: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要拒绝完成该任务吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/refuses',
            data: {
              id: e.currentTarget.id
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已确认',
                  icon: 'success',
                  duration: 2000
                })
                that.onShow();
              } else {
                wx.showToast({
                  title: '失败,请重试',
                  icon: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },
  comment: function(res){
    var uid = res.currentTarget.dataset.uid;
    var oid = res.currentTarget.dataset.oid;
    wx.redirectTo({
      url: './comment/comment?uid='+uid+'&oid='+oid
    })
  }
})