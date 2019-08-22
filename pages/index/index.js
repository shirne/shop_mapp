
const trail = require("../../utils/trail.js");
const app = getApp()

Page({
    data: {
        PageCur: 'home',
        cart_count:0
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
                PageCur: tab
            })
        }else{
            app.tip('页面错误')
        }
    }
})