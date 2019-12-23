Page({
  data:{
    type: [],
    subtypes: [],
    pid: 0,
    hide: false
  },
  onLoad: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/myLabel',
      data:{
        uid: wx.getStorageSync('userinfo').id
      },
      success: function(res){
        that.setData({
          label: res.data
        })
      }
    })
    that.label();
  },
  label: function(){
    var that = this;
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/label',
      success:function(res){
        that.setData({
          type: res.data.type,
          subtypes: res.data.subtypes
        })
      }
    })
  },
  downup: function(e){
    if (this.data.pid == e.currentTarget.dataset.pid){
      this.setData({
        pid: e.currentTarget.dataset.pid,
        hide: !this.data.hide
      })
    }else{
      this.setData({
        pid: e.currentTarget.dataset.pid,
        hide: true
      })
    }
  },
  delLabel: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var label = that.data.label;
    for(var i=0;i<=label.length-1;i++){
      if(i == index){
        label.splice(i, 1);
      }
    }
    that.setData({
      label: label
    })
  },
  addLabel: function(e){
    var that = this;
    var label = that.data.label;
    if (label.length < 3) {
      var id = e.currentTarget.dataset.id;
      var name = e.currentTarget.dataset.name;
      var newarray = [{ 'id': id, 'name': name }];
      var labels = label.concat(newarray);
      that.setData({
        label: labels
      })
    }else{
      wx.showModal({
        title: '标签过多',
        content: '最多不能超过三个哦',
      })
    }
  },
  upLabel: function(){
    var that = this;
    var label = that.data.label;
    var tid = '';
    for(var i=0;i<=label.length-1;i++){
      tid += label[i].id + ',';
    }
    wx.request({
      url:'https://dianshi.ait114.com/think-5.0.7/public/index.php/index/resume/upLabel',
      data:{
        uid: wx.getStorageSync('userinfo').id,
        tid: tid
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