
const trail = require("../../utils/trail.js");
const app = getApp()

Page({
    data: {
        PageCur: 'home',
        cart_count:0,
        product_cate:0,
        news_cate:0
    },
    params:{
        tab:'home'
    },
    onLoad(args){
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
            this.params.tab = tab
        }else{
            app.tip('页面错误')
        }
    },
    onSetData(e){
        this.setData(e.detail)
    },
    onRequireShare(e){
        if(e.detail && e.detail.title){
            app.initShare(this,e.detail.title,e.detail.img)
        }else{
            app.initShare(null)
        }
    }
})