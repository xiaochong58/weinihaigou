<template>
<div class="shop-body">
    <div class="header clearfix">
        <a v-if="carList.length" href="javascript:;" class="edit" v-on:click="edit()">
            <span v-if="!isEditting">编辑</span>
            <span v-else>完成</span>
        </a>
        <h1>购物车</h1>
        <a href="javascript:history.go(-1)" class="header-back"></a>
    </div>
    <div class="shop-box">
        <div class="goods-item" v-if="carList.length" v-for="(dto, index1) in carList">
            <a :href="'http://www.weinihaigou.com/m-html/index/flash-sale.html?relevantId=' +dto.couponPolicyId+ '&type=' + 2" class="activity" v-if="dto.couponPolicyId != null">
                <span class="activity-header" v-html="dto.couponPolicyName"></span>
                <span v-if="!dto.isMeet">
                    <span v-if="dto.couponPolicyType==1"><span>差<span v-html="dto.amount1"></span>元</span></span>
                    <span v-else><span>差<span v-html="dto.goodsNum"></span>件</span></span>
                    立享【<span v-html="dto.couponPolicyName"></span>】
                    <i>></i>
                </span>
                <span v-else>
                    已满足【<span v-html="dto.couponPolicyName"></span>】
                </span>
            </a>
            <div class="goods-box" v-for="(c, index2) in dto.shopCarList">
                <div class="goods-show">

                    <a href="javascript:;" class="checkbox" v-on:click="choose(index1, index2)"  v-if='c.isShow==1 && c.status==1 && c.realStock > 0' :class="{choose: c.selected}">
                        <input type="checkbox" />
                        <i></i>
                    </a>
                    <a href="javascript:;" class="checkbox1" v-else>
                        <input type="checkbox" />
                        <i></i>
                    </a>

                    <router-link :to="'/goodsDetails?goodsNo=' + c.goodsNo" class="goods-img">
                        <img v-bind:src="c.imgUrl2"/>
                        <div v-if='c.isShow==0 || c.status!=1' class="no-goods" v-bind:class="{'opacity':(c.isShow==0||c.status!=1)}">已下架</div>
                        <div v-else >
                            <div class="no-goods" v-if="c.realStock <= 0" v-bind:class="{'opacity':(c.realStock <= 0)}">已抢光</div>
                        </div>
                    </router-link>
                    <div class="goods-link">
                        <router-link :to="'/goodsDetails?goodsNo=' + c.goodsNo"  v-html="c.goodsName2" class="goods-link-main"></router-link>
                        <p class="norms-tax"><span>规格:</span><span v-html="c.skuName" class="com-over norms"></span></p>
                        <p class="norms-tax"><span>仓库:</span><span v-html="c.warehouseName" class="com-over norms"></span></p>
                        <p class="price">¥<span class="every-price" v-html='c.skuPrice.toFixed(2)'></span></p>
                    </div>

                    <div class="num-box" v-if='c.isShow==1 && c.status==1 && c.realStock > 0'>
                        <div class="delete-box" v-show="isEditting">
                            <a href="javascript:;" class="delete" v-on:click="deleteCar(c.cartId+'')">删除</a>
                        </div>
                        <num-control v-show="!isEditting" :count="c.realStock" :number="c.num" :index1="index1" :index2="index2"  v-on:cb="changeNumber" v-on:cb1="addNumber" v-on:cb2="reduceNumber"></num-control>
                        <a href="javascript:;" class="tax down"><span>税费：</span><span>¥<span class="each-tax" v-html="c.goodsTax.toFixed(2)">0.00</span></span><i></i></a>
                    </div>
                    <div class="num-box" v-else>
                        <div class="">
                            <a href="javascript:;" class="delete" v-on:click="deleteCar(c.cartId)">删除</a>
                        </div>
                    </div>
                </div>
                <p class="tax-show">税率<span v-html="(c.tax*100).toFixed(2)"></span>%，结算税费以提交订单时应付总额明细为准</p>
            </div>
        </div>
    </div>

    <com-loading :isLoading="isLoading"></com-loading>

    <p v-show="(noMailMoney>0&&noMailMoney<postpolicy.limitMoney)" class="post-tips-box">不包邮商品共计￥<span v-html="noMailMoney.toFixed(2)"></span>元，再购<span v-html="(parseFloat(postpolicy.limitMoney) - parseFloat(noMailMoney)).toFixed(2)"></span>元免运费</p>

    <p v-show="noMailMoney>=postpolicy.limitMoney" class="post-tips-box">不包邮商品共计￥<span v-html="noMailMoney.toFixed(2)"></span>元，已减免运费</p>

    <div  v-if="carList.length" class="settle-accounts" v-show="!isEditting">
        <div class="makes-box">
            <div class="all-choose-box">
                <a  href="javascript:;" class="checkbox com-choose" :class="{choose : selected}"  v-on:click="chooseAll()">
                    <input type="checkbox"/>
                    <i></i>全选
                </a>
            </div>
            <div class="all-money">
                <p>
                    <span>总金额<span class="money-tips"></span>：</span>
                    <span class="all-money-num">￥</span><span class="all-money-num total-money" v-html='amountMoney.toFixed(2)'></span>
                </p>
                <p class="money-tips">
                    <span>商品总额:￥</span><span class="total-post" v-html="selectedGoodsMoney.toFixed(2)"></span></span>
                </p>
                <p class="money-tips">
                    <span>运费:￥</span><span class="total-post" v-html="selectedFreightMoney.toFixed(2)"></span></span>
                </p>
                <p class="money-tips">
                    <span>预计税费:<span class="total-tax" v-html="selectedTaxMoney.toFixed(2)"></span></span>
                </p>
            </div>
        </div>
        <a href="javascript:;" class="make-btn" v-on:click="goPay()">去结算</a>
    </div>

    <div v-if="carList.length"  class="settle-accounts" v-show="isEditting">
        <div class="makes-box">
            <div class="all-choose-box">
                <a  href="javascript:;" class="checkbox com-choose" :class="{choose : selected}"  v-on:click="chooseAll()">
                    <input type="checkbox"/>
                    <i></i>全选
                </a>
            </div>
        </div>
        <a href="javascript:;" class="make-btn" @click="deleteCar()">删除</a>
    </div>
    <div class="no-shop" v-if='!isLoading && carList.length==0' v-cloak>
        <img src="../m-images/no-shop.png" />
        <router-link to="/index">去逛逛吧 !</router-link>
    </div>

</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import numControl from '../components/numControl'
import comLoading from '../components/comLoading'

export default {

    name : 'shoCar',

    data () {
        return {
            isLoading : true,//loading开关
            carList : [],//购物车列表
            postpolicy : {},//运费规则对象
            selected : false,//全选开关
            isEditting : false,//是否在编辑状态
            idList : [],//被选中的商品id列表
            selectedGoodsMoney : 0,//选中商品总金额
            selectedTaxMoney : 0,//选中商品总税费
            selectedFreightMoney : 0,//选中商品总运费
            noMailMoney : 0,//不包邮商品总金额
            amountMoney : 0,//总金额

        }
    },

    mounted() {

        if ( !this.$store.state.isLogin ) {
            this.$router.push('/login');
        }
        this.getShopCar();

    },

    methods : {

        // 改变对应商品的数量
        changeNumber(numObj) {
            var obj = this.carList[numObj.index1]['shopCarList'][numObj.index2];
            obj['num'] = numObj.val;
            this.calEveryGoodsPrice();
            this.cal();
        },

        // 添加商品数量
        addNumber(numObj) {
            var obj = this.carList[numObj.index1]['shopCarList'][numObj.index2];
            obj['num'] = numObj.val;
            this.calEveryGoodsPrice();
            this.addCar(obj.goodsId, obj.skuId, numObj.val);
            this.cal();
        },

         // 减少商品数量
        reduceNumber(numObj) {
            var obj = this.carList[numObj.index1]['shopCarList'][numObj.index2];
            obj['num'] = numObj.val;
            this.calEveryGoodsPrice();
            this.addCar(obj.goodsId, obj.skuId, numObj.val);
            this.cal();
        },

        // 编辑
        edit() {
            this.isEditting = !this.isEditting;
        },

        // 单个选择
        choose(index1, index2) {
            this.carList[index1]['shopCarList'][index2]['selected'] = !this.carList[index1]['shopCarList'][index2]['selected'];
            this.checkAllChoose();
        },

        // 全选
        chooseAll() {
            var flag = false;
            this.selected = !this.selected;
            if ( this.selected ) {
                flag = true;
            }
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    item.selected = flag;
                });
            });
            this.cal();
        },

        // 判断是否全选
        checkAllChoose() {
            var flag = true,
                oThis = this;
            oThis.idList = '';
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.selected ) {
                        oThis.idList += item.cartId + ',';
                    } else {
                        flag = false;
                    }
                });
            });

            if ( flag ) {
                this.selected = true;
            } else {
                this.selected = false;
            }
            this.cal();
        },

        // 计算每项金额
        cal() {
            // 计算商品总金额
            this.calGoodsMoney();
            // 判断有活动的商品总额是否满足活动
            this.checkIsMeet();
            // 计算有活动的商品总金额（按活动分）
            this.calEveryActivityGoodsMoney();
            // 计算每个商品的税费
            this.calEveryTaxMoney();
            // 计算总税费
            this.calTaxMoney();
            // 计算总运费
            this.calFreightMoney();
            // 计算应付总额
            this.calAmountMoney();
        },

        // 计算每个商品的显示价格（有区间价）
        calEveryGoodsPrice() {
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.priceList.length>0 ) {
                        var num = item.num;
                        for ( var i = 0, len = item.priceList.length; i < len; i++ ) {
                            if (  num >= item.priceList[i]['intervalFirst'] && num <= item.priceList[i]['intervalLast'] ) {
                                item.skuPrice = item.priceList[i]['price'];
                                break;
                            }
                        }
                    }
                });
            });
        },

        // 计算商品税费(根据运营规则，只计算保税一仓)
        calEveryTaxMoney() {
            var item1 = null;
            this.carList.forEach(function( item, index, arr) {
                item1 = item;
                item.shopCarList.forEach(function( item, index, arr) {
                    var goodsMoney = 0;
                    if ( item.supId == 0 && item.deliveryCode == 1 ) {
                        if ( item.priceList.length>0 ) {
                            var num = item.num,
                                price = 0;
                            for ( var i = 0, len = item.priceList.length; i < len; i++ ) {
                                if (  num >= item.priceList[i]['intervalFirst'] && num <= item.priceList[i]['intervalLast'] ) {
                                    price = item.priceList[i]['price'];
                                    break;
                                }
                            }
                            goodsMoney = parseFloat(price) * parseFloat(num);
                        } else {
                            goodsMoney = parseFloat(item.skuPrice) * parseFloat(item.num);
                        }
                        item.goodsTax = goodsMoney * item.tax;
                        if ( item1.isMeet ) {
                            item.goodsTax *= (1 - item1.discount/item1.goodsAllMoney);
                        }
                        item.goodsTax = common.toFixed(item.goodsTax, 2);
                    }
                });
            });
        },

        // 计算商品总税费
        calTaxMoney() {
            var oThis = this;
            oThis.selectedTaxMoney = 0;
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.selected ) {
                        oThis.selectedTaxMoney += item.goodsTax;
                    }
                });
            });
        },

        // 计算商品总运费(根据运营规则，只计算保税一仓)
        calFreightMoney() {
            var oThis = this;
            this.noMailMoney = 0;
            this.selectedFreightMoney = 0;
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.selected && item.deliveryCode == 1 && item.supId == 0) {
                        oThis.noMailMoney += parseFloat(item.skuPrice) * parseFloat(item.num);
                    }
                });
            });
            this.selectedFreightMoney = (  this.noMailMoney == 0 || this.noMailMoney > this.postpolicy.limitMoney) ? 0 : this.postpolicy.postage;
        },

        // 计算每个活动下的商品总额
        calEveryActivityGoodsMoney() {
            var item1 = null,
                oThis = this;
            this.carList.forEach(function( item, index, arr) {
                if ( item.isMeet ) {
                    var item1 = item;
                    item1.goodsAllMoney = 0;
                    item.shopCarList.forEach(function( item, index, arr) {
                        if ( item.selected ) {
                            item1.goodsAllMoney += parseFloat(item.skuPrice) * parseFloat(item.num);
                        }
                    });
                }
            });
        },

        // 计算商品总金额
        calGoodsMoney() {
            var oThis = this;
            this.selectedGoodsMoney = 0;
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.selected ) {
                        oThis.selectedGoodsMoney += parseFloat(item.skuPrice) * parseFloat(item.num);
                    }
                });
            });
        },

        // 判断有活动的商品金额是否已经满足
        checkIsMeet() {
            var oThis = this,
                goodsMoney = 0,
                goodsNum = 0;
            this.carList.forEach(function( item, index, arr) {
                goodsMoney = goodsNum = 0;
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.selected ) {
                        goodsMoney += parseFloat(item.skuPrice) * parseFloat(item.num);
                        goodsNum += parseFloat(item.num);
                    }
                });
                item.amount1 = item.amount - goodsMoney;
                item.goodsNum = item.amount - goodsNum;
                if ( item.amount1<=0 || item.goodsNum <=0 ) {
                    item.isMeet = true;
                    oThis.selectedGoodsMoney = parseFloat(oThis.selectedGoodsMoney) - parseFloat(item.discount);
                } else {
                    item.isMeet = false;
                }
            });
        },

        // 计算应付款
        calAmountMoney() {
            this.amountMoney = this.selectedGoodsMoney + this.selectedTaxMoney + this.selectedFreightMoney;
        },

        // 删除商品
        deleteCar(id) {
            var oThis = this;
            if ( id ) {
                this.idList = id;
            }
            $.customPop({
                msg : '确定要删除吗？',//提示信息
                sureCallBack : function() {
                    $.ajax({
                        type:'post',
                        url: API.delShopCar,
                        data : {id:oThis.idList},
                        dataType: 'json',
                        success :function(data) {
                            if (data.success) {
                                // 删除购物车列表相应的商品数据
                                oThis.carList.forEach(function( item, index, arr) {
                                    var index1 = index;
                                    item.shopCarList.forEach(function( item, index, arr) {
                                        if ( oThis.idList.indexOf(item.cartId) != -1 ) {
                                            oThis.carList[index1]['shopCarList'].splice(index,1);
                                        }
                                    });
                                });
                                oThis.checkAllChoose();
                            } else {
                                $.customTips({
                                    msg : "删除失败，请稍后再试"
                                });
                            }
                        }
                    })
                }
            })
        },

        // 加入购物车
        addCar(goodsId, skuId, num) {
            $.ajax({
                type : "POST",
                url :  API.addShopCar,
                dataType : 'json',
                data:{
                    goodsId: goodsId,
                    skuId: skuId,
                    num: num
                },
                success : function(data) {
                    if(data.success == true) {

                    } else {
                        $.customTips({
                            msg : '加入购物车失败'
                        });
                    }
                }

            });
        },

        // 获取购物车数据
        getShopCar() {
            var oThis = this;
            $.ajax({
                type:'post',
                url: API.shopCarIndexMobile,
                dataType: 'json',
                success :function(data) {
                    oThis.isLoading = false;
                    // console.log(data);
                    if(data.msg) {
                        if ( data.carList ) {
                            data.carList.forEach(function( item, index, arr) {
                                item.isMeet = false;
                                item.amount1 = item.amount;
                                item.goodsNum = item.amount;
                                item.goodsAllMoney = 0.00;
                                for ( var x in item ) {
                                    item.shopCarList.forEach(function( item, index, arr) {
                                        item.selected = false;
                                        item.goodsTax = 0.00;
                                        item.showPrice = 0.00;
                                    });
                                }
                            });
                            oThis.carList = data.carList;
                            oThis.calEveryGoodsPrice();
                            oThis.calEveryTaxMoney();
                        }
                        oThis.postpolicy = data.postpolicy;
                        console.log(oThis.carList);
                    } else {
                        $.customTips({
                            msg : "请求错误，请稍后重试"
                        });
                    }
                },
                error : function(msg){
                    $.customTips({
                        msg : "请求错误，请稍后重试"
                    });
                }
            });
        },

        // 去支付
        goPay() {
            var skuNos = '',
                num = '';
            this.carList.forEach(function( item, index, arr) {
                item.shopCarList.forEach(function( item, index, arr) {
                    if ( item.selected ) {
                        skuNos += item.skuNo + ',';
                        num += item.num + ',';
                    }
                });
            });
            if ( num=='' ) {
                $.customTips({
                    msg : '请选择商品'
                });
                return;
            }
            common.setCookie('PALACE_ORDER_SKUNO', skuNos.substr(0, skuNos.length-1));
            common.setCookie('PALACE_ORDER_NUMS', num.substr(0, num.length-1));
            common.setCookie('PALACE_ORDER_COUPONID', "");
            common.setCookie('PALACE_ORDER_ADDRESS', "");
            this.$router.push('/surePay?fromShop=1');
            common.setCookie('fromShop', 1);
        },
    },

    components : {
        numControl,
        comLoading
    }
}
</script>

<style scoped>
.shop-body {
    padding: 3.5rem 0 7rem;;
}
.edit {
    position: absolute;
    right: 0.875rem;
    top:1.2rem;
    color: #131313;
}
.shop-box {
    margin-bottom: 0.833rem;
    background: #fff;
    border-top: 1px solid #ebebeb;
}

/*璁㈠崟澶撮儴寮€濮�*/
.shop-header {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    border-bottom:1px solid #ebebeb;
    height: 3.125rem;
    padding: 0 1.333rem;
}
.shop-header .bsq ,
.shop-header .zy {
    font-size: 1.1rem;
    margin-left: 0.417rem;
    padding-left: 1.833rem;
    height: 1.25rem;
    background: url(../m-images/shop-icon.png) no-repeat 0 0;
    background-size: 12.5rem 12.5rem;
}
.shop-header .zy {
    height: 1.5rem;
    background-position: 0 -2.875rem;
    line-height: 1.5;
    background-position: 0 -2.875rem;
}
.shop-header .post-activity {
    margin-left: 10px;
    position: relative;
    z-index: 10;
    border: 1px solid #9f2e33;
    padding: 2px 5px;
    color: #fff;
    box-shadow: 2px 2px 0 #c68d8f;
    font-size: 0.75rem;
    background: #9f2e33;
}
.shop-header .post-activity:before {
    content: '';
    position: absolute;
    left: -7px;
    top: 3.5px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-right: 6px solid #9f2e33;
    border-bottom: 5px solid transparent;
}
/*璁㈠崟澶撮儴缁撴潫*/

/*checkbox寮€濮�*/
.checkbox,
.checkbox1 {
    width: 1.4rem;
    height: 1.4rem;
    position: relative;
}
.checkbox input,
.checkbox1 input {
    position: absolute;
    z-index: -1;
    border:none;
}
.checkbox i,
.checkbox1 i,
.choose i {
    display: inline-block;
    vertical-align: middle;
    width: 1.4rem;
    height: 1.4rem;
    background: url(../m-images/pay.png) no-repeat 0 -9.8rem;
    background-size: 16.667rem 16.667rem;
}
.choose i {
    background-position: 0 -13.65rem;
}
/*checkbox缁撴潫*/

/*鍟嗗搧寮€濮�*/
.goods-item .activity {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    color: #f34f34;
    height: 2.75rem;
    padding: 0 1.333rem;
    font-size: 0.917rem;
}
.goods-item .activity .activity-header {
    margin-right: 0.417rem;
    font-size: 0.833rem;
    border:1px solid #f34f34;
    padding: 2px;
}
.goods-item .goods-box {
    border-bottom:1px solid #ebebeb;
}
.goods-item .goods-show {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    height: 9rem;
    padding: 0 1rem;
    overflow: hidden;
}
.goods-item .goods-img {
    position: relative;
    margin:0 .5rem;
    width: 5.417rem;
    height: 5.417rem;
    overflow: hidden;
}
.goods-item .goods-link {
    width: 10rem;
    margin: 0 .5rem 0 0.417rem;
    overflow: hidden;
}
.goods-item .num-box {
    width: 9rem;
    text-align: right;
}
.goods-item .goods-link-main {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    color: #4c4c4c;
    font-size: 1.1rem;
}
.goods-item .norms-tax {
    color: #999;
    font-size: 0.917rem;
}
.goods-item .norms-tax span {
    display: inline-block;
    vertical-align: middle;
}
.goods-item .norms-tax .norms {
    display: inline-block;
    vertical-align: middle;
    width: 6rem;
}
.goods-item .price {
    color: #f34f34;
}
.goods-item .tax {
    margin-top: .8rem;
    display: block;
    position: relative;
    text-align: right;
    color: #999;
    font-size: 0.917rem;
    height: 1rem;
}
.goods-item .tax i,
.goods-item .down i {
    display: inline-block;
    vertical-align: middle;
    margin-left: .2rem;
    width: 0.833rem;
    height: 0.417rem;
    background:url(../m-images/shop-icon.png) no-repeat 0 -9.6rem;
    background-size: 12.5rem 12.5rem;
}
.goods-item .down i {
    background-position:0 -8.208rem;
}
.goods-item .tax-show {
    display: none;
    padding: .5rem 1rem;
    line-height: 1.5rem;
    background:#f7f7f7;
    color: #4d4d4d;
    font-size: 0.917rem;
}
.goods-item .delete-box {
    height: 3rem;
}
.goods-item .delete {
    display: inline-block;
    padding-top: 1.5rem;
    width: 3rem;
    height: 3rem;
    background: url(../m-images/icon2.png) no-repeat .8rem -14.833rem;
    background-size: 33.333rem 33.333rem;
    text-align: center;
    color: #000;
}
/*鍟嗗搧缁撴潫*/

/*閲戦缁嗚妭寮€濮�*/
.money-details {
    border-bottom: 1px solid #ebebeb;
    padding-left:1.333rem;
    font-size: 1.1rem;
}
.money-details .goods-money {
    display: -webkit-flex;
    -webkit-justify-content:space-between;
    color: #999;
    border-bottom: 1px solid #ebebeb;
    padding:0.833rem 1.333rem .833rem 0;

}
.money-details .color {
    color: #1a1a1a;
}
.money-details .goods-money p {
    text-align: right;
}
.money-details .tax-box,
.money-details .post-box,
.money-details .all-money-box {
    height: 2.5rem;
    padding-right: 1.333rem;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content:space-between;
    justify-content:space-between;
    border-bottom: 1px solid #ebebeb;
}
.money-details .all-money {
    color: #9f2e33;
}
.money-details .preferential-amount {
    margin-top:.2rem;
    font-size: 0.833rem;
}
.money-details .settle {
    padding-top: 0.708rem;
    height: 3.333rem;
}
.money-details .settle-btn {
    float: right;
    margin-right: 1.333rem;
    width: 6.042rem;
    height: 2.0rem;
    background:#9f2e33;
    text-align: center;
    line-height: 2rem;
    color: #fff;
    font-size: 1.25rem;
}
.money-details .go-single {
    height: 1rem;
    color: #1a1a1a;
    font-size: 0.833rem;
}
.money-details .go-single i {
    display: inline-block;
    vertical-align: middle;
    margin-left:.5rem;
    width: 0.5rem;
    height: 0.917rem;
    background:url(../m-images/shop-icon.png) no-repeat 0 -5.917rem;
    background-size: 12.5rem 12.5rem;
}
.money-details .go-single span {
    color: #f34f34;
}
.money-details .go-single label {
    display: inline-block;
    vertical-align: middle;
    margin-right: .5rem;
    width: 1.4rem;
    height: 1.4rem;
    line-height: 1.4rem;
    border-radius: 50%;
    border:1px solid #202020;
    color: #202020;
    font-size: 0.833rem;
    text-align: center;
    transform: scale(0.9,0.9);
}
.money-details .go-single label span {
    transform: scale(0.5,0.5);
}
.no-goods {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 3.5rem;
    height: 1.167rem;
    line-height: 1.167rem;
    text-align: center;
    background: #7f7f7f;
    /*opacity: 0;*/
    color: #fff;
    border-radius: 4px;
    font-size: 0.75rem;
}
.opacity {
    opacity:.8;
}

/*閲戦缁嗚妭缁撴潫*/



/*娌℃湁鏁版嵁寮€濮�*/
.no-shop {
    width: 10.833rem;
    margin:5.0rem auto;
    text-align: center;
}
.no-shop a {
    display: block;
    margin: 1.25rem auto;
    width: 7.583rem;
    line-height: 2.208rem;
    border:1px solid #9f2e33;
    color: #9f2e33;
    text-align: center;
    border-radius: 3px;
}
/*娌℃湁鏁版嵁缁撴潫*/

/*搴曢儴鏍忓紑濮�*/
.edit-box {
    display: none;
}
.settle-accounts {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 6rem;
    border-top: 1px solid #e9ebf1;
    background:#fff;
    font-size: 1.143rem;
}
.settle-accounts .makes-box {
    float: left;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content:space-between;
    justify-content:space-between;
    width: 64%;
    height: 100%;
    padding:.5rem 0.625rem 0 1.333rem;
}
.settle-accounts .all-choose-box {
    float: left;
}
.settle-accounts .all-money {
    width: 10.833rem;
    height: 100%;
    font-size: 1rem;
    text-align: right;
}
.settle-accounts .all-money-num {
    color: #9f2e33;
}
.settle-accounts .make-btn {
    float: right;
    width: 36%;
    background:#9f2e33;
    color: #fff;
    text-align: center;
    line-height: 6rem;
    font-size: 1.4rem;
}
.settle-accounts .com-choose {
    color: #000;
    font-size: 1.1rem;
}
#deleteBox {
    display: none;
}
.settle-accounts .money-tips {
    color: #c3c3c3;
    font-size: 0.833rem;
}
/*搴曢儴鏍忕粨鏉�*/

/*搴曢儴閭垂鎻愮ず寮€濮�*/
.post-tips-box {
    /*display: none;*/
    position: fixed;
    left: 0;
    bottom: 6rem;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    color: #000;
    font-size: 0.833rem;
    padding-left: 3rem;
    background: #f8d8d9 url(../m-images/refund.png) no-repeat 1.2rem -6.7rem / 8.333rem 8.333rem;
}
/*搴曢儴閭垂鎻愮ず缁撴潫*/
</style>

