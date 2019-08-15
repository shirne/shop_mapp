//pages/home/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        userInfo: {},
        hasUserInfo: false,
        banners: null,
        midbanners:[],
        autoplay: true,
        interval: 5000,
        duration: 1000,
        cardCur: 0,
        goods_cates: null,
        hot_news: null
    },
    lifetimes: {
        attached: function () {
            app.getSiteInfo(siteinfo => {
                //console.log(siteinfo)
                wx.setNavigationBarTitle({
                    title: siteinfo.name,
                })
                var pages=getCurrentPages();
                app.initShare(pages[pages.length-1], siteinfo.name, siteinfo.weblogo)
            })
            app.httpPost(
                'common/batch', {
                    'product.get_list': {},
                    'product.get_cates': { goods_count: 3},
                    'article.get_list': {},
                    'advs': {
                        flag: 'banner'
                    },
                    'medium_advs':{
                        call:'advs',
                        flag: 'midbanner'
                    }
                },
                json => {
                    if (json.code == 1) {
                        let goods = json.data['product.get_list']
                        if (goods) {
                            goods = goods['lists']
                            goods = trail.fixListImage(goods, 'image')
                        }
                        let cates = json.data['product.get_cates']
                        if (cates) {
                            cates = trail.fixListImage(cates, 'icon,products.image')
                        }
                        let articles = json.data['article.get_list']['lists']
                        if (articles) {
                            articles = articles['lists']
                            articles = trail.fixListImage(articles, 'cover')
                        }
                        let advs = json.data['advs'], midadvs = json.data['medium_advs']
                        advs = trail.fixListImage(advs, 'image')
                        midadvs = trail.fixListImage(midadvs, 'image')
                        this.setData({
                            banners: advs,
                            midbanners: midadvs,
                            goods: goods,
                            goods_cates: cates
                        })
                    }
                }
            )
        }
    },
    methods: {
        cardSwiper: function (e) {
            this.setData({
                cardCur: e.detail.current
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
    }
})