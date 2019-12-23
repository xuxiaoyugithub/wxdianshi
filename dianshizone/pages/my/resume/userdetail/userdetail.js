var app = getApp();
import WxValidate from '../../../../utils/WxValidate.js';
Page({
  data:{
    res: [],
    // hdie: false,
    // hiden: false,
    upload: false,
    pics: [],
    // 多列选择器(二级联动)列表设置,及初始化
    multiArray: [['小学','初中','高中','大专','本科','硕士','博士'], ['全日制','非全日制']],
    multiIndex: [3, 5],
    countryList: ['在读','毕业'],
    countryIndex: 0,
  },
  onLoad: function () {
    var that = this;
    this.initValidate();
    var info = wx.getStorageSync('userinfo');
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/catDetail',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        uid: info.id,
      },
      success: function (res) {
        var photo = [];
        if(res.data.photo != undefined){
          photo[0] = res.data.photo;
        }else{
          photo = [];
        }
        var one = 0;
        var two = 0;
        var mm = that.data.multiArray[0];
        var mms = that.data.multiArray[1];
        for(var i=0;i<=mm.length - 1;i++){
          if(res.data.education == mm[i]){
            var one = i;
          }
        }
        for (var j = 0; j <= mms.length - 1; j++) {
          if (res.data.system == mms[j]) {
            var two = j;
          }
        }
        var state = that.data.countryList;
        for(var k=0;k<=state.length-1;k++){
          if(res.data.state == state[k]){
            var state = k;
          }
        }

        that.setData({
          res: res.data,
          education: res.data.education,
          system: res.data.system,
          state: state,
          pics: photo,
          multiIndex: [one,two],
          countryIndex: state
        })
      },
      fail: function () {
        app.consoleLog("请求数据失败");
      },
      complete: function () {
        // complete 
      }
    })
  },
  // 选择二级联动
  changeMultiPicker(e) {
    this.setData({ multiIndex: e.detail.value, education: this.data.multiArray[0][e.detail.value[0]], system: this.data.multiArray[1][e.detail.value[1]]})
  },
  // 选择国家函数
  changeCountry(e) {
    this.setData({ countryIndex: e.detail.value, state: this.data.countryList[e.detail.value] });
  },
  //
  formSubmit: function (e) {
    var that = this;
    var info = wx.getStorageSync('userinfo');
    let issueInfo = e.detail.value;

    if (!that.WxValidate.checkForm(issueInfo)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }
    if (that.data.education == '') {
      wx.showToast({
        title: '请选择学历',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (that.data.state == '') {
      wx.showToast({
        title: '请选择学历状态',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    if (that.data.pics == []) {
      wx.showToast({
        title: '请选择形象',
        icon: 'error',
        duration: 500,
        mask: true,
      })
      return false;
    }
    //图片上传
    if (that.data.upload) {
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
          var path = res.data;
          that.setData({
            path: path
          })
        }
      })
    }
    if(that.data.path == undefined){
      that.setData({
        path: that.data.pics[0]
      })
    }

    setTimeout(function () {
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/doDetail',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        data: {
          uid: info.id,
          age: e.detail.value.age,
          education: that.data.education,
          system: that.data.system,
          major: e.detail.value.major,
          state: that.data.state,
          realname: e.detail.value.realname,
          school: e.detail.value.school,
          photo: that.data.path
        },
        success: function (res) {
          if (res.data != 2) {
            wx.showToast({
              title: '成功',
              icon: 'succes',
              duration: 1000,
              mask: true,
              success: function () {
                setTimeout(function () {
                  var pages = getCurrentPages();//获取页面栈
                  if (pages.length > 1) {
                    //上一个页面实例对象
                    var prePage = pages[pages.length - 2];
                    //调用上一个页面的onShow方法
                    prePage.onShow()
                  }
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 1000) //延迟时间
              }
            })
          }
        },
        fail: function () {
          app.consoleLog("请求数据失败");
        },
        complete: function () {
          // complete 
        }
      })
    }, 1000)
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var imgsrc = res.tempFilePaths;
        that.setData({
          pics: imgsrc,
          upload: true
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
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics,
      upload: true
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
  //表单验证
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      realname: {
        required: true,
        maxlength: 128
      },
      school: {
        required: true
      },
      age: {
        required: true
      },
      major: {
        required: true
      },
    }
    const messages = {
      realname: {
        required: '请输入真实姓名',
        minlength: '最多只能输入128个字符'
      },
      school: {
        required: '请输入学校名称'
      },
      age: {
        required: '请输入年龄'
      },
      major: {
        required: '请输入专业'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  }
})