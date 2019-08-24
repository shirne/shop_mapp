// components/number-input/number-input.js
const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        step: {
            type: Number,
            value: 1
        },
        value: {
            type: Number,
            optionalTypes:[String],
            value: '',
            observer: function (newVal, oldVal) {
                // 属性值变化时执行
            }
        },
        min: {
            type: Number,
            value: 1,
            observer: function (newVal, oldVal) {
                // 属性值变化时执行
            }
        },
        mintip:{
            type: String,
            value: "最少 {number}",
        },
        max: {
            type: Number,
            value: 0,
            observer: function (newVal, oldVal) {
                // 属性值变化时执行
            }
        },
        maxtip: {
            type: String,
            value: "最多 {number}",
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        number:''
    },
    lifetimes:{
        attached: function () {
            this.setNumber(this.data.value,true)
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        numberGrow(e){
            if(e && e.target){
                let type=e.target.dataset.type
                if(type == 'plus'){
                    this.setNumber(this.data.number + this.data.step)
                } else if (type == 'minus'){
                    this.setNumber(this.data.number - this.data.step)
                }
            }
        },
        onInput(e){
            this.setNumber(e.detail.value)
        },
        setNumber(val, isinit){
            val = parseInt(val) || 0;
            if (val < this.data.min){
                if(!isinit)app.tip(this.data.mintip.replace('{number}',this.data.min));
                val = this.data.min
            }
            if (this.data.max>0 && val > this.data.max) {
                if (!isinit)app.tip(this.data.maxtip.replace('{number}',this.data.max));
                val = this.data.max
            }
            
            if(val === this.number)return;
            this.setData({
                number:val
            })
            var myEventOption = {
                bubbles: false,
                composed: false,
                capturePhase: false
            } 
            
            if (!isinit)this.triggerEvent('change', { value: val}, myEventOption)
        }
    }
})
