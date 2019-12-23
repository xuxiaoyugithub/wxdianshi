Page({
  data:{
    res: [],
    id: 0,
    userid: wx.getStorageSync('userinfo').id,
    status: 1,
    state: 1,
    hiden: 0,
    speed:false
  },
  onLoad: function(e){
    var that = this;
    if(e.status != undefined){
      that.setData({
        state: e.status
      })
    }
    that.setData({
      id: e.id
    })
    that.speed();
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/part', //接口
      data: {
        id: e.id,
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          res: res.data,
          status: res.data.status
        })
      }
    })
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)
  },
  speed: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/speed',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        if(res.data == 2){
          that.setData({
            speed: false
          })
        }else{
          that.setData({
            speed: true
          })
        }
      }
    })
  },
  apply:function(){
    var that = this;
    if(that.data.speed){
      wx.showModal({
        title: '提示',
        content: '确定要申请该职位吗',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/offer/apply', //接口
              data: {
                oid: that.data.id,
                uid: wx.getStorageSync('userinfo').id
              },
              success: function (res) {
                if (res.data == 1) {
                  that.setData({
                    status: 2
                  })
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: '失败,请重试',
                    icon: 'success',
                    duration: 2000
                  })
                }
              }
            })
          } else {
            console.log('弹框后点取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先完善简历',
        success: function(res){
          if (res.confirm) {
            wx.redirectTo({
              url: '../my/resume/resume'
            })
          }
        }
      })
    }
  },
  //接受任务
  accept:function (){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要接受该任务吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/tasks/accept',
            data: {
              uid: wx.getStorageSync('userinfo').id,
              oid: that.data.id
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已接受',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showToast({
                  title: '失败,请重试',
                  icon: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },
  giveup: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要放弃该任务吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/tasks/giveup',
            data: {
              uid: wx.getStorageSync('userinfo').id,
              oid: that.data.id
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已放弃',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showToast({
                  title: '失败,请重试',
                  icon: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },
  complete: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要完成该任务吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/tasks/complete',
            data: {
              uid: wx.getStorageSync('userinfo').id,
              oid: that.data.id
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已完成',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showToast({
                  title: '失败,请重试',
                  icon: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },
})