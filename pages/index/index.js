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
                title: siteinfo.name,
            })
            app.initShare(this, siteinfo.name, siteinfo.weblogo)
        })
        app.httpPost(
            'common/batch',
            {
                'product.get_list':{},
                'product.get_cates':{},
                'article.get_list':{},
                'advs':{
                    flag:'banner'
                }
            },
            json=>{
                if(json.code==1){
                    let goods = json.data['product.get_list']
                    if(goods){
                        goods = goods['lists']
                        if(goods.length % 2 == 1 ){
                            goods.push({})
                        }
                        goods = trail.fixListImage(goods, 'image')
                    }
                    let cates = json.data['product.get_cates']
                    if (cates) {
                        if (cates.length % 2 == 1) {
                            cates.push({})
                        }
                        cates = trail.fixListImage(cates, 'image')
                    }
                    let articles = json.data['article.get_list']['lists']
                    if(articles){
                        articles = articles['lists']
                        articles = trail.fixListImage(articles, 'cover')
                    }
                    let advs = json.data['advs']
                    advs = trail.fixListImage(advs,'image')

                    this.setData({
                        banners: advs,
                        goods: goods,
                        goods_cates: cates
                    })
                }
            }
        )
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
