// pages/team/index.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total_count: 0,
        total_award: 0,
        order_count_7:0,
        rewards_7:0,
        isloading:true,
        notice:{

        },
        member: {
            niakname: '请登录',
            avatar: '/images/avatar-default.png',
            reward: 0
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.initShare(null);
        app.getProfile((profile) => {
            if(profile.is_agent==0){
                app.alert('您还不是代理商，请先升级',res=>{
                    let pages=getCurrentPages()
                    if(pages.length>1){
                        wx.navigateBack({})
                    }else{
                        wx.reLaunch({
                            url: '/pages/index/index?tab=member',
                        })
                    }
                });
                return false;
            }
            this.setData({
                member: profile
            })

            this.loadNotice()
            this.loadData()
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
    loadNotice(){
        app.httpPost('common/notice',{flag:'team'}, json => {
            if(json.code==1){
            this.setData({
                notice: json.data,
            })
            }
        })
    },
    loadData(){
        app.httpPost('member.agent/generic', json => {
            if(json.code==1){
                this.setData({
                    isloading: false,
                    total_award: util.formatMoney(json.data.total_award*.01),
                    order_count_7: json.data.order_count,
                    rewards_7: util.formatMoney(json.data.amount_future*.01),
                })
            }else{
                app.error('加载失败')
            }
        })
    },
    onLoading(e) {
        this.setData({
            isloading:true
        })
        app.getProfile((profile) => {
            this.setData({
                member: profile
            })
            this.loadData(res => {
                this.setData({
                    loadok: true
                })
            })
        }, true)

    },
    gotoUrl(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
})