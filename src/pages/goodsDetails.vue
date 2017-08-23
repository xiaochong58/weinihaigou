<template>
<div>
     <div class="header clearfix">
        <router-link to="/shopCar" class="shopping-logo"><span v-html="$store.state.carCount"></span></router-link>
        <router-link  to="/" class="home-logo"></router-link>
        <h1>商品详情</h1>
        <a href="javascript:history.go(-1)" class="header-back"></a>
    </div>
    <div class="banner">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="data in imgShowList"><a href="javascript:;"><img v-bind:src="data.imgUrl"></a></div>
            </div>
            <div class="pagination"></div>
        </div>
    </div>
    <div class="price-box" >
        <div class="name-share">
            <p class="name" v-html="goodsObj.goodsName"></p>
        </div>
        <div class="price-section-box">
            <!-- <div class="price-section2" v-if="skuPrice.length">
                <div class="price-item" v-for="data in skuPrice">
                    <span class="num-price"><span v-html="data.intervalFirst"></span>-<span v-html="data.intervalLast"></span>件单价</span><br/>
                    <ins class="current-price">￥<span v-html="data.price.toFixed(2)"></span></ins>
                    <del class="original-price">￥<span v-html="showSku.marketPrice.toFixed(2)"></span></del>
                </div>
            </div>
            <div class="price-section1" v-else>
               <ins class="current-price">￥<span v-html="showSku.skuPrice.toFixed(2)"></span></ins>
               <del class="original-price" v-html="showSku.marketPrice.toFixed(2)">￥<span></span></del>
            </div> -->
            <div class="address">
                <img v-bind:src="jack(goodsObj.origin)" />
                <span v-if="goodsObj.origin!=null&&goodsObj.origin!=''"><span v-html="goodsObj.origin"></span><span>原产</span></span>
                <span><span>由</span><span v-html="goodsObj.supplierWarehouse && goodsObj.supplierWarehouse.warehouseName"></span><span>发货，预计7个工作日左右到达</span></span>
            </div>
        </div>
    </div>
    <div class="goods-prams" v-cloak>
        <a href="javascript:;" class="clearfix instruction">
            <div class="prams-header"><span>说明：</span></div>
            <div class="prams-con">
                <span class="red-mark">商品税费</span>
                <span class="red-mark">由<span v-html="goodsObj.deliveryCity"></span>发货，
                    <span v-if="goodsObj.post&&goodsObj.post.postage>0">满<span v-html="goodsObj.post.limitMoney"></span>包邮</span>
                    <span v-else>该商品免运费</span>
                </span><br/>

                <span class="red-mark">100%正品保证</span>
                <span class="red-mark true">假一赔十</span>
            </div>
            <div class="tip tip1"></div>
        </a>
    </div>
    <div class="brand" v-cloak>
        <h2><span>品牌详情</span></h2>
        <div class="brand-der" v-html="goodsDetail.brandStory" v-if="goodsDetail.brandStory"></div>
        <div class="brand-der" v-else v-cloak>全球商品一站式采购代发，主营美妆/个护/食品/保健品/日用品等品类,国内领先主流跨境电商平台的日系产品供应者。设有东京、电商平台的日系产品供应者。设有东京、香港、浙江三个中心。东京：采购与仓储 ; 香港：仓储与BD ; 浙江：运营与购与仓储 ; 香港：仓储与BD ;</div>
        <div class="brand-img" v-bind:class="{'company-img':!goodsDetail.brandStory}">
            <img v-bind:src="goodsDetail.brandLogo"  width="100%" />
        </div>
        <div class="see-brand">
            <router-link :to="'/goodsResult?brandId=' + goodsDetail.brandId + '&brandName=' + goodsDetail.brandName">查看该品牌所有单品></router-link>
        </div>
    </div>
    <div class="goods-details" v-cloak>
        <h2>商品图文说明:</h2>
        <img v-for="data in imgList" src="../m-images/error.jpg" v-bind:src="data.imgUrl" width="100%"  height="100%" />
    </div>
    <div class="goods-footer">
        <a href="javascript:;" class="custom">客服</a>
        <a href="javascript:;" class="collect no-collection" v-bind:class="{'collection':hasColltion}" v-on:click="addCollect()">收藏</a>
        <a href="javascript:;" class="add-shop" v-on:click="goShopCar()">加入购物车</a>
        <a href="javascript:;" class="buy" v-on:click="goBuy()">立即购买</a>
    </div>

    <div class="sku-box">
        <div class="box-bg"></div>
        <div class="sku-main">
            <div class="sku-header clearfix">
                <a href="javascript:;" class="box-close"></a>
                <div class="img-box">
                    <img v-bind:src="showSku.imgUrl2" />
                </div>
                <div class="details">
                    <p>
                        <span class="money">￥<span  class="sku-price"  v-html="showPrice.toFixed(2)"></span></span>
                    </p>
                    <p><span>库存：</span><span class="count"  v-html="showSku.count"></span><span>件</span></p>
                    <p>
                        <span>已选：</span>
                        <span v-html="showSku.skuName" class="format com-over"></span>
                    </p>
                </div>
            </div>
            <div class="sku-con">
                <div>
                    <p class="sku-con-header">规格分类:</p>
                    <div class="sku-con-items clearfix">
                        <a href="javascript:;"  v-for="data in goodsDetails" v-html="data.skuName" v-bind:skuId='data.skuId' v-bind:skuNo="data.skuNo"></a>
                    </div>
                    <p class="sku-con-header">数量:</p>
                    <div>
                        <num-control :count="count" :number="number" v-on:cb="changeNumber"></num-control>
                    </div>
                </div>
            </div>
            <a href="javascript:;" class="sure-add-buy" v-bind:class="{'no-num-buy' : (showSku.count<=0||showSku.status!=1)}" v-on:click="goSure()">确认</a>
        </div>
    </div>


    <div class="instruction-box">
        <div class="box-bg"></div>
        <div class="instruction-main">
            <h2>商品说明<a href="javascript:;" class="box-close"></a></h2>
            <div class="instru-item">
                <dl>
                    <dt><i></i>商品税费</dt>
                    <dd v-if="goodsDetail.tax>0">本产品适用税率为:<span v-html="(goodsDetail.tax*100).toFixed(2)"></span>%税费收取规则</dd>
                    <dd v-else>商家承担</dd>
                </dl>
                <dl>
                    <dt><i></i>商品运费</dt>
                    <dd v-if="goodsObj.post&&goodsObj.post.postage>0">实付满<span v-html="goodsObj.post.limitMoney"></span>元免运费，不足金额的订单收取<span v-html="goodsObj.post.postage"></span>元运费，税费、优惠券不计入<span v-html="goodsObj.post.limitMoney"></span>元金额</dd>
                    <dd v-else>该商品免运费</dd>
                </dl>
                <dl>
                    <dt><i></i>正品保障</dt>
                    <dd>唯妮海购每一件商品都经过严苛的品质把关，100%正品保证</dd>
                </dl>
                <dl>
                    <dt><i></i>假一赔十</dt>
                    <dd>杜绝一切假货，让您无忧购物。</dd>
                </dl>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import '../js/swiper.js'
import numControl from '../components/numControl'

export default {

    name : 'goodsDetails',

    data () {
        return {
            goodsNo: this.$route.query.goodsNo,//goodsNo
            skuId : '',//skuId
            goodsObj : {},//商品详情对象
            imgShowList : [],//详情轮播图
            imgList : [],//商品详情图片
            goodsDetail : [],//商品详情
            goodsDetails : [],//商品全部详情
            skuPrice : [],//sku价格区间
            showSku : {},//默认显示的sku对象
            showPrice : 0,//显示的价格
            number :1,//选择数量
            count : 1,//库存
            nowTime :'',//服务器时间
            hasColltion : false,//判断是否收藏
            isBuy : true,//判断是否是购买还是加入购物车
        }
    },

    computed: mapState(['isLogin']),

    mounted() {
        var oThis = this;
        this.detailMo();
        $('html, body').scrollTop(0);

        // 说明
        $('.instruction').click(function() {
            $('.instruction-box').show();
            setTimeout(function() {
                $('.instruction-main').addClass('show');
            }, 0);
        });
        // 统一关闭
        $('.box-close').click(function() {
            oThis.closeAll();
        });
        $('.box-bg').click(function() {
            oThis.closeAll();
        });
    },

    watch : {
        number : function() {
            this.getShowPrice();
        }
    },

    methods : {

        // 点击购买
        goBuy() {
            if( this.isLogin ) {
                this.isBuy = true;
                $('.sku-box').show();
                setTimeout(function() {
                    $('.sku-main').addClass('show');
                }, 0);
            } else {
               this.$router.push('/login');
            }
        },

        // 点击加入购物车
        goShopCar() {
            if( this.isLogin ) {
                this.isBuy = false;
                $('.sku-box').show();
                setTimeout(function() {
                    $('.sku-main').addClass('show');
                }, 0);
            } else {
               this.$router.push('/login');
            }
        },

        // 点击弹框的确定（加入购物车或者购买）
        goSure() {
            if( this.showSku.count<=0||this.showSku.status!=1 ) {
                return false;
            }
            if ( this.isBuy ) {
                //跳转到支付页面
                common.setCookie('PALACE_ORDER_SKUNO', this.showSku.skuNo);
                common.setCookie('PALACE_ORDER_NUMS', this.number);
                common.setCookie('PALACE_ORDER_COUPONID', "");
                common.setCookie('PALACE_ORDER_ADDRESS', "");
                common.setCookie('fromShop', 0);
                common.setCookie('changeGoodsNo', this.goodsNo );
                this.$store.commit('changeGoodsNo', this.goodsNo );
                this.$router.push('/surePay');
            } else {
                this.addShopCar();
            }
        },

        // 添加收藏
        addCollect() {
            if( this.isLogin ) {
                if( this.hasColltion ) {
                    $.customTips({
                        msg: '已收藏'
                    });
                } else {
                    this.insertCollect();
                }
            } else {
                this.$router.push('/login');
            }
        },

        changeNumber(numObj) {
            this.number = numObj.val;
        },

        closeAll : function() {
            $('.instruction-main').removeClass('show');
            $('.sku-main').removeClass('show');
            $('.sure-add-buy').removeClass('go-buy').removeClass('add-shop-car');
            setTimeout(function() {
                $('.instruction-box').hide();
                $('.sku-box').hide();
            },100);
        },

        getShowPrice() {
            var oThis = this,
                number = this.number;
           if( oThis.skuPrice.length==0 ) {
                oThis.showPrice = oThis.showSku.skuPrice;
            } else {
                oThis.showPrice = oThis.skuPrice[0].price;
            }

            console.log(oThis.showPrice);
            oThis.skuPrice.forEach(function(item, index, arr) {
                if( number>=item.intervalFirst&&number<=item.intervalLast ) {
                    oThis.showPrice = item.price;
                }
                if( number>=arr[arr.length-1].intervalLast ) {
                    oThis.showPrice = arr[arr.length-1].price;
                }
            });
        },

        detailMo() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url:  API.detailMo,
                dataType: 'json',
                data : {
                    goodsNo : this.goodsNo,
                },
                success : function(data) {
                    console.log(data);
                    oThis.goodsObj = data;
                    oThis.imgShowList = data.imgShowList;
                    oThis.imgList = data.imgList;
                    oThis.origin = data.origin;
                    oThis.activityList = data.activityList;
                    oThis.goodsDetail = data.detailList[0];
                    oThis.goodsDetails = data.detailList;
                    oThis.showSku = data.detailList[0];
                    oThis.skuId = oThis.showSku.skuId;
                    oThis.nowTime = data.nowTime;

                    // 单个sku库存
                    oThis.count = oThis.goodsObj.detailList[0].count;

                    oThis.$nextTick(function() {

                        var mySwiper = new Swiper('.swiper-container',{
                            grabCursor: true,
                            paginationClickable: true,
                            pagination: '.pagination'
                        });

                        // 获取sku价格
                        oThis.getSkuPrice();

                        // 初始化数量控制
                        $('.sku-con-items').find('a').eq(0).addClass('active');

                        // 选择商品
                        $(document).on('click', '.sku-con-items a', function() {
                            if( $(this).hasClass('active') ) {
                                return;
                            }
                            var index = $(this).index();
                            $('.sku-con-items a').removeClass('active');
                            $(this).addClass('active');

                            // 改变sku对象
                            oThis.showSku = oThis.goodsDetails[index];
                            oThis.skuId = oThis.showSku.skuId;
                            oThis.count = oThis.showSku.count;

                            // 重新获取sku区间价格
                            oThis.getSkuPrice();
                        });


                    });
                }
            });
        },

        getSkuPrice : function() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url:  API.getIntervalPrice,
                dataType: 'json',
                data : {
                   skuId : oThis.skuId
                },
                success : function(data) {
                    if( data.success ) {
                        oThis.skuPrice = data.result;
                        if( oThis.skuPrice.length==0 ) {
                            oThis.showPrice = oThis.showSku.skuPrice;
                        } else {
                            oThis.showPrice = oThis.skuPrice[0].price;
                        }
                        console.log(oThis.showPrice);
                    }
                }
            });
        },

        isCollect : function() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url:  API.isCollect,
                dataType: 'json',
                data : {
                    goodsId : oThis.goodsDetail.goodsId
                },
                success : function(data) {
                    if ( data.success ) {
                        oThis.hasColltion = true;
                    } else {
                        oThis.hasColltion = false;
                    }
                }
            });
        },

        insertCollect : function() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url:  API.insertCollect,
                dataType: 'json',
                data : {
                    goodsId : oThis.goodsDetail.goodsId
                },
                success : function(data) {
                    console.log(data);
                    if ( data.success ) {
                        if( data.message=='00000023' ) {
                           $.customTips({
                                msg: "已收藏"
                            });
                        } else if( data.message=='00000000' ) {
                            $.customTips({
                                msg: "收藏成功"
                            });
                           oThis.hasColltion = true;
                        }
                    }
                }
            });
        },

        addShopCar : function() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url:  API.addShopCar,
                dataType: 'json',
                data : {
                    goodsId : oThis.showSku.goodsId,
                    skuId : oThis.showSku.skuId,
                    num : this.number
                },
                success : function(data) {
                    if ( data.success ) {
                        oThis.$store.commit('carCount');
                        $.customTips({
                            msg: '加入购物车成功'
                        });
                        $('.sku-main').removeClass('show');
                        setTimeout(function() {
                            $('.sku-box').hide();
                        },300);
                    } else {
                        $.customTips({
                            msg: '加入购物车失败'
                        });
                    }
                }
            });
        },

        drawCoupon : function(couponId) {
            var oThis = this;
            console.log(couponId);
            $.ajax({
                type : 'post',
                url:  API.drawCoupon,
                dataType: 'json',
                data : {
                    couponIds : parseInt(couponId)
                },
                success : function(data) {
                    $.customTips({
                        msg: data.message
                    });
                }
            });
        },

        getNowTime : function(nowTime) {
            return new Date(nowTime).getTime();
        },

        format : function(time) {
            var date = new Date(time);
            function two(day) {
                if( day<10 ) {
                    return '0' + day;
                }
                return day;
            }
            return  date.getFullYear()+ '.' + two(date.getMonth()+1) + '.' + two(date.getDate());
        },

        jack : function(county) {
            switch (county) {
            case '日本':
                return '../images/img-tip-jp.png'
                break;
            case '神奈川县':
                return '../images/img-tip-jp.png'
                break;
            case '澳大利亚':
                return '../images/img-tip-as.png'
                break;
            case '韩国':
                return '../images/img-tip-kr.png'
                break;
            case '美国':
                return '../images/img-tip-usa.png'
                break;
            case '法国':
                return '../images/img-tip-fa.png'
                break;
            case '德国':
                return '../images/img-tip-de.png'
                break;
            case '荷兰':
                return '../images/img-tip-hn.png'
                break;
            case '马来西亚':
                return '../images/img-tip-mlxy.png'
                break;
            case '新加坡':
                return '../images/img-tip-xjp.png'
                break;
             case '越南':
                return '../images/img-tip-yn.png'
                break;
            case '意大利':
                return '../images/img-tip-ydl.png'
                break;
            case '英国':
                return '../images/img-tip-yg.png'
                break;
            case '中国':
                return '../images/img-tip-china.png'
                break;
            default:
                return '../images/img-tip-jp.png'
            }
        }
    },

    components : {
        numControl


    }
}
</script>

<style scoped>
@import '../css/swiper.min.css';

/*banner寮€濮�*/
.banner {
    position: relative;
    height: 26.667rem;
    margin-top:3.5rem;
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
}
.banner-bg {
    position: absolute;
    top: 9rem;
    right: 40px;
    width: 1rem;
    opacity: 0;
}
.banner-bg-show {
    opacity: 1;
}
.banner .swiper-container {
    height: 100%;
}
.banner .swiper-slide a {
    display: block;
    height: 100%;
    text-align: center;
}
.banner .swiper-slide a img {
    width: 100%;
}
.banner .pagination {
    position: absolute;
    z-index: 20;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
}
.banner .swiper-pagination-bullet {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    opacity: 0.5;
    background-color: #000;
    border: 1px solid #fff;
    cursor: pointer;
}
.banner .swiper-pagination-bullet-active {
    background: #9f2e33;
    border:1px solid #9f2e33;
    opacity: 1;
}
/*banner缁撴潫*/

/*浠锋牸鍖洪棿寮€濮�*/
.price-box {
    padding: 1.25rem;
    background-color: #fff;
}
.price-box .name-share {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    box-sizing: content-box;
    height: 2.083rem;
    padding-bottom: 1.0rem;
    border-bottom: 1px solid #ebebeb;
}
.price-box .name {
    padding-right: 10%;
    box-sizing: content-box;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    color: #4d4d4d;
    font-size: 1.2rem;
}
.price-box .share {
    width: 2rem;
    height: 2rem;
    background:url(../m-images/icon-week.png) no-repeat 5px -2.5rem;
    background-size: 8.333rem 8.333rem;
}
.price-box .price-section-box {
    padding-top:0.958rem;
}
.price-box .current-price {
    margin-right: 3px;
    font-size: 1.333rem;
    color: #f45e48;
    text-decoration: none;
}
.price-box .original-price {
    font-size: 0.833rem;
    color: #adadad;
}
.price-box .price-section2 {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
}
.price-box .num-price {
    display: inline-block;
    position: relative;
    margin-bottom: 5px;
    font-size: 0.667rem;
    line-height: 1.5;
    padding: 2px 4px;
    background-color: #eee;
    border-radius: 3px;
}
.price-box .num-price:after {
    content: '';
    position: absolute;
    left: 5px;
    bottom: -4px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 4px solid #eee;
}
.price-box .address {
    margin-top: 0.833rem;
    color: #aeaeae;
    font-size: 0.833rem;
}
.price-box .address span {
    vertical-align: middle;
}
.address img {
    width: 2rem;
    height: 1.5rem;
    vertical-align: middle;
}
.price-box .price-section2 .original-price {
    display: none;
}
.price-box .price-section2 .price-item:first-child .original-price {
    display: inline-block;
}
/*浠锋牸鍖洪棿缁撴潫*/

/*淇冮攢-棰嗗埜寮€濮�*/
.goods-prams {
    background-color: #fff;
    margin-top: 0.708rem;
    border-top: 1px solid #ebebeb;
}
.goods-prams a {
    position: relative;
    display: -webkit-flex;
    display: flex;
    padding:0 1.25rem;
    border-bottom: 1px solid #ebebeb;
    color: #1a1a1a;
}
.goods-prams .tip {
    position: absolute;
    right: 1.25rem;
    top:1.25rem;
    width: 0.417rem;
    height: 1rem;
    background:url(../m-images/icon-week.png) no-repeat 0 -6.042rem;
    background-size: 8.333rem 8.333rem;
}
.goods-prams .tip1 {
    top: 2rem;
}
.goods-prams .prams-header,
.goods-prams .prams-con {
    padding: 0.917rem 0;
}
.goods-prams a span {
    padding-bottom: 0.833rem;
}
.goods-prams .color {
    color: #f34f34;
    margin-right: 10px;
}
.goods-prams .prams-header span,
.goods-prams .prams-con span {
    line-height: 1.6;
}
.goods-prams .prams-header {
    width: 15%;
}
.goods-prams .red-mark {
    position: relative;
    margin-right: 8px;
}
.goods-prams .red-mark:before {
    content: '';
    display: inline-block;
    margin-right: 3px;
    vertical-align: middle;
    width: 5px;
    height: 5px;
    background-color: #f34f34;
    border-radius: 50%;
}

/*淇冮攢-棰嗗埜缁撴潫*/

/*鍝佺墝璇︽儏寮€濮�*/
.brand {
    margin-top: 0.708rem;
    background: #fff;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
}
.brand h2 {
    position: relative;
    width: 14.917rem;
    height: 1.25rem;
    margin: 1.25rem auto 1rem;
    color: #3d3d3d;
    text-align:center;
}
.brand h2 span {
    position: absolute;
    width: 6.667rem;
    left: 4.167rem;
    z-index: 2;
    background-color: #fff;
    font-size: 1.083rem;
}
.brand h2:after {
    content: '';
    position: absolute;
    z-index: 1;
    width: 100%;
    left: 0;
    top: 0.5rem;
    border-top: 1px solid #ebebeb;
}
.brand .brand-der {
    padding: 0 1.25rem;
    line-height: 1.8;
    color: #4d4d4d;
}
.brand .see-brand {
    margin-bottom: 1.583rem;
    text-align: center;
}
.brand .see-brand a {
    color: #aa4549;
}
.brand .brand-img {
    width: 4.6rem;
    margin:0.625rem auto 0.833rem;
    overflow:hidden;
}
.brand .company-img {
    width: 7rem;
    margin-bottom: 1.5rem;
}
/*鍝佺墝璇︽儏缁撴潫*/

/*鍥炬枃璇存槑寮€濮�*/
.goods-details {
    margin-top: 0.708rem;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    background-color: #fff;
}
.goods-details h2 {
    line-height: 3.125rem;
    font-size: 1.0rem;
    padding-left: 1.458rem;
}
.goods-details img {
    display: block;
    min-height: 150px;
}
/*鍥炬枃璇存槑缁撴潫*/

/*鍟嗗搧搴曢儴寮€濮�*/
.goods-footer {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 45px;
    border-top: 1px solid #ebebeb;
    background-color:#fff;
    font-size: 12px;
    z-index: 11;
}
.goods-footer .custom {
    padding-top: 22px;
    width: 15%;
    background: url(../m-images/goods-custom.png) no-repeat center top;
    background-size: 24px 21px;
    color: #131313;
    text-align: center;
}
.goods-footer .no-collection,
.goods-footer .collection {
    padding-top: 22px;
    width: 15%;
    background: url(../m-images/goods-no-collection.png) no-repeat center top;
    background-size: 24px 21px;
    color: #131313;
    text-align: center;
}
.goods-footer .collection {
    background: url(../m-images/goods-collection.png) no-repeat center top;
    background-size: 24px 21px;
    color: #9f2e33;
}
.goods-footer .add-shop,
.goods-footer .buy {
    width: 35%;
    line-height: 45px;
    text-align: center;
    color: #131313;
    border-left: 1px solid #ebebeb;
    font-size: 15px;
}
.goods-footer .buy {
    background-color: #9f2e33;
    color: #fff;
}
/*鍟嗗搧搴曢儴缁撴潫*/

/*搴曢儴寮瑰嚭妗嗗紑濮�*/
.show {
    -webkit-transform: translateY(0) !important;
}
.instruction-box,
.coupon-box {
    display: none;
}
.box-bg {
    width: 100%;
    opacity: .5;
    height: 100%;
    position: fixed;
    background-color: #666;
    top: 0;
    left: 0;
    z-index: 100;
}
.instruction-box .instruction-main,
.coupon-box .coupon1-main,
.share-box .share-main,
.share-box .link-main {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 101;
    width: 100%;
    height: 22rem;
    background-color: #fff;
    -webkit-transform: translateY(22rem);
    transform: translateY(22rem);
    -webkit-transition: -webkit-transform .2s cubic-bezier(0,0,.25,1);
}
.instruction-box .instruction-main h2,
.coupon-box .coupon1-main h2 {
    padding:0.917rem 1.333rem;
    font-size: 1.2rem;
    color: #131313;
    border-bottom: 1px solid #ebebeb;
    text-align: center;
}
.box-close {
    float: right;
    width: 1.25rem;
    height: 1.25rem;
    background:url(../m-images/icon2.png) no-repeat 0 -8.708rem;
    background-size: 33.333rem 33.333rem;
}
.instruction-box .instru-item {
    line-height: 1.5;
    color: #131313;
    padding: 0.417rem 1.333rem;
}
.instruction-box .instru-item dl {
    margin-bottom: 0.417rem;
}
.instruction-box .instru-item dd {
    color: #636363;
}
.instruction-box .instru-item dt {
    font-size: 1.1rem;
}
.instruction-box .instru-item i {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    width: 6px;
    height: 6px;
    background-color: #9f2e33;
    -webkit-transform:rotate(45deg);
    transform:rotate(45deg);
}
.coupon-box .coupon1-item {
    height: 19rem;
    padding: 0.6rem 1.333rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
}

/*鍒嗕韩寮€濮�*/
.share-box {
    display: none;
}
.share-box .share-main {
    height: 13rem;
    -webkit-transform: translateY(13rem);
    transform: translateY(13rem);
}
.share-items {
    margin-left:-1rem;
    padding: 1.958rem 1.958rem 0 1.958rem
}
.share-items  a {
    float: left;
    margin: 0 0 1.5rem 2rem;
    width: 3.8rem;
    height: 5.0rem;
    text-align: center;
    color: #131313;
}
.share-items  a div {
    display: block;
    margin-bottom: 0.625rem;
    width: 3.6rem;
    height: 3.6rem;
    background: url(../m-images/icon1.png) no-repeat 0.75rem 0.8rem;
    background-size: 25.0rem 25.0rem;
    border: 1px solid #000;
    border-radius: 50%;
}
.share-items .pyq {
    background: url(../m-images/share.png) no-repeat .8rem .8rem;
    background-size: 10.417rem 10.417rem;
}
.share-items .wb {
    background-position: .75rem -7.083rem;
}
.share-items .qq {
    background-position: .85rem -3.125rem;
}
.share-items .qq-zone {
    background: url(../m-images/share.png) no-repeat .6rem -2.875rem;
    background-size: 10.417rem 10.417rem;
}
.share-items .link {
    background: url(../m-images/share.png) no-repeat .6rem -6.8rem;
    background-size: 10.417rem 10.417rem;
}
.cancel-share {
    display: block;
    line-height: 4.0rem;
    border-top: 1px solid #ebebeb;
    text-align: center;
    font-size: 1.167rem;
    color: #7c7c7c;
}
.share-box .link-main {
    display: none;
    height: auto;
    -webkit-transform: translateY(0rem);
    transform: translateY(0rem);
}
.share-box .link-main h2 {
    padding:1.5rem 0;
    text-align: center;
    font-size: 1.1rem;
}
.share-box .link-main p {
    padding: 0 1rem 1rem 1rem;
    word-break: break-all;
    font-size: 0.917rem;
}
/*鍒嗕韩缁撴潫*/

/*璐拱sku寮€濮�*/
.sku-box {
    display: none;
}
.sku-box .sku-main {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 101;
    width: 100%;
    height: 27.417rem;
    background-color: #fff;
    -webkit-transform: translateY(27.417rem);
    transform: translateY(27.417rem);
    -webkit-transition: -webkit-transform .2s cubic-bezier(0,0,.25,1);
}
.sku-box .sku-header {
    max-width: 640px;
    margin: 0 auto;
    padding: 0 1.417rem;
    border-bottom: 1px solid #e6e6e6;
}
.sku-box .sku-header .box-close {
    margin-top: 0.917rem;
}
.sku-box .img-box {
    float: left;
    width: 6.25rem;
    height: 6.25rem;
    -webkit-transform: translateY(-0.833rem);
    transform: translateY(-0.833rem);
    border-radius: 4px;
    border:1px solid #e6e6e6;
    overflow: hidden;
}
.sku-box .img-box img {
    border-radius: 4px;
}
.sku-box .details {
    float: left;
    margin: 0.917rem 0 0 1rem;
    color: #414141;
    line-height: 1.4;
}
.sku-box .details span {
    vertical-align: middle;
}
.sku-box .details .format {
    display: inline-block;
    vertical-align: middle;
    width: 10rem;
}
.sku-box .money {
    margin-right: 0.917rem;
    font-size: 1.25rem;
    color: #eb2634;
    vertical-align: middle;
}
.sku-box .activity {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 4px;
    background-color: #f0f0f0;
    color: #ec6e74;
    font-size: 0.75rem;
}
.sku-box .sku-con {
    max-width: 640px;
    margin: 0 auto;
    height: 16.667rem;
    padding: .5rem 1.417rem;
    overflow-y: auto;
}
.sku-box .sku-con-header {
    margin-bottom: 0.417rem;
}
.sku-box .sku-con-items {
    margin-left:-0.833rem;
    margin-bottom: 0.833rem;
}
.sku-box .sku-con-items a {
    float: left;
    margin: 0 0 .5rem 0.833rem;
    padding: 0.4rem .3rem;
    border:1px solid #414141;
    color: #414141;
    font-size: 0.917rem;
}
.sku-box .sku-con-items .active {
    background: url(../m-images/icon1.png) no-repeat 0 -22.833rem;
    background-size: 25.0rem 25.0rem;
    border: 1px solid #eb2634;
    color: #eb2634;
}
.sku-box .sku-con-items .active:before {

}
.sku-box  .sure-add-buy {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 4.167rem;
    background-color: #a54144;
    color: #fff;
    font-size: 1.25rem;
    text-align: center;
}
.sku-box .no-num-buy {
    background: #dedede;
    pointer-events: none;
    border: none;
    color: #fff;
}
/*璐拱sku缁撴潫*/

/*鏈堢悆寮€濮�*/
.moon-box {
    /*display: none;*/
}
.block {
    display: block;
}
.moon-box .moon-bg {
    position: fixed;
    z-index: 999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    opacity: .5;
}
.moon-box .moon-main {
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin:auto;
    width: 22.083rem;
    height: 11.5rem;
    background-color: #fff;
    border-radius: 6px;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
    color: #000;
    text-align:center;
}
.moon-box .moon-img-box {
    width: 10.0rem;
    margin: -5rem auto 0;
}
.moon-header {
    margin-bottom: 1rem;
    font-size: 1.333rem;
}
.moon-btn {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-between;
    justify-content: space-between;
    -webkit-align-items:center;
    align-items: center;
    height: 3.92rem;
    border-top: 1px solid #ebebeb;
    overflow:hidden;
}
.moon-btn a {
    width: 50%;
    line-height: 3.92rem;
    color: #9f2e33;
    text-align: center;
}
.moon-btn a:first-child {
    border-right: 1px solid #ebebeb;
}
/*鏈堢悆缁撴潫*/


#url {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    opacity: 0;
}








</style>

