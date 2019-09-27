//pages/home/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
    },
    data: {
        userInfo: {},
        hasUserInfo: false,
        profile:{},
        banners: null,
        midbanners:[],
        autoplay: true,
        interval: 5000,
        duration: 1000,
        cardCur: 0,
        keyword:'',
        goods_cates: null,
        hot_news: null,
        isattached:false
    },
    lifetimes: {
        attached: function () {
            this.data.isattached=true
            wx.showLoading({
                title: '',
            })
            app.getSiteInfo(siteinfo => {
                if (this.data.isattached){
                    this.triggerEvent('sharedata',{
                        title: siteinfo.webname,
                        img: siteinfo.weblogo
                    })
                }
            })
            app.getProfile(profile=>{
                this.setData({
                    profile:profile
                })

                this.loadData(res => {
                    wx.hideLoading()
                })
            })
        },
        moved: function () { 
            console.log('moved')
        },
        detached: function () {
            this.data.isattached = false
        },
    },
    methods: {
        loadData(callback=null){
            app.httpPost(
                'common/batch', {
                    'product.get_list': { withsku: 1, type: 4, pagesize:4},
                    'product.get_cates': { goods_count: 4,withsku:1 },
                    'article.get_list': {},
                    'advs': {
                        flag: 'banner'
                    },
                    'four_advs': {
                        call: 'advs',
                        flag: 'fourmenu'
                    },
                    'medium_advs': {
                        call: 'advs',
                        flag: 'midbanner'
                    }
                },
                json => {
                    if (json.code == 1) {
                        let goods = json.data['product.get_list']
                        if (goods) {
                            goods = trail.fixProductList(goods['lists'], this.data.profile.level);
                        }
                        let cates = json.data['product.get_cates']
                        if (cates) {
                            cates = trail.fixListImage(cates, 'icon,products.image',400)
                            for (let i = 0; i < cates.length; i++) {
                                cates[i].products = trail.fixProductList(cates[i].products, this.data.profile.level);
                            }
                        }
                        let articles = json.data['article.get_list']['lists']
                        if (articles) {
                            articles = articles['lists']
                            articles = trail.fixListImage(articles, 'cover')
                        }
                        let advs = json.data['advs'], midadvs = json.data['medium_advs'], fourmenu = json.data['four_advs']
                        advs = trail.fixListImage(advs, 'image',[800,418])
                        midadvs = trail.fixListImage(midadvs, 'image', [800, 418])

                        if (fourmenu && fourmenu.length > 0) {
                            fourmenu = trail.fixListImage(fourmenu, 'image', [400,0])
                            if (fourmenu.length < 4) {
                                fourmenu.push({ image: '' })
                                fourmenu.push({ image: '' })
                                fourmenu.push({ image: '' })
                            }
                        }
                        this.setData({
                            banners: advs,
                            midbanners: midadvs,
                            fourmenu: fourmenu,
                            goods: goods,
                            goods_cates: cates
                        })
                    }
                    callback && callback(true)
                },
                fail=>{
                    callback && callback(false)
                }
            )
        },
        cardSwiper: function (e) {
            this.setData({
                cardCur: e.detail.current
            })
        },
        gotoUrl:function(e){
            var url = e.currentTarget.dataset.url
            if(url){
                if(url.indexOf('http://')==0 || url.indexOf('https://')==0){
                    wx.navigateTo({
                        url: '/pages/common/h5?url=' + url,
                    })
                }else{
                    if(url.indexOf('pages/')==0){
                        url = '/'+url
                    }
                    if (url.indexOf('/') !== 0) {
                        url = '/' + url
                    }
                    if (url.indexOf('/pages/') == -1) {
                        url = '/pages' + url
                    }
                    wx.navigateTo({
                        url: url,
                    })
                }
            }
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
        },
        setKeyword(e){
            this.data.keyword = e.detail.value
        },
        doSearch:function(e){
            wx.navigateTo({
                url: '../index/search?keyword=' + this.data.keyword,
            })
        }
    }
})