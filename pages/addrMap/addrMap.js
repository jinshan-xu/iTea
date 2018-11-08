// pages/addrMap/addrMap.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var map;
Page({
  data: {
    polyline: [],
    location: {
      latitude: 22.72174,
      longitude:114.06301
    },
    markers: [{
      latitude: 22.72174,
      longitude:114.06301,
      id: 1,
      name: '当前选中位置',    
    }],
    recPos: [],
    selectedIdx: 0  // 选中的位置序号
  },

  onLoad: function (options) {
    // 初始化创建地图对象
    this.mapCtx = wx.createMapContext('myMap'); 
    // 获取授权   
    wx.getSetting({
      success(res) {               
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success () {            
              console.log("ok");
            }
          })
        }
      }
    });    
    // 获取腾讯地图控制对象
    this.qqMap = new QQMapWX({
      key: '4RABZ-ANNHS-RBYOC-6IZL2-DCYCT-HJB5G'
    })
    this.moveToLocation();
    console.log(11);
  },

  // 拖动地图时移动 marker
  handleChange(e){        
    var _this = this;    
    // 只有当拖动改变视图 / 拖动结束 时才会执行
    if(e.type == "end" && e.causedBy == "drag"){
      this.getRecPos();
    }      
  },

  initRecPosi(){
    // 地图渲染完成时获取位置推荐列表
    this.getRecPos();    
  },

  getCenterLocation(){  // 获取地图中心位置经纬度
    this.mapCtx.getCenterLocation({      
      success(res){
        return res;
      }    
    })
  },

  moveToLocation(){
    // 将地图中心定位到 当前手机地理位置
    this.mapCtx.moveToLocation();  
  },

  getLocation(){     // 获取当前位置经纬度
    wx.getLocation({
      type: 'gcj02',
      success(res) {        
        return res;       
      }
    })
  },

  changePosition(){   // 修改地图中心经纬度
    var location = this.data.location;
    var { longitude, latitude } = this.data.location;
    longitude = parseFloat(longitude - 0.001).toFixed(5);
    latitude = parseFloat(latitude - 0.001).toFixed(5);
    location.longitude = longitude;
    location.latitude = latitude;
    this.setData({
      location
    });
  },

  getRecPos(){   // 获取推荐地址
    var _this = this;
    this.mapCtx.getCenterLocation({      
      success(res){        
        // 获取此时位置的推荐地址          
        _this.qqMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            // 推荐地点 到此处地标          
            var addrRef = res.result.address_reference;
            var landMark = addrRef.landmark_11 ||   addrRef.landmark_l2;                    
            if(typeof landMark == 'object'){
              // 查询
              _this.search(landMark.title);
            }                    
          }
        });
      }    
    });
    
  },

  getSuggestion(sug){  // 关键字输入推荐
    var _this = this;
    this.qqMap.getSuggestion({
      keyword: sug,
      policy: 1,
      success(res){           
        //console.log(res);
        _this.setData({
          recPos: res.data
        });        
      } 
    })
  },

  search(location){  // 关键字查询返回模糊匹配结果    
    var _this = this;
    this.qqMap.search({      
      address_format: 'short',
      keyword: location,
      page_size: 10,
      success(res){        
        // console.log(res);
        _this.setData({
          recPos: res.data
        });        
      }
    })
  },

  selectPos(e){  // 选中位置
    console.log(e.target.dataset);
    var idx = e.target.dataset.id;
    console.log(idx);
    if(idx !== undefined){      
      this.setData({
        selectedIdx: idx
      })
    }
  }

})