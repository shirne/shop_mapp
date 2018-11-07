// pages/product/detail.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      currentIndex:1,
      screenWidth:500,
      id: 0
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
      var sysInfo=wx.getSystemInfoSync()
      //console.log(sysInfo)
      this.setData({
          screenWidth:sysInfo.windowWidth
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('product/view' ,{id:this.data.id}, json => {
          if (json.code == 1) {
              let product=json.data.product
              product.image = trail.fixImageUrl(product.image)
              product.content = trail.fixContent(product.content)
              let albums = trail.fixListImage(json.data.images, 'image')
              let skus = trail.fixListImage(json.data.skus, 'image')
              this.setData({
                  model: product,
                  albums:albums,
                  skus:skus
              })
              app.initShare(this, product.title, product.image)
          }
      })
  },
  bannerChange: function (e) {
      this.setData({
          currentIndex:e.detail.current
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