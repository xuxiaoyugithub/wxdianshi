var app = getApp()
Page({
  data: {
    navbar: ['全部任务', '人才市场'],
    currentTab: 0,
    animate: 'myfirst',
    yesorno: 'none',
    flag: true,
    test: 'test1',
    dataList: [
      {
        id: 0,
        title: "开发任务",
        url: "../../images/ggg.jpg"
      },
      {
        id: 1,
        title: "设计任务",
        url: "../../images/ggg.jpg"
      },
      {
        id: 2,
        title: "文案写作",
        url: "../../images/ggg.jpg"
      },
      {
        id: 3,
        title: "资讯任务",
        url: "../../images/ggg.jpg"
      },
      {
        id: 4,
        title: "有偿活动",
        url: "../../images/ggg.jpg"
      }
    ],
    lang:0,
    list:[],
    types: [],
    type: [],
    subtype: [],
    id: 0,
    color: 0,
    sx1: '全部岗位',
    time: 0,
    lists: [],
    height: 0,//元素高度
    hide: 0,//加载显示隐藏
    text: '努力加载中',//加载信息
    page: 0,//页数
    limit: 5,//每页显示条数
    hasmore: true,
    hiden: 0,
    backTopValue: false
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/types',
      success: function(res){
        that.setData({
          dataList: res.data,
          types: res.data,
          lang: res.data.length
        })
      }
    })
    setTimeout(function(){
      that.setData({
        hiden:1
      })
    },1000)
  },
  onShow: function(){
    var that = this;
    if (wx.getStorageSync('userinfo').identity == 1){
      that.setData({
        currentTab: 0,
        page: 0,
        list: [],
        lists: [],
        id: 0,
        time: 0,
        hiden: 1
      })
      that.list();
    }else{
      that.setData({
        currentTab: 1,
        page: 0,
        list: [],
        lists: [],
        id: 0,
        time: 0,
        hiden: 1
      })
      that.lists();
    }
  },
  list: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer', //接口
      data: {
        page: that.data.page,
        limit: that.data.limit,
        time: that.data.time
      },
      success: function (res) {
        if(res.data.res == []){
          that.setData({
            page: that.data.page - 1
          })
        }
        var list = res.data.res;
        var data = that.data.list;
        var lists = data.concat(list);
        var len = lists.length;

        that.setData({
          list: lists,
          sx1: '全部岗位',
          height: len * 150 + 360,
          page: that.data.page + 1,
          hide: 0
        })
      }
    })
  },
  lists: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/personnel', //接口
      data: {
        page: that.data.page,
        limit: that.data.limit,
        time: that.data.time
      },
      success: function (res) {
        console.log(res);
        if (res.data == []) {
          that.setData({
            page: that.data.page - 1
          })
        }
        var list = res.data;
        var data = that.data.lists;
        var lists = data.concat(list);
        var len = lists.length;
        that.setData({
          lists: lists,
          sx1: '全部岗位',
          height: len * 165 + 360,
          page: that.data.page + 1,
          hide: 0
        })
      }
    })
  },
  navbarTap: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      list: [],
      lists: [],
      page: 0,
      id: 0,
      time: 0,
      hiden: 0
    })
    if (that.data.currentTab == 0) {
      that.list();
      setTimeout(function () {
        that.setData({
          hiden: 1
        })
      }, 1000)
    }
    if (that.data.currentTab == 1) {
      that.lists();
      setTimeout(function () {
        that.setData({
          hiden: 1
        })
      }, 1000)
    }
  },
  fabiao: function () {

    this.setData({
      yesorno: 'block'
    })

    this.setData({
      test: 'test1'
    })

    this.setData({
      flag: false
    })

  },
  laqi: function () {

    this.setData({
      test: 'test2',
    })
    this.setData({
      flag: true
    })
  },
  screen: function (e) {
    var that = this;
    that.setData({
      color: e.currentTarget.dataset['id']
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/screens', //接口
      data: {
        id: that.data.color,
        keys: that.data.currentTab
      },
      success: function (res) {
        that.setData({
          type: res.data.type,
          subtype: res.data.subtype,
        })
      }
    })
  },
  talent: function(e){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/talent', //接口
      data: {
        tid: that.data.id,
        time: that.data.time,
        page: that.data.page,
        limit: that.data.limit
      },
      success: function (res) {
        if (res.data == []) {
          that.setData({
            page: that.data.page - 1
          })
        } else {
          that.setData({
            page: that.data.page + 1
          })
        }
        var list = res.data;
        var data = that.data.lists;
        var lists = data.concat(list);
        var len = lists.length;
        that.setData({
          lists: lists,
          index: 0,
          yesorno: 'none',
          flag: true,
          height: len * 160 + 360,
          hide: 0
        })
      }
    })
  },
  type: function(e){
    var that = this;
    that.setData({
      id: e.currentTarget.dataset['id'],
      page: 0,
      sx1: e.currentTarget.dataset['name'],
      list: []
    })
    that.screens();
  },
  types: function (e) {
    var that = this;
    that.setData({
      id: e.currentTarget.dataset['id'],
      page: 0,
      sx1: e.currentTarget.dataset['name'],
      lists: []
    })
    that.talent();
  },
  screens: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/lists', //接口
      data: {
        id: that.data.id,
        time: that.data.time,
        page: that.data.page,
        limit: that.data.limit
      },
      success: function (res) {
        if (res.data == []) {
          that.setData({
            page: that.data.page - 1
          })
        }else{
          that.setData({
            page: that.data.page + 1
          })
        }
        var list = res.data;
        var data = that.data.list;
        var lists = data.concat(list);
        var len = lists.length;
        that.setData({
          list: lists,
          index: 0,
          yesorno: 'none',
          flag: true,
          height: len * 150 + 360,
          hide: 0
        })
      }
    })
  },
  time: function (e) {
    var that = this;
    if (e.currentTarget.dataset['time'] == 0) {
      that.setData({
        page: 0,
        time: 1,
        list: [],
        lists: []
      })
    } else {
      that.setData({
        page:0,
        time: 0,
        list: [],
        lists: []
      })
    }
    if(that.data.currentTab == 0){
      if (that.data.id == 0){
        that.list();
      }else{
        that.screens();
      }
    }else{
      if (that.data.id == 0) {
        that.lists();
      }else{
        that.talent();
      } 
    }
    
    // if (that.data.id == 0) {
    //   that.list();
    // } else {
    //   wx.request({
    //     url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/lists', //接口
    //     data: {
    //       id: that.data.id,
    //       keys: that.data.currentTab,
    //       time: that.data.time
    //     },
    //     success: function (res) {
    //       that.setData({
    //         list: res.data,
    //       })
    //     }
    //   })
    // }
  },
  
  onPullDownRefresh() {
    var that = this;
    if(that.data.hasmore){
      that.setData({
        hide: 1
      })
      that.setData({
        hasmore: false
      })
      setTimeout(function () {
        
        if(that.data.currentTab == 0){
          if (that.data.id != 0){
            that.screens();
          } else if (that.data.id == 0){
            that.list();
          }
        }else{
          if (that.data.id != 0) {
            that.talent();
          } else if (that.data.id == 0){
            that.lists();
          }
        }
        setTimeout(function () {
          that.setData({
            hasmore: true
          })
        }, 1000)
      },2000)
    }
    // wx.setNavigationBarTitle({
    //   title: '寸草心+'
    // })//动态设置当前页面的标题。
  },

  //回到顶部
  // 监听滚动条坐标
  onPageScroll: function (e) {
    //console.log(e)
    var that = this
    var scrollTop = e.scrollTop
    var backTopValue = scrollTop > 100 ? true : false
    that.setData({
      backTopValue: backTopValue
    })
  },

  // 滚动到顶部
  backTop: function () {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  jump: function(){
    wx.navigateTo({
      url: '../release/release'
    })
  }
})