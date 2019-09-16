// pages/about/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      siteinfo:null,
      lists:[],
      map:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.getSiteInfo(siteinfo=>{
          this.setData({
              siteinfo: siteinfo
          })
          if (siteinfo.location) {
              this.setData({
                  map: {
                      id: 1,
                      title: '公司位置',
                      content:siteinfo.address,
                      coordinate: siteinfo.location
                  }
              })
          }
            app.initShare(this, siteinfo.webname + '-公司介绍', siteinfo.weblogo)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('page/pages?group=about',(json)=>{
          if(json.code==1){
              this.setData({
                  lists:json.data
              })
          }
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  gotoDetail:function(e){
    wx.navigateTo({
        url: 'detail?id=' + e.currentTarget.dataset.id,
    })
  },
  callPhone:function(e){
      wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.telephone,
      })
  },
  openMap:function(e){
      var coordinate = e.currentTarget.dataset.coordinate.split(',')
      wx.openLocation({
          latitude: parseFloat(coordinate[1]),
          longitude: parseFloat(coordinate[0]),
          name: this.data.siteinfo.webname,
          address: this.data.map.content
      })
  }
})