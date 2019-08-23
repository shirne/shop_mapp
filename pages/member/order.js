// pages/member/order.js
const util = require("../../utils/util.js");
const trail = require("../../utils/trail.js");
const app = getApp()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        status:"",
        page:1,
        orders:[[]],
        ordercounts:[],
        hasmore:true,
        totalcount:0,
        isloading:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    changeStatus(e){
        let status=e.target.dataset.status
        //console.log(status)
        this.setData({
            status: status,
            hasmore: true,
            orders:[[]],
            page:1
        })
        this.loadData()
    },
    loadData(){
        //console.log('loadData')
        if(!this.data.hasmore)return;
        this.setData({
            isloading: true
        })
        app.httpPost('member.order/index',{status:this.data.status,page:this.data.page},json=>{
            let newData = {
                hasmore: false,
                isloading: false
            }
            if(json.code == 1){
                newData['ordercounts']=json.data.counts
                newData['totalcount']=json.data.count
                if(json.data && json.data.lists && json.data.lists.length>0){
                    let lists = trail.fixListImage(json.data.lists,'products.product_image')
                    newData['orders[' + this.data.page + ']'] = json.data.lists
                    if (this.data.page < json.data.total_page){
                        newData['hasmore'] = true;
                        this.data.page ++
                    }
                }
                
            }else{
                app.tip('加载错误')
            }
            //console.log(newData)
            this.setData(newData)
        })
    }
})