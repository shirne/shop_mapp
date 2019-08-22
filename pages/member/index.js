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
        }
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