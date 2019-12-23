Page({
  data:{
    pid:0,
    keys:0,
    lists:[],
    types:[],
    type:[],
    subtype:[],
    yesorno: 'none',
    flag: true,
    test: 'test1',
    color:0,
    sx1:'全部岗位',
    time: 0,
    id: 0,
    personnel: [],
    height: 0,//元素高度
    hide: 0,//加载显示隐藏
    text: '努力加载中',//加载信息
    page: 0,//页数
    limit: 5,//每页显示条数
    hasmore: true,
    hiden: 0
  },
  onLoad: function(e){
    var that = this;
    that.setData({
      pid: e.id,
      keys: e.keys
    })
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)
    if(that.data.keys == 0){
      that.list();
    }else{
      that.lists();
    }
  },
  //获取列表数据
  list: function(){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/list', //接口
      data:{
        keys:that.data.keys,
        pid: that.data.pid,
        time: that.data.time,
        page: that.data.page,
        limit: that.data.limit
      },
      success: function (res) {
        if (res.data.lists == []) {
          that.setData({
            page: that.data.page - 1
          })
        }else{
          that.setData({
            page: that.data.page + 1
          })
        }
        var list = res.data.lists;
        var data = that.data.lists;
        var lists = data.concat(list);
        var len = lists.length;
        that.setData({
          lists: lists,
          type: res.data.type,
          types: res.data.type,
          subtype: res.data.subtype,
          height: len * 150 + 80,
          hide: 0
        })
      }
    })
  },
  lists: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/single', //接口
      data:{
        pid: that.data.pid,
        page: that.data.page,
        limit: that.data.limit
      },
      success: function (res) {
        console.log(res.data.personnel);
        if (res.data.lists == []) {
          that.setData({
            page: that.data.page - 1
          })
        } else {
          that.setData({
            page: that.data.page + 1
          })
        }
        var list = res.data.personnel;
        var data = that.data.personnel;
        var lists = data.concat(list);
        var len = lists.length;
        that.setData({
          personnel: lists,
          types: res.data.type,
          subtype: res.data.subtype,
          sx1: '全部岗位',
          height: len * 160 + 80,
          hide: 0
        })
      }
    })
  },
  screen: function(e){
    var that = this;
    that.setData({
      color: e.currentTarget.dataset['id']
    })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/screens', //接口
      data: {
        id: that.data.color
      },
      success: function (res) {
        that.setData({
          type: res.data.type,
          subtype: res.data.subtype,
        })
      }
    })
  },
  talent: function (e) {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/talent', //接口
      data: {
        pid: that.data.pid,
        tid: that.data.id,
        time: that.data.time,
        page: that.data.page,
        limit: that.data.limit
      },
      success: function (res) {
        if (res.data.personnel == []) {
          that.setData({
            page: that.data.page - 1
          })
        } else {
          that.setData({
            page: that.data.page + 1
          })
        }
        var list = res.data;
        var data = that.data.personnel;
        var lists = data.concat(list);
        var len = lists.length;
        that.setData({
          personnel: lists,
          // index: 0,
          yesorno: 'none',
          flag: true,
          sx1: that.data.sx1,
          height: len * 160 + 80,
          hide: 0
        })
      }
    })
  },
  type: function (e) {
    var that = this;
    that.setData({
      id: e.currentTarget.dataset['id'],
      page: 0,
      sx1: e.currentTarget.dataset['name'],
      lists: []
    })
    that.screens();
  },
  types: function (e) {
    var that = this;
    that.setData({
      id: e.currentTarget.dataset['id'],
      page: 0,
      sx1: e.currentTarget.dataset['name'],
      personnel: []
    })
    that.talent();
  },
  screens: function (e){
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/lists', //接口
      data: {
        id: that.data.id,
        pid: that.data.pid,
        keys: that.data.keys,
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
          flag:true,
          sx1: that.data.sx1,
          height: len * 150 + 80,
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
        lists: [],
        personnel: []
      })
    } else {
      that.setData({
        page: 0,
        time: 0,
        lists: [],
        personnel: []
      })
    }
    if (that.data.keys == 0) {
      // if(that.data.id == 0){
      //   that.list();
      // }else{
        that.screens();
      // } 
    } else {
      that.talent();
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
  onPullDownRefresh() {
    var that = this;
    if (that.data.hasmore) {
      that.setData({
        hide: 1
      })
      that.setData({
        hasmore: false
      })
      setTimeout(function () {
        if (that.data.keys == 0) {
          if (that.data.id != 0 || that.data.time != 0) {
            that.screens();
          } else {
            that.list();
          }
        } else {
          if (that.data.id != 0 || that.data.time != 0) {
            that.talent();
          } else {
            that.lists();
          }
        }
        setTimeout(function () {
          that.setData({
            hasmore: true
          })
        }, 1000)
      }, 2000)
    }
    // wx.setNavigationBarTitle({
    //   title: '寸草心+'
    // })//动态设置当前页面的标题。
  }
})