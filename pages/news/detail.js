// pages/news/detail.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
var html = require("../../utils/HtmlToNodes.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        digging:false,
        digged:false
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
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.showLoading({
            title: '',
        })
        app.httpPost('article/view', { id: this.data.id} , json => {
            if (json.code == 1) {
                let data=json.data.article
                data.create_time = util.getLocalTime(data.create_time)
                data.cover = trail.fixImageUrl(data.cover)
                //json.data.content = html.HtmlToNodes(trail.fixContent(json.data.content))
                data.content = html.HtmlToNodes(data.content, trail.fixTag)
                //console.log(JSON.stringify(json.data.content))
                json.data.images = trail.fixListImage(json.data.images,'image')
                this.setData({
                    model: data,
                    images: json.data.images,
                    digged: json.data.digged
                })
                wx.setNavigationBarTitle({
                    title: data.title,
                })
                app.initShare(this, data.title, data.img_url)
            }
            wx.hideLoading()
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
    diggUp: function (e) {
        if (this.data.digged) {
            util.tip('您已经点过赞了')
            return
        }
        if (this.data.digging)return
        this.data.digging = true
        
        app.httpPost('article/digg' ,{id:this.data.id,type:'up'},json=>{
            if (json.code==1){
                let newdata={}
                newdata['modal.digg'] = json.data.digg
                newdata.digged=true
                this.setData(newdata)
                util.success('感谢点赞')
            }
            this.data.digging = false
        })
    }
})