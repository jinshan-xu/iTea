// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: [],  // 订单列表
    totalNum: 0,  // 总数
    totalPrice: 0,  // 总价
    isSelfGet: true, // 是否自取

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var proList = JSON.parse(options.data);
    // var orderNum = options.orderNum;
    // var totalPrice = options.totalPrice;
    // this.setData({
    //   proList, orderNum, totalPrice
    // });
    wx.navigateTo({
      url: '../index/index'
    })
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
  getWay(e){
    var way = e.currentTarget.dataset.way;
    var flag = false;
    if(way == 'self') {
      flag = true;
    }
    else if(way == 'takeaway'){
      flag = false;
    }
    else{
      return;
    }
    this.setData({
      isSelfGet: flag
    });
  }
})