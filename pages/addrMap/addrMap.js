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
    selectedIdx: 0,  // 选中的位置序号
    pageIdx: 1,
    toLocation: false,  // 点击回到位置
    jump: false,        // 指针是否跳动
    isShowWait: false,  // 是否显示加载框
    isShowMsg: false    // 是否显示信息提示
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
  },

  pointerJump(){    
    this.setData({
      jump: true
    });
    setTimeout(()=>{
      this.setData({
        jump: false
      });
    },300)
  },
  // 拖动地图时移动 marker
  handleChange(e){        
    var _this = this;  
    
    // 只有当拖动改变视图 / 拖动结束 时才会执行
    if(e.type == "end" && e.causedBy == "drag"){          
      this.getRecPos(true);
      // 每次拖动地图将 重新选中第一个推荐地址
      this.setData({
        selectedIdx: 0
      });      
      this.pointerJump();
      this.setData({
        toLocation: false   // 修改位置标识颜色
      });
    }      
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

  changePosition(location){   // 修改地图中心经纬度    
    this.setData({
      location
    });
  },

  getRecPos(flag){   // 获取推荐地址
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
              _this.search(landMark.title, flag);
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

  search(location, flag){  // 关键字查询返回模糊匹配结果    
    var _this = this;
    this.qqMap.search({      
      address_format: 'short',
      keyword: location,
      page_size: 10,
      page_index: flag?1: _this.data.pageIdx,  // 默认搜索第一页
      success(res){        
        // console.log(res);                                
        // 如果是拖动地图 flag = true 将 recPos 直接赋值
        if(flag){
          _this.setData({
            recPos: res.data,
            isShowWait: false
          });          
        }
        else{ // 如果是加载更多, 就拼接 recPos
          if(res.data.length == 0){
            _this.showMsg();
          }
          var rec = _this.data.recPos;
          var recPos = rec.concat(res.data);
          _this.setData({
            recPos,
            isShowWait: false
          });
        }                
      }
    })
  },

  selectPos(e){  // 选中位置    
    var tar = e.currentTarget.dataset;
    var idx = tar.id;    
    if(idx !== undefined){      
      var location = {
        latitude: tar.lat,
        longitude: tar.lng
      }
      // 转换地图中心位置
      this.changePosition(location);      
      this.pointerJump();
      this.setData({
        selectedIdx: idx
      });
    }
  },

  getMorePosi(e){ 
    // 下拉刷新获取更多地址推荐        
    if(e){
      var pageIdx = this.data.pageIdx;      
      this.setData({
        pageIdx: ++pageIdx,
        isShowWait: true
      });      
      this.getRecPos(false); // 加载更多, 使用 concat 连接数组
    }    
  },

  showMsg(){  // 搜索到底
    this.setData({
      isShowMsg: true
    })
    setTimeout(()=>{
      this.setData({
        isShowMsg: false
      })
    }, 2000)
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('pulldown')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('reach bottom')
  }

})