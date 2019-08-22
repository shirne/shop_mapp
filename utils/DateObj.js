
const parseDate = (date)=>{
    if (date instanceof Date) {
        return date
    } else if (date instanceof String) {
        if (date.isMatch(/^\d+$/)) {
            if (date.length == 10) {
                date = date * 1000
            } else {
                date = date * 1
            }
            return new Date(date)
        } else {
            return new Date(date.replace(/-/g, '/'))
        }
    } else if (date instanceof Number) {
        if (date.toString().length == 10) {
            date = date * 1000
        }
        return new Date(date)
    }
    return new Date('invalid')
}

const formatNumber = (n)=>{
        return n >= 10 ? n : '0' + n
    }

class DateObj
{
    dateObj=new Date()
    isThisMonth=true
    constructor(date = null, props={}){
        if(date){
            this.dateObj = parseDate(date)
        }
        if(props.isThisMonth !== undefined){
            this.isThisMonth = props.isThisMonth
        }
    }

    inMonth(year,month){
        return this.dateObj.getFullYear() == year && this.dateObj.getMonth()+1==month
    }

    isDate(date) {
        return this.toString()==date
    }

    get date(){
        return formatNumber(this.dateObj.getDate())
    }

    set date(date){
        this.dateObj = parseDate(date)
    }
    toObject(){
        return {
            fullDate:this.toString(),
            date: formatNumber(this.dateObj.getDate()),
            isThisMonth: this.isThisMonth
        }
    }
    toString(){
        return [this.dateObj.getFullYear(), formatNumber(this.dateObj.getMonth() + 1), formatNumber(this.dateObj.getDate())].join('-')
    }
}

module.exports = DateObj