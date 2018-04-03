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
            if (json.code == 200) {
                if(json.result.data.length%2==1){
                    json.result.data.push({})
                }
                this.setData({
                    goods: json.result.data
                })
            }
        })
        app.httpPost('site/Adv/index',{pos:'index'}, (json) => {
            //console.log(json)
            if(json.code==200){
                this.setData({
                    banners: json.result
                })
            }
        })
        app.httpPost('mall/Class/index', json => {
            if (json.code == 200) {
                this.setData({
                    goods_cates: json.result
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
