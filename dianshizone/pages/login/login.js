var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true,
    avatarUrl: "",//用户头像
    nickName: "",//用户昵称
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
    //           // 根据自己的需求有其他操作再补充
    //           // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
    //           wx.login({
    //             success: res => {
    //               // 获取到用户的 code 之后：res.code
    //               console.log("用户的code:" + res.code);
    //               // 可以传给后台，再经过解析获取用户的 openid
    //               // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
    //               wx.request({
    //                   // 自行补上自己的 APPID 和 SECRET
    //                   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
    //                   success: res => {
    //                       // 获取到用户的 openid
    //                       console.log("用户的openid:" + res.data.openid);
    //                   }
    //               });
    //             }
    //           });
    //         }
    //       });
    //     } else {
    //       // 用户没有授权
    //       // 改变 isHide 的值，显示授权页面
    //       that.setData({
    //         isHide: true
    //       });
    //     }
    //   }
    // });
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },
  bindGetUserInfo(res) {
    let info = res;
    if (info.detail.userInfo) {
      console.log("点击了同意授权");
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/login',
              data: {
                code: res.code,
                nickName: info.detail.userInfo.nickName,
                city: info.detail.userInfo.city,
                province: info.detail.userInfo.province,
                avatarUrl: info.detail.userInfo.avatarUrl
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                var userinfo = {};
                userinfo = res.data;
                // userinfo['id'] = res.data;
                // userinfo['nickName'] = info.detail.userInfo.nickName;
                // userinfo['avatarUrl'] = info.detail.userInfo.avatarUrl;
                wx.setStorageSync('userinfo', userinfo);
                wx.setStorageSync('login', 1);
                wx.showToast({
                  title: '登录成功',
                  icon: 'succes',
                  duration: 500,
                  mask: true,
                  success: function () {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }, 1000) //延迟时间
                  }
                })
              }
            })
          } else {
            console.log("授权失败");
          }
        },
      })

    } else {
      console.log("点击了拒绝授权");
    }
  }

  // bindGetUserInfo: function (e) {
  //   if (e.detail.userInfo) {
  //     //用户按了允许授权按钮
  //     var that = this;
  //     // 获取到用户的信息了，打印到控制台上看下
  //     console.log("用户的信息如下：");
  //     console.log(e.detail.userInfo);
      
  //     //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
  //     that.setData({
  //       isHide: false
  //     });
  //     //
  //     wx.login({
  //       success: res => {
  //         if (res.code) {
  //           console.log(this.data.nickName);
  //           wx.request({

  //             url: 'http://localhost:801/think-5.0.7/public/index/login/login', //接口
  //             method: 'GET',
  //             header: {
  //               'Content-Type': 'application/json',
  //             },
  //             data: {
  //               code: res.code,
  //               nickName: this.data.nickName,
  //               avatarUrl: this.data.avatarUrl
  //             },

  //             success: function (res) {
  //               app.globalData.userInfo = res.data;
  //               wx.switchTab({
  //                 url: '../index/index'
  //               })
  //             }

  //           })

  //         } else {

  //           console.log('获取code失败' + res.errMsg)

  //         }
  //       }
  //     })
  //     //
  //   } else {
  //     //用户按了拒绝按钮
  //     wx.showModal({
  //       title: '警告',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         // 用户没有授权成功，不需要改变 isHide 的值
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     });
  //   }
  // }
})
