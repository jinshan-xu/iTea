// pages/addr/addr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],  // 用户填写的地址信息
    hasAddr: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if(options.userInfo){
      var info = JSON.parse(options.userInfo);
      var userInfo = [];
      userInfo.push(info);
      this.setData({
        userInfo,
        hasAddr: true
      })
    }        
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
  addAddrBtn(){
    // 跳转信息填写页面
    wx.navigateTo({
      url: '../addAddr/addAddr'
    })
  },
  alterUserInfo(){
    // 修改地址信息
    var url = '../addAddr/addAddr?userInfo=' + JSON.stringify(this.data.userInfo[0]);
    wx.navigateTo({
      url
    })
  },
  toPay(){
    // 返回 toPay 页面
    var url = '../pay/pay?userInfo=' + JSON.stringify(this.data.userInfo[0])
    wx.navigateTo({      
      url
    })
  }
})