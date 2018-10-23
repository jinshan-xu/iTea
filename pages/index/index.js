//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    leftList: [
      {         
        id: "xinpin",
        name: "叹茶新品"
      },
      { 
        id: "binggan",
        name: "鲜美小食"
      },
      {
        id: "miao",
        name: "芝士茗茶"
      },      
      {
        id: "huangguan",
        name: "当季限定"
      },
      { 
        id: "shuiguo1",
        name: "满杯鲜果"
      },
      {
        id: "cake",
        name: "茶冰淇淋"
      },
      { 
        id: "mangguo",
        name: "芒果家族"
      },
      { 
        id: "caomei",
        name: "草莓家族"
      },
      {
        id: "zhenzhunaicha",
        name: "混合茶饮"
      },
      {
        id: "tiandian",
        name: "甜点小食"
      },
      {
        id: "zhishi",
        name: "多多加料"
      },
      {
        id: "linggan",
        name: "灵感提示"
      }      
    ],
    curIndex: 0,
    isScroll: true,
    scrollTop: 1,
    toView: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  getUserInfo: function(e) {
    
  },
  switchTab: function(e){  
    console.log(e.target);    
    this.setData({            
      toView: "xinpin",
      curIndex: e.target.dataset.index
    });
  }
})
