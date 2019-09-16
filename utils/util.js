const formatTime = (date, withTime = true, spliter = '/') => {
    date=transDate(date)
    if (!isValidDate(date)) return ' - '
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    let datestr = [year, month, day].map(item => {
        return formatNumber(item)
    }).join(spliter)

    if (withTime) {
        datestr += ' ' + [hour, minute, second].map(item => {
            return formatNumber(item)
        }).join(':')
    }
    return datestr
}

const formatNumber = (n, len=2) => {
    let l = n.toString().length;
    return l >= len ? n : (new Array(len - l + 1).join('0') + n)
}

const force_number = (number)=>{
    if(typeof number === typeof 'a'){
        number = parseFloat(number)
    }
    if (typeof number !== typeof 0.1 && typeof number !== typeof 1){
        return 0
    }
    return isNaN(number)?0:number
}

const formatMoney = (n, len=2) => {
    let result = Math.round(n * Math.pow(10, len)) * Math.pow(10, -len)
    return result.toFixed(len)
}

const transDate = date => {
    if (typeof date == typeof 'a') {
        if(parseInt(date) == date){
            date = timestamp2date(date)
        }else{
            date = string2date(date)
        }
    } else if (typeof date == typeof 1) {
        date = timestamp2date(date)
    }
    if (date instanceof Date) {
        return date
    }
    return new Date('a')
}
const isValidDate = (date) => {
    return date && date instanceof Date && !isNaN(date.getTime())
}

const timestamp2date = timestamp => {
    return (timestamp) ? new Date(timestamp * 1000) : new Date()
}

const string2date = datestring => {
    return (datestring) ? new Date(datestring.replace(/-/g, '/')) : new Date()
}

const prevDate = date => {
    date = transDate(date)
    let yestoday = new Date(date.getTime() - 24 * 60 * 60 * 1000)
    return yestoday
}

const nextDate = date => {
    date = transDate(date)
    let tommrow = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    return tommrow
}

const daysOfMonth = (year, month) => {
    let nextMonth = month + 1
    if (nextMonth > 11) {
        nextMonth = 0
        year += 1
    }
    let nfirstDay = new Date(year, nextMonth, 1)
    let lastDay = prevDate(nfirstDay)
    return lastDay.getDate()
}

const dateFormat = (format, timestamp) => {
    let a, jsdate = transDate(timestamp);
    let pad = function (n, c) {
        if ((n = n + "").length < c) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    let txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let txt_ordin = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    };
    let txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let f = {
        // Day 
        d: function () {
            return pad(f.j(), 2)
        },
        D: function () {
            return f.l().substr(0, 3)
        },
        j: function () {
            return jsdate.getDate()
        },
        l: function () {
            return txt_weekdays[f.w()]
        },
        N: function () {
            return f.w() + 1
        },
        S: function () {
            return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
        },
        w: function () {
            return jsdate.getDay()
        },
        z: function () {
            return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
        },

        // Week 
        W: function () {
            var a = f.z(),
                b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                return 1;
            } else {
                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime() / 1000));
                } else {
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month 
        F: function () {
            return txt_months[f.n()]
        },
        m: function () {
            return pad(f.n(), 2)
        },
        M: function () {
            return f.F().substr(0, 3)
        },
        n: function () {
            return jsdate.getMonth() + 1
        },
        t: function () {
            var n;
            if ((n = jsdate.getMonth() + 1) == 2) {
                return 28 + f.L();
            } else {
                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                    return 31;
                } else {
                    return 30;
                }
            }
        },

        // Year 
        L: function () {
            var y = f.Y();
            return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
        },
        //o not supported yet 
        Y: function () {
            return jsdate.getFullYear()
        },
        y: function () {
            return (jsdate.getFullYear() + "").slice(2)
        },

        // Time 
        a: function () {
            return jsdate.getHours() > 11 ? "pm" : "am"
        },
        A: function () {
            return f.a().toUpperCase()
        },
        B: function () {
            // peter paul koch: 
            var off = (jsdate.getTimezoneOffset() + 60) * 60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds / 86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00" + beat;
            if ((String(beat)).length == 2) beat = "0" + beat;
            return beat;
        },
        g: function () {
            return jsdate.getHours() % 12 || 12
        },
        G: function () {
            return jsdate.getHours()
        },
        h: function () {
            return pad(f.g(), 2)
        },
        H: function () {
            return pad(jsdate.getHours(), 2)
        },
        i: function () {
            return pad(jsdate.getMinutes(), 2)
        },
        s: function () {
            return pad(jsdate.getSeconds(), 2)
        },
        //u not supported yet 

        // Timezone 
        //e not supported yet 
        //I not supported yet 
        O: function () {
            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
            else t = "+" + t;
            return t;
        },
        P: function () {
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2))
        },
        //T not supported yet 
        //Z not supported yet 

        // Full Date/Time 
        c: function () {
            return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
        },
        //r not supported yet 
        U: function () {
            return Math.round(jsdate.getTime() / 1000)
        }
    };

    return format.replace(/[\\]?([a-zA-Z])/g, function (t, s) {
        let ret = '';
        if (t != s) {
            // escaped 
            ret = s;
        } else if (f[s]) {
            // a date function exists 
            ret = f[s]();
        } else {
            // nothing special 
            ret = s;
        }
        return ret;
    });
}

const getLocalTime = (time, nosecond = true) => {
    let date = new Date(parseInt(time) * 1000).toLocaleString()
    if (nosecond) {
        date = date.replace(/:\d{1,2}$/, ' ')
    }
    return date
}

const getAge = (birth) => {
    if (typeof birth == 'string') {
        birth = new Date(birth)
    }
    const now = new Date()

    var nowyear = now.getFullYear()
    var nowmonth = now.getMonth()
    var year = nowyear - birth.getFullYear()
    var month = nowmonth - birth.getMonth()
    var days = now.getDate() - birth.getDate()

    if (days < 0) {
        month -= 1
        if (month < 0) {
            year -= 1
            nowyear -= 1
            nowmonth = 12 - nowmonth
        }
        var maxDate = getMaxDate(nowyear, nowmonth)
        days += maxDate
    }
    if (year < 1) {
        if (month < 1) {
            return days + '天'
        } else {
            return month + '个月'
        }
    } else if (year == 1) {
        return year + '岁' + (month > 0 ? (month + '个月') : '')
    } else {
        return year + '岁'
    }
}

const addDayToWeek = (date, week) => {
    var cweek = new Date().getDay()
    if (week < cweek) {
        return addDay(date, week - cweek + 7)
    } else {
        return addDay(date, week - cweek)
    }
}

const addDay = (date, days) => {
    if (typeof date == 'string') {
        date = new Date(date)
    }
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    day += days
    var maxDate = getMaxDate(year, month)
    while (day > maxDate) {
        day = day - maxDate
        month = month + 1
        if (month > 12) {
            month = month - 12
            year = year + 1
        }

        maxDate = getMaxDate(year, month)
    }
    while (day < 0) {
        month = month - 1
        if (month < 1) {
            month = month + 12
            year = year - 1
        }
        maxDate = getMaxDate(year, month)

        day = day + maxDate
    }

    date.setYear(year)
    date.setMonth(month - 1)
    date.setDate(day)
    return date
}

const getMaxDate = (year, month) => {
    var maxDate = 31
    if ([4, 6, 9, 11].indexOf(month) > -1) maxDate = 30
    else if (month == 2) {
        maxDate = ((year % 4 == 0 && year % 100 != 0) || year % 100 == 0) ? 29 : 28
    }
    return maxDate
}
const countObject = obj => {
    var i = 0
    for (var o in obj) {
        i++
    }
    return i
}

const compareVersion = (v1, v2) => {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i])
        var num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

const strgblen = (str) => {
    if (str == null) return 0;
    if (typeof str != "string") {
        str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "01").length;
}

const algorithm = (longitude1, latitude1, longitude2, latitude2) => {

    var Lat1 = rad(latitude1); // 纬度
    var Lat2 = rad(latitude2);
    var a = Lat1 - Lat2; //两点纬度之差
    var b = rad(longitude1) - rad(longitude2); //经度之差

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(Lat1) * Math.cos(Lat2) * Math.pow(Math.sin(b / 2), 2))); //计算两点距离的公式
    s = s * 6378137.0; //弧长乘地球半径（半径为米）
    //s = Math.round(s * 10000) / 10000;//精确距离的数值
    if (s > 1000) {
        s = Math.round(s / 10) / 100 + 'km'
    } else {
        s = Math.round(s) + 'm'
    }

    return s;
}



const rad = (d) => {
    return d * Math.PI / 180.00; //角度转换成弧度
}

const checkMobile = (mobile) => {
    var mobilePatter = '^1[3-9][0-9]{9}$'
    var mobileReg = new RegExp(mobilePatter)
    return mobileReg.test(mobile)
}


const tip = (msg) => {
    wx.showToast({
        icon: 'none',
        title: msg,
    })
}
const success = (msg) => {
    wx.showToast({
        title: msg,
        icon: 'success'
    });
}
const error = (msg) => {
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
}
const alert = (msg, callback = null) => {
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
        config = {
            ...config,
            ...msg
        }
    }
    wx.showModal(config)
}
const confirm = (msg, callback = null, cancel = null) => {
    var config = {
        title: "系统提示",
        content: msg,
        showCancel: true,
        success: function (res) {
            if (res.confirm) {
                if (typeof callback == 'function') {
                    callback()
                }
            } else {
                if (typeof cancel == 'function') {
                    cancel()
                }
            }
        }
    }
    if (typeof msg == 'object') {
        config = {
            ...config,
            ...msg
        }
    }
    wx.showModal(config);
}
const actionSheet = (actions, callback) => {
    wx.showActionSheet({
        itemList: actions,
        success: res => {
            if (resons[res.tapIndex]) {
                callback(actions[res.tapIndex], res.tapIndex)
            }
        }
    })
}

module.exports = {
    formatTime: formatTime,
    forceNumber: force_number,
    formatNumber: formatNumber,
    formatMoney: formatMoney,
    isValidDate: isValidDate,
    timestamp2date: timestamp2date,
    string2date: string2date,
    dateFormat: dateFormat,
    getLocalTime: getLocalTime,
    getAge: getAge,
    addDayToWeek: addDayToWeek,
    addDay: addDay,
    prevDate: prevDate,
    nextDate: nextDate,
    daysOfMonth: daysOfMonth,
    countObject: countObject,
    compareVersion: compareVersion,
    strgblen: strgblen,
    algorithm: algorithm,
    checkMobile: checkMobile,
    tip: tip,
    success: success,
    error: error,
    alert: alert,
    confirm: confirm,
    actionSheet: actionSheet
}