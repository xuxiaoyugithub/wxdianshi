var calls = require("../../utils/util.js")
var city = '';
var app = getApp();
var info = wx.getStorageSync('userinfo');
import WxValidate from '../../utils/WxValidate.js'
var dateTimePicker = require('../../utils/dateTimePicker.js');
// const formUtil = require('../../utils/formUtil.js');
Page({
  data: {
    // text:"这是一个页面"
    customItem: [],
    detailed: '',
    types: '',
    typesid: 0,
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['小时', '天', '月', '次'],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    keys: 0,
    login: 0,
    AddSite: [],
    // isShow: 0,
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    isreal: false
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  onLoad: function () {
    var that = this;
    that.initValidate();
    var login = wx.getStorageSync('login');
    that.setData({
      login: login
    })
    if(login == 1){
      that.isreal();
    }
    // if (login == 1) {
    //   wx.request({
    //     url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/release/isShow',
    //     data: {
    //       uid: wx.getStorageSync('userinfo').id
    //     },
    //     success: function (res) {
    //       if (res.data == 1) {
    //         that.isreal();
    //         that.setData({
    //           isShow: 1
    //         })
    //       } else {
    //         that.setData({
    //           isShow: 2
    //         })
    //       }
    //     }
    //   })
    // }
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
  onShow: function () {
    var login = wx.getStorageSync('login');
    this.setData({
      types: app.globalData.name,
      typesid: app.globalData.id,
      login: login
    })
  },
  isreal: function () {
    var that = this;
    //检查用户是否实名认证
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/release/isreal',
      data: {
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        if (res.data != 2) {
          if (res.data.state == 1) {
            wx.showModal({
              title: '实名认证待审核',
              content: '审核中暂时不能发布任务',
              success: function (res) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
            that.setData({
              isreal: false
            })
          } else {
            that.setData({
              isreal: true
            })
            that.isCompany();
          }
        } else {
          wx.showModal({
            title: '实名认证',
            content: '请先前去进行实名认证',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../my/wallet/realname/realname'
                })
              }
            }
          })
          that.setData({
            isreal: false
          })
        }
      }
    })
  },
  //判读用户是否进行机构认证
  isCompany: function(){
    if (wx.getStorageSync('userinfo').iscompany == 1){
      wx.showModal({
        title: '机构认证',
        content: '请先进行机构认证',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../fillin/fillin'
            })
          }
        }
      })
    }
  },
  formBindsubmit: function (e) {
    if (this.data.isreal) {
      let issueInfo = e.detail.value
      //校验表单
      if (!this.WxValidate.checkForm(issueInfo)) {
        if (this.data.typesid == 0) {
          const error = { param: 'title', msg: '请选择类型', value: "" }
          this.showModal(error)
          return false
        } else {
          const error = this.WxValidate.errorList[0]
          this.showModal(error)
          return false
        }

      }
      if (e.detail.value.deadline == '') {
        var deadline = '不限时间';
      } else {
        var deadline = e.detail.value.deadline;
      }
      wx.showLoading({
        title: '玩命加载中',
        mask: true
      })
      wx.request({
        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/reoffer', //接口
        method: 'POST',
        data: {
          uid: wx.getStorageSync('userinfo').id,
          index: this.data.index,
          content: e.detail.value.content,
          details: e.detail.value.details,
          money: e.detail.value.money,
          phone: e.detail.value.phone,
          weixin: e.detail.value.weixin,
          title: e.detail.value.title,
          typesid: this.data.typesid,
          deadline: deadline,
          place: this.data.AddSite.area
        },
        success: function (res) {
          wx.showToast({
            title: '发布成功',
            icon: 'succes',
            duration: 500,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../offer/offer',
                })
              }, 1000) //延迟时间
            }
          })
        }
      })
    } else {
      this.isreal();
    }
  },
  formReset: function () {

  },
  // show: function () {
  //   var that = this;
  //   if (that.data.typesid == 0) {
  //     const error = { param: 'title', msg: '请选择类型', value: "" }
  //     this.showModal(error)
  //     return false
  //   }
  //   wx.request({
  //     url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/release/reShow',
  //     method: 'POST',
  //     data: {
  //       uid: wx.getStorageSync('userinfo').id,
  //       tid: that.data.typesid
  //     },
  //     success: function (res) {
  //       if (res.data == 1) {
  //         wx.showToast({
  //           title: '发布成功',
  //           icon: 'succes',
  //           duration: 500,
  //           mask: true,
  //           success: function () {
  //             setTimeout(function () {
  //               wx.switchTab({
  //                 url: '../offer/offer',
  //               })
  //             }, 1000) //延迟时间
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  
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
      title: {
        required: true,
        maxlength: 128
      },
      content: {
        required: true
      },
      details: {
        required: true
      },
      money: {
        required: true
      },
      // deadline: {
      //   required: true
      // },
      phone: {
        requeired: true
      },
      // place: {
      //   required: true
      // },
      typesid: {
        requeired: true
      },
    }
    const messages = {
      title: {
        required: '请输入任务名称',
        minlength: '最多只能输入128个字符'
      },
      contetnt: {
        required: '请输入工作内容'
      },
      details: {
        required: '请输入工作要求'
      },
      money: {
        required: '请输入基本薪资'
      },
      phone: {
        required: '请输入联系方式'
      },
      typesid: {
        requeired: '请选择类型'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  //去登陆
  wxdl: function () {
    wx.navigateTo({
      url: '../login/login'
    })
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
  type: function(){
    wx.redirectTo({
      url: './types/types'
    })
  },
  company: function(e){
    this.setData({
      index: e.currentTarget.dataset.index
    })
  }
})