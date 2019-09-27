// pages/product/index.js
var util = require("../../utils/util.js");
var trail = require("../../utils/trail.js");
const app = getApp()

Component({
    options: {
        addGlobalClass: true,
    },
    properties:{
        cate:{
            type:Number,
            observe(newval, oldval){
                if(newval != this.data.cate_id){
                    this.setData({
                        cate_id:newval
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
        cate_id: 0,
        lists:[],
        isloading: true,
        totalcount:0,
        page: 1,
        has_more: true,
        isattached: false
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
                        title: siteinfo.webname + '-产品中心',
                        img: siteinfo.weblogo
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
        loadCate(){
            app.httpPost('product/get_cates', json => {
                if (json.code == 1) {
                    if (json.data && json.data.length > 0) {
                        let cates = trail.fixListImage(json.data, 'icon')
                        let cate_id = this.data.cate_id
                        if (this.data.cate_id == 0) {
                            cate_id = json.data[0].id
                        }
                        this.setData({
                            cates: cates,
                            cate_id: cate_id
                        })
                    }
                    app.getProfile(profile => {
                        console.log(profile)
                        this.setData({
                            profile: profile
                        })

                        this.loadData()
                    })
                }
            })
        },
        loadData () {
            var cid = this.data.cate_id
            app.httpPost('product/get_list', { cate: cid,pagesize:6,page:this.data.page,withsku:1 }, json => {
                if (cid == this.data.cate_id) {
                    if (json.code == 1) {
                        let lists = json.data.lists
                        lists = trail.fixProductList(lists,this.data.profile.level);

                        this.setData({
                            lists: this.data.lists.concat(lists),
                            page: json.data.page + 1,
                            totalcount:json.data.total,
                            has_more: json.data.page < json.data.total_page,
                            isloading: false
                        })
                    } else {
                        this.setData({
                            isloading: false
                        })
                    }
                }
            })
        },
        loadmoreData(e) {
            if (this.data.isloading) {
                return;
            }
            if(!this.data.has_more)return;
            this.setData({
                isloading: true
            })
            this.loadData()
        },
        reloadData(e){
            this.setData({
                lists: [],
                isloading: true,
                page: 1,
                has_more: true
            })
            this.loadData()
        },
        gotoList (e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: 'list?cate_id=' + id,
            })
        },
        changeCategory (e) {
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
        gotoDetail (e) {
            var id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '../product/detail?id=' + id,
            })
        }

    }
})