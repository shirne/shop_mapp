// components/infinite-page/infinite-page.js
Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        loadend:{
            type:Boolean,
            value:false,
            observer(newval,oldval){
                if(newval){
                    this.loadEnd()
                }
            }
        },
        loadingbg:{
            type:String,
            value:''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        istop:true,
        isloading: true,

        loadok: false,
        pullend: false,
        pulldown: 0,
        downY: 0,
        autolose:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        startPull(e){
            this.data.istop=true
        },
        onTouchStart(e) {
            this.setData({
                downY: e.touches[0].pageY,
                pullend: false
            })
        },
        onTouchMove(e) {
            if(!this.data.istop)return;
            let downY = this.data.downY
            this.setData({
                pulldown: e.touches[0].pageY - downY
            })
        },
        onTouchEnd(e) {
            if (!this.data.istop) return;
            this.setData({
                pullend: true,
                loadok: false
            })
        },
        onLoading(e) {
            this.data.autolose=setTimeout(()=>{
                this.loadEnd()
            },5000)
            this.triggerEvent('reload')
        },
        onLoadMore(e){
            this.triggerEvent('loadmore')
        },
        loadEnd(){
            clearTimeout(this.data.autolose)
            this.setData({
                loadok: true
            })
        },
        onScroll(e){
            if(e.detail.scrollTop>5){
                this.data.istop = false
            }
        }
    }
})
