const formatTime = (date, withTime=true, spliter='/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(spliter) + (withTime?(' ' + [hour, minute, second].map(formatNumber).join(':')):'')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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
  var a = Lat1 - Lat2;//两点纬度之差
  var b = rad(longitude1) - rad(longitude2); //经度之差

  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(Lat1) * Math.cos(Lat2) * Math.pow(Math.sin(b / 2), 2)));//计算两点距离的公式
  s = s * 6378137.0;//弧长乘地球半径（半径为米）
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
  var mobilePatter = '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$'
  var mobileReg = new RegExp(mobilePatter)
  return mobileReg.test(mobile)
}

module.exports = {
  formatTime: formatTime,
  getAge: getAge,
  addDayToWeek: addDayToWeek,
  addDay: addDay,
  countObject: countObject,
  compareVersion: compareVersion,
  strgblen: strgblen,
  algorithm: algorithm,
  checkMobile: checkMobile
}
