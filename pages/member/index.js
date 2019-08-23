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
            niakname:'请登录'
        },
        ordercounts:{},
        issigned:false,
        sign_keep_days: 0,
        sign_days: 0,
        signrecords:0
    },

    /**
     * 生命周期函数
     */
    lifetimes:{
        attached: function (options) {
            app.initShare(null);
            trail.getProfile((profile)=>{
                this.setData({
                    member: profile
                })
            })

            app.httpPost('common/batch',{
                'notice':{},
                'lastsign': { call: 'member/sign.getlastsign' },
                'signtotaldays': { call: 'member/sign.totaldays' },
                'signrecords':{call:'member/sign.totalcredit'},
                'ordercounts':{call:'member/order.counts'}
            },json=>{
                //console.log(json)
                let newData={}
                if(json.data.notice){
                    newData.notice=json.data.notice
                }
                if (json.data.lastsign){
                    let lastsign=json.data.lastsign
                    let curdate = util.formatTime(new Date(),false,'-')
                    console.log(curdate,lastsign.signdate)
                    if (lastsign.signdate == curdate) {
                        newData['issigned'] = true
                        newData['sign_keey_days'] = lastsign.keep_days
                    } else {
                        //newData['issigned'] = false
                        let yesdate = util.prevDate(curdate)
                        console.log(yesdate)
                        if (lastsign.signdate == util.formatTime(yesdate, false, '-')) {
                            newData['sign_keey_days'] = lastsign.keep_days
                        }
                    }
                }
                newData['signrecords'] = json.data.signrecords;
                newData['sign_days'] = json.data.signtotaldays;
                newData['ordercounts'] = json.data.ordercounts;
                this.setData(newData)
            })
            
        },

        moved: function () { },
        detached: function () { },
    },
    ready: function () {

    },

    methods: {
        gotoOrder: function (e) {
            var status = e.currentTarget.dataset.status
            wx.navigateTo({
                url: '/pages/member/order?status=' + status,
            })
        },
        gotoUrl: function (e) {
            var url = e.currentTarget.dataset.url
            wx.navigateTo({
                url: url
            })
        }
    }

})