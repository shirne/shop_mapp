// pages/order/cart.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const Product = require("../../utils/product.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        cart_count: 0,
        carts: [],

        product: {},
        sku: {},
        allstorage: 0, //当前产品全部库存
        selected: "", //选取规格说明文字
        options: {}, //当前商品已选的规格
        current: -1, //当前正在重选规格的序号

        //总价
        totalPrice: 0,

        //全部选中状态
        checked: false,
        //编辑项索引
        editIndex: -1,

        isloading: true,

        //弹出遮罩层控制
        ismask: false,
        isclosing: false,

    },

    //组件 
    product: null,

    /**
     * 生命周期函数--监听页面加载
     */
    attached: function (options) {
        console.log('cart')
        app.initShare(null)
        this.loadData();
    },
    methods: {
        loadData: function () {

            app.checkLogin(() => {
                app.httpPost('cart/getall', (json) => {
                    if (json.code == 1 && json.data) {
                        var carts = this.fixDataImage(json.data)
                        this.setData({
                            carts: carts,
                            isloading: false
                        })

                        this.checkall()
                    } else {
                        this.setData({
                            isloading: false
                        })
                    }
                })
                this.updateCount()
            })
        },
        fixDataImage(data) {
            data = trail.fixListImage(data, 'cart_product_image,product_image')
            return data
        },
        updateCount: function () {
            trail.getCartCount(count => {

            }, true)
        },
        checkall: function (e) {
            //console.log(e)
            var carts = this.data.carts
            var ischecked = e ? e.detail.checked : true
            for (var i = 0; i < carts.length; i++) {
                if (carts[i].storage > 0) {
                    carts[i].checked = ischecked
                }
            }
            this.setData({
                carts: carts,
                checked: ischecked
            })
            this.calcolation()
        },
        shopTabTo: function (e) {
            var url = e.currentTarget.dataset.url
            util.shopTab(url)
        },
        itemChecked: function (e) {
            console.log(e)
            var carts = this.data.carts
            var ischecked = e.detail.checked
            var cart_id = e.detail.value
            for (var i = 0; i < carts.length; i++) {
                if (carts[i].sku_id == cart_id) {
                    carts[i].checked = ischecked
                }
            }
            this.setData({
                carts: carts,
                checked: ischecked ? this.data.checked : false
            })
            this.calcolation()
        },
        enableEdit: function (e) {
            var carts = this.data.carts
            var id = e.currentTarget.dataset.id
            for (var i = 0; i < carts.length; i++) {
                if (carts[i].id == id) {
                    carts[i].editMode = true
                    break;
                }
            }
            this.setData({
                carts: carts
            })
        },
        countGrow: function (e) {
            //console.log(e)
            var grow = e.target.dataset.grow
            var d = e.currentTarget.dataset
            var carts = this.data.carts
            if (grow && typeof d.index == 'number' && carts[d.index]) {
                var cart = carts[d.index]
                if (grow == "1" && cart.count >= 0) {
                    carts[d.index].count = parseInt(cart.count) + parseInt(grow)
                } else {
                    if (grow == "-1" && cart.count > 1) {
                        carts[d.index].count = parseInt(cart.count) + parseInt(grow)
                    }
                }
                if (cart.count > 0) {
                    if (cart.count > cart.storage) {
                        carts[d.index].count = cart.storage || 1
                        app.error('库存不足')
                    }

                    this.setData({
                        carts: carts
                    })
                    this.calcolation()
                }
            }
        },
        setCount: function (e) {
            var d = e.currentTarget.dataset
            var carts = this.data.carts
            for (var i = 0; i < carts.length; i++) {
                if (d.sku_id == carts[i].sku_id) {
                    carts[i].count = parseInt(e.detail.value)
                    if (carts[i].count <= 0) {
                        carts[i].count = 0
                    }
                    if (carts[i].count > carts[i].storage) {
                        carts[i].count = parseInt(carts[i].storage) || 1
                        app.error('库存不足')
                    }
                    if (carts[i].count > 0) {
                        this.setData({
                            carts: carts
                        })
                        this.calcolation()
                    }
                    break;
                }
            }
        },
        saveEdit: function (e) {
            var carts = this.data.carts
            var id = e.currentTarget.dataset.id
            for (var i = 0; i < carts.length; i++) {
                if (carts[i].id == id) {
                    carts[i].editMode = false

                    app.httpPost('cart/update',
                        {
                            sku_id: carts[i].sku_id,
                            count: carts[i].count,
                            id: id
                        },
                        json => {
                            this.updateCount()
                        })

                    break;
                }
            }
            this.setData({
                carts: carts
            })
        },
        openMask: function (e) {
            this.setData({
                ismask: true
            })
        },
        closeMask: function (e) {
            this.setData({
                ismask: false,
                isclosing: true
            })
            setTimeout(() => {
                this.setData({
                    isclosing: false
                })
            }, 500);
        },
        showSpec: function (e) {
            wx.showLoading({
                title: '加载中',
            })
            var d = e.currentTarget.dataset
            app.httpPost('product/view', { id: d.product_id }, (json) => {
                wx.hideLoading()
                if (json.code == 1) {
                    let product = new Product(json.data.product, json.data.skus)

                    this.product = product
                    this.setData({
                        product: product.getProduct(),
                        options: d.specs,
                        allstorage: product.getAllStorage(),
                        selected: product.getSelectedText(),
                        optsku: product.getSpecStatus(d.specs),
                        current: d.index,
                        sku: product.searchSku(d.specs)
                    })
                    this.openMask(null)
                } else {
                    util.error('数据错误')
                }
            })
        },
        setOption: function (e) {
            //console.log(e)
            var d = e.currentTarget.dataset
            var options = this.data.options


            if (options[d.spec_id] == d.value) {
                delete options[d.spec_id]
            } else {
                if (!this.data.optsku[d.spec_id] || !this.data.optsku[d.spec_id][d.value])
                    return
                options[d.spec_id] = d.value
            }
            var sku = this.product.searchSku(options)
            //console.log(options)
            this.setData({
                options: options,
                selected: this.product.getSelectedText(options),
                sku: sku,
                optsku: this.product.getSpecStatus(options),
            })
        },
        setSpec: function (e) {
            if (!this.data.sku) return
            var carts = this.data.carts
            var current = this.data.current
            if (carts[current]) {

                carts[current].specs = this.data.sku.specs
                carts[current].sku_id = this.data.sku.sku_id
                carts[current].storage = this.data.sku.storage
                carts[current].product_price = this.data.sku.price
                this.setData({
                    carts: carts
                })
            }
            this.closeMask(null)
            this.calcolation()
        },
        delCart: function (e) {
            var id = e.currentTarget.dataset.id
            var index = e.currentTarget.dataset.index
            util.confirm('确定将该商品移出购物车？', () => {
                app.httpPost('cart/delete', { sku_id: id }, json => {
                    if (json.code == 1) {
                        util.success('删除成功')
                        this.updateCount()
                        var carts = this.data.carts
                        carts.splice(index, 1)
                        this.setData({
                            carts: carts
                        })
                        this.calcolation()

                    }
                })
            })

        },
        calcolation: function () {
            var price = 0

            this.data.carts.forEach(cart => {
                if (cart.count > 0 && cart.storage > 0) {
                    price += parseFloat(cart.product_price) * cart.count
                }
            })
            price = Math.round(price * 100) / 100
            this.setData({
                totalPrice: price.toFixed(2)
            })
        },
        emptyEvent: function (e) {

        },
        goSettle: function (e) {
            var checked = 0
            var carts = this.data.carts
            for (var j = 0; j < carts.length; j++) {
                if (carts[j].checked) {
                    if (carts[j].storage < carts[j].count || carts[j].storage == 0) {
                        app.error('商品「' + carts[j].product_title.substring(0, 3) + '..」库存不足')
                        return
                    }
                    checked++
                }
            }
            if (checked < 1) {
                app.error('请选择商品')
                return
            }
            wx.navigateTo({
                url: '/pages/order/confirm?data=cartdata',
                success: (res) => {
                    if (res.eventChannel) {
                        res.eventChannel.emit('acceptDataFromOpenerPage', this.getOrderData())
                    } else {
                        app.globalData['cartdata'] = this.getOrderData()
                    }
                }
            })
        },
        gotoHome: function (e) {
            app.switchIndex('home')
        },

        //生成订单数据
        getOrderData: function () {
            var carts = []
            this.data.carts.forEach(cart => {
                if (cart.checked && cart.count > 0) {
                    carts.push(cart)
                }
            })
            return carts
        },
        toDetail(e) {
            wx.navigateTo({
                url: '/pages/product/detail?id=' + e.currentTarget.dataset.item.product_id,
            })
        }
    }
})