Page({
  data:{
    space: [],
    user: [],
    scount: 0,
    cur: 0,
    uid: 0,
    state: 0,
    users: [],
    follow: 0,
    fans: 0,
    userid: 0,
    hiden: 0
  },
  onLoad: function(e){
    var that = this;
    that.setData({
      uid: e.uid,
      userid: wx.getStorageSync('userinfo').id
    })
    that.userdetail();
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)
  },
  onShow: function(){
    this.userdetail();
  },
  userdetail: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/userdetail', //接口
      data: {
        uid: that.data.uid,
        userid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        that.setData({
          space: res.data.space,
          user: res.data.user,
          scount: res.data.scount,
          follow: res.data.follow,
          fans: res.data.fans,
          state: res.data.state
        })
      }
    })
  },
  //文章列表
  cur1: function(){
    var that = this;
    this.setData({
      cur:0
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/userdetail', //接口
      data: {
        uid: that.data.uid,
      },
      success: function (res) {
        that.setData({
          space: res.data.space,
          user: res.data.user,
          scount: res.data.scount
        })
      }
    })
  },
  //关注列表
  cur2: function () {
    var that = this;
    this.setData({
      cur: 1
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/followUsers', //接口
      data: {
        uid: that.data.uid
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          users: res.data
        })
      }
    })
  },
  //粉丝列表
  cur3: function () {
    var that = this;
    this.setData({
      cur: 2
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/fans', //接口
      data: {
        uid: that.data.uid
      },
      success: function (res) {
        that.setData({
          users: res.data
        })
      }
    })
  },
  //关注
  follow: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/follow',
      data:{
        gzid: wx.getStorageSync('userinfo').id,
        bgid: that.data.uid
      },
      success: function(res){
          that.setData({
            state: 1,
            users: res.data,
            fans: that.data.fans+1
          })
      }
    })
  },
  cancels: function(e){
    var that = this;
    var gzid = e.currentTarget.dataset.gzid;
    var bgid = e.currentTarget.dataset.bgid;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/cancels',
      data: {
        bgid: bgid,
        gzid: gzid
      },
      success: function (res) {
        console.log(res);
        that.setData({
          users: res.data.users,
          fans: that.data.fans-1,
          state: 0
        })
      }
    })
  },
  detail: function(e){
    var uid = e.currentTarget.dataset.uid;
    wx.redirectTo({
      url:'../userdetail/userdetail?uid='+uid
    })
  },
  details: function (e) {
    var uid = e.currentTarget.dataset.uid;
    wx.redirectTo({
      url: '../userdetail/userdetail?uid=' + uid
    })
  },
  chat: function(){
    var that = this;
    wx.redirectTo({
      url: '../text/chat/chat?uid=' + that.data.uid + '&nickname=' + that.data.user.nickname + '&avatarurl=' + that.data.user.avatarurl
    })
  }
})