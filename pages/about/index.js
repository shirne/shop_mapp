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
      lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.getSiteInfo(siteinfo=>{
          this.setData({
              siteinfo: siteinfo
          })
            app.initShare(this, siteinfo.webname + '-公司介绍', siteinfo.weblogo)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('page/Info',(json)=>{
          if(json.status==1){
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
  }
})