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
    // textarea
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变) 
    pics: [],
    content: '',
    title: '',
    // select: false,
    // grade_name: '--请选择--',
    // grades: [
    //   {
    //     id: 2,
    //     name:'其他'
    //   }
    // ],
    // value: 0,
    selects: false,
    grade_names: '--请选择--',
    gradess: [],
    values: 0
  },
  // bindShowMsg() {
  //   this.setData({
  //     select: !this.data.select
  //   })
  // },
  bindShowMsgs() {
    this.setData({
      selects: !this.data.selects
    })
  },
  // mySelect(e) {
  //   var name = e.currentTarget.dataset.name
  //   this.setData({
  //     grade_name: name,
  //     select: false,
  //     value: e.currentTarget.dataset.id
  //   })
  // },
  mySelects(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      grade_names: name,
      selects: false,
      values: e.currentTarget.dataset.id
    })
  },
  //标题
  input: function(e){
    var value = e.detail.value;
    this.setData({
      title: value
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
    app.uploadimg({
      url: 'https://........',//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  onLoad: function (options) {
    var that = this;
    // if (wx.getStorageSync('userinfo') == []){
    //   wx.showToast({
    //     title: '请先登录'
    //   })
    //   setTimeout(function(){
    //     wx.navigateBack({
    //       delta: 1, // 回退前 delta(默认为1) 页面 
    //       success: function (res) {
    //         // success 
    //       },
    //       fail: function () {
    //         // fail 
    //       },
    //       complete: function () {
    //         // complete 
    //       }
    //     }) 
    //   },1000)
    // }
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/type', //接口
      success: function (res) {
        that.setData({
          gradess: res.data
        })
      }
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
  submit: function (e) {
    var that = this;
    var pics = that.data.pics;
    var content = that.data.content;
    var uid = wx.getStorageSync('userinfo').id;
    var path = '';
    // if(that.data.value == 0){
    //   wx.showToast({
    //     title: '请选择类别1',
    //     icon: 'error',
    //     duration: 500,
    //     mask: true,
    //   })
    //   return false;
    // }
    if (that.data.values == 0) {
      wx.showToast({
        title: '请选择类别2',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (that.data.title == '') {
      wx.showToast({
        title: '请填写标题',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (that.data.content == '') {
      wx.showToast({
        title: '请填写内容',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if(pics != []){
      for (var i = 0; i <= that.data.pics.length - 1; i++) {
        wx.uploadFile({
          url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads',
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
            path += res.data + ',';
          }
        })
      }
    }
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    setTimeout(function () {
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/index/release',
        method: 'POST',
        data: {
          uid: uid,
          photo: path,
          content: content,
          title: that.data.title,
          tid: that.data.values,
          // top: that.data.value
        },
        success: function (res) {
          if (res.data == 1) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }, 1000)
  }
})