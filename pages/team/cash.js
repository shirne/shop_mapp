// pages/team/cash.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cashtype:'',
        cashtip:'',
        balance: 0,
        userinfo:{},
        member:{},

        ispack: false,   //是否仅支持红包
        picker: [{ title: '请选择' }],
        index: '0',
        cards:null,
        cardid: 0,
        cardidx: 0,
        banklist:[''],
        bankidx:0,

        formdata:{},
        inputamount:'',

        enabled: false,
        amountchanged: false,
        amount_set_delay: 0,
        loading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.getUserInfo(userinfo=>{
            this.setData({
                userinfo: userinfo
            })
        })
        app.getProfile(profile=>{
            this.setData({
                member:profile,
                balance: (profile.reward - profile.froze_reward)*.01
            })
            this.loadData()
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    setAmount(e){
        this.data.amountchanged=true
        this.setField(e,'amount')
    },
    setAlipay(e) {
        this.setField(e, 'alipay')
    },
    setBankname(e) {
        this.setField(e, 'bankname')
    },
    setCardname(e) {
        this.setField(e, 'cardname')
    },
    setCardno(e) {
        this.setField(e, 'cardno')
    },
    setRealname(e){
        this.setField(e, 'realname')
    },
    setField(e,field){
        let newdata={}
        newdata['formdata.' + field]=e.detail.value
        this.setData(newdata)
        this.checkState()
    },
    pickerChange(e){
        let idx = e.detail.value
        this.setData({
            index: idx,
            cashtype: this.data.picker[idx].type
        })
        if (this.data.cashtype=='unioncard'){
            if(!this.data.card){
                this.loadCard()
            }
        }else{
            this.checkState()
        }
    },
    loadCard(){
        wx.showLoading({
            title: '',
        })
        app.httpPost('member.account/cards', json => {
            if(json.code==1){
                let cards=json.data.cards
                cards.push({
                    id:0,
                    bank:'添加新银行卡'
                })
                this.setData({
                    cards: cards,
                    banklist:json.data.banklist||[]
                })
                wx.hideLoading()
                this.checkState()
            }else{
                app.alert('加载数据错误')
            }
        })
    },
    pickerCardChange(e){
        let cards=this.data.cards
        let idx=e.detail.value
        this.setData({
            cardidx: idx,
            cardid: cards[idx].id
        })
        this.checkState()
    },
    bankChange(e){
        let idx = e.detail.value
        this.setData({
            bankidx: idx
        })
    },
    checkState(){
        //console.log('checkstate')
        this.setData({
            enabled:false,
            tiptext:''
        })
        clearTimeout(this.data.amount_set_delay)
        if(!this.data.formdata.amount){
            this.setData({
                tiptext:'请填写提现金额'
            })
            return false;
        }
        
        let amount = parseFloat(this.data.formdata.amount)
        if (amount < 0 || isNaN(amount)) {
            this.setData({
                tiptext: '金额不合法'
            })
            return false;
        }
        let config = this.data.cashconfig
        let amounttip=''
        if (config.limit > 0 && amount < config.limit){
            amounttip='最低提现金额: '+config.limit
            amount = config.limit
        }
        if (config.max > 0 && amount > config.max) {
            amounttip = '最高提现金额: ' + config.limit
            amount = config.max
        }
        if (config.power > 0 && (amount % config.power) != 0) {
            amounttip = '提现金额必须是 ' + config.power+' 的整数倍'
            amount = Math.ceil(amount / config.power) * config.power
        }
        if (amounttip){
            this.data.amount_set_delay=setTimeout(()=>{
                if (this.data.amountchanged){
                    app.tip(amounttip)
                    this.data.amountchanged=false
                }
                this.setData({
                    inputamount: amount
                })
            },600)
        }
        if(amount > this.data.balance){
            this.setData({
                tiptext: '可提现余额不足'
            })
            return false;
        }
        if (this.data.cashtype == 'wechat'){
            if (!this.data.formdata.realname) {
                this.setData({
                    tiptext: '请填写真实姓名'
                })
                return false;
            }
        }else if(this.data.cashtype=='alipay'){
            if(!this.data.formdata.alipay){
                this.setData({
                    tiptext: '请填写支付宝账号'
                })
                return false;
            }
        } else if (this.data.cashtype == 'unioncard'){
            if (cardid==0){
                if (!this.data.formdata.bankname ||
                    !this.data.formdata.cardname ||
                    !this.data.formdata.cardno 
                ){
                    this.setData({
                        tiptext: '请填写银行卡资料'
                    })
                    return false;
                }
            }
        }
        this.setData({
            enabled:true
        })
    },
    loadData(){
        app.httpPost('member.account/cash_config',json=>{
            if(json.code==1){
                this.setData({
                    cashconfig:json.data
                })
                let types=json.data.types
                if(!types || types.length<1){
                    app.alert('系统维护中,提现功能暂不可用',res=>{
                        wx.navigateBack({})
                    })
                }else{
                    let picker=[]
                    if (types.indexOf('wechat') > -1 || types.indexOf('wechatpack') > -1 || types.indexOf('wechatminipack') > -1){
                        picker.push({title:'微信零钱',type:'wechat'})
                        if (types.indexOf('wechat')<0){
                            this.setData({
                                ispack:true,
                                wechatlimit:'微信提现每次额度200，每日额度1000，10次以内'
                            })
                        }else{
                            this.setData({
                                wechatlimit: ''
                            })
                        }
                    }
                    if (types.indexOf('alipay') > -1){
                        picker.push({title:'支付宝余额',type:'alipay'})
                    }
                    if (types.indexOf('unioncard') > -1) {
                        picker.push({title:'银行卡',type:'unioncard'})
                    }
                    let config=json.data
                    let cashtip=''
                    if(config.cashdesc){
                        cashtip = config.cashdesc
                    }else{
                        if (config.fee){
                            cashtip += '提现手续费：'+config.fee+'% '
                            if(config.fee_min){
                                cashtip+= '最低 '+config.fee_min+'元 '
                            }
                            if (config.fee_max) {
                                cashtip += '封顶 ' + config.fee_max + '元 '
                            }
                        }
                        if (config.limit > 0 || config.max > 0 || config.power > 0){
                            if (cashtip) cashtip +="\n"
                            cashtip += '单次提现金额: '
                            if(config.limit>0){
                                cashtip += '最低 ' + config.limit
                            }
                            if (config.max > 0){
                                cashtip += '最高 ' + config.max
                            }
                            if (config.power > 0) {
                                cashtip += ' 金额必须是 ' + config.power+' 的整数倍'
                            }
                        }
                    }

                    this.setData({
                        cashtip: cashtip,
                        picker: picker,
                        cashtype:picker[0].type,
                        index:0
                    })
                    this.checkState()
                }
            }else{
                app.alert('系统错误，请稍候再试', res => {
                    wx.navigateBack({})
                })
            }
        })
    },
    submitForm(e){
        if(this.data.loading)return;
        this.setData({
            loading:true
        })
        let data=this.data.formdata
        data.cashtype = this.data.cashtype
        data.bank = this.data.banklist[this.data.bankidx]
        app.httpPost('member.account/cash',data,json=>{
            
            if(json.code==1){
                app.alert(json.msg,()=>{
                    wx.navigateBack({})
                })
            }else{
                this.setData({
                    loading: false
                })
                app.error(json.msg)
            }
        })
    }
})