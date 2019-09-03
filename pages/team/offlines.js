// pages/team/offlines.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        users:[],
        page:1,
        level:1,
        levels:1,
        pid:0,
        isloading:true,
        has_more:true,
        totalcount:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.getProfile(profile=>{
            this.setData({
                levels: parseInt(profile.level.commission_layer)
            })
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

    loadmoreData: function () {
        this.data.page++
        this.loadData()
    },

    loadData(callback=null){
        app.httpPost('member.agent/team',{
            pid:this.data.pid,
            level:this.data.level,
            page:this.data.page
        }, json => {
            let newData = { isloading: false, totalcount: json.data.total }
            if(json.data && json.data.users && json.data.users.length>0){
                newData['users[' + json.data.page + ']'] = json.data.users
            }else{
                newData['users[' + json.data.page + ']']=[]
            }
            this.setData(newData)
            callback && callback()
        })
    },
    tabSelect(e){
        let id=e.currentTarget.dataset.id
        if(id != this.data.level){
            this.setData({
                page: 1,
                users: [],
                level: id,
                has_more: true,
                isloading: true
            })
            this.loadData()
        }
    },
    reloadData(e) {
        this.setData({
            page: 1,
            lists: [],
            has_more: true,
            isloading: true
        })
        this.loadData(res => {
            this.setData({
                loadok: true
            })
        })
    },
})