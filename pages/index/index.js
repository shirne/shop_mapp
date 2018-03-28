//index.js
//获取应用实例
var util = require("../../utils/util.js");
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    banners:null,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goods_cates:null,
    hot_news:null
  },
  onLoad: function () {
    
  },
  onShow:function(){
    app.httpPost('index',json=>{
      if(json.code==200){
        
      }
    })
    app.getSiteInfo(siteinfo=>{
      console.log(siteinfo)
      wx.setNavigationBarTitle({
        title: siteinfo.webname,
      })
    })
  },
  gotoProduct:function(e){
    wx.navigateTo({
      url: '../category/list?cate_id='+e.currentTarget.id,
    })
  }
})
