Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: false,
    Width: '',
    Height: '',
    imagePath: '',
    img: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //进入页面是否授权，如果没授权的话授权
    let _this = this
    wx.getSetting({
      success(res) {
        //授权，如果取消授权的话 显示打开设置，进行授权，否则没有办法进行下一步
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }, fail() {
              //state默认为false 保存分享图显示
              _this.setData({
                state: true
              })
            }
          })
        } else {

        }
      }
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/image', //接口
      data:{
        id: options.id
      },
      success: function (res) {
        _this.setData({
          img: res.data
        })
      }
    })
  },
  save: function () {
    var that = this;
    var imgSrc = that.data.img;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showModal({
              content: '图片已保存到相册，赶紧晒一下吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },

  // addressAgain: function () {
  //   const _this = this
  //   wx.openSetting({
  //     success(res) {
  //       if (!res.authSetting["scope.writePhotosAlbum"]) {
  //         console.log('状态不对')

  //       } else {
  //         _this.setData({
  //           state: false
  //         })
  //       }
  //     },
  //   })
  // }
})