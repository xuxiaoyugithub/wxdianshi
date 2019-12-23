Page({
  data:{
    types: []
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/release', //接口
      success: function (res) {
        console.log(res.data);
        that.setData({
          types: res.data,
        })
      }
    })
  },
  jump: function (res){
    wx.redirectTo({
      url: '../subtypes/subtypes?id=' + res.currentTarget.dataset.id
    })
  }
})