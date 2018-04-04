// pages/product/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate_id:0,
    isloading:true,
    page:1,
    has_mre:true
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
          if (json.code == 200) {
              if (json.result.length % 2 == 1) json.result.push({})
              this.setData({
                  cates: json.result,
                  cate_id: this.data.cate_id ? this.data.cate_id : json.result[0].class_id
              })
              this.loadData()
          }
      })
  },
  loadData:function(){
      var cid = this.data.cate_id
      app.httpPost('mall/List', { id:cid},json => {
          if (cid == this.data.cate_id){
          if (json.code == 200 ) {
              if (json.result.data.length % 2 == 1) json.result.data.push({})
              var pageData = json.result.pageData
              this.setData({
                  lists: json.result.data,
                  page:pageData.page+1,
                  has_more: pageData.page < pageData.totalPage,
                  isloading:false
              })
          }else{
              this.setData({
                  lists: [],
                  page: 1,
                  has_more: false,
                  isloading: false
              })
          }
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
        cate_id:id,
        lists:[],
        isloading: true,
        page:1,
        has_more:true
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