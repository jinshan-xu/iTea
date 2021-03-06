// pages/remark/remark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    len: 0,
    label: [{content: "打包", active: ""},{content: "不打包", active: ""}],    
    val: "",
    plchoe: "请填写备注信息" ,
    showVal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  countLen(e){    
    var val = e.detail.value;
    this.setData({
      len: 50 - e.detail.value.length,
      val
    });
  },
  addLabel(e){
    var idx = e.target.dataset.idx;  
    var content = e.target.dataset.content;
    var label = this.data.label;        
    if(content){
      label[idx].active = "active";    
      var val = this.data.val + content;   
      this.setData({
        val,
        label,
        len: 50 - val.length,
        showVal: true
      })    
    }    
  },
  toPay(){
    wx.navigateTo({
      url: '../pay/pay'
    })
  },
  dataIn(){
    this.setData({
      showVal: true
    })
  },
  handleBlur(e){    
    if(this.data.val.length==0){      
      this.setData({
        showVal: false
      })
    }
  }
})