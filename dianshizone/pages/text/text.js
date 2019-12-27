//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    uid:0,
    currentTab:0,
    private: 0,
    notice: 0,
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    system: 0,
    likes: 0,
    message: 0,
    follow: 0,
    count: 0,
    chatlist: []
  },
  onShow:function(){
    var that = this;
    if (wx.getStorageSync('userinfo') != []){
      that.setData({
        uid: wx.getStorageSync('userinfo').id
      })
    }
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/number',
      data: {
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        that.setData({
          private: res.data.private,
          notice: res.data.notice
        })
      }
    })
    that.chatlist();
    that.notice();
  },
  //聊天者列表
  chatlist: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/chatlist',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        console.log(res.data);
        that.setData({
          chatlist: res.data
        })
      }
    })
  },
  //事件处理函数
  clickTab: function(event){
    var cur = event.currentTarget.dataset.current;
    this.setData({
      currentTab: cur,
    });
    if(cur == 1){
      this.notice();
    }
  },
  private: function(){

  },
  notice: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/notice',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        that.setData({
          system: res.data.system,
          likes: res.data.likes,
          message: res.data.message,
          follow: res.data.follow,
          count: res.data.count
        })
      }
    })
  },
  //去登陆
  wxdl: function () {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    var that = this;
    that.chatlist();
    setTimeout(function () {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  }
})
