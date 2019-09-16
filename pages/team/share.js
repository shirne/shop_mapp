// pages/team/share.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrcode:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
    loadData(){
        app.httpPost('member.agent/poster',json=>{
            if(json.code==1){
                this.setData({
                    qrcode: trail.fixImageUrl(json.data.poster_url)
                })
                app.getProfile(profile=>{
                    this.shareRoute='pages/index/index'
                    app.initShare(this, '来自' + profile.nickname+'的分享', this.data.qrcodes);
                })
                
            }else{
                app.tip(json.msg||'加载失败')
            }
        })
    },
    saveImage(){
        if(!this.data.qrcode){
            app.error('分享图未生成')
        }else{
            /*app.alert('请在接下来显示的图片中长按图片保存',res=>{

                wx.previewImage({
                    current: this.data.qrcode,
                    urls: [this.data.qrcode]
                })
            })*/
            
            wx.showLoading({
                title: '',
            })
            wx.downloadFile({
                url: this.data.qrcode,
                filePath: `${wx.env.USER_DATA_PATH}/shareimg.jpg`,
                success(res) {
                    wx.hideLoading()
                    //console.log(res)
                    if (res.statusCode === 200) {
                        //app.tip('下载成功:' + res.filePath)
                        wx.saveImageToPhotosAlbum({
                            filePath: res.filePath,
                            success:()=>{
                                app.success('分享图已保存到相册')
                            }
                        })
                    }else{
                        app.error('图片下载失败')
                    }
                },
                fail(res){
                    wx.hideLoading()
                    app.error(res.errMsg)
                }
            })
        }
    }
})