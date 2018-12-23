// pages/member/address.js
var util = require("../../utils/util.js");

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default_id:0,
    addresses:[],
    deleted:{},
    isloading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.initShare(null)
    
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
    var self = this;
    app.checkLogin(() => {
        app.httpPost('member/addresses', {}, (data) => {
        if (data.code == 1) {
          var addresses = data.data
          var default_id = 0
          for (var i = 0; i < addresses.length; i++) {
            if (addresses[i].is_default) {
              default_id = addresses[i].address_id
            }
          }
          self.setData({
            default_id: default_id,
            addresses: addresses,
            isloading: false
          })
        }
      })
    })
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
  onSetDefault:function(e){
    e.detail.stop=true
    var defaultid=e.detail.value
    if(defaultid==this.data.default_id)return;
    var self=this
    app.confirm('您确定将所选地址设为默认地址？',()=>{
      app.httpPost('user/addressdefault',{address_id:defaultid},(data)=>{
        self.setData({
          default_id:defaultid
        })
        app.success('设置成功')
      })
    })
  },
  addAddress:function(){
    wx.navigateTo({
      url: 'address-add',
    })
  },
  editAddress:function(e){
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'address-add?address_id='+id,
    })
  },
  delAddress:function(e){
    var id = e.currentTarget.dataset.id
    var self=this
    app.confirm('您是否确认删除该地址？',()=>{
      app.httpPost('user/addressdel',{address_id:id},(data)=>{
        if(data.status==0){
          app.success('删除成功')
          var deleted = self.data.deleted
          deleted[id] = true
          self.setData({
            deleted: deleted
          })
        }else{
          app.error(data.message||"删除失败")
        }
      })
      
    })
  },
  addFromWechat:function(){
    var self=this
    wx.chooseAddress({
      success:(res)=>{
        //console.log(res)
        var address=Models.Address()
        address.recive_name = res.userName
        //address.recive_name = res.postalCode
        address.area = res.provinceName+' '+res.cityName+' '+res.countyName
        address.area_array = [res.provinceName, res.cityName, res.countyName]
        //address.recive_name = res.cityName
        //address.recive_name = res.countyName
        address.street = res.detailInfo
        //address.recive_name = res.nationalCode
        address.mobile = res.telNumber
        
        wx.showLoading({
          title: '正在提交'
        })
        app.httpPost('user/addressupdate',
        {address:address},
        (data)=>{
          wx.hideLoading()
          if(data.status==0){
            app.success('保存成功')
            self.onShow()
          }else{
            app.error(data.message)
          }
        })
      }
    })  
  }
})