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
            value: 0,
            observer: function (newVal, oldVal) {
                // 属性值变化时执行
            }
        },
        max: {
            type: Number,
            value: 0,
            observer: function (newVal, oldVal) {
                // 属性值变化时执行
            }
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
            this.setNumber(this.data.value)
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
        setNumber(val){
            val = parseInt(val) || 0;
            if (val < this.data.min){
                app.tip('最少 ' + this.data.min);
                val = this.data.min
            }
            if (this.data.max && val > this.data.max) {
                app.tip('最多 ' + this.data.max);
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
            
            this.triggerEvent('change', { value: val}, myEventOption)
        }
    }
})
