Page({
  data: {
    hiden: 0,
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    sign: 0,
    text: '签到',
    wsign: "https://dianshi.ait114.com/think-5.0.7/public/static/wq.png",
    ysign: "https://dianshi.ait114.com/think-5.0.7/public/static/yq.png",
    series: 0,
    signs:[]
  },
  onLoad: function () {
    var that = this;

    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)
    

    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    })

    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/sign/index',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        // var dateArr = that.data.dateArr;
        // for(var i=0;i<=dateArr.length-1;i++){
        //   for(var k=0;k<=res.data.signs.length-1;k++){
        //     if(dateArr[i].isToday == res.data.signs[k]){
        //       dateArr[i].sign = 123;
        //     }else{
        //       dateArr[i].sign = 321;
        //     }
        //   }
        // }
        // console.log(res.data.signs);
        // console.log(dateArr);
        that.setData({
          series: res.data.series,
          signs: res.data.signs,
          // dateArr: dateArr
        })
        var sign = 0;
        var text = '';
        if(res.data.created_at != undefined){
          if (res.data.created_at == res.data.today) {
            sign = 1;
            text = '已签到';
          } else {
            sign = 0;
            text = '签到';
          }
          that.setData({
            sign: sign,
            text: text,
          })
        }
        
      }
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                          //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  //签到
  sign: function(){
    var that = this;
    that.end();
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/sign/sign',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        that.setData({
          sign: 1,
          text: '已签到',
          series: res.data
        })
      }
    })
  },
  nanTwo: function () {
    this.start();
  },
  start: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(0.7).scale(0.5, 0.5).step();
    this.setData({
      ani: animation.export()
    })
  },
  end: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(1).scale(1, 1).step()
    this.setData({
      ani: animation.export()
    })
  }
})