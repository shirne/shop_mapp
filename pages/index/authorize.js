// pages/index/authorize.js
const app=getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo:null,
        detail:null,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
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
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    this.doCallback()
                }
            }
        })
    },

    doCallback(){
        if(app.login){
            //console.log(app.login)
            //app.login.isauthing = false
            app.login.doLogin(success => {
                wx.navigateBack({
                    success:res=>{
                        app.login.isauthing = false
                    }
                })
            })
        }else{
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
        
    },

    bindReturns(e){
        if(e && e.detail && e.detail.rawData){
            this.data.userinfo = e.detail.userInfo
            this.data.detail = e.detail
            
            this.doCallback()
        }
    }

})