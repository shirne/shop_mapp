// pages/news/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        cate: {
            type: Number,
            observe(newval, oldval) {
                if (newval != this.data.cate_id) {
                    this.setData({
                        cate_id: newval
                    })
                    this.loadData()
                }
            }
        }
    },
    /**
     * 页面的初始数据
     */
    data: {
        lists: [],
        page: 1,
        totalcount:0,
        has_more: true,
        isloading: true,
        isattached: false,
    },
    lifetimes: {
        /**
         * 生命周期函数--监听页面加载
         */
        attached: function () {
            this.data.isattached = true
            app.getSiteInfo((siteinfo) => {
                if (this.data.isattached) {
                    this.triggerEvent('sharedata', {
                        title: siteinfo.webname + '-新闻中心'
                    })
                }
            })
            this.loadCate()
        },
        moved: function () { },
        detached: function () {
            this.data.isattached = false
        },
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    ready: function () {
        
    },
    methods: {
        reloadData() {
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
        loadCate(){
            app.httpPost('article/get_cates',{pid:'news'}, json => {
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
            app.httpPost('article/get_list',{cate: cid}, json => {
                if (json.code == 1 && cid == this.data.cate_id) {
                    json.data.lists = trail.fixListImage(json.data.lists, 'cover')
                    json.data.lists = trail.fixListDate(json.data.lists, 'Y-m-d', 'create_time')
                    this.setData({
                        lists: this.data.lists.concat(json.data.lists),
                        page: page + 1,
                        totalcount: json.data.total,
                        has_more: json.data.total_page >= page ? true : false,
                        isloading: false
                    })
                }
                callback && callback(true)
            }, res=>{
                callback && callback(false)
            })
        },

        loadmoreData(e){

            if (this.data.isloading || !this.data.has_more) {
                return;
            }
            this.setData({
                isloading:true
            })
            this.loadData()
        },
        onTouchStart(e){
            this.setData({
                downY:e.touches[0].pageY,
                pullend: false
            })
        },
        onTouchMove(e) {
            let downY = this.data.downY
            this.setData({
                pulldown: e.touches[0].pageY-downY
            })
        },
        onTouchEnd(e) {
            this.setData({
                pullend: true,
                loadok: false
            })
        },
        gotoList: function (e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/news/list?cate_id=' + id,
            })
        },
        changeCategory: function (e) {
            var id = e.currentTarget.dataset.id
            this.setData({
                cate_id: id,
                page: 1,
                has_more: true,
                lists: [],
                isloading: true
            })
            this.loadData()
        },
        gotoDetail: function (e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/news/detail?id=' + id,
            })
        }
    }
})