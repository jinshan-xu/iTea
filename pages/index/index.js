//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    leftList: [],
    banner: [],    
    proList: {},
    curIndex: 0,
    isScroll: true,
    scrollTop: 1,
    toView: '',    
    selectPro: [{/*pid: true*/},{/*pid: num*/},{/*pid: price*/}],  // pidList pNumList
    orderNum: 0,
    totalPrice: 0,
    bgColor: "normal"
  },
  onLoad: function(options){
    var self = this;    
    wx.request({
      url: 'https://myserver.applinzi.com/iteaIndex/class-list',      
      method: 'get',
      success: function(res) {        
      self.setData({
        leftList: res.data
      });  
      }
    });
    wx.request({      
      url: 'https://myserver.applinzi.com/iteaIndex/banner',
      methos: 'get',
      success: function(res){        
        self.setData({
          banner: res.data
        });
      }
    });
    wx.request({      
      url: 'https://myserver.applinzi.com/iteaIndex/pro-list',
      methos: 'get',
      success: function(res){                    
        self.setData({
          proList: self.classProList(res.data)
        });               
      }
    });
  },
  onShow: function(){
   
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo: function(e) {
    
  },
  switchTab: function(e){        
    this.setData({            
      toView: e.target.dataset.type,
      curIndex: e.target.dataset.index
    });
  },
  classProList: function(list){
    var arr = {};
    var type = '';
    for(let item of list){                         
      type = item.type;               
      if(!arr[type]){
        arr[type] = {};          
      }              
      if(!arr[type]['data']){
        arr[type]['data'] = [];
      }
      arr[type]['listOrder'] = item.list_order;      
      arr[type]['data'].push(item);
    }
    return arr;
  },
  addProNum: function(e){       
    var pid = e.target.dataset.pid;
    var price = e.target.dataset.price;
    var selectPro = this.data.selectPro;
    var orderNum = this.data.orderNum;        
    if(orderNum > 8){
      this.alertNum(1);
    }
    selectPro[0][pid] = true;
    var num = selectPro[1][pid];
    num = num ? num + 1 : 1; 
    selectPro[1][pid] = num;    
    selectPro[2][pid] = price;
    this.setData({
      selectPro,
      orderNum: orderNum + 1,
      totalPrice: this.data.totalPrice + price
    });
  },
  minsProNum: function(e){
    var pid = e.target.dataset.pid;
    var price = e.target.dataset.price;
    var selectPro = this.data.selectPro;    
    var num = selectPro[1][pid];
    num = num ? num - 1 : 0; 
    var orderNum = this.data.orderNum;
    orderNum = orderNum === 0 ? 0 : orderNum - 1;
    if(orderNum <= 9){
      this.alertNum(-1);
    }
    if(!num){
      selectPro[0][pid] = false;
    }
    selectPro[1][pid] = num;        
    this.setData({
      selectPro,
      orderNum: orderNum,
      totalPrice: this.data.totalPrice - price
    });
  },
  alertNum(n){
    this.setData({
      bgColor: n > 0 ? "alertNum" : "normal"
    });
  }
})
