import WxValidate from '../../utils/WxValidate.js';
var dateTimePicker = require('../../utils/dateTimePicker.js');
var calls = require("../../utils/util.js")
var city = '';
Page({
  data:{
    name: '',//公司名称
    industry: '',//行业
    number: '',//公司人数
    nature: '',//工作性质
    introduce: '',//公司简介
    pics: [],//公司logo,
    detailed: '',//地区
    multiArray: [['上午8:00','上午9:00', '上午10:00', '上午11:00'], ['下午5:00', '下午6:00','下午7:00','下午8:00']],
    multiIndex: [0, 0],
    show: 1,
    countryList: ['0~99', '99~200'],
    countryIndex: 0,
    pics: [],
    thumb: [],
    license: [],
    thumbs: '',
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
  },
  onLoad:function(){
    this.initValidate();
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  // 选择二级联动
  changeMultiPicker(e) {
    this.setData({ multiIndex: e.detail.value })
  },
  // 选择公司人数
  changeCountry(e) {
    this.setData({ countryIndex: e.detail.value, number: this.data.countryList[e.detail.value] });
  },
  //省市联动
  bindRegionChange: function (e) {
    var that = this
    city = e.detail.value
    //为了让选择框有个默认值，    
    that.setData({
      clas: '',
    })　　　//下拉框所选择的值

    this.setData({
      //拼的字符串传后台
      detailed: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2],
      //下拉框选中的值
      region: e.detail.value
    })

    this.setData({
      "AddSite.area": e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2]
    })
    console.log(this.data.AddSite)
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
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
  // 图片
  chooses: function (e) {//这里是选取图片的方法
    var that = this;
    var thumb = that.data.thumb;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var imgsrc = res.tempFilePaths;
        thumb = thumb.concat(imgsrc);
        that.setData({
          thumb: thumb,
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
  // 图片
  choosees: function (e) {//这里是选取图片的方法
    var that = this;
    var license = that.data.license;
    wx.chooseImage({
      count: 5, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var imgsrc = res.tempFilePaths;
        license = license.concat(imgsrc);
        that.setData({
          license: license,
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
  // 删除图片
  deleteImgs: function (e) {
    var thumb = this.data.thumb;
    var index = e.currentTarget.dataset.index;
    thumb.splice(index, 1);
    this.setData({
      thumb: thumb,
    });
  },
  // 预览图片
  previewImgs: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var thumb = this.data.thumb;
    wx.previewImage({
      //当前显示图片
      current: thumb[index],
      //所有图片
      urls: thumb
    })
  },
  // 删除图片
  deleteImges: function (e) {
    var license = this.data.license;
    var index = e.currentTarget.dataset.index;
    license.splice(index, 1);
    this.setData({
      license: license,
    });
  },
  // 预览图片
  previewImges: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var license = this.data.license;
    wx.previewImage({
      //当前显示图片
      current: license[index],
      //所有图片
      urls: license
    })
  },
  formBindsubmit: function(e){
    var that = this;
    let issueInfo = e.detail.value
    //校验表单
    if (!that.WxValidate.checkForm(issueInfo)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }

    if(that.data.pics.length == 0){
      const error = { param: 'title', msg: '请选择logo', value: "" }
      this.showModal(error)
      return false
    }
    that.setData({
      name: e.detail.value.name,
      industry: e.detail.value.industry,
      introduce: e.detail.value.introduce,
      nature: e.detail.value.nature,
      number: e.detail.value.number,
      place: e.detail.value.place,
      show: 2
    })
  },
  up: function(){
    var that = this;
    that.setData({
      show: 1
    })
  },
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
      name: {
        required: true,
        maxlength: 128
      },
      industry: {
        required: true
      },
      number: {
        requeired: true
      },
      nature: {
        required: true
      },
      place: {
        required: true
      },
      introduce: {
        required: true
      }
    }
    const messages = {
      name: {
        required: '请输入公司名称',
        minlength: '最多只能输入128个字符'
      },
      industry: {
        required: '请输入行业'
      },
      introduce: {
        required: '请输入公司简介'
      },
      nature: {
        required: '请输入工作性质'
      },
      place: {
        required: '请选择公司所在地'
      },
      number: {
        required: '请输入公司人数'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  //时间选择
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
  submit: function(e){
    var that = this;
    // if(e.detail.value.fullname == ''){
    //   const error = { param: 'title', msg: '请输入公司全称', value: "" }
    //   this.showModal(error)
    //   return false
    // }
    // if (e.detail.value.master == '') {
    //   const error = { param: 'title', msg: '请输入企业法人', value: "" }
    //   this.showModal(error)
    //   return false
    // }
    // if (e.detail.value.time == '') {
    //   const error = { param: 'title', msg: '请选择注册时间', value: "" }
    //   this.showModal(error)
    //   return false
    // }
    // if (e.detail.value.capital == '') {
    //   const error = { param: 'title', msg: '请输入注册资本', value: "" }
    //   this.showModal(error)
    //   return false
    // }
    // if (that.data.license == '') {
    //   const error = { param: 'title', msg: '请选择营业执照', value: "" }
    //   this.showModal(error)
    //   return false
    // }
    // if (that.data.thumb == '') {
    //   const error = { param: 'title', msg: '请选择公司照片', value: "" }
    //   this.showModal(error)
    //   return false
    // }

    if(e.detail.value.fullname == undefined){
      var fullname = '';
    }else{
      var fullname = e.detail.value.fullname;
    }

    if (e.detail.value.master == undefined) {
      var master = '';
    } else {
      var master = e.detail.value.master;
    }

    if (e.detail.value.time == undefined) {
      var time = '';
    } else {
      var time = e.detail.value.time;
    }

    if (e.detail.value.capital == undefined) {
      var capital = '';
    } else {
      var capital = e.detail.value.capital;
    }

    var thumb = that.data.thumb;
    var photo = '';
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
          logo: path
        })
      }
    })
    if (that.data.license == []){
      wx.uploadFile({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads',
        filePath: that.data.license[0],
        name: "file",
        async: false,
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          method: 'POST'   //请求方式
        },
        success: function (res) {
          var license = res.data;
          that.setData({
            licenses: license
          })
        }
      })
    }
    for(var i=0;i<=thumb.length-1;i++){
      wx.uploadFile({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/uploads/uploads',
        filePath: thumb[i],
        name: "file",
        async: false,
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          method: 'POST'   //请求方式
        },
        success: function (res) {
          photo += res.data + ',';
          that.setData({
            thumbs: photo
          })
        }
      })
    }

    setTimeout(function(){
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/company/index',
        data:{
          uid: wx.getStorageSync('userinfo').id,
          name: that.data.name,
          industry: that.data.industry,
          number: that.data.countryList[that.data.countryIndex],
          workhour: that.data.multiArray[0][that.data.multiIndex[0]] + '-' + that.data.multiArray[1][that.data.multiIndex[1]],
          nature: that.data.nature,
          place: that.data.place,
          introduce: that.data.introduce,
          logo: that.data.logo,
          fullname: fullname,
          master: master,
          capital: capital,
          time: time,
          license: that.data.licenses,
          thumb: that.data.thumbs
        },
        success: function(res){
          if(res.data == 1){
            var user = wx.getStorageSync('userinfo');
            user.iscompany = 2;
            wx.setStorageSync('userinfo', user);
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
          }else{
            wx.showToast({
              title: '失败请重试',
              icon: 'succes',
              duration: 1000,
              mask: true,
            })
          }
        }
      })
    },1000)
  }
})