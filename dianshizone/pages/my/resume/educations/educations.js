var app = getApp();
import WxValidate from '../../../../utils/WxValidate.js';
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
Page({
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    education: [],
    hide: 0,
    hides: 0,
    hdien: false,
    hidens: false,
    multiArray: [['小学', '初中', '高中', '大专', '本科', '硕士', '博士'], ['全日制', '非全日制']],
    multiIndex: [0, 0],
  },
  onLoad: function (e) {
    var that = this;
    this.initValidate();
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
    that.cateducation(e.id);
  },
  // 选择二级联动
  changeMultiPicker(e) {
    this.setData({ multiIndex: e.detail.value, education: this.data.multiArray[0][e.detail.value[0]], system: this.data.multiArray[1][e.detail.value[1]] })
  },
  cateducation:function(id){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/cateducation',
      data:{
        id: id
      },
      success: function(res){
        var one = 0;
        var two = 0;
        var mm = that.data.multiArray[0];
        var mms = that.data.multiArray[1];
        for (var i = 0; i <= mm.length - 1; i++) {
          if (res.data.education == mm[i]) {
            var one = i;
          }
        }
        for (var j = 0; j <= mms.length - 1; j++) {
          if (res.data.system == mms[j]) {
            var two = j;
          }
        }
        that.setData({
          id: id,
          educations: res.data,
          education: res.data.education,
          system: res.data.system,
          multiIndex: [one,two]
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this;
    var info = wx.getStorageSync('userinfo');
    let issueInfo = e.detail.value;
    if (!that.WxValidate.checkForm(issueInfo)) {
      const error = that.WxValidate.errorList[0]
      that.showModal(error)
      return false
    }
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/updateEdu',
      data: {
        id: that.data.id,
        school: e.detail.value.school,
        education: that.data.education,
        system: that.data.system,
        major: e.detail.value.major,
        after: e.detail.value.after,
        start_time: e.detail.value.start_time,
        end_time: e.detail.value.end_time
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == 1) {
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
      }
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
      school: {
        required: true,
        maxlength: 128
      },
      major: {
        required: true
      },
    }
    const messages = {
      school: {
        required: '请输入学校名称',
        minlength: '最多只能输入128个字符'
      },
      major: {
        required: '请输入专业'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
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
  hide: function () {
    this.setData({
      hide: 1
    })
  },
  hides: function () {
    this.setData({
      hides: 1
    })
  },
  select: function () {
    this.setData({
      hiden: !this.data.hiden
    })
  },
  selected: function (e) {
    var that = this;
    var education = e.currentTarget.dataset.education;
    that.setData({
      hiden: !that.data.hiden,
      education: education
    })
  },
  selects: function () {
    this.setData({
      hidens: !this.data.hidens
    })
  },
  selectsed: function (e) {
    var that = this;
    var system = e.currentTarget.dataset.system;
    this.setData({
      hidens: !this.data.hidens,
      system: system
    })
  }
})