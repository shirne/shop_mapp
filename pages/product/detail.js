// pages/product/detail.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        currentIndex: 1,
        screenWidth: 500,
        id: 0,
        model: null,
        albums: null,
        skus: null,
        price: '',
        market_price: '',
        allstorage:0,
        good_count:1,

        maskfor:''
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
        var sysInfo = wx.getSystemInfoSync()
        //console.log(sysInfo)
        this.setData({
            screenWidth: sysInfo.windowWidth
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.httpPost('product/view', { id: this.data.id }, json => {
            if (json.code == 1) {
                let product = json.data.product
                product.image = trail.fixImageUrl(product.image)
                product.content = trail.fixContent(product.content)
                let albums = trail.fixListImage(json.data.images, 'image')
                let skus = trail.fixListImage(json.data.skus, 'image')
                skus.forEach(sku=>{
                    sku.cost_price=parseFloat(sku.cost_price)
                    sku.market_price = parseFloat(sku.market_price)
                    sku.price = parseFloat(sku.price)
                })
                this.setData({
                    model: product,
                    albums: albums,
                    skus: skus
                })
                this.setPrice()
                app.initShare(this, product.title, product.image)
            }
        })
    },
    bannerChange: function (e) {
        this.setData({
            currentIndex: e.detail.current
        })
    },
    setPrice: function () {
        let min_price=-1;
        let max_price=-1;
        let market_min_price = -1;
        let market_max_price = -1;
        if(this.data.skus){
            this.data.skus.forEach(sku=>{
                if(min_price<0){
                    min_price = sku.price
                    max_price = sku.price
                    market_min_price = sku.market_price
                    market_max_price = sku.market_price
                }else{
                    min_price = Math.min(min_price, sku.price)
                    max_price = Math.max(max_price, sku.price)
                    market_min_price = Math.min(market_min_price, sku.market_price)
                    market_max_price = Math.max(market_max_price, sku.market_price)
                }
                
            })
        }
        this.setData({
            price: max_price>min_price?(min_price+'~'+max_price):min_price,
            market_price: market_max_price > market_min_price ? (market_min_price + '~' + market_max_price) : market_min_price,
        })
    },
    openMask: function (e, frm = '') {
        var data = {
            ismask: true,
            opt_from: frm,
            maskfor: e.currentTarget.dataset.for
        }
        if (data.maskfor == 'spec') {
            /*if (!this.data.sku && this.data.product.skus instanceof Array && this.data.product.skus.length > 0) {
                data.selected = this.getSelected(this.data.product.specifications, this.data.options)
                data.sku = this.searchSku()
                data.optsku = this.getAllSku(this.data.product.skus, this.data.product.specifications)
            }*/
        }
        this.setData(data)
    },
    hideMask: function (e) {
        this.setData({
            ismask: false,
            isclosing: true,
            maskfor: ''
        })
        setTimeout(() => {
            this.setData({
                isclosing: false
            })
        }, 500)
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
    getAllStorage: function (skus) {
        var storage = 0
        for (var i = 0; i < skus.length; i++) {
            storage += parseInt(skus[i].storage) || 0
        }
        return storage
    },
    getSelected: function (specs, opts = {}) {
        var specvals = []
        var selected = []
        for (var i = 0; i < specs.length; i++) {
            if (opts[specs[i].spec_id]) {
                for (var j = 0; j < specs[i].lists.length; j++) {
                    if (specs[i].lists[j].spec_value_id == opts[specs[i].spec_id]) {
                        specvals.push(specs[i].lists[j].label)
                        break
                    }
                }
            } else {
                selected.push(specs[i].spec_name)
            }
        }
        if (selected.length > 0) {
            return "请选择 " + selected.join(' ')
        } else {
            return "已选：\"" + specvals.join('" "') + '"'
        }
    },
    getAllSku: function (skus, specs, opts = {}) {
        var allSku = {}
        for (var i = 0; i < specs.length; i++) {
            var spec_id = specs[i].spec_id
            allSku[spec_id] = {}
            var sks = skus.filter(sku => {
                if (!opts || util.countObject(opts) < 1) {
                    return true
                } else {
                    for (var j = 0; j < sku.specs.length; j++) {
                        if (sku.specs[j].spec_id != spec_id
                            && opts[sku.specs[j].spec_id]
                            && opts[sku.specs[j].spec_id] != sku.specs[j].spec_value_id) {
                            return false
                        }
                    }
                    return true
                }
            })
            sks.forEach(sku => {
                sku.specs.forEach(spec => {
                    if (spec.spec_id == spec_id) {
                        allSku[spec_id][spec.spec_value_id] = true
                    }
                })
            })
        }
        return allSku
    },
    searchSku: function (opts = {}) {
        var pass = false
        var product = this.data.product
        for (var i = 0; i < product.skus.length; i++) {
            var specs = product.skus[i].specs
            pass = true
            for (var j = 0; j < specs.length; j++) {
                if (!opts[specs[j].spec_id] || opts[specs[j].spec_id] != specs[j].spec_value_id) {
                    pass = false
                    break
                }
            }
            if (pass) {
                return product.skus[i]
            }

        }
        return null
    },
    countGrow(e) {
        if (this.data.sku == null) {
            app.error("请选择商品规格")
            return
        }
        var d = e.currentTarget.dataset
        var grow = parseInt(e.target.dataset.grow)
        grow = grow + this.data.good_count
        if (grow < 1) {
            grow = 1
        }
        if (this.data.product.max_buy != null && grow > this.data.product.max_buy) {
            app.error("超出商品的限制购物数量")
            return
        }
        if (grow > this.data.sku.storage) {
            app.error("库存不够")
            return
        }
        this.setData({
            good_count: grow
        })
    },
    setCount(e) {
        if (this.data.sku == null) {
            app.error("请选择商品规格")
            return
        }
        var value = parseInt(e.detail.value)
        if (value > this.data.sku.storage) {
            app.error("库存不够")
            return
        }
        if (value < 1) {
            value = 1
        }
        this.setData({
            good_count: value
        })
    },
    /**
     * 添加到购物车
     */
    addtocart:function(e=null){
        if (this.data.sku) {
            this.sureAddCart(e)
        } else {
            this.openMask(e, 'cart')
        }
    },
    sureAddCart: function (e) {
        if (!this.data.sku) {
            app.error('请选择规格')
        } else {
            if (this.data.sku.storage < 1) {
                app.error('该商品暂时缺货')
                return
            }
            var data = {
                product_id: this.data.product.product_id,
                sku_id: this.data.sku.sku_id,
                specs: this.data.sku.specs,
                sku_num: this.data.good_count
            }
            app.httpPost('shop/cartadd', data, json => {
                if (json.status == 0) {
                    app.success('成功添加到购物车')
                    this.updateCartCount()
                } else {
                    app.error(json.message)
                }
                this.hideMask()
            })
        }
    },
    buynow: function (e=null) {
        if (this.data.sku) {
            this.sureBuy(e)
        } else {
            this.openMask(e, 'buy')
        }
    },
    sureBuy: function (e) {
        if (!this.data.sku) {
            app.error('请选择规格')
        } else {
            if (this.data.sku.storage < 1) {
                app.error('该商品暂时缺货')
                return
            }
            this.hideMask()
            wx.navigateTo({
                url: 'confirm?from=buy&storage=' + this.data.sku.storage + '&getdata=getOrderData',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }
    },
    emptyEvent:function(e=null){
        if(e){
            
        }
    }
})