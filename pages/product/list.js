// pages/product/list.js
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
        page:1,
        lists:[],
        has_more:true,
        isloading:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.cate_id) {
            this.setData({
                top_id : parseInt(options.cate_id)
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.httpPost('product/get_list'+this.data.top_id, json => {
            if (json.code == 1) {
                let data=json.data.lists
                data = trail.fixListImage(data, 'image')
                this.setData({
                    cates: data
                })
            }
        })
        app.getProfile(profile => {
            this.setData({
                profile: profile
            })
            this.loadData()
        })
    },
    getCateId:function(){
        return this.data.cate_id ? this.data.cate_id : this.data.top_id
    },
    loadData: function () {
        var cid = this.getCateId()
        var page = this.data.page
        
        app.httpPost('product/get_list?cate=' + cid+'&page='+page, json => {
            if (json.code == 1 && cid == this.getCateId()) {
                let products=json.data.lists
                products = trail.fixProductList(products,this.data.profile.level)
                if (products.length % 2 == 1) products.push({})
                this.setData({
                    lists: this.data.lists.concat(products),
                    page: this.data.page+1,
                    has_more: json.data.total_page>=page,
                    isloading:false
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.has_more) {
            this.setData({
                isloading:true
            })
            this.loadData()
        }
    },

    changeCategory: function (e) {
        var id = e.currentTarget.dataset.id
        this.setData({
            page:1,
            cate_id: id,
            lists:[],
            isloading:true
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