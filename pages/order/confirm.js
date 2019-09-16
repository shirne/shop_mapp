// pages/order/confirm.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        buy_from: "cart",
        storage: 0,
        address: {},
        products: [],
        memo: '',
        totalPrice: 0,
        products_total_price: 0,
        express: { fee: 0, title: '免邮' },
        ordering: false,
        delay_timing:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.initShare(null)
        if (options.from) {
            this.setData({
                buy_from: options.from,
                storage: parseInt(options.storage)
            })
        }

        wx.showLoading({
            title: '',
        })
        

        if (options.data) {
            this.data.delay_timing = setTimeout(() => {
                this.errorBack()
            }, 3000);
            if (this.getOpenerEventChannel ){
                const eventChannel = this.getOpenerEventChannel()
                //eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
                //eventChannel.emit('someEvent', { data: 'test' });
                // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
                eventChannel.on('acceptDataFromOpenerPage',  (data)=> {
                    console.log(data)
                    this.setdata(data)
                })
            }else{
                let data = app.globalData[options.data]
                app.globalData[options.data]=null
                if(data){
                    this.setdata(data)
                }
            }
        }else{
            this.errorBack()
        }
    },
    errorBack(msg = '数据错误'){
        app.error(msg)
        setTimeout(()=>{
            wx.navigateBack({

            })
        },600)
        
    },
    setdata(products){
        clearTimeout(this.data.delay_timing)
        if (products && products.length > 0) {
            let total_price=0
            products.forEach(product => {
                total_price += parseFloat(product.product_price) * product.count
            })
            total_price = Math.round(total_price * 100) / 100

            this.setData({
                products: products,
                totalPrice: total_price.toFixed(2)
            })
            this.prepare()
        }else{
            this.errorBack()
        }
        
    },
    prepare(){
        wx.showLoading({
            title: '',
        })
        app.checkLogin(() => {
            var data = {}
            data.products = []
            this.data.products.forEach(product => {
                data.products.push({
                    sku_id: product.sku_id,
                    count: product.count
                })
            })

            if(this.data.address && this.data.address_id)data.address= this.data.address
            app.httpPost('order/prepare', data, json => {
                wx.hideLoading()
                if (json.code == 1) {
                    var products = this.data.products
                    
                    this.setData({
                        products: products,
                        address: json.data.address,
                        express: json.data.express
                    }, () => {
                        wx.hideLoading()
                        this.calcolation()
                    })
                } else {
                    this.errorBack()
                }
            })
        })
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

    pickAddress: function (e) {
        var id = e.currentTarget.dataset.addressid
        wx.navigateTo({
            url: '../common/pick-address?id=' + id + '&callback=setAddress',
        })
    },
    setAddress: function (address) {
        this.setData({
            address: address
        })
        this.prepare()
    },
    emptyEvent: function () {

    },
    //直接下单中修改购买数量
    countGrow: function (e) {
        var grow = e.target.dataset.grow
        var store_id = e.target.dataset.store_id
        var products = this.data.products
        var oldcount = products[0].count
        if (grow) {
            if (grow == "1") {
                products[0].count = parseInt(products[0].count) + parseInt(grow)
            } else {
                if (grow == "-1" && stores[0].groups[0].carts[0].count > 1) {
                    products[0].count = parseInt(products[0].count) + parseInt(grow)
                }
            }
            if (products[0].count > 0) {
                if (products[0].max_buy != null && products[0].count > products[0].max_buy) {
                    app.error("超出商品的限制购物数量")
                    products[0].count = oldcount
                }
                if (products[0].count > this.data.storage) {
                    app.error('库存不足')
                    products[0].count = this.data.storage
                }

                this.setData({
                    products: products
                }, () => {
                    this.calcolation()
                })
            }
        }
    },
    calcolation: function () {
        var total_price = 0
        let expresses=this.data.express.postages
        let postage={fee:0,posareas:{}}
        let poscalc={}

        let newData = {}
        this.data.products.forEach((product,idx) => {
            let postage_id = product.postage_id
            let pamount = (Math.round((product.product_price * product.count) * 100) / 100)
            if (postage_id>0){
                if (expresses[postage_id] && expresses[postage_id].length>0){
                    if (!poscalc[postage_id]){
                        poscalc[postage_id] = {
                            total:0,
                            amount:0,
                            areas:{}
                        }

                        expresses[postage_id].forEach(positem => {
                            poscalc[postage_id].areas[positem.id] = positem
                        })
                    }
                    poscalc[postage_id].amount += pamount
                    var calc_type = expresses[postage_id][0].calc_type
                    if (calc_type==2){
                        poscalc[postage_id].total += this.calc_size(product.size)
                    }else if(calc_type==1){
                        poscalc[postage_id].total += product.count
                    }else{
                        poscalc[postage_id].total += product.weight*product.count
                    }
                    product.deprecated = 0
                }else{
                    product.deprecated=1
                    newData['products['+idx+'].deprecated']=1
                }
            }
            if(!product.deprecated){
                total_price += pamount
            }
        })

        this.setData(newData)
        let total_postage=0
        let text='免运费'
        let area_ids={}
        for (var pid in poscalc){
            let curfee=-1
            for(var aid in poscalc[pid].areas){
                let area = poscalc[pid].areas[aid]
                if (area.free_limit > 0 && poscalc[pid].amount >= area.free_limit){
                    curfee=0
                    text = '免费包邮'
                }else{
                    let fee = util.forceNumber(area.first_fee)
                    if (poscalc[pid].total > area.first && area.extend > 0 && area.extend_fee > 0){
                        let count = poscalc[pid].total - area.first
                        while(count>0){
                            fee += area.extend_fee
                            count -= area.extend
                            if(area.ceiling>0 && area.ceiling<fee){
                                fee = area.ceiling
                                break;
                            }
                        }
                    }
                    if(curfee <0 || curfee > fee){
                        curfee=fee
                        area_ids[pid]=aid
                    }
                }
            }
            poscalc.fee = curfee
            total_postage += curfee
        }
        total_price = Math.round(total_price * 100) / 100
        total_postage = Math.round(total_postage*100)/100
        this.setData({
            total_price: total_price,
            totalPrice: (total_price + total_postage).toFixed(2),
            total_postage: total_postage,
            totalPostage: total_postage.toFixed(2),
            area_ids:area_ids,
            postageText: text
        })
    },
    calc_size(size){
        if(!size){
            return 0;
        }
        if(typeof size == typeof 's'){
            size = size.split(',')
        }
        if(size.length<3)return 0;
        let result = size[0]*size[1]*size[2]
        return isNaN(result)?0:result
    },
	/**
	 * 提交订单
	 */
    submitOrder(e) {
        if (this.data.ordering) return
        if (!this.data.address) {
            app.error("请选择收货地址")
            return
        }
        if (this.data.buy_from == 'buy') {
            if (this.data.products[0].count > this.data.storage) {
                app.error("库存不足")
                return
            }
        }
        //console.log(e)
        var products = []
        this.data.products.forEach((product, index) => {
            if(!product.deprecated){
                let areaid=0
                if (product.postage_id > 0 && this.data.area_ids[product.postage_id]){
                    areaid = this.data.area_ids[product.postage_id]
                }
                products.push({
                    sku_id: product.sku_id,
                    postage_id: product.postage_id,
                    postage_area_id: areaid,
                    count: product.count
                })
            }
        })
        const param = {
            address_id: this.data.address.address_id,
            form_id: e.detail.formId,
            products: products,
            remark: this.data.memo,
            total_postage: this.data.total_postage,
            total_price: this.data.total_price, //用于价格比较
            'from': this.data.buy_from
        }
        this.data.ordering = true
        trail.makeOrder('order/confirm', param, order_id => {

            wx.redirectTo({
                url: '/pages/member/order-detail?id=' + order_id,
            })
        }, (order_id,errmsg) => {
            if (order_id) {
                wx.redirectTo({
                    url: '/pages/member/order-detail?id=' + order_id,
                })
            } else {
                if(errmsg){
                    app.error(errmsg)
                }else{
                    app.error('下单失败')
                }
                this.data.ordering = false
            }
        })
    },
	/**
	 * 留言
	 */
    memoHandle(e) {
        var idx = e.currentTarget.dataset.idx
        let memo = e.detail.value
        this.setData({
            memo: memo
        })
    },
	/**
	 * 手动录入修改购买数量
	 */
    setCount: function (e) {
        //console.log(e)
        var d = e.currentTarget.dataset
        var products = this.data.products

        var cart = products[d.index]
        if (cart) {
            products[d.index].count = parseInt(e.detail.value)
            if (products[d.index].count <= 0) {
                products[d.index].count = 1
            }
            if (products[d.index].count > this.data.storage) {
                products[d.index].count = this.data.storage
                app.error('库存不足')
            }
            if (products[d.index].count > 0) {
                this.setData({
                    products: products
                }, () => {
                    this.calcolation()
                })
            }
        }
    }
})