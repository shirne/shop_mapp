// pages/member/order-express.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        express: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let order_id = parseInt(options.id)
        if (!order_id) {
            app.error('参数错误')
            setTimeout(() => {
                wx.navigateBack({

                })
            }, 600)
        } else {
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    loadData() {
        wx.showLoading({
            title: '',
        })
        app.httpPost('member.order/express', { id: this.data.id }, json => {
            wx.hideLoading()

            let express = json.data
            if (express.product) {
                express.product['image'] = trail.fixImage(express.product['image'])
            }

            this.setData({ express: express })
        })
    }
})