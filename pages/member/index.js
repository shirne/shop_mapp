// pages/member/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        favourite_count: 0,
        member: {
            niakname:'请登录'
        }
    },

    /**
     * 生命周期函数
     */
    lifetimes:{
        attached: function (options) {
            app.initShare(null);
            app.checkLogin(() => {
                wx.showLoading({
                    title: '加载中',
                })
                app.httpPost('member/profile', {}, (json) => {
                    wx.hideLoading()
                    if (json.code == 1) {
                        json.data = trail.fixImage(json.data, 'avatar')
                        json.data.cardno = util.formatNumber(json.data.id,8)
                        this.setData({
                            member: json.data
                        })
                    }
                })
            })
        },

        moved: function () { },
        detached: function () { },
    },
    ready: function () {

    },

    methods: {
        gotoOrder: function (e) {
            var status = e.currentTarget.dataset.status
            wx.navigateTo({
                url: '/pages/member/order?status=' + status,
            })
        },
        gotoUrl: function (e) {
            var url = e.currentTarget.dataset.url
            wx.navigateTo({
                url: url
            })
        }
    }

})