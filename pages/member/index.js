// pages/member/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      favourite_count: 0,
      member: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.checkLogin(() => {
          wx.showLoading({
              title: '加载中',
          })
          app.httpPost('member/profile', {}, (json) => {
              wx.hideLoading()
              if (json.code == 1) {
                  json.data = trail.fixImage(json.data,'avatar')

                  this.setData({member:json.data})
              }
          })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

    gotoOrder: function (e) {
        var status = e.currentTarget.dataset.status
        wx.navigateTo({
            url: 'order?status=' + status,
        })
    },
    gotoUrl: function (e) {
        var url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    }
})