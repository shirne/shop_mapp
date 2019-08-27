// components/pull-load/pull-load.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        loadok:{
            type:Boolean,
            observer(newval, oldval){
                if(newval){
                    this.endLoading()
                }
            }
        },
        pullend: {
            type: Boolean,
            observer(newval, oldval) {
                if(newval){
                    this.checkLoading()
                }
            }
        },
        pulldown:{
            type:Number,
            observer(newval, oldval) {
                //clearInterval(this.data.timer)
                //clearInterval(this.data.loadingtimer)
                this.updatePullTop(newval)
            }
        },
        maxheight: {
            type:Number,
            value:80
        },
        restoretime: {
            type:Number,
            value: 800
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        pullTop:0,
        dotsize:0,
        dots:[],
        isloading: false,
        loadingidx: 0,
        loadingtimer:0,
        timer: 0,
        timestamp: 0
    },

    lifetimes:{
        attached: function () {
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        updatePullTop(newval){
            if (newval > 0) {
                if (this.data.isloading) {
                    this.setData({
                        isloading: false
                    })
                }
                if (newval > this.data.maxheight) newval = this.data.maxheight;
                let dotsize= Math.round(newval * .2)
                this.setData({
                    pullTop: newval,
                    dotsize: dotsize
                })
            }
        },
        checkLoading(){
            if(this.data.pullTop>=this.data.maxheight){
                this.startLoading()
            }else{
                this.endLoading()
            }
        },
        startLoading(){
            this.triggerEvent('loading',{});
            this.setData({
                isloading:true
            })
        },
        endLoading(){
            if(this.data.isloading){
                this.triggerEvent('loadend', {});
            }
            this.setData({
                pullTop:0,
                dotsize: 0
            })
        }
    }
})
