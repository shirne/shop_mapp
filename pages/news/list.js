// pages/news/list.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      top_id: 0,
      cate_id: 0,
      page: 1,
      lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.cate_id) {
          this.setData({
              top_id: parseInt(options.cate_id)
          })
          this.params={
              cate_id:this.data.top_id
          }
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      app.httpPost('article/get_cates?pid=' + this.data.top_id, json => {
          if (json.code == 1) {
              json.data = trail.fixListImage(json.data, 'img_url')
              this.setData({
                  cates: json.data
              })
          }
      })
  },
  getCateId: function () {
      return this.data.cate_id ? this.data.cate_id : this.data.top_id
  },
  loadData: function () {
      var cid = this.getCateId()
      app.httpPost('article/get_list?cate=' + cid+'&page='+this.data.page, json => {
          if (json.code == 1 && cid == this.getCateId()) {
              json.data=trail.fixListImage(json.data,'img_url')
              this.setData({
                  lists: this.data.lists.concat(json.data),
                  page: this.data.page + 1,
                  has_more: json.data.length > 9
              })
            }
            wx.stopPullDownRefresh()
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
      this.data.page = 1
      this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      if(this.data.has_more){
        this.loadData()
      }
  },

  changeCategory: function (e) {
      var id = e.currentTarget.dataset.id
      this.setData({
          page: 1,
          cate_id: id,
          lists: []
      })
      this.loadData()
  },
  gotoDetail: function (e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
          url: 'detail?id=' + id,
      })
  }
})