//index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        banners: null,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        goods_cates: null,
        hot_news: null
    },
    onLoad: function () {

    },
    onShow: function () {
        app.getSiteInfo(siteinfo => {
            //console.log(siteinfo)
            wx.setNavigationBarTitle({
                title: siteinfo.webname,
            })
            app.initShare(this, siteinfo.webname, siteinfo.weblogo)
        })
        app.httpPost('mall/List/index', json => {
            if (json.status == 1) {
                var channels = {}
                json.data.channel.forEach(cnl => {
                    channels[cnl.name] = cnl
                })
                this.setData({
                    goods_cates: json.data.category
                })
            }
        })
        app.httpPost('site/Adv/index',{pos:'index'}, (json) => {
            //console.log(json)
            if(json && json.data){
                var banner = JSON.parse(json.data)
                banner.MultiPicture = trail.fixListImage(banner.MultiPicture, 'mPicture_url')
                this.setData({
                    banners: banner.MultiPicture
                })
            }
        })
        app.httpPost('mall/Class/index', json => {
            if (json.status == 1) {
                json.data = trail.fixListImage(json.data, 'img_url')
                this.setData({
                    news: json.data
                })
            }
        })
    },
    gotoProductList: function (e) {
        wx.navigateTo({
            url: '../product/list?cate_id=' + e.currentTarget.dataset.id,
        })
    },
    gotoProduct: function (e) {
        wx.navigateTo({
            url: '../product/detail?id=' + e.currentTarget.dataset.id,
        })
    },
    gotoNewsList: function (e) {
        wx.navigateTo({
            url: '../news/list?cate_id=' + e.currentTarget.dataset.id,
        })
    },
    gotoNews: function (e) {
        wx.navigateTo({
            url: '../news/detail?id=' + e.currentTarget.dataset.id,
        })
    }
})
