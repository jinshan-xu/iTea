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
    toView: ''
  },
  onLoad: function(options){
    var self = this;    
    wx.request({
      url: 'http://127.0.0.1:3001/index/class-list',      
      method: 'get',
      success: function(res) {        
      self.setData({
        leftList: res.data
      });  
      }
    });
    wx.request({      
      url: 'http://127.0.0.1:3001/index/banner',
      methos: 'get',
      success: function(res){        
        self.setData({
          banner: res.data
        });
      }
    });
    wx.request({      
      url: 'http://127.0.0.1:3001/index/pro-list',
      methos: 'get',
      success: function(res){
        console.log(self.classProList(res.data));             
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
    // list -> [{},{}...]
    // target -> proList -> [ [{},{}..], [{}],..]
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
  }
})
