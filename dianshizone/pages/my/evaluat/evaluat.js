//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [
      {
        text: '全部'
      },
      {
        text: '好评'
      },
      {
        text: '中评'
      },
      {
        text: '差评'
      }
    ],
    currentTab: 0,
    navScrollLeft: 0,
    uid: 0,
    list: [],
    click: false
  },
  //事件处理函数
  onLoad: function (e) {
    var that = this;
    that.setData({
      click: true
    })
    if(e.uid !== undefined){
      that.setData({
        uid: e.uid
      })
    }else{
      that.setData({
        uid: wx.getStorageSync('userinfo').id
      })
    }
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/evaluate/index',
      data:{
        uid: that.data.uid,
        cur: that.data.currentTab
      },
      success:function(res){
        console.log(res);
        that.setData({
          list: res.data
        })
      }
    })
  },
  switchNav(event) {
    var that = this;
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth,
      click: false
    })
    // if (this.data.currentTab == cur) {
    //   return false;
    // } else {
      // this.setData({
      //   currentTab: cur
      // })
    // }
    if (this.data.currentTab == cur) {
      setTimeout(function () {
        that.setData({
          click: true
        })
      }, 500)
      return false;
    } else {
      console.log(123);
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/evaluate/index',
        data: {
          uid: that.data.uid,
          cur: that.data.currentTab
        },
        success: function (res) {
          console.log(res);
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
  },
  switchTab(event) {
    var that = this;
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/evaluate/index',
      data: {
        uid: that.data.uid,
        cur: that.data.currentTab
      },
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data
        })
      }
    })
  },
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
})