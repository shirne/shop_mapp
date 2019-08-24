//app.js
const util = require("utils/util.js");
const Login = require("utils/Login.js");
const TSRequest = require("utils/TSRequest.js");

App({
    onLaunch: function () {
        wx.getSystemInfo({
            success: res => {
                this.globalData.systemInfo = res

                //基础库版本提示
                if (util.compareVersion(res.SDKVersion, '2.4.4') < 0) {
                    wx.showModal({
                        title: '提示',
                        content: '当前微信版本过低，部分功能可能无法使用。'
                    })
                }

                this.globalData.StatusBar = res.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight;

            },
        })
        this.login = new Login(this)
    },
    checkLogin(callback = null, widthinit = false) {
        this.login.checkLogin(callback)
    },
    getUserInfo: function (callback = null) {
        if (!this.globalData.userInfo) {
            var self = this
            wx.getUserInfo({
                success: res => {
                    self.globalData.userInfo = res.userInfo
                    if (typeof callback == 'function') callback(self.globalData.userInfo)
                }
            })
        } else {
            if (typeof callback == 'function') callback(this.globalData.userInfo)
        }
    },

    getSiteInfo: function (callback = null, force = false) {
        if (!this.siteinfoRequest) {
            this.siteinfoRequest = new TSRequest('common/siteinfo', siteinfo => {
                if (siteinfo.weblogo) {
                    siteinfo.weblogo = this.fixImageUrl(siteinfo.weblogo)
                } else {
                    siteinfo.weblogo = "/icons/logo.png"
                }
                return siteinfo
            })
        }
        this.siteinfoRequest.getData(siteinfo => {
            this.globalData.profile = siteinfo
            callback(siteinfo)
        }, force)
    },
    getProfile(callback = null, force = false) {
        if (!this.profileRequest) {
            this.profileRequest = new TSRequest('member/profile', profile => {
                profile.avatar = this.fixImageUrl(profile.avatar)
                profile.cardno = util.formatNumber(profile.id, 8)
                return profile
            })
        }
        this.profileRequest.getData(profile => {
            this.globalData.profile = profile
            callback(profile)
        }, force)
    },
    clearProfile: function () {
        this.globalData.profile = null
    },
    fixImageUrl (url) {
        if (!url) return url
        if (typeof url !== 'string') return url
        if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) return url
        
        var prefix = this.globalData.imgDir
        if (url.indexOf('/') !== 0) {
            prefix += '/'
        }
        return prefix + url
    },
    httpGet: function (url, success, error) {
        this.request(url, {}, 'GET', success, error)
    },
    httpPost: function (url, data, success = null, error = null) {
        if (typeof data == "function") {
            success = data
            error = success
            data = {}
        }
        this.request(url, data, 'POST', success, error)
    },
    request: function (url, data, method, success, error) {
        let self = this;
        let queryUrl = url

        let header = {}
        header.token = this.login.getToken()
        
        wx.request({
            url: this.globalData.server + queryUrl,
            data: data,
            header: header,
            method: method,
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 102) {
                    console.log('登录信息失效 AT ' + new Date().toLocaleString())
                    self.globalData.token = "";
                    self.checkLogin(() => {
                        self.request(url, data, method, success, error)
                    });
                } else if (res.data.code == 103) {
                    console.log('Token过期 AT ' + new Date().toLocaleString())
                    self.refreshToken(() => {
                        self.request(url, data, method, success, error)
                    }, true)
                } else if (res.data.code == 99) {
                    console.log('需要登录 ' + new Date().toLocaleString())
                    if (self.globalData.token) {
                        self.tip('服务器令牌验证出错')
                    } else {
                        //self.tip('请先登录')
                        self.checkLogin(() => {
                            self.request(url, data, method, success, error)
                        });
                    }
                } else {
                    if (typeof success == "function") {
                        success(res.data, res);
                    }
                }
            },
            fail: function (res) {
                if (typeof error == "function") {
                    error(res);
                }
            },
            complete: function (res) {
                if (res.statusCode != 200) {
                    if (typeof error == "function") {
                        error(res);
                    } else {
                        //self.error("服务器维护中")
                        console.log('请求出错　', url)
                    }
                }
            }
        });
    },
    tip: function (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        })
    },
    success: function (msg) {
        wx.showToast({
            title: msg,
            icon: 'success'
        });
    },
    error: function (msg) {
        if (!msg) msg = '系统错误'
        wx.showToast({
            icon: 'none',
            title: msg,
        })
    },
    alert: function (msg, callback = null) {
        var config = {
            title: "系统提示",
            content: msg,
            showCancel: false,
            success: function (res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        }
        if (typeof msg == 'object') {
            config = { ...config, ...msg }
        }
        wx.showModal(config)
    },
    confirm: function (msg, confirm = null, cancel = null, callback = null) {
        var config = {
            title: "系统提示",
            content: msg,
            showCancel: true,
            success: function (res) {
                if (res.confirm) {
                    if (typeof confirm == 'function') {
                        confirm(res)
                    }
                } else if (res.cancel) {
                    if (typeof cancel == 'function') {
                        cancel(res)
                    }
                }
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        }
        if (typeof msg == 'object') {
            config = { ...config, ...msg }
        }
        wx.showModal(config);
    },
    switchIndex: function (tab) {
        var pages = getCurrentPages();
        if (pages[0].route == 'pages/index/index') {
            if (pages.length > 1) {
                wx.navigateBack({
                    delta: pages.length,
                    success: function () {
                        pages[0].changeTab(tab)
                    }
                })
            } else {
                pages[0].changeTab(tab)
            }
        } else {
            wx.reLaunch({
                url: '/pages/index/index?tab=' + tab,
            })
        }
    },
    //设置分享信息
    initShare: function (page, title, img = "", withTicket = true) {
        if (page == null) {
            console.log("hideshare")
            wx.hideShareMenu({})
            return
        }
        console.log("share:", page.route)
        wx.showShareMenu({
            withShareTicket: withTicket
        })

        let profile=null
        this.getProfile(p=>{
            profile=p
        })

        page.onShareAppMessage = res => {
            if (res.from === 'button') {
                // 来自页面内转发按钮
                console.log(res.target)
            }
            var route = '/' + page.route
            let query = []
            if (page.params) {
                for (let i in page.params) {
                    query.push(i + '=' + encodeURIComponent(page.params[i]))
                }
            }
            
            if (profile && profile.agentcode) {
                query.push('agent=' + profile.agentcode)
            }
            if (query.length > 0) {
                route += '?' + query.join('&')
            }
            console.log('share:', route)
            var data = {
                title: title ? title : this.globalData.siteinfo.sitename,
                imageUrl: img ? img : this.globalData.siteinfo.weblogo,
                path: route,
                success: function (res) {
                    // 转发成功
                    util.success('转发成功')
                },
                fail: function (res) {
                    // 转发失败
                }
            }
            return data
        }
    },
    globalData: {
        tipmsgstay: 1000,
        siteinfo: null,
        userInfo: null,
        profile: null,


        cart_count: -1,
        wxid: 'OCUgNk',
        imgDir: 'http://scms.test.com',
        limit: 10,//分页条数
        server: "http://scms.test.com/api/"
    }
})