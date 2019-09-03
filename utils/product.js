let util = require("util.js");
const html = require("HtmlToNodes.js");
let trail = require("trail.js");

class Product
{
    constructor(product={},skus=[],level={})
    {
        skus.forEach(sku => {
            sku.cost_price = parseFloat(sku.cost_price)
            sku.market_price = parseFloat(sku.market_price)
            sku.price = parseFloat(sku.price)
        })

        product.image = trail.fixImageUrl(product.image)
        product.content = html.HtmlToNodes(product.content, trail.fixTag)
        skus = trail.fixListImage(skus, 'image')

        let vproduct=trail.fixProductSkuPrice({
            is_discount:product.is_discount,
            skus:skus
        },level?level:{})

        this.product=product
        this.skus = vproduct.skus
    }

    getProduct(){
        return this.product
    }

    getSkus(){
        return this.skus
    }

    getAllStorage () {
        var skus=this.skus
        var storage = 0
        for (var i = 0; i < skus.length; i++) {
            storage += parseInt(skus[i].storage) || 0
        }
        return storage
    }

    getPriceText(){
        var prices=this.getPrice()
        return prices.max_price > prices.min_price ? 
            (prices.min_price + '~' + prices.max_price) : 
            prices.min_price
    }

    getPriceDescText(){
        return this.skus.length?this.skus[0].price_desc:''
    }

    getPrice(){
        let min_price = -1;
        let max_price = -1;
        if (this.skus) {
            this.skus.forEach(sku => {
                if (min_price < 0) {
                    min_price = sku.price
                    max_price = sku.price
                } else {
                    min_price = Math.min(min_price, sku.price)
                    max_price = Math.max(max_price, sku.price)
                }

            })
        }
        return {
            min_price: min_price,
            max_price: max_price
        }
    }

    getMarketPriceText() {
        var prices = this.getMarketPrice()
        return prices.market_max_price > prices.market_min_price ?
            (prices.market_min_price + '~' + prices.market_max_price) : 
            prices.market_min_price
    }

    getMarketPrice() {
        let market_min_price = -1;
        let market_max_price = -1;
        if (this.skus) {
            this.skus.forEach(sku => {
                if (market_min_price < 0) {
                    market_min_price = sku.market_price
                    market_max_price = sku.market_price
                } else {
                    market_min_price = Math.min(market_min_price, sku.market_price)
                    market_max_price = Math.max(market_max_price, sku.market_price)
                }

            })
        }
        return {
            market_min_price: market_min_price,
            market_max_price: market_max_price
        }
    }

    getPropText()
    {
        let prop_data = this.product.prop_data
        let proptext = [];
        if (prop_data) {
            let idx = 0;
            for (let k in prop_data) {
                if (idx > 2) {
                    proptext.push('...')
                    break;
                }
                proptext.push(k)
                idx++
            }
        }
        return proptext.join(' ')
    }
    getSpecText() {
        let spec_data = this.product.spec_data
        let spectext = []
        if (spec_data) {
            let idx = 0;
            for (let k in spec_data) {
                if (idx > 2) {
                    spectext.push('...')
                    break;
                }
                spectext.push(spec_data[k].title)
                idx++
            }
        }
        return spectext.join(' ')
    }

    //根据已选项生成文本显示
    getSelectedText (opts = {}) {
        var specs=this.product.spec_data
        var specvals = []
        var selected = []
        for (var i = 0; i < specs.length; i++) {
            if (opts[specs[i].spec_id]) {
                for (var j = 0; j < specs[i].lists.length; j++) {
                    if (specs[i].lists[j].spec_value_id == opts[specs[i].spec_id]) {
                        specvals.push(specs[i].lists[j].label)
                        break
                    }
                }
            } else {
                selected.push(specs[i].spec_name)
            }
        }
        if (selected.length > 0) {
            return "请选择 " + selected.join(' ')
        } else {
            return "已选：\"" + specvals.join('" "') + '"'
        }
    }

    //根据已选的选项确定其它选项是否是可选状态
    getSpecStatus ( opts = {}) {
        let allSpec = {}

        for (let spec_id in this.product.spec_data) {
            allSpec[spec_id] = {}
            let sks = this.skus.filter(sku => {
                if (!opts || util.countObject(opts) < 1) {
                    return true
                } else {
                    for (let sku_spec_id in sku.specs) {
                        //确保当前规格可切换
                        if (sku_spec_id != spec_id) {
                            if (opts[sku_spec_id] && opts[sku_spec_id] != sku.specs[sku_spec_id]) {
                                return false
                            }
                        }
                    }
                    return true
                }
            })
            sks.forEach(sku => {
                if (sku.specs[spec_id] && sku.storage > 0) {
                    allSpec[spec_id][sku.specs[spec_id]] = true
                }
            })
        }
        return allSpec
    }

    //根据规格检索sku
    searchSku (opts = {}) {
        var pass = false
        var product = this.product
        var skus = this.skus
        for (var i = 0; i < skus.length; i++) {
            var specs = skus[i].specs
            pass = true
            for (let spec_id in specs) {
                if (!opts[spec_id] || opts[spec_id] != specs[spec_id]) {
                    pass = false
                    break
                }
            }
            if (pass) {
                return skus[i]
            }

        }
        return null
    }
}

module.exports = Product