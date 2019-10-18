# 小程序商城项目
基于微信小程序的商城前端。<br />
完整功能为colorui分支，基于[ColorUI](https://www.color-ui.com/)库开发

# 功能
该项目以[ShirneCMS](https://gitee.com/shirnecn/ShirneCMS)为接口端实现原生小程序的商城系统<br />

 - [x] 首页,产品页，新闻页
 - [x] 授权登录
 - [x] 产品详情
 - [x] 购物车
 - [x] 会员中心
 - [x] 会员签到
 - [x] 收货地址
 - [x] 下单支付
 - [x] 订单管理
 - [x] 分销中心
 - [x] 分享小程序码
 - [x] 公司介绍，位置导航，拨打电话等

# 分销流程
1. 购买指定商品（后台商品属性中设置）升级为分销会员
2. 通过小程序码或右上角分享给其它会员，扫码或打开链接，绑定推荐关系
   1. 如会员已有推荐人，或已经升级为分销会员，则不会绑定
   2. 推荐关系有问题的会员可在后台中重新设置（但不会影响已产生的佣金）
3. 被推荐会员购买产品，即产生佣金，根据订单进度发放佣金
   1. 佣金算法在全局中配置
   2. 通用分配比例在会员组中设置
   3. 特殊产品，可按指定比例或指定金额的方式设置

# 后端项目
[ShirneCMS](https://gitee.com/shirnecn/ShirneCMS)

# 功能截图
|    |    |    |
|:---:|:---:|:---:|
|![首页](https://shirne.oss-cn-shenzhen.aliyuncs.com/website-mapp/cu-shop-home.png "首页")|![产品展示](https://shirne.oss-cn-shenzhen.aliyuncs.com/website-mapp/cu-shop-product.png "产品展示")|![产品详情](https://shirne.oss-cn-shenzhen.aliyuncs.com/website-mapp/cu-shop-detail.png "产品详情")|
|![购物车](https://shirne.oss-cn-shenzhen.aliyuncs.com/website-mapp/cu-shop-cart.png "购物车")|![会员中心](https://shirne.oss-cn-shenzhen.aliyuncs.com/website-mapp/cu-shop-member.png "会员中心")|![会员签到](https://shirne.oss-cn-shenzhen.aliyuncs.com/website-mapp/cu-shop-sign.png "会员签到")|