// Components/s-checkbox/s-checkbox.js
Component({
    behaviors: [],
    /**
     * 组件的属性列表
     */
    properties: {
        checked: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                this.setData({
                    _checked: newVal
                })
            }
        },
        value: String,
        label: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        _checked: false
    },
    attached: function () {
        //console.log(this.data)
        this.setData({
            _checked: this.data.checked
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap: function (e) {
            //console.log(e)
            var myEventDetail = {
                value: this.data.value,
                checked: this.data._checked
            }
            var myEventOption = {
                bubbles: false,
                composed: false,
                capturePhase: false
            }
            this.triggerEvent('change', myEventDetail, myEventOption)
            if (myEventDetail.stop === true) return

            var checked = !this.data._checked
            this.setData({
                _checked: checked
            })
            myEventDetail.checked = checked
            this.triggerEvent('changed', myEventDetail, myEventOption)
        }
    }
})
