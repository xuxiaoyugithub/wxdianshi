Page({
  data:{
    list:[]
  },
  onLoad: function(){
    this.list();
  },
  onShow: function(){
    this.list();
  },
  list: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/bankcard',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        console.log(res.data);
        that.setData({
          list: res.data
        })
      }
    })
  },
  longTap: function (e) {
    var that = this;
    wx.showModal({
      title: '操作',
      content: '解除绑定',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/wallet/delbank',
            data:{
              id: e.currentTarget.dataset.id
            },
            success: function(res){
              if(res.data == 1){
                that.list();
              }
            }
          })
        }
      }
    })
  }
})