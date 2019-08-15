
const app = getApp()

Page({
    data: {
        PageCur: 'home'
    },
    onLoad(args){
        app.initShare(this)
        if (args && args.tab){
            this.setData({'PageCur': args.tab})
        }
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    }
})