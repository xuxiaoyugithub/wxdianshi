const app = getApp();
Page({
  data: {
    staticImg: app.globalData.staticImg,
    current: 0,
    attitude: true,
    time: true,
    efficiency: true,
    environment: true,
    professional: true,
    userStars: [
      "../../../../images/xxx.jpg",
      "../../../../images/xxx.jpg",
      "../../../../images/xxx.jpg",
      "../../../../images/xxx.jpg",
      "../../../../images/xxx.jpg",
    ],
    wjxScore: 5,
    // textarea
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变) 
    pics: [],
    content: '',
    uid: 0,
    oid: 0
  },
  // 星星点击事件
  starTap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "../../../../images/xxx.jpg";
        that.setData({
          wjxScore: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "../../../../images/yyy.jpg"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars: tempUserStars
    })
  },
  // 标签
  label: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      attitude: !e.currentTarget.dataset.index
    })
  },
  label1: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      time: !e.currentTarget.dataset.index
    })
  },
  label2: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      efficiency: !e.currentTarget.dataset.index
    })
  },
  label3: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      environment: !e.currentTarget.dataset.index
    })
  },
  label4: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      professional: !e.currentTarget.dataset.index
    })
  },
  // 留言
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len, //当前字数 
      content: value 
    });
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics,
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
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    console.log(pics);
    app.uploadimg({
      url: 'https://........',//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  onLoad: function (options) {
    this.setData({
      uid: options.uid,
      oid: options.oid
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  submit: function (){
    var that = this;
    var label = '';
    if (that.data.attitude){
      label += '服务态度好 ';
    }
    if (!that.data.time) {
      label += '用时时间短 ';
    }
    if (!that.data.efficiency) {
      label += '效率高 ';
    }
    if (!that.data.environment) {
      label += '环境好 ';
    }
    if (!that.data.professional) {
      label += '很专业 ';
    }
    var state = that.data.wjxScore;
    var pics = that.data.pics;
    var content = that.data.content;
    var plzid = wx.getStorageSync('userinfo').id;
    var path = '';
    for (var i = 0; i <= that.data.pics.length-1;i++){
      wx.uploadFile({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads', //仅为示例，非真实的接口地址
        filePath: that.data.pics[i],
        name: "file",
        async: false,
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          method: 'POST'   //请求方式
        },
        success: function (res) {
          console.log(res.data);
          path += res.data+',';
        }
      })
    }
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    setTimeout(function(){
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/comment',
        method: 'POST',
        data: {
          oid: that.data.oid,
          uid: that.data.uid,
          plzid: plzid,
          state: state,
          label: label,
          photo: path,
          content: content
        },
        success: function (res) {
          if(res.data == 1){
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    },1000)
  }
})