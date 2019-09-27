
let app=null

/**
 * 单例数据获取+缓存类
 */
class TSRequest{
    api = ''
    param=''
    trytimes=0
    maxtimes=10

    process=null
    success=[]
    error=[]

    data=null
    isloading=false

    error_timing=0

    constructor(api='', param=null, process=null){
        if(!app) app=getApp()
        this.setparam(api, param, process)
    }

    setparam(api = '', param = null, process = null){
        console.log('new TSRequest:',api)
        if(typeof param == 'function'){
            process = param
            param=null
        }
        if (api !== '') this.api = api
        if (param !== null) this.param = param
        if (typeof process == 'function')this.process = data=>{
            return process(data)
        }
    }

    getData(success=null,error=null,force=false){
        if(error && typeof error !=='function'){
            force=error
            error=null
        }
        if(this.data && !force){
            if (typeof success == 'function') success(this.data)
            return
        }

        if (typeof success == 'function') this.success.push(success)
        if (typeof error == 'function') this.error.push(error)
        if(!this.isloading)this._request()
    }

    _callback(issuccess=true){
        if(issuccess){
            this.error=[]
            while(this.success.length>0){
                let func = this.success.shift()
                func(this.data)
            }
        }else{
            this.success = []
            while (this.error.length > 0) {
                let func = this.error.shift()
                func()
            }
        }
    }

    _request(){
        this.isloading=true
        app.httpPost(this.api, this.param, (json) => {
            this.isloading = false
            this.trytimes = 0
            if (json.code == 1) {
                this.data = json.data
                if (this.process) {
                    this.data = this.process(this.data)
                }
                this._callback()
            } else {
                this._callback(false)
            }
        }, error => {
            this._onerror(false)
        })
    }

    _onerror(){
        if(this.trytimes>= this.maxtimes){
            console.error('获取数据失败,已尝试：' + this.trytimes + ' 次')
            this.isloading = false
            this.trytimes = 0
            this._callback(false)
        }else{
            clearTimeout(this.error_timing)
            this.error_timing = setTimeout(() => {
                this.trytimes++;
                this._request()
            }, this.trytimes * 500)
        }
    }
}


module.exports = TSRequest