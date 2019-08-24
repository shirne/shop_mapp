
class Login {

    app = null
    isloging=false
    loginqueue= []//缓存登录过程中需要的回调操作

    userInfo=null

    token= ""
    token_time= 0
    token_expire= 7200
    refresh_token= ""

    constructor(app) {
        this.app = app
    }

    getToken(){
        return this.token
    }

    /**
     * 检查是否已登录并执行登录，登录成功则回调
     */
    checkLogin(callback = null, widthinit = false) {
        if (this.isloging) {
            if (typeof callback == 'function') this.loginqueue.push(callback)
            console.log('已在登录')
            return;
        }
        var self = this;
        if (!this.token) {
            console.log('正在登录')
            if (typeof callback == 'function') this.loginqueue.push(callback)
            this.isloging = true;
            wx.login({
                success: function (lres) {
                    if (lres.code) {
                        const code = lres.code
                        wx.getUserInfo({
                            withCredentials: true,
                            success: (res) => {
                                self.userInfo = res.userInfo

                                var data = {
                                    code: code,
                                    wxid: self.app.globalData.wxid,
                                    rawData: res.rawData,
                                    signature: res.signature
                                }

                                self.app.httpPost('auth/wxlogin', data, (json) => {
                                    self.isloging = false;
                                    //console.log(self.globalData)
                                    if (json.data && json.data.token) {
                                        console.log('登录成功')
                                        self.setLogin(json.data)

                                        self.processQueue()
                                    } else {
                                        self.tip(json.msg || "获取登录信息失败")
                                    }
                                }, res => {
                                    self.isloging = false;
                                    self.tip("网络错误，登录失败")
                                })

                            },
                            fail: res => {
                                wx.hideLoading()
                                wx.showModal({
                                    title: '取消授权提示',
                                    content: '没有用户授权信息，不能获取用户在应用中的对应数据？',
                                    cancelText: "重新授权",
                                    confirmText: "不授权",
                                    success: (data) => {
                                        if (data.confirm) {
                                            console.info("确认不授权")
                                            self.tip("无法自动登录")
                                        } else if (data.cancel) {
                                            wx.openSetting({
                                                success: result => {
                                                    if (result.authSetting['scope.userInfo'] == true) {
                                                        self.isloging = false
                                                        self.checkLogin(callback, withinit)
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })

                    } else {
                        self.isloging = false;
                        this.app.error("获取登录状态失败")
                    }
                }
            })
        } else {
            console.log('已登录')
            //if (typeof callback == 'function') callback()
            self.refreshToken(callback)
        }
    }
    //success:回调函数  is_force:是否强制刷新
    refreshToken(success, is_force) {
        if (this.isloging) {
            if (typeof success == 'function') this.loginqueue.push(success)
            console.log('已在刷新Token')
            return;
        }
        var self = this
        if (is_force || !this.checkToken()) {
            console.log((is_force ? '强制' : '') + '刷新 token  AT ' + new Date().toLocaleString())
            this.token = ""
            if (this.refresh_token) {

                if (typeof success == 'function') this.loginqueue.push(success)
                this.isloging = true;

                this.app.httpPost('auth/refresh', { refresh_token: this.refresh_token }, (json) => {
                    self.isloging = false;
                    if (json.code == 1) {
                        self.setLogin(json.data)
                        self.processQueue()
                    } else {
                        self.tip(json.message || "刷新token失败")

                        //重新执行登录 回调已加到队列，不需重复添加
                        this.checkLogin()
                    }
                })
            } else {
                this.checkLogin(success)
            }
        } else {
            console.log('不需刷新 token')
            if (typeof success == 'function') success()
        }
    }
    //检查token是否有效
    checkToken() {
        if (!this.token) {
            return false
        }
        var nowTime = Math.ceil(new Date().getTime() / 1000)
        if (this.token_time + this.token_expire - 30 <= nowTime) {
            console.log(this)
            return false
        }

        return true
    }
    setLogin(data) {
        this.token = data.token;
        this.token_time = Math.floor(new Date().getTime() / 1000)
        this.refresh_token = data.refresh_token
        this.token_expire = data.token_expire
    }
    processQueue() {
        var func = null
        while (func = this.loginqueue.shift()) {
            func()
        }
    }
    tip (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        })
    }
}

module.exports = Login