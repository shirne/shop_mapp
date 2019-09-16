// pages/product/diy.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        products:[],
        isloading:true,
        types:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.types){
            this.setData({
                types:options.types
            })
        }
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

    loadData(){

        app.httpPost('product/get_list', {type:this.data.types,withsku:1} , json => {
            if (json.code == 1 ) {
                let products = json.data.lists
                products = trail.fixProductList(products)
                this.setData({
                    products: products,
                    isloading: false
                })
            }
        })
    },
    getOrderData: function (product_id) {
        var cart = {}
        for (let i = 0; i < this.data.products.length; i++) {
            var product = this.data.products[i]
            if (product.id==product_id){
                cart.sku_id = product.skus[0].sku_id
                cart.product_price = product.skus[0].price
                cart.product_image = product.image
                cart.count = 1
                cart.product_id = product.id
                cart.product_title = product.title
                //cart.promotion = this.data.promotions,
                //cart.max_buy = product.max_buy
                break;
            }
        }
        return [cart]
    },
    buynow(e){
        let product_id=e.currentTarget.dataset.id

        wx.navigateTo({
            url: '../order/confirm?from=buy&data=cartdata',
            success: (res) => {
                if (res.eventChannel) {
                    res.eventChannel.emit('acceptDataFromOpenerPage', this.getOrderData(product_id))
                } else {
                    app.globalData['cartdata'] = this.getOrderData(product_id)
                }
            }
        })
    }
})