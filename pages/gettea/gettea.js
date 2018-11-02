// pages/gettea/gettea.js

Page({
  data: {
    toView: 'red',
    scrollTop: 0,
    hasOrder: false
  },
  onLoad: function(options){
    
  },
  toIndexPage(){
    wx.switchTab({
      url: '../index/index'
    });
  }
})