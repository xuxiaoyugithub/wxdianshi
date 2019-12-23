Page({
  data:{
    userListInfo:[
      {
        icon: "../../images/qianbao.png",
        text: '我的钱包',
        url: "./wallet/wallet"
      },
      {
        icon: "../../images/jl.png",
        text: '在线简历',
        url: "./resume/resume"
      },
      {
        icon: "../../images/release.png",
        text: '我的发布',
        url: "./task/task"
      },
      {
        icon: "../../images/sq.png",
        text: '我的申请',
        url: "./tasks/tasks"
      },
      {
        icon: "../../images/pj.png",
        text: '我的评价',
        url: "./evaluat/evaluat"
      }
    ],
    info: [],
    uid: 0,
    integral: 0,
    series: 0,
    credit: 0,
    state: 0
  },
  onLoad:function(){
    var that = this;
    if (wx.getStorageSync('userinfo')) {
      that.setData({
        uid: wx.getStorageSync('userinfo').id
      })
      that.num();
      that.lookup();
      var len = wx.getStorageSync('userinfo').nickname.length;
      if(len >= 6){
        var nickname = wx.getStorageSync('userinfo').nickname.substr(0,6);
        nickname = nickname + '..';
      }else{
        var nickname = wx.getStorageSync('userinfo').nickname;
      }
      that.setData({
        avatarurl: wx.getStorageSync('userinfo').avatarurl,
        nickname: nickname
      })
    }
  },
  onShow: function(){
    var that = this
    if (wx.getStorageSync('userinfo') != []){
      var len = wx.getStorageSync('userinfo').nickname.length;
      if (len >= 6) {
        var nickname = wx.getStorageSync('userinfo').nickname.substr(0, 6);
        nickname = nickname + '..';
      } else {
        var nickname = wx.getStorageSync('userinfo').nickname;
      }
      //更新数据
      that.setData({
        info: wx.getStorageSync('userinfo'),
        uid: wx.getStorageSync('userinfo').id,
        avatarurl: wx.getStorageSync('userinfo').avatarurl,
        nickname: nickname
      })
      that.num();
    }
    that.lookup();
  },
  num: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/myFollow',
      data: {
        uid: that.data.uid
      },
      success: function (res) {
        that.setData({
          // scount: res.data.scount,
          // follow: res.data.follow,
          // fans: res.data.fans
          credit: res.data.credit,
          integral: res.data.integral,
          series: res.data.series,
        })
      }
    })
  },
  lookup: function(){
    var that = this;
    if (wx.getStorageSync('userinfo') != []){
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/lookup',
        data: {
          uid: that.data.uid
        },
        success: function (res) {
          if (res.data != 3) {
            that.setData({
              state: res.data
            })
          } else {
            that.setData({
              state: 3
            })
          }
        }
      })
    }
  },
  jump: function(e){
    var info = wx.getStorageSync('userinfo');
    if(info == []){
      // if (e.currentTarget.dataset['text'] == '在线简历'){
        // wx.showToast({
        //   title: '请先登录',
        //   icon: 'error',
        //   duration: 2000,
        //   mask: true,
        // })
      // }
      wx.showModal({
        title: '未登录',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false;
    }
  },
  switchChange: function(e){
    if (e.detail.value == true){
      var state = 1;
    }else{
      var state = 0;
    }
    this.setData({
      state: state
    })
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/save',
      data:{
        state: state,
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        if(res.data == 1){
          console.log('修改成功');
        }
      }
    })
  }
})