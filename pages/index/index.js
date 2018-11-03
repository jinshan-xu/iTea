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
    proList: {}, // 所有商品列表
    curIndex: 0,
    isScroll: true,
    scrollTop: 1,
    toView: '',
    shoppingList: {}, // {pid: [{ proDetail }, { specInfo }, { specInfo }, ...  ]  }
    selectedProSpec: {}, // 已经选中的规格参数
    orderNum: 0, // 总杯数
    totalPrice: 0, // 总价格
    proTotal: {}, // 对应商品的总数
    bgColor: "normal",
    isShowSpecBox: false,
    isShowMask: false,
    isShowDetailBox: false,  // 是否显示商品详情框
    isShowExceedBox: false,  // 是否超过 10 杯
    chosePro: {}, // 当前被选中的商品
    addToShopBtn: true, // 是否显示 加入购物车按钮
    specNum: 0, // 已经完成规格选取的商品
    disCountPrice: 0, // 大杯的加价
    price: 0, // 选规格商品的单价    
    isShowDetail: false, // 是否显示购物详情
    listDetail: [], // 购物车内商品详情
    query: null
  },
  onLoad: function (options) {
    var self = this;    
    wx.request({
      url: 'https://myserver.applinzi.com/iteaIndex/class-list',
      method: 'get',
      success: function (res) {
        self.setData({
          leftList: res.data
        });
      }
    });
    wx.request({
      url: 'https://myserver.applinzi.com/iteaIndex/banner',
      methos: 'get',
      success: function (res) {
        self.setData({
          banner: res.data
        });
      }
    });
    wx.request({
      url: 'https://myserver.applinzi.com/iteaIndex/pro-list',
      methos: 'get',
      success: function (res) {
        self.setData({
          proList: self.classProList(res.data)
        });
      }
    });
  },
  onShow: function () {

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  scrollHandle(e) {  // 处理右侧下拉事件
    var self = this;
    wx.createSelectorQuery().selectAll('.list-title').boundingClientRect(function(res){      
      for(let i=0;i<res.length;i++){
        if(res[i].top< 60 && res[i].top > 0 ){
          self.setData({
            curIndex: i
          })
          break;
        }
      }
    }).exec()          
  },

  getUserInfo: function (e) {

  },
  switchTab: function (e) {
    this.setData({
      toView: e.target.dataset.type,
      curIndex: e.target.dataset.index
    });
  },
  pay(){    
    this.setData({
      isShowSpecBox: false,
      isShowMask: false
    });
    var data = this.getDetailList();
    var dataStr = JSON.stringify(data);    
    wx.navigateTo({
      url: '../pay/pay?data=' + dataStr + '&totalPrice=' + this.data.totalPrice + '&orderNum=' + this.data.orderNum
    });
  },
  classProList: function (list) {
    var arr = {};
    var type = '';
    for (let item of list) {
      type = item.type;
      if (!arr[type]) {
        arr[type] = {};
      }
      if (!arr[type]['data']) {
        arr[type]['data'] = [];
      }
      arr[type]['listOrder'] = item.list_order;
      arr[type]['data'].push(item);
    }
    return arr;
  },
  alertNum(n) {
    this.setData({
      bgColor: n > 0 ? "alertNum" : "normal"
    });
  },
  showDetailBox(e){
    var pid = e.currentTarget.dataset.pid;
    this.addChosePro(pid);  // 创建 chosePro
    var price = this.getPrice();     // 获取商品 price    
    this.setData({
      isShowMask: true,
      isShowDetailBox: true,
      price
    });
  },
  plus(e) {    
    var pid = e.currentTarget.dataset.pid;
    var plus = e.target.dataset.plus;
    var shoppingList = this.data.shoppingList;
    var price = e.currentTarget.dataset.price;
    if (plus == 1) {
      if(this.checkNum()){
        return;
      }
      if (shoppingList[pid]) {
        shoppingList[pid].add.num++;
      } else {
        shoppingList[pid] = {};
        var obj = this.getObj(pid)
        shoppingList[pid].pro = obj;
        shoppingList[pid].add = {};
        shoppingList[pid].add.num = 1;
        var price = (parseFloat(obj.new_price) * parseFloat(obj.dis_count)).toFixed(1);
        shoppingList[pid].add.price = price;
      }
      this.setData({
        shoppingList: shoppingList
      });
    }
    if (plus == -1) {
      var num = shoppingList[pid].add.num;
      if (num == 1) {
        delete shoppingList[pid];
      } else {
        shoppingList[pid].add.num--;
      }
      this.setData({
        shoppingList
      });
    }
    if(!plus){ 
      return;
   }
    this.alterOrderNum(plus); // 修改所选总杯数
    this.plusSpecProPrice(plus, price);
  },
  getObj(pid) { // 获取对应 pid 的商品信息
    var list = this.data.proList;
    for (let key in list) {
      for (let obj of list[key].data) {
        if (obj.pid == pid) {
          return obj;
        }
      }
    }
    return {};
  },
  choseSpec(e) { // 点击 选规格 按钮
    var pid = e.target.dataset.pid;
    var proObj = this.getObj(pid); // 获取当前选中的商品信息         
    var price = this.getDisCountPrice(proObj);
    this.alterSlectedProSpec(pid, proObj);
    this.setData({
      isShowMask: true,
      isShowSpecBox: true,
      isShowDetailBox: false,
      chosePro: proObj, // chosePro 保存当前被选中的商品     
      disCountPrice: price
    });
    var price = this.getPrice();
    var idKey = this.getKey();
    // 首先判断此商品以及默认规格是否已经被添加进入 shoppingList        
    this.setData({
      addToShopBtn: !this.isSeleInList(idKey), // 显示 添加进购物车 按钮
      specNum: this.getSpecNum(idKey),
      price
    });
  },
  alterSlectedProSpec(pid, proObj) { // 构建商品规格对象    
    var selectedProSpec = {};
    var arr = ['spec', 'mate', 'top_mate', 'bot_mate', 'taste', 'sugar', 'sta', 'temp'];
    for (let i in arr) {
      selectedProSpec[arr[i]] = {};
      selectedProSpec[arr[i]].arr = proObj[arr[i]].split('#');
      selectedProSpec[arr[i]].order = parseInt(i);
      selectedProSpec[arr[i]].selectIndex = 1;
    }
    this.setData({
      selectedProSpec: selectedProSpec // 保存商品规格对象    
    });
  },
  hide() {
    this.setData({
      isShowMask: false,
      isShowSpecBox: false,
      isShowDetail: false,
      isShowDetailBox: false
    });
  },
  addToShop() {
    if(this.checkNum()){ return; }
    // 在选择规格页面点击 添加进购物车
    var pid = this.data.chosePro.pid;
    var shoppingList = this.data.shoppingList;
    if (!shoppingList[pid]) {
      shoppingList[pid] = {};
      shoppingList[pid].pro = this.data.chosePro;
    }
    var choseProObj = shoppingList[pid];
    var specId = this.getKey();
    choseProObj[specId] = this.getSpecObj();
    choseProObj[specId].num = 1; // 第一次点击 添加 时将 num=1 写入 shoppingList
    choseProObj[specId].price = this.data.price;
    shoppingList[pid] = choseProObj;
    this.setData({
      shoppingList,
      addToShopBtn: false,
      specNum: 1
    });
    this.getProTotal();
    this.alterOrderNum(1); // 更新总杯数 
    this.plusSpecProPrice(1); // 更新总价       
  },
  confirmSpec(e) { // 点击规格子元素
    var key = e.currentTarget.dataset.specid; // 规格名称
    var idx = e.target.dataset.idx; // 点击到的元素的 index    
    if (!(key && idx)) {
      return;
    }
    if (key == 'spec') {
      if (idx == 2) {
        var price = (parseFloat(this.data.price) + parseFloat(this.data.disCountPrice)).toFixed(1);
      } else {
        price = this.getPrice();
      }
      this.setData({
        price
      });
    }
    // 更新 selectedProSpec 对象     
    var selectedProSpec = this.data.selectedProSpec;
    selectedProSpec[key].selectIndex = idx;
    var idKey = this.getKey(); // 获取 规格对应子项目的 index    
    var num = this.getSpecNum(idKey);
    this.setData({
      selectedProSpec,
      // 根据是否存在于所商品列表选中显示/隐藏 添加到购物车列表
      addToShopBtn: !this.isSeleInList(idKey),
      specNum: num
    });
  },
  getDisCountPrice(obj) { // 传入商品的大杯价格
    var price = obj.new_price * .2;
    var p = parseInt(price);
    return price - p > .5 ? p + .5 : p;
  },
  getKey() { // 从 selectedProSpec 的 selectIndex 中获取 id 
    var arr = [];
    var selectedProSpec = this.data.selectedProSpec;
    for (let key in selectedProSpec) {
      arr[selectedProSpec[key].order] = selectedProSpec[key].selectIndex;
    }
    return arr.join('_');
  },
  getSpecStr() {
    var arr = [];
    var selectedProSpec = this.data.selectedProSpec;
    for (let key in selectedProSpec) {
      var item = selectedProSpec[key];
      arr[item.order] = item.arr[item.selectIndex];
    }
    return arr.join('，');
  },
  getSpecObj() { // 获取 selectedProSpec 对象中除去 arr 的所有数据    
    var selectedProSpec = JSON.parse(JSON.stringify(this.data.selectedProSpec));
    for (let key in selectedProSpec) {
      delete selectedProSpec[key].arr;
    }
    selectedProSpec.specString = this.getSpecStr();
    return selectedProSpec;
  },
  getChoseProId() { // 获取当前选中的产品的 pid
    return this.data.chosePro.pid;
  },
  isSeleInList(idList) { // 所选规格序列是否已经存在于购物列表中
    var pid = this.getChoseProId();
    var shoppingList = this.data.shoppingList;
    if (shoppingList[pid]) {
      return (idList in shoppingList[pid]);
    }
    return false;
  },
  getSpecNum(idKey) { // 获取对应 idKey 下的 num    
    var pid = this.getChoseProId();
    var temp = this.data.shoppingList[pid];
    if (typeof temp === 'object' && temp[idKey]) {
      return temp[idKey].num;
    } else {
      return 0;
    }
  },
  alterSpecNum(e) { // 修改选定规格的商品的个数        
    var pid = this.getChoseProId();
    var idKey = this.getKey();
    var shoppingList = this.data.shoppingList;
    var num = shoppingList[pid][idKey].num;
    var plus = e.target.dataset.plus;
    if (plus == 1) { // 如果是 +
      if(this.checkNum()){ return; }
      num++;
      shoppingList[pid][idKey].num++;
    }
    if (plus == -1) { // 如果是 -
      if (num > 1) {
        shoppingList[pid][idKey].num--;
        num--;
      } else {
        shoppingList[pid][idKey].num = 0;
        delete shoppingList[pid][idKey]; // 数量为 0 将对应对象删除        
        num = 0;
      }
    }
    if (num != 0) {
      shoppingList[pid][idKey].price = this.data.price; // 将对应规格的单价添加进去
    }
    this.setData({
      shoppingList, // 更新 shoppingList 中对应商品对应规格列表中的 num
      addToShopBtn: num ? false : true,
      specNum: num
    });
    this.getProTotal(); // 更新视图中的 proTotal 数据 
    this.alterOrderNum(plus); // 更新总杯数  
    this.plusSpecProPrice(plus); //  更新总价      
  },
  getProTotal() { // 获取某一商品被选择的所有个数    
    var shoppingList = this.data.shoppingList;
    var obj = {};
    if (shoppingList != {}) {
      for (let key in shoppingList) {
        var sum = 0;
        for (let k in shoppingList[key]) {
          if ('num' in shoppingList[key][k]) {
            sum += parseInt(shoppingList[key][k].num);
          }
        }
        obj[key] = sum;
      }
    }
    this.setData({
      proTotal: obj
    });
  },
  getPrice() { // 更新当前商品的折后价格,不包括大杯价格
    var price = this.data.chosePro.new_price;
    var disCount = this.data.chosePro.dis_count;
    return (price * disCount).toFixed(1);
  },
  alterOrderNum(signal) { // 修改 orderNum  总杯数
    var i = signal < 0 ? -1 : 1;
    this.setData({
      orderNum: this.data.orderNum + i
    });
  },
  plusSpecProPrice(signal, price) { // 选取带规格商品时修改 totalPrice 总价格
    var i = signal > 0 ? 1 : -1;
    var p = price ? price : this.data.price;
    var resPrice = parseFloat(this.data.totalPrice) + parseFloat(p) * i;
    this.setData({
      totalPrice: resPrice.toFixed(1)
    });
  },
  showDetail() {
    var arr = this.getDetailList();
    this.setData({
      isShowMask: true,
      isShowSpecBox: false,
      isShowDetail: true,
      isShowDetailBox: false,
      listDetail: arr
    });
  },
  clearShoppingList(e) { // 清楚购物车    
    this.setData({
      shoppingList: {},
      proTotal: {},
      orderNum: 0,
      totalPrice: 0,
      isShowMask: false
    });
  },
  getDetailList() { // 购物车内商品列表 
    // [ specId: {pid , specId, title, price, oldPri, image, specStr, num } ]
    var list = this.data.shoppingList;
    var arr = [];
    for (let key in list) {
      var obj = {};
      var pro = list[key].pro;
      if ('add' in list[key]) { // 不需要选取规格的商品
        obj = {
          pid: key,
          specId: undefined,
          title: pro.name,
          price: list[key].add.price,
          oldPri: pro.dis_count == 1 ? 0 : pro.new_price,
          img: pro.img,
          specStr: undefined,
          num: list[key].add.num
        }
        arr.push(obj);
      } else {
        for (let item in list[key]) {
          var obj = {};
          if (item != 'pro') {
            obj = {
              pid: key,
              specId: item,
              title: pro.name,
              price: list[key][item].price,
              oldPri: pro.dis_count == 1 ? 0 : pro.new_price,
              img: pro.img,
              specStr: list[key][item].specString,
              num: list[key][item].num
            }
            arr.push(obj);
          }
        }
      }
    }
    return arr;
  },
  anotherPlus(e) { // 在购物列表中重新新加数据    
    var plus = e.target.dataset.plus;    
    var pid = e.currentTarget.dataset.pid;
    var specId = e.currentTarget.dataset.specid;
    var idx = e.currentTarget.dataset.idx;
    var listDetail = this.data.listDetail; // 修改 listDetail 商品详情列表
    var totalPrice = this.data.totalPrice; // 修改 totalPrice 总价
    var orderNum = this.data.orderNum; // 修改 orderNum 商品总数
    var shoppingList = this.data.shoppingList; // 修改 shoppingList 所有商品的 num
    var proTotal = this.data.proTotal; // 修改 proTotal 保存着 选规格 右上角数字
    if (plus == '-1') { // 点击 减
      totalPrice = (totalPrice - listDetail[idx].price).toFixed(1);
      var num1 = listDetail[idx].num;
      if (num1 == 1) {
        listDetail.splice(idx, 1);
        console.log(listDetail);
        if(listDetail.length == 0){
          this.setData({
            isShowMask: false
          });
        }
      } else {
        listDetail[idx].num--;
      }
      orderNum--;
      var num2 = proTotal[pid];
      if (num2 == 1) {
        delete proTotal[pid];
      } else {
        proTotal[pid]--;
      }
      if (!specId) {
        var num3 = shoppingList[pid].add.num;
        if (num3 == 1) {
          delete shoppingList[pid];
        } else {
          shoppingList[pid].add.num--;
        }
      } else {
        var num3 = shoppingList[pid][specId].num;
        if (num3 == 1) {
          delete shoppingList[pid];
        } else {
          shoppingList[pid][specId].num--;
        }
      }
    }
    if (plus == '1') { // 点击 加
      // 需要个数
      if(this.checkNum()){ return; }
      listDetail[idx].num++;
      orderNum++;
      proTotal[pid]++;
      totalPrice = (parseInt(totalPrice) + parseInt(listDetail[idx].price)).toFixed(1);
      if (!specId) {
        shoppingList[pid].add.num++;
      } else {
        shoppingList[pid][specId].num++;
      }
    }
    this.setData({
      listDetail,
      orderNum,
      proTotal,
      totalPrice,
      shoppingList
    });
  },
  addChosePro(pid){  // 创建 chosePro
    var proObj = this.getObj(pid); // 获取当前选中的商品信息         
    this.setData({
      chosePro: proObj
    });
  },
  checkNum(){
    var total = this.data.orderNum;
    if(total >= 10){
      if(!this.data.isShowExceedBox){
        this.setData({
          isShowExceedBox: true
        });
        setTimeout(()=>{
          this.setData({
            isShowExceedBox: false
          });
        },2000)
      }      
      return true;
    }
    else{
      return false;
    }
  }
})