// pages/product/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.getSiteInfo((siteinfo) => {
          app.initShare(this, siteinfo.webname+'-产品中心', siteinfo.weblogo)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('mall/Class', json => {
          if (json.status == 1) {
              json.data = trail.fixListImage(json.data,'img_url')
              if(json.data.length % 2==1)json.data.push({})
              this.setData({
                  cates: json.data
              })
          }
      })
  },
  loadData:function(){
      var cid = this.data.cate_id
      app.httpPost('mall/List', json => {
          if (json.status == 1 && cid == this.data.cate_id) {
              json.data.forEach(item => {
                  item.img_url = app.globalData.imgDir + item.img_url
              })
              this.setData({
                  lists: json.data
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
  gotoList: function (e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
          url: 'list?cate_id=' + id,
      })
  },
  changeCategory:function(e){
    var id=e.currentTarget.dataset.id
    this.setData({
        cate_id:id
    })
    this.loadData()
  },
  gotoDetail:function(e){
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
          url: 'detail?id='+id,
      })
  }
})