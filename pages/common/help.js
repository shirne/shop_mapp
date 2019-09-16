// pages/common/help.js
var util = require("../../utils/util.js");
var Models = util.models;

//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        content: "",
        btnText: "我知道了",
        buttons: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.initShare(null)
        const pages = getCurrentPages();
        const prePage = pages[pages.length - 2]

        if (options.datafunc) {
            var d = prePage[options.datafunc](options)
            this.setData(d)
        } else {
            var key = 'help'
            if (options.data) key = options.data
            if (prePage && prePage.data[key]) {
                this.setData(prePage.data[key])
            }
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

    bindReturn: function () {
        wx.navigateBack({
            delta: 1,
        })
    },
    bindReturns: function (e) {
        var d = e.currentTarget.dataset
        var button = this.data.buttons[d.index]
        var rtn = true
        if (button && button.callback) {
            rtn = button.callback()
        }
        if (rtn !== false) {
            wx.navigateBack({})
        }
    }
})