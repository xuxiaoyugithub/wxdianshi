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
        text: '申请中'
      },
      {
        text: '等待接受'
      },
      {
        text: '已接受'
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
    click: false,
  },
  onLoad: function () {
    
  },
  //事件处理函数
  onShow: function () {
    var that = this;
    that.setData({
      click: true
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/tasks/index',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        uid: wx.getStorageSync('userinfo').id,
        status: that.data.currentTab
      },
      success: function (res) {
        that.setData({
          list: res.data
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
    // var that = this;
    var cur = event.currentTarget.dataset.current;
    var status = event.currentTarget.dataset.id;
    //每个tab选项宽度占1/5
    var singleNavWidth = that.data.windowWidth / 5;
    //tab选项居中                            
    that.setData({
      navScrollLeft: (cur - 2) * singleNavWidth,
      click: false
    })
    if (that.data.currentTab == cur) {
      setTimeout(function () {
        that.setData({
          click: true
        })
      }, 500)
      return false;
    } else {
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/tasks/index', //接口
        data: {
          uid: wx.getStorageSync('userinfo').id,
          status: cur
        },
        success: function (res) {
          that.setData({
            list: res.data,
            currentTab: cur
          })
          setTimeout(function () {
            that.setData({
              click: true
            })
          }, 500)
        }
      })
    }
  }, 1000),
  switchTab: util.throttle(function (that, event) {
    // var that = this;
    var cur = event.detail.current;
    var singleNavWidth = that.data.windowWidth / 5;
    that.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/tasks/index', //接口
      data: {
        uid: wx.getStorageSync('userinfo').id,
        status: cur
      },
      success: function (res) {
        that.setData({
          list: res.data,
          currentTab: cur
        })
      }
    })
  }, 1000),
})