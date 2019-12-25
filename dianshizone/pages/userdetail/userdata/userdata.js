const app = getApp();

Page({
  data:{
    uid: 0,
    avatarurl: '',
    nickname: '',
    imgsrc: '',
    hiden: 0,
    age: 0
  },
  onLoad: function(e){
    var that = this;
    that.setData({
      avatarurl: wx.getStorageSync('userinfo').avatarurl,
      nickname: wx.getStorageSync('userinfo').nickname,
      age: wx.getStorageSync('userinfo').age
    })
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)
  },
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    // var pics = that.data.pics;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var imgsrc = res.tempFilePaths;
        that.setData({
          imgsrc: imgsrc,
          avatarurl: imgsrc
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  submit: function(e){
    var that = this;
    that.setData({
      nickname: e.detail.value.nickname,
      age: e.detail.value.age
    })
    if(that.data.imgsrc != ''){
      wx.uploadFile({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads',
        filePath: that.data.imgsrc[0],
        name: "file",
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          method: 'POST'   //请求方式
        },
        success: function (res) {
          that.setData({
            imgsrc: res.data
          })
          that.submits();
        }
      })
    }else{
      that.setData({
        imgsrc: that.data.avatarurl
      })
      that.submits();
    } 
  },
  submits: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/updateUser',
      data: {
        uid: wx.getStorageSync('userinfo').id,
        avatarurl: that.data.imgsrc,
        nickname: that.data.nickname,
        age: that.data.age
      },
      success: function (res) {
        var userinfo = wx.getStorageSync('userinfo');
        console.log(res);
        if (res.data == 1) {
          userinfo.avatarurl = that.data.imgsrc;
          userinfo.nickname = that.data.nickname;
          userinfo.age = that.data.age;
          wx.setStorageSync('userinfo', userinfo);
          wx.showToast({
            title: '修改成功'
          })
        } else {
          wx.showToast({
            title: '修改失败'
          })
        }
      }
    })
  }
})