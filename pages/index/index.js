
const trail = require("../../utils/trail.js");
const app = getApp()

Page({
    data: {
        PageCur: 'home',
        cart_count:0,
        needpulldown:false,
        ispulldown:false,
        needreachbottom:false,
        isreachbottom:false
    },
    onLoad(args){
        app.initShare(this)
        if (args && args.tab){
            this.setData({'PageCur': args.tab})
        }
        app.checkLogin(()=>{
            trail.getCartCount(count=>{
                
            })
        })
    },
    NavChange(e) {
        this.changeTab(e.currentTarget.dataset.cur)
    },
    setCartCount(count){
        this.setData({
            cart_count: count
        })
    },
    changeTab(tab){
        var alltabs = ['home', 'product','news','cart','member'];
        if(alltabs.indexOf(tab)>-1){
            this.setData({
                PageCur: tab,
                needpulldown: false,
                ispulldown: false,
                needreachbottom: false,
                isreachbottom: false
            })
        }else{
            app.tip('页面错误')
        }
    },

    onRequireSupport(e){
        console.log(e)
        if(e.detail.pulldown){
            this.setData({
                needpulldown:true
            })
        }
        if (e.detail.reachbottom) {
            this.setData({
                needreachbottom: true
            })
        }
    },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
    onPullDownRefresh: function () {
        if(!this.data.needpulldown)return;
        wx.startPullDownRefresh()
        this.setData({
            ispulldown:true
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.needreachbottom) return;
        this.setData({
            isreachbottom: true
        })
    }
})