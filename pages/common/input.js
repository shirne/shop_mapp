// pages/common/input.js
var util = require("../../utils/util.js");
var Models = util.models;

//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: "",
        unit: "",
        title: "请输入信息",
        inputtype: "text",
        placeholder: "请填写信息",
        tips: "",
        link: "",
        linkText: "",
        help: {},
        callBack: "",
        focus: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.initShare(null)
        if (options.data) {
            const pages = getCurrentPages()
            if (pages[pages.length - 2].data) {
                this.setData(pages[pages.length - 2].data[options.data])
            }
        }
        if (options.callback) {
            this.setData({
                callBack: options.callback
            })
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
    setFocus: function (e) {
        console.log(e)
        this.setData({
            focus: true
        })
    },
    bindSetValue: function (e) {
        this.setData({
            value: e.detail.value
        })
    },
    helpLink: function () {
        wx.navigateTo({
            url: 'help?data=help',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    buttonComplete: function (e) {
        const pages = getCurrentPages()
        var rtn = true
        if (pages[pages.length - 2]) {
            rtn = pages[pages.length - 2][this.data.callBack](this.data.value)
        }
        if (rtn !== true && rtn !== undefined) {
            app.error(rtn)
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    }
})