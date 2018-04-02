// Components/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      isloading:{
        type: Boolean,
        value: false,
        observer: function (newVal, oldVal) {
            this.setData({
                _isloading: newVal
            })
        }
    },
    hasmore: {
        type: Boolean,
        value: true
    },
    nomoreLabel:{
        type: String,
        value: '没有更多内容了'
    },
    dataCount:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
      _isloading:false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
