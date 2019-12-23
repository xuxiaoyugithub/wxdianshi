//logs.js
Page({
  data:{
    avatarUrl: '',
    nickName: '',
    str: '',
    undergo: [],
    detail: [],
    hiden: 0,
    nickname: '',
    education: [],
    jzjump: true
  },
  onShow: function(){
    var that = this;
    var info = wx.getStorageSync('userinfo');
    
      wx.request({

        url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume', //接口
        header: {
          'Content-Type': 'application/json',
        },
        data: {
          uid: info.id,
        },
        success: function (res) {
          console.log(res.data.detail);
          that.setData({
            str: res.data.str,
            undergo: res.data.undergo,
            detail: res.data.detail,
            avatarUrl: info.avatarurl,
            nickName: info.nickname,
            education: res.data.education,
            honor: res.data.honor
          })
        }
      })
    wx.request({
      url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/myLabel',
      data: {
        uid: wx.getStorageSync('userinfo').id
      },
      success: function (res) {
        that.setData({
          label: res.data
        })
      }
    })
    setTimeout(function () {
      that.setData({
        hiden: 1
      })
    }, 1000)     
  },
  longTap: function(e){
    var that = this;
    that.setData({
      jzjump: false
    })
    wx.showModal({
      title: '操作',
      content: '删除该项目经历',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/delUndergo',
            data:{
              id: e.currentTarget.dataset.id
            },
            success: function(res){
              if(res.data == 1){
                that.onShow();
              }
              that.setData({
                jzjump: true
              })
            }
          })
        } else {
          that.setData({
            jzjump: true
          })
        }
      }
    })
  },
  jump: function(e){
    if (this.data.jzjump) {
      wx.navigateTo({
        url: './undergos/undergos?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  jump2: function(e){
    if(this.data.jzjump){
      wx.navigateTo({
        url: './educations/educations?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  longTap2: function (e) {
    var that = this;
    that.setData({
      jzjump: false
    })
    wx.showModal({
      title: '操作',
      content: '删除该教育经历',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/delEducation',
            data: {
              id: e.currentTarget.dataset.id
            },
            success: function (res) {
              if (res.data == 1) {
                that.onShow();
              }
              that.setData({
                jzjump: true
              })
            }
          })
        }else{
          that.setData({
            jzjump: true
          })
        }
      }
    })
  },
  jump3: function (e) {
    if (this.data.jzjump) {
      wx.navigateTo({
        url: './honors/honors?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  longTap3: function (e) {
    var that = this;
    that.setData({
      jzjump: false
    })
    wx.showModal({
      title: '操作',
      content: '删除该荣誉',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/delHonor',
            data: {
              id: e.currentTarget.dataset.id
            },
            success: function (res) {
              if (res.data == 1) {
                that.onShow();
              }
              that.setData({
                jzjump: true
              })
            }
          })
        } else {
          that.setData({
            jzjump: true
          })
        }
      }
    })
  }
})