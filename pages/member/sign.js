// pages/member/sign.js

const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const DateObj = require("../../utils/DateObj.js")
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        year: '0000',
        month: '01',
        date: '01',
        prevmonth:'',
        nextmonth:'',
        curdate: '',
        keey_days:0,
        ranking_day:0,
        dates: [],
        signed:null,
        member: {
            niakname: '请登录',
            avatar: '/images/avatar-default.png'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.getProfile((profile) => {
            this.setData({
                member: profile
            })
        })
        this.getLastSign()
        this.setDate(new Date())
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
    getLastSign(){
        app.httpPost('member.sign/getlastsign', json => {
            if (json.code == 1 && json.data && json.data.id) {
                let signdata=json.data
                let curdate = [this.data.year, this.data.month, this.data.date].join('-')
                let newData={}
                if (signdata.signdate == curdate) {
                    newData['signed'] = true
                    newData['keey_days'] = signdata.keep_days
                    newData['ranking_day'] = signdata.ranking_day
                }else{
                    newData['signed'] = false
                    let yesdate = util.prevDate(curdate)
                    if (signdata.signdate == util.formatTime(yesdate,false,'-')){
                        newData['keey_days'] = signdata.keep_days
                    }
                }

                let cursigndata = this.data.signedDates
                if (!cursigndata) cursigndata={}
                if (!cursigndata[signdata.signdate] ){
                    cursigndata[signdata.signdate] = signdata
                    newData["signedDates"] = cursigndata
                }
                
                this.setData(newData)
            }
        })
    },
    changeMonth(e){
        //console.log(e)
        let month=e.target.dataset.month
        if(month){
            this.setDate(month)
        }
    },
    getSignData(){
        if(!this.data.dates)return;
        let lastRow = this.data.dates[this.data.dates.length-1]
        let args={
            from_date:this.data.dates[0][0].fullDate,
            to_date:lastRow[lastRow.length-1].fullDate
        }
        app.httpPost('member.sign/getsigns', args,json=>{
            if(json.code==1){
                if(json.data){
                    this.setData({
                        signedDates:json.data
                    })
                    
                }
            }
        })
    },
    setDate(date) {
        //console.log(date)
        if (!(date instanceof Date)) {
            date = util.string2date(date);
        }
        //console.log(date)
        if (!util.isValidDate(date)){
            app.tip('日期错误')
            return
        }

        let newData = {
            year: date.getFullYear(),
            month: util.formatNumber(date.getMonth() + 1),
            date: util.formatNumber(date.getDate())
        }
        newData.curdate = [newData.year, newData.month, newData.date].join('-')
        if (newData.year != this.data.year || newData.month != this.data.month) {
            let firstdate = new Date(date.getFullYear(), date.getMonth(), 1)
            let day = firstdate.getDay()
            let dates = [[]], row = 0

            let prevDate = util.prevDate(firstdate)
            let prevMonth = prevDate.getMonth()
            let prevYear = prevDate.getFullYear()
            newData.prevmonth = prevYear + '-' + util.formatNumber(prevMonth+1)
            if (day > 0) {
                
                for (let i = 0; i < day; i++) {
                    dates[row].push(new DateObj(new Date(prevYear, prevMonth, prevDate.getDate() - day + i + 1), { isThisMonth: false }).toObject())
                }
            }

            let curYear = date.getFullYear()
            let curMonth = date.getMonth()
            let dateCount = util.daysOfMonth(curYear, curMonth)
            //console.log('curdate:',curYear, curMonth,dateCount)
            for (let i = 1; i <= dateCount; i++) {
                dates[row].push(new DateObj(new Date(curYear, curMonth, i), { isThisMonth: true }).toObject())
                if (dates[row].length >= 7) {
                    //console.log(row)
                    row++
                    dates[row] = []
                }
            }

            let lastRowCount = dates[row].length
            let lastdate = new Date(date.getFullYear(), date.getMonth(), dateCount)
            let nextDate = util.nextDate(lastdate)
            //console.log('nextdate:',nextDate.toLocaleString())
            let nextMonth = nextDate.getMonth()
            let nextYear = nextDate.getFullYear()
            newData.nextmonth = nextYear + '-' + util.formatNumber(nextMonth+1)
            if (lastRowCount > 0) {
                if (lastRowCount < 7) {
                    
                    let firstDay = nextDate.getDay()
                    for (let i = 1; i <= 7 - firstDay; i++) {
                        console.log(i)
                        dates[row].push(new DateObj(new Date(nextYear, nextMonth, i), { isThisMonth: false }).toObject())
                    }
                }
            } else {
                dates.pop()
            }
            newData.dates = dates
            //console.log(dates[0][0].toString())
            //console.log(dates)
        }

        this.setData(newData)
        this.getSignData()
    },
    dosign(e){
        if(this.signed){
            app.tip('今天已经签到过了哦~')
            return
        }
        app.httpPost('member.sign/dosign',{mood:''},json=>{
            app.tip(json.msg)
            if(json.code == 1){
                this.getLastSign()
            }
        })
    }
})