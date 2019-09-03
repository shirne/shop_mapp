// pages/member/order-detail.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:0,
        order:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let order_id = parseInt(options.id)
        if(!order_id){
            app.error('参数错误')
            setTimeout(()=>{
                wx.navigateBack({ })
            },600)
        }else{
            this.setData({
                id: order_id
            })
            this.loadData()
        }
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

    gotoProduct(e){
        let data=e.currentTarget.dataset
        wx.navigateTo({
            url: '/pages/product/detail?id=' + data.id
        })
    },
    gotoExpress(){
        let order = this.data.order;
        if(order.status>0 && order.express_no){
            wx.navigateTo({
                url: 'order-express?id=' + order.order_id
            })
        }else{
            app.error('没有物流信息')
        }
    },
    loadData(){
        wx.showLoading({
            title: '',
        })
        app.httpPost('member.order/view', { id: this.data.id }, json => {
            wx.hideLoading()

            let order = json.data
            order.create_date = util.formatTime(util.timestamp2date(order.create_time))
            order.pay_date = util.formatTime(util.timestamp2date(order.pay_time))
            order.deliver_date = util.formatTime(util.timestamp2date(order.deliver_time))
            order.confirm_date = util.formatTime(util.timestamp2date(order.confirm_time))
            if(order.products){
                order.products = trail.fixListImage(order.products, 'product_image')
            }
            
            this.setData({order:order})
        })
    },
    orderAction(e) {
        let data = e.currentTarget.dataset;
        let id = data.id, status = data.status

        trail.orderAction(data.action, id, status, () => {
            if(data.action=='delete'){
                wx.navigateBack({
                    
                })
            }else{
                this.loadData()
            }
        })
    },
    callphone(){
        app.getSiteInfo(siteinfo=>{
            if(siteinfo.telephone){
                wx.makePhoneCall({
                    phoneNumber: siteinfo.telephone
                })
            }else{
                app.alert('未设置电话，请联系客服')
            }
        })
        
    }
})