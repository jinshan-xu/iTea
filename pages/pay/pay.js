// pages/pay/pay.js
var globalData = getApp().globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    proList: [],  // 订单列表
    orderNum: 0,  // 总数
    totalPrice: 0,  // 总价
    isSelfGet: true, // 是否自取
    disCountPrice: 0, // 总共优惠金额
    phone: undefined,
    hasAddr: false,      // 是否有地址传回来
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(options.data){
      // 是否从 index 页面传回来
      var proList = JSON.parse(options.data);
      var orderNum = options.orderNum;
      var totalPrice = options.totalPrice;
      var disCountPrice = this.getDisPri(proList);    
      this.setData({
        proList, orderNum, totalPrice, disCountPrice
      });
      // 将购物车商品信息保存到全局      
      globalData.proList = proList;
      globalData.orderNum = orderNum;
      globalData.totalPrice = totalPrice;
      globalData.disCountPrice = disCountPrice;
    }
    else{  // 否则向全局找数据
      this.setData({
        proList: globalData.proList, 
        orderNum: globalData.orderNum,
        totalPrice: globalData.totalPrice,          
        disCountPrice: globalData.disCountPrice,
        isSelfGet: globalData.isSelfGet
      });
    }

    if(options.userInfo){
      // 填写了地址
      var userInfo = JSON.parse(options.userInfo);
      this.setData({
        hasAddr: true,
        userInfo
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
  },
  getDisPri(arr){  // 计算应付金额
    var disCountPrice = 0;    
    for(let item of arr){
      var price = item.oldPri == 0 ? item.price : item.oldPri;
      disCountPrice += parseFloat(price - item.price) * item.num;      
    }    
    return disCountPrice.toFixed(1);
  },
  toTicket(){
    wx.navigateTo({
      url: '../ticket/ticket'
    })
  },
  toRemark(){
    wx.navigateTo({
      url: '../remark/remark'
    })
  },
  toAddAddr(){
    globalData.isSelfGet = false;
    wx.navigateTo({
      url: '../addr/addr'
    })
  },
  getPhoNum(e){
    var num = e.detail.value;
    console.log(num);
  },
  pay(){
    wx.requestPayment(
      {
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success':function(res){
        
      },
      'fail':function(res){
        
      },
      'complete':function(res){}
      })
  }
})