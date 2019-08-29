// pages/index/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword:'',

        loadok: false,
        pullend: false,
        pulldown: 0,
        downY: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.keyword){
            this.setData({
                keyword:options.keyword
            })
        }
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

    reload() {
        if (this.data.isloading) {
            return;
        }
        this.data.page = 1;
        this.setData({
            lists: [],
            has_more: true,
            isloading: true
        })
        this.loadData()
    },
    loadCate() {
        app.httpPost('article/get_cates?pid=news', json => {
            if (json.code == 1) {
                if (json.data && json.data.length > 0) {

                    this.setData({
                        cates: json.data,
                        cate_id: this.data.cate_id > 0 ? this.data.cate_id : json.data[0].id
                    })
                }
                this.loadData()
            }
        })
    },
    loadData: function (callback) {
        if (!this.data.has_more) {
            return;
        }
        var cid = this.data.cate_id
        var page = this.data.page
        app.httpPost('article/get_list?cate=' + cid, json => {
            if (json.code == 1 && cid == this.data.cate_id) {
                json.data.lists = trail.fixListImage(json.data.lists, 'cover')
                json.data.lists = trail.fixListDate(json.data.lists, 'Y-m-d', 'create_time')
                this.setData({
                    lists: this.data.lists.concat(json.data.lists),
                    page: page + 1,
                    has_more: json.data.total_page >= page ? true : false,
                    isloading: false
                })
            }
            callback && callback(true)
        }, res => {
            callback && callback(false)
        })
    },

    onReachBottom(e) {

        if (this.data.isloading) {
            return;
        }
        this.setData({
            isloading: true
        })
        this.loadData()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDown: function () {

        this.setData({
            page: 1,
            lists: [],
            has_more: true,
            isloading: true
        })
        this.loadData()
    },
    onTouchStart(e) {
        this.setData({
            downY: e.touches[0].pageY,
            pullend: false
        })
    },
    onTouchMove(e) {
        let downY = this.data.downY
        this.setData({
            pulldown: e.touches[0].pageY - downY
        })
    },
    onTouchEnd(e) {
        this.setData({
            pullend: true,
            loadok: false
        })
    },
    onLoading(e) {
        this.setData({
            page: 1,
            lists: [],
            has_more: true,
            isloading: true
        })
        this.loadData(res => {
            this.setData({
                loadok: true
            })
        })
    },
})