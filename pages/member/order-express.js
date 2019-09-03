// pages/member/order-express.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        traces: null,
        product:{},
        express: "",
        express_code: "",
        express_no: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let order_id = parseInt(options.id)
        if (!order_id) {
            app.error('参数错误')
            setTimeout(() => {
                wx.navigateBack({ })
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

    loadData() {
        wx.showLoading({
            title: '',
        })
        app.httpPost('member.order/express', { id: this.data.id }, json => {
            wx.hideLoading()

            let data = json.data
            if (data.product && data.product.image) {
                data.product['image'] = trail.fixImageUrl(data.product['image'])
            }
            if (data.traces && data.traces.length>0){
                let firstdate = data.traces[0].AcceptTime
                let lastdate = data.traces[data.traces.length-1].AcceptTime
                let curDate = util.string2date(firstdate)
                if (curDate < util.string2date(lastdate)){
                    data.traces = data.traces.reverse()
                }

                let curDateStr = ''

                for(let i=0;i<data.traces.length;i++){
                    let sdate = util.string2date(data.traces[i].AcceptTime)
                    let sdatestr = util.formatTime(sdate, false)
                    data.traces[i].time = util.dateFormat('H:i', sdate)
                    if (sdatestr != curDateStr){
                        curDateStr = sdatestr
                        data.traces[i].date = util.dateFormat('m-d', sdate)
                    }
                }
            }

            this.setData(data)
        })
    }
})