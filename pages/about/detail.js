// pages/about/detail.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
var html = require("../../utils/HtmlToNodes.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
      model:null,
      images:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.id) {
          this.setData({
              id: parseInt(options.id)
          })
          this.params={id:this.data.id}
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('page/page', {name:this.data.id}, json => {
          if (json.code == 1) {
              let data=json.data.page
              data.icon = trail.fixImageUrl(data.icon)
              data.content = html.HtmlToNodes(data.content, trail.fixTag)
              this.setData({
                  model: data,
                  images:json.data.images
              })
              wx.setNavigationBarTitle({
                  title: data.title,
              })
              app.initShare(this, data.title, data.icon)
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

})