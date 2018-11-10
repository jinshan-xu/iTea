// pages/addAddr/addAddr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: [{value: "先生", isChecked: true},{value: "女士", isChecked: false}],    
    uname: '',    
    phone: '',
    addr: '',
    houseNum: '',
    gender: '',
    userInfo: {}    // 最终的用户收货信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.userInfo){    
      // 如果前一个页面有传值, 则修改  
      var userInfo = JSON.parse(options.userInfo);
      var {uname, phone, addr, gender, houseNum} = userInfo;
      var sex = this.data.sex;
      if(gender == '先生'){
        sex[0].isChecked = true;
        sex[1].isChecked = false;
      }
      else{
        sex[0].isChecked = false;
        sex[1].isChecked = true;
      }
      this.setData({
        userInfo,
        sex, uname, phone, gender, houseNum, addr
      })
    }           
  },

  toAddrMap(){
    wx.navigateTo({
      url: '../addrMap/addrMap'
    })
  },
  onChangeAddress: function() {
    var _this = this;
     wx.chooseLocation({
       success: function(res) {                  
          _this.setData({
            addr: res.name
          });
          console.log(_this.data.addr);
          console.log('ongchange run')
        },
        fail: function(err) {
          console.log(err)
        }
      });
  },
  getUname(e){    
    var uname = e.detail.value;    
    this.setData({
      uname
    })
  },
  getPhone(e){
    var phone = e.detail.value;    
    // 验证手机号！
    var reg = /^[0-9]{11}$/
    if(!reg.test(phone)){      
      wx.showToast({
        title: '请检查手机号码格式！',
        duration: 2000,        
        icon: 'none'
      })
      return
    }
    this.setData({
      phone
    })
  },
  getAddr(e){
    var addr = e.detail.value;
    
    this.setData({
      addr
    })
    console.log(this.data.addr);
    console.log('getAddr run ');
  },
  getHouseNum(e){
    var houseNum = e.detail.value;
    this.setData({
      houseNum
    })
  },
  getGender(e){
    var gender = e.detail.value;
    this.setData({
      gender
    })
  },
  confirmInfo(){  // 确认用户信息
    var {uname, gender, phone, addr, houseNum} = this.data    
    var userInfo = {
      uname, gender, phone, addr, houseNum
    }
    this.setData({
      userInfo
    })
    if(!addr){
      wx.showToast({
        title: '请选择收货地址！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(phone == ''){
      console.log(phone)
      wx.showToast({
        title: '请填写联系电话！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var url = '../addr/addr?userInfo=' + JSON.stringify(userInfo); 
    wx.navigateTo({
      url      
    })
  },
  toAddrMap(){  // 跳转到自写的 addrMap 页面, 仅作演示使用
    wx.navigateTo({
      url: '../addrMap/addrMap'
    })
  }
})