// pages/member/address-add.js
var util = require("../../utils/util.js");

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action:"添加",
    address_id:0,
    address:{},
    area:[],
    isloading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.initShare(null)
    if(options.address_id){
      this.setData({
        action:"修改",
        address_id:options.address_id
      })
      app.httpPost('user/addressget',{address_id:options.address_id},(data)=>{
        if(data.status==0){
          var areas=data.data.address.area.split('&nbsp;')
          data.data.address.area_array=areas
          data.data.area=areas
          this.setData(data.data)
        }
      })
    }else{
        wx.setNavigationBarTitle({
            title: '添加地址',
        })
    }
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
  onChanged:function(e){
    console.log(e)
    var address = this.data.address
    if (e.detail.checked) {
      address.is_default = true
    } else {
      address.is_default = false
    }
    this.setData({
      address: address
    })
  },
  checkRowTap:function(){
    var address = this.data.address
    if (!address.is_default) {
      address.is_default = true
    } else {
      address.is_default = false
    }
    this.setData({
      address: address
    })
  },
  bindValueChange:function(e){
    var address = this.data.address
    var k=e.currentTarget.dataset.key
    address[k] = e.detail.value
    this.setData({
      address: address
    })
  },
  bindAreaChange:function(e){
    //console.log(e)
    var areas=e.detail.value
    var address=this.data.address
    address.area=areas.join(' ')
    address.area_array=areas
    this.setData({
      address:address,
      area:areas
    })
  },
  bindTextAreaBlur:function(e){
    //console.log(e)
    var address = this.data.address
    address.street = e.detail.value
    this.setData({
      address: address
    })
  },
  buttonComplete:function(){
    var address=this.data.address
    if(!address.recive_name){
      app.error('请填写收货人')
      return
    }
    if (!address.mobile) {
      app.error('请填写联系电话')
      return
    }
		if (address.mobile.length == 11 && !util.checkMobile(address.mobile)){
			app.error('手机号码不正确')
		}
    if (!address.area) {
      app.error('请选择所在地区')
      return
    }
    if (!address.street) {
      app.error('请填写详细地址')
      return
    }
    this.setData({
      isloading:true
    })
		if (this.data.address.area_array.length ==1){
			this.data.address.area_array = this.data.address.area_array[0].split(" ")
			this.setData({
				address : this.data.address
			})
		}
    app.httpPost('user/addressupdate',{address:address},(data)=>{
      if(data.status==0){
        app.success('保存成功')
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        }, app.globalData.tipmsgstay)
      }else{
        app.error(data.message)
      }
    })
  }
})