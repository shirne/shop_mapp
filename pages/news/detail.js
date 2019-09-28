// pages/news/detail.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
var html = require("../../utils/HtmlToNodes.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        digging:false,
        digged:false,
        model:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                id: parseInt(options.id)
            })
            this.params={id:this.data.id}
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.showLoading({
            title: '',
        })
        app.httpPost('article/view', { id: this.data.id} , json => {
            if (json.code == 1) {
                let data=json.data.article
                data.create_time = util.getLocalTime(data.create_time)
                data.cover = trail.fixImageUrl(data.cover)
                //json.data.content = html.HtmlToNodes(trail.fixContent(json.data.content))
                data.content = html.HtmlToNodes(data.content, trail.fixTag)
                //console.log(JSON.stringify(json.data.content))
                json.data.images = trail.fixListImage(json.data.images,'image')
                this.setData({
                    model: data,
                    images: json.data.images,
                    digged: json.data.digged
                })
                wx.setNavigationBarTitle({
                    title: data.title,
                })
                app.initShare(this, data.title, data.cover)
            }
            wx.hideLoading()
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

    diggUp: function (e) {
        if (this.data.digged) {
            app.tip('您已经点过赞了')
            return
        }
        if (this.data.digging)return
        this.data.digging = true
        
        app.httpPost('article/digg' ,{id:this.data.id,type:'up'},json=>{
            if (json.code==1){
                let newdata={}
                newdata['model.digg'] = json.data.digg
                newdata.digged=true
                this.setData(newdata)
                app.success('感谢点赞')
            }else{
                app.error(json.msg)
            }
            this.data.digging = false
        })
    }
})