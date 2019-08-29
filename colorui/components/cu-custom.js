const app = getApp();
Component({
    /**
     * 组件的一些选项
     */
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    /**
     * 组件的对外属性
     */
    properties: {
        bgColor: {
            type: String,
            default: ''
        },
        isCustom: {
            type: [Boolean, String],
            default: false
        },
        isBack: {
            type: [Boolean, String],
            default: false
        },
        bgImage: {
            type: String,
            default: ''
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        origIsCustom: false
    },

    lifetimes: {
        attached: function () {
            this.data.origIsCustom = this.data.isCustom
        },
    },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {
            if (!this.data.origIsCustom) {
                let pages = getCurrentPages()
                if (pages.length < 2) {
                    if (pages && pages[0].route != 'pages/index/index') {
                        this.setData({
                            isCustom: true
                        })
                        return;
                    }
                }
            }
            if (this.data.isCustom != this.data.origIsCustom) {
                this.setData({
                    isCustom: this.data.origIsCustom
                })
            }
        },
        hide: function () { },
        resize: function () { },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        BackPage() {
            let pages = getCurrentPages()
            if (pages.length == 1 && pages[0].route != 'pages/index/index') {
                this.toHome()
            } else {
                wx.navigateBack({
                    delta: 1
                });
            }
        },
        toHome() {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
    }
})