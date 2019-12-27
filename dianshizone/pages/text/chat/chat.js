const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
  // msgList = [{
  //   speaker: 'server',
  //   contentType: 'text',
  //   content: '欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！'
  // },
  // {
  //   speaker: 'customer',
  //   contentType: 'text',
  //   content: '我怕是走错片场了...'
  // }
  // ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({ title: options.nickname })
    initData(this);
    this.setData({
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
      other_pic: options.avatarurl,
      other_id: options.uid,
      user_id: wx.getStorageSync('userinfo').id
    });
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/online',
      data: {
        user_id: that.data.user_id,
        other_id: that.data.other_id
      },
      success: function (res) {

      }
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/chatdetail',
      data: {
        user_id: that.data.user_id,
        other_id: that.data.other_id
      },
      success: function (res) {
        that.setData({
          msgList: res.data
        })
      }
    })
  },
  onUnload: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/nonline',
      data:{
        user_id: that.data.user_id,
        other_id: that.data.other_id
      },
      success: function(res){

      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    var that = this;
    var list = that.data.msgList;
    list.push({
      speaker: 'user',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    this.setData({
      msgList: list,
      inputVal
    });
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/firstChat',
      data:{
        user_id: that.data.user_id,
        other_id: that.data.other_id
      },
      success: function(res){
        that.setData({
          chat_id: res.data
        })
        wx.request({
          url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/chat/send',
          data:{
            user_id: that.data.other_id,
            chat_id: that.data.chat_id,
            content: e.detail.value
          },
          success: function(res){
            console.log(res);
          }
        })
      }
    })
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})