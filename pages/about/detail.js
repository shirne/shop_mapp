// pages/about/detail.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.id) {
          this.setData({
              id: parseInt(options.id)
          })
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('page/Info' + this.data.id, json => {
          if (json.status == 1) {
              json.data.img_url = trail.fixImageUrl(json.data.img_url)
              json.data.content = trail.fixContent(json.data.content)
              this.setData({
                  model: json.data
              })
              wx.setNavigationBarTitle({
                title: json.data.title,
              })
              app.initShare(this, json.data.title, json.data.img_url)
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
  
  }
})