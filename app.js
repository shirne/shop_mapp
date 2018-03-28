//app.js
var util = require("utils/util.js");

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res

        //基础库版本提示
        if (util.compareVersion(res.SDKVersion, '1.9.1') < 0) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，部分功能可能无法使用。'
          })
        }
      },
    })

  },
  checkLogin: function (callback = null, widthinit = false) {
    if (this.globalData.isloging) {
      if (typeof callback == 'function') this.globalData.loginqueue.push(callback)
      console.log('已在登录')
      return;
    }
    var self = this;
    if (!this.globalData.token) {
      console.log('正在登录')
      if (typeof callback == 'function') this.globalData.loginqueue.push(callback)
      this.globalData.isloging = true;
      wx.login({
        success: function (lres) {
          if (lres.code) {
            const code = lres.code
            wx.getUserInfo({
              withCredentials: true,
              success: (res) => {
                self.globalData.userInfo = res.userInfo

                var data = {
                  code: code,
                  store_id: self.globalData.storeId,
                  rawData: res.rawData,
                  signature: res.signature
                }

                self.httpPost('auth/wxlogin', data, (json) => {
                  self.globalData.isloging = false;
                  console.log(self.globalData)
                  if (json.data && json.data.token) {
                    console.log('登录成功')
                    self.setLogin(json.data)
                    
                    self.processQueue()
                  } else {
                    self.error("获取登录信息失败")
                  }
                })

              }
            })

          } else {
            self.globalData.isloging = false;
            self.error("获取登录状态失败")
          }
        }
      })
    } else {
      console.log('已登录')
      //if (typeof callback == 'function') callback()
      self.refreshToken(callback)
    }
  },
  //success:回调函数  is_force:是否强制刷新
  refreshToken: function (success, is_force) {
    if (this.globalData.isloging) {
      if (typeof success == 'function') this.globalData.loginqueue.push(success)
      console.log('已在刷新Token')
      return;
    }
    var self = this
    if (is_force || !this.checkToken()) {
      console.log((is_force ? '强制' : '') + '刷新 token  AT ' + new Date().toLocaleString())
      this.globalData.token = ""
      if (this.globalData.refresh_token) {

        if (typeof callback == 'function') this.globalData.loginqueue.push(callback)
        this.globalData.isloging = true;

        this.httpPost('common/refresh_token', { refresh_token: this.globalData.refresh_token }, (json) => {
          self.globalData.isloging = false;
          if (json.status == 1) {
            self.setLogin(json.data)
            self.processQueue()
          } else {
            self.error(json.message || "刷新token失败")

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
  },
  checkToken: function () {
    if (!this.globalData.token) {
      return false
    }
    var nowTime = Math.ceil(new Date().getTime() / 1000)
    if (this.globalData.token_time + this.globalData.token_expire - 30 <= nowTime) {
      console.log(this.globalData)
      return false
    }

    return true
  },
  setLogin:function(data){
    this.globalData.token = data.token;
    this.globalData.token_time = Math.floor(new Date().getTime() / 1000)
    this.globalData.refresh_token = data.refresh_token
    this.globalData.token_expire = data.token_expire
  },
  processQueue: function () {
    var func = null
    while (func = this.globalData.loginqueue.shift()) {
      func()
    }
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
  getProfile: function (callback = null) {
    if (!this.globalData.profile) {
      var self = this;
      this.httpPost('user/profile', (json) => {
        if (json.status == 1) {
          self.globalData.profile = json.data.profile
          if (typeof callback == 'function') callback(self.globalData.profile)
        } else {
          setTimeout(() => { self.getProfile(callback) }, 3000)
        }
      })
    } else {
      if (typeof callback == 'function') callback(this.globalData.profile)
    }
  },
  getSiteInfo: function (callback = null) {
    if (!this.globalData.siteinfo) {
      var self = this;
      this.httpPost('system/Site/info', (json) => {
        if (json.code == 200) {
          self.globalData.siteinfo = json.data
          if (typeof callback == 'function') callback(self.globalData.siteinfo)
        } else {
          setTimeout(() => { self.getSiteInfo(callback) }, 3000)
        }
      })
    } else {
      if (typeof callback == 'function') callback(this.globalData.siteinfo)
    }
  },
  clearProfile: function () {
    this.globalData.profile = null
  },
  httpGet: function (url, success, error) {
    this.request(url, {}, 'GET', success, error)
  },
  httpPost: function (url, data, success = null, error = null) {
    if (typeof data == "function") {
      success = data
      data = {}
    }
    this.request(url, data, 'POST', success, error)
  },
  request: function (url, data, method, success, error) {
    let self = this;
    let queryUrl = url
    if (!this.globalData.debug) {
      if (!data) data = {};
      if (this.globalData.token)
        data.token = this.globalData.token;
    }
    wx.request({
      url: this.globalData.server + queryUrl,
      data: data,
      method: method,
      dataType: 'json',
      header:{
        token:'e75fYDdAl9V66mTXSzHTuwDxRC0ZXWYe'
      },
      success: function (res) {
        if (res.data.status == 101) {
          console.log('登录信息失效 AT ' + new Date().toLocaleString())
          self.globalData.token = "";
          self.checkLogin(() => {
            self.request(url, data, method, success, error)
          });
        } else if (res.data.status == 103) {
          console.log('Token过期 AT ' + new Date().toLocaleString())
          self.refreshToken(() => {
            self.request(url, data, method, success, error)
          }, true)
        } else
          if (typeof success == "function") {
            success(res.data, res);
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
            console.log('请求出错　',url)
          }
        }
      }
    });
  },
  uploadFile: function (data, success, error = null, handle = null) {
    var self = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var file = res.tempFiles[0]
        if (!file) {
          self.error('请选择要上传的图片')
          return
        }
        if (file.size > 5120000) {
          self.error('您选择的图片过大，可以裁剪后再上传')
          return
        }

        if (typeof data == "string")
          data = { "file_path": data }

        if (typeof handle == "function") {
          var handled = false
          var t = setTimeout(() => {
            handled = true
            self.uploadHandle(data, res.tempFilePaths, success, error)
          }, 600)
          handle(res.tempFilePaths, tempFilePaths => {
            if (handled) return
            clearTimeout(t)
            self.uploadHandle(data, tempFilePaths, success, error)
          })
        } else {
          self.uploadHandle(data, res.tempFilePaths, success, error)
        }
      },
      fail: function () {
        if (typeof error == "function") {
          error(null)
        }
      }
    })
  },
  uploadHandle: function (data, tempFilePaths, success, error = null) {
    wx.showLoading({
      title: '文件上传中',
    })
    var self = this
    var url = self.globalData.server + 'member/upload'
    if (!self.globalData.debug) {
      if (self.globalData.token)
        url += "&token=" + self.globalData.token

    }
    //console.log(url)

    const uploadTask = wx.uploadFile({
      url: url,
      filePath: tempFilePaths[0],
      name: 'file_upload',
      formData: data,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var data = res.data
        try {
          if (typeof data == "string")
            data = JSON.parse(data)
        } catch (e) {
          data = null
        }
        if (data) {
          if (data.status == 1) {
            success(data.data, data);
          } else {
            if (typeof error == "function") {
              error(data)
            }
          }
        } else {
          if (typeof error == "function") {
            error(null, res)
          }
        }
      },
      fail: function (res) {
        wx.hideLoading()
        if (typeof error == "function") {
          error(res)
        }
      }
    })
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '已上传 ' + res.progress + '%',
      })
    })
  },
  tip: function (msg) {
    this.error(msg)
  },
  success: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'success'
    });
  },
  error: function (msg) {
    if (!msg) msg = '系统错误'
    if (msg.length > 7) {
      wx.showToast({
        icon: 'none',
        title: msg,
      })
    } else {
      wx.showToast({
        image: '/icons/error.png',
        title: msg,
      })
    }
  },
  alert: function (msg, callback = null, confirmText='确定') {
    if (typeof callback=='string'){
      confirmText = callback
      callback=null
    }
    var config = {
      title: "系统提示",
      content: msg,
      showCancel: false,
      confirmText: confirmText,
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
  confirm: function (msg, texts='', callback = null, cancel = null) {
    if(typeof texts=='function'){
      cancel = callback
      callback = texts
      texts=''
    }
    var config = {
      title: "系统提示",
      content: msg,
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          if (typeof callback == 'function') {
            callback(res)
          }
        } else {
          if (typeof cancel == 'function') {
            cancel(res)
          }
        }
      }
    }
    if (texts){
      texts = texts.split(',')
      if (texts[0]){
        config.confirmText = texts[0]
      }
      if(texts[1]){
        config.cancelText = texts[1]
      }
    }
    if (typeof msg == 'object') {
      config = { ...config, ...msg }
    }
    wx.showModal(config);
  },
  actionSheet: function (actions, callback) {
    wx.showActionSheet({
      itemList: actions,
      success: res => {
        if (resons[res.tapIndex]) {
          callback(actions[res.tapIndex],res.tapIndex)
        }
      }
    })
  },
  initShare: function (page, title, img = "", withTicket = true) {
    if (page == null) {
      wx.hideShareMenu({})
      return
    }
    console.log("share:", page.route)
    wx.showShareMenu({
      withShareTicket: withTicket
    })
    page.onShareAppMessage = res => {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      var data = {
        title: title ? title : this.globalData.siteinfo.sitename,
        path: page.route,
        success: function (res) {
          // 转发成功
          app.success('转发成功')
        },
        fail: function (res) {
          // 转发失败
        }
      }
      if (img) {
        data.imageUrl = img
      }
      return data
    }
  },
  globalData: {
    isloging: false,
    tipmsgstay: 1000,
    loginqueue: [],//缓存登录过程中需要的回调操作
    siteinfo: null,
    userInfo: null,

    token: "",
    token_time: 0,
    token_expire: 7200,
    refresh_token: "",

    cart_count:0,
    limit: 10,//分页条数
    server: "http://s.test.com/a/"
  }
})