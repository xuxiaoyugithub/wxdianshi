Page({
  formSubmit: function(e){
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/setup/feedback',
      data:{
        uid: wx.getStorageSync('userinfo').id,
        feedback: e.detail.value.feedback
      },
      success: function(res){
        if(res.data == 1){
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
  }
})