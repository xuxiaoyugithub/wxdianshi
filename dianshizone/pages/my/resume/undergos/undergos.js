var app = getApp();
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
Page({
  data:{
    id: 0,
    res: '',
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    hide: 0,
    hides: 0,
    pics: [],
    thumb: ''
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/catUndergo',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        id: that.data.id,
      },
      success: function (res) {
        that.setData({
          res: res.data,
          pics: res.data.thumb,
          photo: res.data.thumb
        })
      },
      fail: function () {
        app.consoleLog("请求数据失败");
      },
      complete: function () {
        // complete 
      }
    })
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    // 精确到分的处理，将数组的秒去掉
    var lastArray1 = obj.dateTimeArray.pop();
    var lastTime1 = obj.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  formSubmit: function (e) {
    var that = this;
    var path = '';
    //图片上传
    if (that.data.pics != []) {
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
            that.setData({
              path: path
            })
          }
        })
      }
    }
    //提交
    setTimeout(function(){
      var thumbs = '';
      if(that.data.photo != []){
        for(var j=0;j<=that.data.photo.length-1;j++){
          thumbs += that.data.photo[j] + ',';
        }
        thumbs += that.data.path;
      }else{
        thumbs = that.data.path;
      }
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/updateUndergo',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        data: {
          id: that.data.id,
          project: e.detail.value.project,
          role: e.detail.value.role,
          start_time: e.detail.value.start_time,
          end_time: e.detail.value.end_time,
          describe: e.detail.value.describe,
          contribute: e.detail.value.contribute,
          thumb: thumbs
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
    },1000)
    
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  hide: function(){
    this.setData({
      hide:1
    })
  },
  hides: function () {
    this.setData({
      hides: 1
    })
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
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics,
      photo: pics,
      len: -1
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
  }
})