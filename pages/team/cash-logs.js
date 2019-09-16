// pages/team/cash-logs.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        status:'0',
        page: 1,
        logs: [[]],
        hasmore: true,
        totalcount: 0,
        isloading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.status !== undefined && options.status !== '' && options.status !== null) {
            this.setData({
                status: options.status
            })
        }
        app.getProfile(profile=>{
            this.setData({
                profile:profile
            })
        })
        this.loadData();
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
    loadmoreData: function () {
        this.loadData()
    },

    tabSelect(e) {
        let status = e.target.dataset.status
        //console.log(status)
        this.setData({
            status: status,
            hasmore: true,
            logs: [[]],
            page: 1
        })
        this.loadData()
    },
    reloadData() {
        this.setData({
            hasmore: true,
            logs: [[]],
            page: 1
        })
        this.loadData()
    },
    loadData() {
        //console.log('loadData')
        if (!this.data.hasmore) return false;
        this.setData({
            isloading: true
        })
        app.httpPost('member.account/cash_list', { status: this.data.status, page: this.data.page }, json => {
            let newData = {
                hasmore: false,
                isloading: false
            }
            if (json.code == 1) {
                //newData['ordercounts'] = json.data.counts
                newData['totalcount'] = json.data.total
                if (json.data && json.data.cashes && json.data.cashes.length > 0) {
                    newData['logs[' + this.data.page + ']'] = trail.fixListDate(json.data.cashes, 'Y-m-d H:i:s','create_time,payment_time,fail_time')
                    if (this.data.page < json.data.total_page) {
                        newData['hasmore'] = true;
                        this.data.page++
                    }
                }

            } else {
                newData['logs[' + this.data.page + ']'] = [];
                app.tip('加载错误')
            }
            //console.log(newData)
            this.setData(newData)
        })
        return true
    }
})