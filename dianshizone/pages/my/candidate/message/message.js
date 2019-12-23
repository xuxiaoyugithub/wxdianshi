Page({
  data:{
    id: 0,
    oid: 0,
    advantage:[],
    detail: [],
    undergo: [],
    offer: 0,
    more1: false,
    mores1: false,
    more2: false,
    mores2: false,
    more3: false,
    mores3: false,
    more4: false,
    mores4: false
  },
  onLoad:function(e){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/message',
      data:{
        uid: e.uid
      },
      success:function(res){
        that.setData({
          advantage: res.data.advantage,
          len1: res.data.advantage.content.length,
          introduce: res.data.advantage.content.substring(0, 40),
          detail: res.data.detail,
          undergo: res.data.undergo,
          education: res.data.education,
          honor: res.data.honor,
          id: e.uid,
          oid: e.oid,
          offer: e.offer
        })
      }
    })
  },
  agree: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要同意该申请人吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/agree',
            data:{
              uid: that.data.id,
              oid: that.data.oid
            },
            success: function (res){
              if(res.data == 1){
                wx.showToast({
                  title: '已同意',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                })
              }else{
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
  refuse: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要拒绝该申请人吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/task/refuse',
            data: {
              uid: that.data.id,
              oid: that.data.oid
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已拒绝',
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
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = e.currentTarget.dataset.arr;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  more1: function(){
    var that = this;
    that.setData({
      more1: !that.data.more1,
      mores1: !that.data.mores1
    })
  },
  more2: function () {
    var that = this;
    that.setData({
      more2: !that.data.more2,
      mores2: !that.data.mores2
    })
  },
  more3: function () {
    var that = this;
    that.setData({
      more3: !that.data.more3,
      mores3: !that.data.mores3
    })
  },
  more4: function () {
    var that = this;
    that.setData({
      more4: !that.data.more4,
      mores4: !that.data.mores4
    })
  }
})