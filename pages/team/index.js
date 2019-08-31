// pages/team/index.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total_count: 0,
        total_award: 0,
        order_count_7:0,
        rewards_7:0,
        member: {
            niakname: '请登录',
            avatar: '/images/avatar-default.png',
            reward: 0
        },

        loadok: false,
        pullend: false,
        pulldown: 0,
        downY: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.initShare(null);
        app.getProfile((profile) => {
            this.setData({
                member: profile
            })
        })
        this.loadData()
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
    loadData(){
        
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDown: function () {

        this.setData({
            page: 1,
            lists: [],
            has_more: true,
            isloading: true
        })
        this.loadData()
    },
    onTouchStart(e) {
        this.setData({
            downY: e.touches[0].pageY,
            pullend: false
        })
    },
    onTouchMove(e) {
        let downY = this.data.downY
        this.setData({
            pulldown: e.touches[0].pageY - downY
        })
    },
    onTouchEnd(e) {
        this.setData({
            pullend: true,
            loadok: false
        })
    },
    onLoading(e) {
        app.getProfile((profile) => {
            this.setData({
                member: profile
            })
            this.loadData(res => {
                this.setData({
                    loadok: true
                })
            })
        }, true)

    },
    gotoUrl(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
})