const util = require("util.js");

const app = getApp()

const default_image = '/images/image.png'

var cart_count = -1
const getCartCount = (callback, force) => {
    if (force || cart_count < 0) {
        app.checkLogin( ()=> {
            app.httpPost('cart/getcount', json => {
                if (json.code == 1) {
                    cart_count = parseInt(json.data) || 0;
                    let pages = getCurrentPages()
                    
                    if (pages.length>0 && pages[0].route == 'pages/index/index'){
                        pages[0].setCartCount(cart_count)
                    }

                    callback(cart_count)
                }
            })
        })
    } else {
        callback(cart_count)
    }
}


const makeOrder = (api, data, success, error) => {
    wx.showLoading({
        title: '正在提交',
    })
    app.httpPost(api,
        data,
        (json) => {
            wx.hideLoading()
            if (json.code == 1) {
                if (json.data && json.data.payment) {
                    if (json.data.payment.timeStamp){
                        doPay(json.data.payment, res=>{
                            success(json.data.order_id)
                        }, res=>{
                            app.alert('支付失败', res => {
                                error(json.data.order_id)
                            })
                        })
                    }else{
                        app.alert('发起支付失败', res => {
                            error(json.data.order_id)
                        })
                    }
                } else {
                    payOrder(json.data.order_id, success, error)
                    
                }

            } else {
                error(0,json.msg)
            }
        })
}

const payOrder = (orderid, success, error)=>{
    app.httpPost('order/wechatpay', { order_id: orderid, payid : app.globalData.wxid}, json => {
        if (json.data.payment && json.data.payment.timeStamp) {
            doPay(json.data.payment, res => {
                success(orderid)
            }, res => {
                app.alert('支付失败', res => {
                    error(orderid)
                })
            })
        } else {
            app.alert(json.msg||'发起支付失败', res => {
                error(orderid)
            })
        }
    })
}

const doPay = (payment, success, error)=>{
    payment.timeStamp = payment.timeStamp.toString()
    //todo 转到支付
    wx.requestPayment({
        ...payment,
        'success': function (res) {
            if (res.errMsg == 'requestPayment:ok') {
                setTimeout(()=>{
                    app.getProfile(null,true)
                },500)
                success(res)
            }
        },
        'fail': function (res) {
            error(res)
        },
        'complete': function (res) {
            //6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调
            //回调 errMsg 为 'requestPayment:cancel'
            if (res.errMsg == 'requestPayment:cancel') {
                error(res)
            }
        }
    })
}

const uploadFile= (data, success, error = null, handle = null)=> {
    
    wx.chooseImage({
        count: 1,
        success: function (res) {
            var file = res.tempFiles[0]
            if (!file) {
                util.error('请选择要上传的图片')
                return
            }
            if (file.size > 5120000) {
                util.error('您选择的图片过大，可以裁剪后再上传')
                return
            }

            if (typeof data == "string")
                data = { "file_path": data }

            if (typeof handle == "function") {
                var handled = false
                var t = setTimeout(() => {
                    handled = true
                    uploadHandle(data, res.tempFilePaths, success, error)
                }, 600)
                handle(res.tempFilePaths, tempFilePaths => {
                    if (handled) return
                    clearTimeout(t)
                    uploadHandle(data, tempFilePaths, success, error)
                })
            } else {
                uploadHandle(data, res.tempFilePaths, success, error)
            }
        },
        fail: function () {
            if (typeof error == "function") {
                error(null)
            }
        }
    })
}
const uploadHandle= (data, tempFilePaths, success, error = null)=> {
    wx.showLoading({
        title: '文件上传中',
    })
    
    var url = app.globalData.server + 'member/uploadImage'
    if (!app.globalData.debug) {
        url += "?api_version=1.0"
        if (app.globalData.token)
            url += "&token=" + app.globalData.token

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
                if (data.code == 1) {
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
}
const fixListDate = (lists, format="Y-m-d",key = "create_time") => {
    if (!lists || !lists.length) return lists
    for (var i = 0; i < lists.length; i++) {
        lists[i] = fixDate(lists[i], format, key)
    }
    return lists
}
const fixDate = (obj, format = "Y-m-d", key = "create_time") => {
    if (!obj) return obj
    if (key.indexOf(',') > 0) {
        key.split(',').forEach((k) => {
            k = k.trim()
            if (k) {
                obj = fixDate(obj, format, k)
            }
        })
        return obj
    }

    obj[key] = util.dateFormat(format, obj[key])

    return obj
}
const fixListImage = (lists, key = "avatar") => {
    if (!lists || !lists.length) return lists
    for (var i = 0; i < lists.length; i++) {
        lists[i] = fixImage(lists[i], key)
    }
    return lists
}
const fixImage=(obj, key)=>{
    if(!obj )return obj
    if (key.indexOf(',') > 0) {
        key.split(',').forEach((k) => {
            k = k.trim()
            if (k) {
                obj = fixImage(obj, k)
            }
        })
        return obj
    }
    if (key.indexOf('.') > 0 && !obj[key]){
        let parts = key.split('.')
        let k = parts.shift()
        let nk = parts.join('.')
        if (obj[k]){
            if (obj[k] instanceof Array) {
                obj[k] = fixListImage(obj[k], nk)
            } else {
                obj[k] = fixImage(obj[k], nk)
            }
        }
        return obj
    }
    
    if (obj[key] instanceof Array){
        obj[key] = obj[key].map(img=>{
            return fixImageUrl(img)
        })
    }else{
        obj[key] = fixImageUrl(obj[key])
    }
    return obj
}

const fixImageUrl = (url) => {
    return app.fixImageUrl(url)
}

const fixContent = (content)=>{
    if(typeof content!= 'string' || content=='')return content
    //移除不支持的
    content=content.replace(/&emsp;/g,'')
    content = content.replace(/\bid="[^"]+"\s*/g, '')

    content = content.replace(/<([\w]+)\s+(?:class="([^"]+)")?/g,(mth,tag,cls)=>{
        //console.log(tag,cls)
        if(tag=='br'){
            return mth
        }else{
            return '<'+tag+' class="tag_'+tag+(cls?(' '+cls):'')+'" '
        }
    })
    content = content.replace(/src="([^"]+)"/g,(mth,url)=>{
        //console.log(url)
        return 'src="' + fixImageUrl(url) + '"'
    })
    return content
}

const fixTag = (node, pnode) => {
    if (!node.attrs) {
        node.attrs = {}
    }
    if (node.attrs.class) {
        node.attrs.class += ' tag_' + node.name
    } else {
        node.attrs.class = 'tag_' + node.name
    }
    if (node.name == 'img') {
        if (node.attrs.src) {
            node.attrs.src = fixImageUrl(node.attrs.src)
        }
        if (pnode.name == 'p' && pnode.children.length < 1) {
            if (pnode.attrs.class) {
                pnode.attrs.class += ' tag_noindent'
            } else {
                pnode.attrs.class = 'tag_noindent'
            }
        }
    }
}
const fixMarketPrice = (goods)=>{
    if (goods && goods.length) {
        for (let i = 0; i < goods.length; i++) {
            goods[i].market_price = Math.round(goods[i].market_price) || 0
        }
    }
    return goods;
}

const reasons=[
    "我不想要了",
    "重复下单",
    "信息填写错误重新拍",
    "没有礼品/优惠",
    "卖家缺货",
    "其它原因"
]

const refundReasons=[
    "15天无理由退货",
    "发货不全/配件不全",
    "收到商品时有破损/污渍/变形",
    "商品质量问题",
    "未按约定时间发货",
    "商家发错货"
]

const orderAction=(action, id, status, success)=>{
    switch (action) {
        case 'delete':
            wx.showModal({
                title: '删除订单',
                content: '删除订单后所有数据不可恢复！',
                success(res) {
                    if (res.confirm) {
                        app.httpPost('member.order/delete', { id: id }, json => {
                            if(json.code==1){
                                app.success(json.msg)
                                success && success()
                            }else{
                                app.error(json.msg)
                            }
                        })
                    }
                }
            })
            break;
        case 'cancel':
            wx.showActionSheet({
                itemList: reasons,
                success: (res) => {
                    let reason = reasons[res.tapIndex]
                    if (reason) {
                        app.httpPost('member.order/cancel', { id: id, reason: reason }, json => {
                            if (json.code == 1) {
                                app.success(json.msg)
                                success && success()
                            } else {
                                app.error(json.msg)
                            }
                        })
                    }
                }
            })
            break;
        case 'repay':
            wx.showActionSheet({
                itemList: ['微信支付'],
                success: (res) => {
                    if (res.tapIndex === 0) {
                        trail.payOrder(id, order_id => { 
                            success && success()
                         }, order_id => {

                        })
                    }
                }
            })
            break;
        case 'express':
            wx.navigateTo({
                url: 'order-express?id=' + id
            })
            break;
        case 'confirm':
            wx.showModal({
                title: '确认完成',
                content: '请确认已收到货并且货品完整！',
                success: (res) => {
                    if (res.confirm) {
                        app.httpPost('member.order/confirm', { id: id }, json => {
                            if (json.code == 1) {
                                app.success(json.msg)
                                success && success()
                            } else {
                                app.error(json.msg)
                            }
                        })
                    }
                }
            })
            break;
    }
}

module.exports = {
    makeOrder: makeOrder,
    payOrder: payOrder,
    getCartCount: getCartCount,
    uploadFile: uploadFile,
    fixListDate: fixListDate,
    fixDate: fixDate,
    fixListImage: fixListImage,
    fixImage: fixImage,
    fixImageUrl: fixImageUrl,
    fixContent: fixContent,
    fixTag: fixTag,
    fixMarketPrice: fixMarketPrice,
    reasons: reasons,
    refundReasons: refundReasons,
    orderAction: orderAction
}