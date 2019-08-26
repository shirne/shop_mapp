// pages/index/authorize.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo:null,
        detail:null,
        credit:false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.credit && options.credit!='0'){
            this.data.credit = true
        }
        wx.getSetting({
            success:(res)=> {
                if (res.authSetting['scope.userInfo']) {
                    if (this.data.credit){
                        wx.getUserInfo({
                            withCredentials: true,
                            success: (res) => {
                                this.data.userinfo = res.userInfo
                                this.data.detail = res
                                if (this.callbacks.length > 0) {
                                    this.doCallback()
                                }
                            }
                        });

                    }else{
                        wx.getUserInfo({
                            success:  (res)=> {
                                this.data.userinfo = res.userInfo
                                if(this.callbacks.length>0){
                                    this.doCallback()
                                }
                            }
                        })
                    }
                }
            }
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

    callbacks:[],
    addCallback(callback){
        if(this.data.userinfo){
            callback(userinfo)
            wx.navigateBack({
                
            })
        }
        this.callbacks.push(callback)
    },
    doCallback(){
        if (this.data.userinfo) {
            let func=null
            while(func = this.callbacks.shift()){
                func(this.data.credit?this.data.detail:this.data.userinfo)
            }
            wx.navigateBack({

            })
        }
    },

    bindReturns(e){
        //console.log(e)
        this.data.userinfo = e.detail.userInfo
        this.data.detail = e.detail
        //if(this.data.userinfo){
            this.doCallback()
        //}
    }

})