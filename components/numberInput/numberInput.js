// components/numberInput/numberInput.js

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
            this.setNumber(this.value)
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        numberGrow(){

        },
        setNumber(){

        }
    }
})
