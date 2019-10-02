// pages/about/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        siteinfo: null,
        lists: [],
        CustomBar: app.globalData.CustomBar,
        version: app.globalData.env + ' ' + app.globalData.version,
        cacheinfo: '',
        map: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.showLoading({
            title: '',
        })
        wx.getStorageInfo({
            success: (res) => {

                var size = res.currentSize
                var unit = 'KB';
                if (size > 1024) {
                    size = size / 1024
                    size = Math.round(size * 100) * .01
                    unit = 'MB';
                }
                this.setData({
                    cacheinfo: res.keys.length + '个缓存,共 ' + size + unit
                })
            },
        })
        app.getSiteInfo(siteinfo => {
            this.setData({
                siteinfo: siteinfo
            })
            if (siteinfo.location) {
                this.setData({
                    map: {
                        id: 1,
                        title: '公司位置',
                        content: siteinfo.address,
                        coordinate: siteinfo.location
                    }
                })
            }
            wx.hideLoading()
            app.initShare(this, siteinfo.webname + '-公司介绍', siteinfo.weblogo)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.httpPost('page/pages', { group: 'about' }, (json) => {
            if (json.code == 1) {
                this.setData({
                    lists: json.data
                })
            }
        })
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

    gotoDetail: function (e) {
        wx.navigateTo({
            url: 'detail?id=' + e.currentTarget.dataset.id,
        })
    },
    callPhone: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.telephone,
        })
    },
    openMap: function (e) {
        var coordinate = e.currentTarget.dataset.coordinate.split(',')
        wx.openLocation({
            latitude: parseFloat(coordinate[1]),
            longitude: parseFloat(coordinate[0]),
            name: this.data.siteinfo.webname,
            address: this.data.map.content
        })
    },
    checkUpdate(e){
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate((res) => {
            if(res.hasUpdate){
                app.tip('系统有更新')
            }else{
                app.tip('已经是最新版本')
            }
        })

        updateManager.onUpdateReady(() => {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: (res) => {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(() => {
            app.tip('版本下载失败，下次启动时更新')
        })
    },
    clearCache(e) {
        wx.clearStorage({
            success: res => {
                app.success('清除成功')
                this.onLoad()
            },
            fail: res => {
                app.error('清除失败')
            }
        })
    }
})