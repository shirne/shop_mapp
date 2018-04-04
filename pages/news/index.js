// pages/news/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lists:[],
        cate_id:0,
        page:1,
        has_more:true,
        isloading:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.getSiteInfo((siteinfo)=>{
            app.initShare(this,siteinfo.webname+'-新闻中心',siteinfo.weblogo)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.httpPost('article/Class/index', json => {
            if (json.code == 200) {
                
                this.setData({
                    cates: json.result,
                    cate_id: json.result[0].class_id
                })
                this.loadData()
            }
        })
    },
    loadData: function () {
        var cid = this.data.cate_id
        var page=this.data.page
        app.httpPost('article/List/index',{id:cid}, json => {
            if (cid == this.data.cate_id) {
                if (json.code == 200) {
                    var pageData=json.result.pageData
                    this.setData({
                        lists: this.data.lists.concat(json.result.data),
                        page: page+1,
                        has_more: pageData.page >= pageData.totalPage?true:false,
                        isloading: false
                    })
                }else{
                    this.setData({
                        has_more: false,
                        isloading: false
                    })
                }
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
        this.setData({
            page:1,
            lists: [],
            has_more: true,
            isloading: true
        })
        this.loadData()
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
    changeCategory: function (e) {
        var id = e.currentTarget.dataset.id
        this.setData({
            cate_id: id,
            page:1,
            has_more:true,
            lists: [],
            isloading: true
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