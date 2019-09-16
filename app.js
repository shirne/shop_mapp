//app.js
const util = require("utils/util.js");
const Login = require("utils/Login.js");
const TSRequest = require("utils/TSRequest.js");
const is_debug=true
const defaultCustom = {
    width: 87,
    height: 32,
    top: 24,
    right: 368,
    bottom: 56,
    left: 281
}

let debuginfo='';

App({
    onLaunch: function (options) {
        if(options.query && options.query.agent){
            this.globalData.agent = options.query.agent
        }

        if (__wxConfig && __wxConfig.envVersion){
            this.globalData.env = __wxConfig.envVersion
        }

        //1020	公众号 profile 页相关小程序列表
        //1035	公众号自定义菜单
        //1036	App 分享消息卡片
        //1037	小程序打开小程序
        //1038	从另一个小程序返回
        //1043	公众号模板消息
        //referrerInfo {appId,extraData}
        this.globalData.scene=options.scene;

        let custom = null
        try {
            custom = wx.getMenuButtonBoundingClientRect();
            
            this.addDebug(custom);
        }catch(err){
            this.addDebug('getMenuButtonBoundingClientRect:'+err.message);
        }
        if(!custom){
            custom = defaultCustom
        }
        if (custom.top < 1) custom.top = defaultCustom.top
        if (custom.height < 1) custom.height = defaultCustom.height
        if (custom.bottom < 1) custom.bottom = custom.top+custom.height
        if (custom.width < 1) custom.width = defaultCustom.width

        try{
            const res = wx.getSystemInfoSync();
            this.globalData.systemInfo = res
            this.addDebug(res)

            //基础库版本提示
            if (util.compareVersion(res.SDKVersion, '2.4.4') < 0) {
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，部分功能可能无法使用。'
                })
            }

            this.addDebug('statusBarHeight:'+res.statusBarHeight)
            this.globalData.StatusBar = res.statusBarHeight;

            if (custom.right < 1) custom.right = res.windowWidth - (custom.top - res.statusBarHeight)*2
            if (custom.left < 1) custom.left =custom.right-custom.width
        }catch(e){
            this.addDebug('getSystemInfo:'+e.message)

            if (custom.left < 1) custom.left = defaultCustom.left
            if (custom.right < 1) custom.right = custom.left + custom.width
        }
        if (!this.globalData.StatusBar){
            this.globalData.StatusBar = custom.top < 24 ? custom.top * .76 : 20
        }

        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - this.globalData.StatusBar;
        this.addDebug(['custom-release',this.globalData.Custom, this.globalData.CustomBar])
        this.login = new Login(this, this.globalData.agent)
    },
    checkUpdate(){
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate( (res)=> {
            //console.log(res.hasUpdate)
            this.tip('系统有更新')
        })

        updateManager.onUpdateReady( ()=> {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success:  (res) =>{
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(()=> {
            this.tip('版本下载失败，下次启动时更新')
        })
    },
    addDebug(info){
        if(!is_debug)return;
        if(typeof info != typeof 'a'){
            info = JSON.stringify(info)
        }
        debuginfo += info +"\n"
    },
    onPageNotFound(res) {
        wx.redirectTo({
            url: '/pages/index/index'
        })
    },
    checkLogin(callback = null) {
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
                profile.money_formated = (profile.money*.01).toFixed(2)
                profile.credit_formated = (profile.credit*.01).toFixed(2)
                profile.reward_formated = (profile.reward * .01).toFixed(2)
                return profile
            })
        }
        this.profileRequest.getData(profile => {
            this.globalData.profile = profile
            callback && callback(profile)
        }, force)
    },
    clearProfile: function () {
        this.globalData.profile = null
    },
    fixImageUrl (url,size=null) {
        if (!url) return url
        if (typeof url !== 'string') return url
        if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) return url
        
        if (url.indexOf('/') !== 0) {
            url = '/' + url
        }
        if(size && url.indexOf('?')<0){
            if(typeof size==typeof 'a' || typeof size == typeof 1){
                url += this.globalData.imgSize.replace(/\{(width|height)\}/g,size)
            }else if(size instanceof Array){
                let sizestr = this.globalData.imgSize.replace('{width}', size[0])
                
                sizestr = sizestr.replace('{height}', size[1]||0)
                
                url += sizestr
            }else if(size.width || size.height){
                let sizestr = this.globalData.imgSize.replace('{width}', size.width||0)
                sizestr = sizestr.replace('{height}', size.height||0)
                url += sizestr
            }
        }
        return this.globalData.imgDir + url
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

        if (method=='POST' && debuginfo){
            if(!data){
                data={}
            }
            data.debug = debuginfo
            debuginfo=''
        }
        
        wx.request({
            url: this.globalData.server + queryUrl,
            data: data,
            header: header,
            method: method,
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 102) {
                    console.log('登录信息失效 AT ' + new Date().toLocaleString())
                    self.login.clearLogin();
                    self.login.checkLogin(() => {
                        self.request(url, data, method, success, error)
                    });
                } else if (res.data.code == 103) {
                    console.log('Token过期 AT ' + new Date().toLocaleString())
                    self.login.refreshToken(() => {
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
                    console.log('请求出错　', url)
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
        //console.log("share:", page.route)
        wx.showShareMenu({
            withShareTicket: withTicket
        })

        let profile={}
        this.getProfile(p=>{
            profile=p
        })
        let siteinfo = {}
        this.getSiteInfo(s => {
            siteinfo = s
        })

        page.onShareAppMessage = res => {
            if (res.from === 'button') {
                // 来自页面内转发按钮
                console.log(res.target)
            }
            var route = '/' + (page.shareRoute ? page.shareRoute:page.route)
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
                title: title ? title : siteinfo.sitename,
                imageUrl: img ? img : siteinfo.weblogo,
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

        limit: 10,//分页条数
        agent:'',
        scene:0,

        cart_count: -1,
        env:'release',
        version:'1.1.6',
        wxid: 'uYBUC3j6V',
        imgSize:'?w={width}&h={height}&q=70', //系统压缩参数
        //imgSize:'?x-oss-process=image/resize,w_{width},h_{height},limit_1/auto-orient,0', //oss参数
        imgDir: 'https://scms.test.com',
        server: "https://scms.test.com/api/"
    }
})