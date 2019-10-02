// pages/member/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        favourite_count: 0,
        member: {
            
        },
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        ordercounts:{},
        issigned:false,
        sign_keep_days: 0,
        sign_days: 0,
        signrecords:0,
        isloading:true,
        showtip:false
    },

    /**
     * 生命周期函数
     */
    lifetimes:{
        attached: function (options) {
            //console.log('member')
            app.initShare(null);
            app.getProfile((profile)=>{
                this.setData({
                    member: profile
                })
            })
            this.loadData()
            
        },

        moved: function () { },
        detached: function () { },
    },
    
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {
            this.loadData()
         },
        hide: function () { },
        resize: function () { },
    },

    methods: {
        bindReturns(e) {
            if (e && e.detail && e.detail.rawData) {
                this.data.userinfo = e.detail.userInfo
                this.data.detail = e.detail

                this.doCallback()
            }
        },
        doCallback() {
            if (app.login) {
                //console.log(app.login)
                //app.login.isauthing = false

                wx.showLoading({
                    title: '正在登录',
                })
                app.login.doLogin(success => {
                    wx.hideLoading()
                    app.success('登录成功')
                    this.onLoading()
                })
            } else {
                wx.reLaunch({
                    url: '/pages/index/index',
                })
            }
        },
        closethis(e){
            this.setData({
                showtip:false
            })
        },
        loadData(callback){
            app.httpPost('common/batch', {
                'notice': {flag:'member'},
                'lastsign': { call: 'member/sign.getlastsign' },
                'signtotaldays': { call: 'member/sign.totaldays' },
                'signrecords': { call: 'member/sign.totalcredit' },
                'ordercounts': { call: 'member/order.counts' }
            }, json => {
                //console.log(json)
                let newData = { isloading:false}
                if(json.code==1){
                    if (json.data.notice) {
                        newData.notice = json.data.notice
                    }
                    if (json.data.lastsign) {
                        let lastsign = json.data.lastsign
                        let curdate = util.formatTime(new Date(), false, '-')
                        //console.log(curdate,lastsign.signdate)
                        if (lastsign.signdate == curdate) {
                            newData['issigned'] = true
                            newData['sign_keey_days'] = lastsign.keep_days
                        } else {
                            //newData['issigned'] = false
                            let yesdate = util.prevDate(curdate)
                            //console.log(yesdate)
                            if (lastsign.signdate == util.formatTime(yesdate, false, '-')) {
                                newData['sign_keey_days'] = lastsign.keep_days
                            }
                        }
                    }
                    newData['signrecords'] = json.data.signrecords;
                    newData['sign_days'] = json.data.signtotaldays;
                    newData['ordercounts'] = json.data.ordercounts;
                }else if(json.code==99){
                    newData['showtip']=true
                }
                this.setData(newData)

                callback && callback()
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
                this.loadData()
            },true)
            
        },
        checkLogin:function(){
            if(!this.data.member.id){
                app.error('请先登录')
                return false
            }
            return true
        },
        gotoOrder: function (e) {
            if(!this.checkLogin())return
            var status = e.currentTarget.dataset.status
            wx.navigateTo({
                url: '/pages/member/order?status=' + status,
            })
        },
        gotoUrl: function (e) {
            if (!this.checkLogin()) return
            var url = e.currentTarget.dataset.url
            wx.navigateTo({
                url: url
            })
        }
    }

})