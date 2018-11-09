// pages/addAddr/addAddr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: [{value: "男", isChecked: true},{value: "女", isChecked: false}],
    chooseAddress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  toAddrMap(){
    wx.navigateTo({
      url: '../addrMap/addrMap'
    })
  },
  onChangeAddress: function() {
    var _page = this;
     wx.chooseLocation({
       success: function(res) {
          _page.setData({
            chooseAddress: res.name
          });
        },
        fail: function(err) {
          console.log(err)
        }
      });
    }
})