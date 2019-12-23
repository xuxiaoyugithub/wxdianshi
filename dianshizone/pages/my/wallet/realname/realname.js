const app = getApp();
var bankCard = require('../../../../utils/bankCard.js');
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
    back: [],
    content: '',
    title: '',
    userInputCardNum: '', // 银行卡账号
    cardlen: 0,
    bankName: '', // 银行名字
    cardType: '', // 银行卡类型
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    if(pics.length == 0){
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
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
    }
  },
  back: function (e) {//这里是选取图片的方法
    var that = this;
    var back = that.data.back;
    if (back.length == 0) {
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {

          var imgsrc = res.tempFilePaths;
          back = back.concat(imgsrc);
          that.setData({
            back: back,
          });
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    app.uploadimg({
      url: 'https://........',//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  onLoad: function (options) {

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
    var uid = wx.getStorageSync('userinfo').id;
    var path = '';
    var back = '';
    if (e.detail.value.realname == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (e.detail.value.idnumber == '') {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (e.detail.value.contact == '') {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (that.data.pics.length == 0 || that.data.back.length == 0) {
      wx.showToast({
        title: '请选择证件照',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (pics != []) {
        wx.uploadFile({
          url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads',
          filePath: that.data.pics[0],
          name: "file",
          async: false,
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            method: 'POST'   //请求方式
          },
          success: function (res) {
            path = res.data;
          }
        })
    }
    if(that.data.back != []){
      wx.uploadFile({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads',
        filePath: that.data.back[0],
        name: "file",
        async: false,
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          method: 'POST'   //请求方式
        },
        success: function (res) {
          back = res.data;
        }
      })
    }
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    setTimeout(function () {
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/realname',
        method: 'POST',
        data: {
          uid: uid,
          realname: e.detail.value.realname,
          idnumber: e.detail.value.idnumber,
          contact: e.detail.value.contact,
          positive: path,
          back: back,
          number: e.detail.value.number,
          type: e.detail.value.type,
          phone: e.detail.value.phone
        },
        success: function (res) {
          if (res.data == 1) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }, 1500)
  },
  // 账号输入框的监听事件
  bankcardInput: function (e) {
    var card = e.detail.value;


    // 格式
    var len = card.length
    //判断用户是输入还是回删
    if (len > this.data.cardlen) {
      //用户输入
      if ((len + 1) % 5 == 0) {
        card = card + ' '
      }
    } else {
      //用户回删
      card = card.replace(/(^\s*)|(\s*$)/g, "")
    }
    //将处理后的值赋予到输入框
    this.setData({
      userInputCardNum: card
    })
    //将每次用户输入的卡号长度赋予到长度中转站
    this.setData({
      cardlen: len
    });
    let cardNum = this.data.userInputCardNum.replace(/\s*/g, ""); // 格式化字符串的空格
    var temp = bankCard.bankCardAttribution(cardNum);
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    }
    else {
      this.setData({
        cardType: temp.bankName + temp.cardTypeName,
      })
    }
  },
  // 卡类型事件
  bankcardTypeInput: function (e) {
    let cardTypeInput = e.detail.value;
    this.setData({
      cardType: cardTypeInput
    })
  }
})