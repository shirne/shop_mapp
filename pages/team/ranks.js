// pages/team/ranks.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mode:'month',
        modes:{
            'month':'当月排名',
            'year':'年度排名',
            'total':'总排名'
        },
        isloading:true,
        ranks:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.mode && this.data.modes[options.mode]){
            this.setData({
                mode:options.mode
            })
        }
        this.loadData()
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
    changeMode(e){
        let mode=e.currentTarget.dataset.mode
        this.setData({
            mode:mode
        })
        this.loadData()
    },
    loadData(){
        this.setData({
            isloading: true
        })
        app.httpPost('member.agent/rank', { mode: this.data.mode }, json => {
            let newData = {
                isloading: false
            }
            if (json.code == 1) {
                newData['ranks'] = json.data.ranks

            } else {
                newData['ranks']=[]
                app.tip('加载错误')
            }

            this.setData(newData)
        })
    }
})