Page({
  data:{
    page: 0,
    limit: 5,
    time: 1,
    list: [],
    height:0,
    hide: 0,//加载显示隐藏
    hasmore: true,
  },
  onLoad: function(){
    this.list();
  },
  list: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer', //接口
      data: {
        page: that.data.page,
        limit: that.data.limit,
        time: that.data.time
      },
      success: function (res) {
        if (res.data.res == []) {
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
          height: len * 175,
          page: that.data.page + 1,
          hide: 0,
          // lang: res.data.types.length
        })
      }
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
        that.list();
        setTimeout(function () {
          that.setData({
            hasmore: true
          })
        }, 1000)
      }, 2000)
    }
  },
})