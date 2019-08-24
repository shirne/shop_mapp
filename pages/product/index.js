// pages/product/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        cate_id: 0,
        isloading: true,
        page: 1,
        has_more: true,
        isattached: false
    },
    lifetimes: {
        /**
         * 生命周期函数--监听页面加载
         */
        attached: function (options) {
            this.data.isattached = true
            app.getSiteInfo((siteinfo) => {
                if (this.data.isattached) {
                    this.triggerEvent('sharedata', {
                        title: siteinfo.webname + '-产品中心',
                        img: siteinfo.weblogo
                    })
                }
            })
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
        app.httpPost('product/get_cates', json => {
            if (json.code == 1) {
                let cates = trail.fixListImage(json.data, 'icon')

                this.setData({
                    cates: cates,
                    cate_id: this.data.cate_id ? this.data.cate_id : json.data[0].id
                })
                this.loadData()
            }
        })
    },
    methods: {
        loadData: function () {
            var cid = this.data.cate_id
            app.httpPost('product/get_list', { cate: cid }, json => {
                if (cid == this.data.cate_id) {
                    if (json.code == 1) {
                        let lists = json.data.lists
                        lists = trail.fixListImage(lists, 'image')
                        lists = trail.fixMarketPrice(lists);

                        this.setData({
                            lists: lists,
                            page: json.data.page + 1,
                            has_more: json.data.page < json.data.total_page,
                            isloading: false
                        })
                    } else {
                        this.setData({
                            lists: [],
                            page: 1,
                            has_more: false,
                            isloading: false
                        })
                    }
                }
            })
        },
        gotoList: function (e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: 'list?cate_id=' + id,
            })
        },
        changeCategory: function (e) {
            var id = e.currentTarget.dataset.id
            this.setData({
                cate_id: id,
                lists: [],
                isloading: true,
                page: 1,
                has_more: true
            })
            this.loadData()
        },
        gotoDetail: function (e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '../product/detail?id=' + id,
            })
        }

    }
})