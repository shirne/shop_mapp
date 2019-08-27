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

                if (this.data.isloading) {
                    this.setData({
                        isloading: false
                    })
                }
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
        },
        bgcolor:{
            type:String,
            observer(newval, oldval) {
                this.setData({
                    bgstring: newval?('background-color:'+newval):''
                })
            }
        },
        bgimg: {
            type: String,
            observer(newval, oldval) {
                this.setData({
                    bgstring: newval ? ('background-image:url(' + newval+')') : ''
                })
            }
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
        timestamp: 0,
        bgstring:''
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
                let pulltop = newval;
                if (newval > this.data.maxheight) {
                    let over = newval - this.data.maxheight
                    let ratio = 1 - this.data.maxheight / (this.data.maxheight + over)
                    pulltop = this.data.maxheight + this.data.maxheight * ratio;
                    
                }
                
                let dotsize = Math.round(pulltop * 15)*.01

                this.setData({
                    pullTop: pulltop,
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
            setTimeout(() => {
                this.triggerEvent('loading',{});
            }, 500)

            if (this.data.pullTop > this.data.maxheight) {
                this.updatePullTop(this.data.maxheight)
            }

            this.setData({
                isloading:true
            })
        },
        endLoading(){
            if(this.data.pullTop<=0)return;
            if(this.data.isloading){
                this.triggerEvent('loadend', {});
            }
            
            this.setData({
                pullTop: 0,
                dotsize: 0
            })
            
        }
    }
})
