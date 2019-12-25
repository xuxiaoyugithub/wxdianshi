Page({
  data: {
    identity: '',
  },
  onShow: function(){
    var that = this;
    var user = wx.getStorageSync('userinfo');
    if(user.identity == 1){
      that.setData({
        identity: '灵活用工达人'
      })
    }else{
      that.setData({
        identity: '发布者'
      })
    }
  },
  change: function(){
    var that = this;
    wx.showModal({
      title: '切换身份',
      content: '确定要切换当前身份吗',
      success: function (res) {
        if (res.confirm) {
          var user = wx.getStorageSync('userinfo');
          wx.request({
            url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/setup/change',
            data:{
              uid: user.id
            },
            success: function(res){
              if(res.data == '未机构认证'){
                wx.showModal({
                  title: '未机构认证',
                  content: '请先进行机构认证',
                  success: function(res){
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '../../fillin/fillin'
                      })
                    }
                  }
                })
              }else{
                console.log(res.data);
                user.identity = res.data;
                wx.setStorageSync('userinfo', user);
                wx.showToast({
                  title: '切换成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true,
                })
                if (res.data == 1) {
                  that.setData({
                    identity: '灵活用工达人'
                  })
                } else {
                  that.setData({
                    identity: '发布者'
                  })
                }
              }
            }
          })
        }
      }
    })
  }
})