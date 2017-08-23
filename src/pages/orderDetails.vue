<template>
<div class="com-body3">
    <div class="header clearfix">
        <h1>订单详情</h1>
        <router-link to="order?type=0" class="header-back"></router-link>
    </div>

    <!-- 未支付状态 -->
    <div class="continue-pay" v-if="orderTrade.tradeStatus==1">
        <div class="continue-tips">订单已提交成功，等待买家付款将在24小时后自动关闭该订单</div>
        <div class="continue-img">
            <img src="../m-images/continue-pay.png" />
        </div>
    </div>

     <!-- 待审核状态 -->
    <div class="continue-pay"  v-if="orderTrade.tradeStatus==2 || orderTrade.tradeStatus==5" >
        <div class="continue-tips">您的订单等待发货</div>
        <div class="continue-img">
            <img src="../m-images/continue-pay.png" />
        </div>
    </div>

    <!-- 待收货状态 -->
    <a class="logistics" v-if="orderTrade.tradeStatus==7">
        <div class="logistics-main">
            <p class="logistics-status">已发货</p>
            <p>物流信息：<span v-html="logistics[0].context" class="logistics-item"></span></p>
        </div>
        <i></i>
    </a>

    <!-- 已完成状态 -->
    <div class="continue-pay deal-success" v-if="orderTrade.tradeStatus==11">
        <div class="continue-tips">交易成功
        <p>物流信息：<span v-html="logistics[0].context" class="logistics-item"></span></p>
        </div>
        <div class="continue-img">
            <img src="../m-images/continue-pay.png" />
        </div>
    </div>

    <!-- 已关闭状态 -->
    <div class="continue-pay already-closed" v-if="orderTrade.tradeStatus==0">
        <div class="continue-tips">交易关闭</div>
        <div class="continue-img">
            <img src="../m-images/continue-pay.png" />
        </div>
    </div>
    <div class="address-box" v-cloak>
        <p class="name-phone">
            <span v-html="orderTrade.sndTo"></span>
            <span v-html="orderTrade.tel"></span>
        </p>
        <div class="address">
            <i></i>
            <span v-html="orderTrade.province"></span><span v-html="orderTrade.city"></span>
            <span v-html="orderTrade.town"></span><span v-html="orderTrade.adr"></span>
        </div>
    </div>

   <div class="leave-word" v-cloak>
        <p>买家留言</p>
        <div v-html="orderTrade.remark"></div>
    </div>

    <div class="pay-info" v-cloak>
        <p>订单编号：<span v-html="orderTrade.tradeNo"></span></p>
        <p>支付时间：<span v-html="format(orderTrade.payerTime)"></span></p>
    </div>

    <!-- 支付状态 -->
    <div class="order-item" v-cloak>
        <router-link :to="'/goodsDetails?goodsNO=' + data.detailGoodsNo" class="goods-details" v-for="data in orderTrade.orderGoods">
            <div class="img-box">
                <img v-bind:src="data.goodsImgUrl" />
            </div>
            <div class="goods-der">
                <p class="goods-name"  v-html="data.tradeName"></p>
                <div class="goods-tips">
                    <span>规格：<span v-html="data.unit"></span></span>
                </div>
            </div>
            <div class="price">
                <p>￥<span v-html="data.sellPrice.toFixed(2)"></span></p>
                <p class="goods-num">×<span v-html="data.sellCount"></span></p>
            </div>
        </router-link>
    </div>

    <!-- 未支付钱是红色的，已支付去掉红色 -->
    <div class="price-box">
        <p>
            <span>商品金额(不含税):</span>
            <span class="continue">¥<span v-html="orderTrade.costTotal.toFixed(2)"></span></span>
        </p>
        <p>
            <span>活动优惠:</span>
            <span class="continue">¥-<span v-html="orderTrade.activeAmount.toFixed(2)"></span></span>
        </p>
        <p>
            <span>优惠券优惠:</span>
            <span class="continue">¥-<span v-html="orderTrade.couponAmount.toFixed(2)"></span></span>
        </p>
        <p>
            <span>运费:</span>
            <span class="continue">¥<span v-html="orderTrade.postageTotal.toFixed(2)"></span></span>
        </p>
        <p>
            <span>税费:</span>
            <span class="continue">¥<span v-html="orderTrade.postalTax.toFixed(2)"></span></span>
        </p>
        <p>
            <span>应付总额:</span>
            <span class="continue">¥<span v-html="orderTrade.rcvTotal.toFixed(2)"></span></span>
        </p>
    </div>

    <div class="pay-box" v-if="orderTrade.tradeStatus==1" v-cloak>
        <p class="pay-header">选择支付方式:</p>
        <div class="pay-main">
            <a href="javascript:;" class="zfb active" v-if="!$store.state.weixn">
                <span>支付宝</span>
                <i></i>
            </a>
            <a href="javascript:;" class="wx active" v-else>
                <span>微信</span>
                <i></i>
            </a>
        </div>
    </div>

    <div class="make-box1" v-if="orderTrade.tradeStatus==1" v-cloak>
        <a href="javascript:;" class="custom-service" id="onlineServiceWrap"></a>
        <a href="javascript:;" v-on:click="qxOrder(orderTrade.tradeNo)" class="cancel-order">取消订单</a>
        <a href="javascript:;" v-on:click="toPay(orderTrade.tradeNo)" class="pay-after">继续支付</a>
    </div>


    <div class="make-box2" v-if="orderTrade.tradeStatus==7">
        <router-link :to="'logistics?logistid=' + data.logistid +'&postId=' + data.postId">查看物流</router-link>
        <a href="javascript:;" v-on:click="takeOrder(orderTrade.tradeId)" class="red">确认收货</a>
    </div>

    <div class="make-box2" v-if="orderTrade.tradeStatus==11" v-cloak>
        <router-link :to="'logistics?logistid=' + orderTrade.logistid +'&postId=' + orderTrade.postId">查看物流</router-link>
        <a href="javascript:;" v-on:click="delOrder(orderTrade.tradeId)" class="red">删除订单</a>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import imgLazy from '../js/img-lazy.js'
import comEnd from '../components/comEnd'
import comLoading from '../components/comLoading'
export default {

    name : 'orderDetails',

    data () {
        return {
            tradeNo : '',
            logistics : [],
            orderTrade : [],
            post : [],
        }
    },

    mounted() {
        if ( !this.$store.state.isLogin ) {
            this.$router.push('/login');
        }
        this.getDetail();
    },

    methods : {
        getDetail() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url : API.tradeMoDetail,
                dataType : 'json',
                data : {
                    tradeNo : this.$route.query.tradeNo
                },
                success : function(data) {
                    console.log(data);
                    if (data.success == true) {
                        oThis.logistics = data.logistics;
                        oThis.orderTrade = data.orderTrade;
                        oThis.post = data.post;
                    }
                }
            });
        },

        delOrder(tradeId) {
            $.customPop({
                msg : '您确定要删除吗？',
                sureCallBack :function() {
                    var oThis = this;
                    $.ajax({
                        type : 'post',
                        url : API.delTrade,
                        dataType : 'json',
                        data : {
                            tradeIds : tradeId
                        },
                        success : function(data) {
                            if (data.msg == "00000000") {
                                window.location.href = '/m-html/my/my-order.html?type=0';
                            } else {
                                $.customTips({
                                    msg : '订单删除失败'
                                });
                            }
                        }
                    });
                }
            });
        },

        qxOrder(tradeNo) {
            var oThis = this;
            $.ajax({
                type : 'post',
                url : API.updateTrade,
                dataType : 'json',
                data : {
                    tradeNo : tradeNo
                },
                success : function(data) {
                    console.log(data);
                    if (data.success == true) {
                        $.customTips({
                            msg : '订单取消成功'
                        });
                        location.reload();
                    } else {
                        $.customTips({
                            msg : '订单取消失败'
                        });
                    }
                }
            });
        },

        takeOrder(tradeId) {
            var oThis = this;
            $.ajax({
                type : 'post',
                url : API.updateStatus,
                dataType : 'json',
                data : {
                    tradeId : tradeId
                },
                success : function(data) {
                    console.log(data);
                    if (data.msg == '00000000') {
                        $.customTips({
                            msg : '确认收货成功'
                        });
                        location.reload();
                    } else {
                        $.customTips({
                            msg : '确认收货失败'
                        });
                    }
                }
            });
        },

        format(time) {
            if(!time==''){
                var date = new Date(time);
                function two(day) {
                    if( day<10 ) {
                        return '0' + day;
                    }
                    return day;
                }
                return  date.getFullYear()+ '-' + two(date.getMonth()+1) + '-' +
                two(date.getDate())+" "+two(date.getHours())+":"+two(date.getMinutes())+":"+two(date.getSeconds());
            }
        },

        goPay(payStatus, tradeNo) {
            var oThis = this;
            $.ajax({
                type : 'post',
                url : API.toPay,
                dataType : 'json',
                data : {
                    tradeNo : tradeNo,
                    payStatus : payStatus
                },
                success : function(data) {
                    console.log(data);
                    if(data.success==true) {
                        window.location.href = data.result;
                    } else{
                        if(data.msg=='000000012'){
                            $.customTips({
                                msg : '订单已超过支付时间，请重新下单'
                            });
                        } else if (data.msg=='000000014'){
                            $.customTips({
                                msg : '订单已支付，请不要重复提交'
                            });
                        } else {
                            $.customTips({
                                msg : '网络异常，请稍后再试'
                            });
                        }
                    }
                }
            });
        },

        toPay(tradeNo) {
            var payStatus = 4;
            if( this.$store.state.weixn ) {
                payStatus = 5;
            }
            this.goPay(payStatus,tradeNo);
        }
    },

    components : {
        comLoading,
        comEnd
    }
}
</script>

<style scoped>
.com-body3 {
    padding: 3.5rem 0 3rem;
}
/*鐗╂祦寮€濮�*/
.logistics {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-between;
    justify-content: space-between;
    -webkit-align-items:center;
    align-items: center;
    height: 5.75rem;
    padding:1.25rem 1.333rem;
    background-color: #4c7884;
    color: #fff;
}
.logistics .logistics-main {
    width: 90%;
}
.logistics .logistics-status {
    margin-bottom: 0.417rem;
    height: 1.5rem;
    line-height: 1.8rem;
    padding-left: 1.417rem;
    font-size: 1.2rem;
    background: url(../m-images/icon2.png) no-repeat 0 -19.417rem;
    background-size: 33.333rem 33.333rem;
}
.logistics i {
    display: inline-block;
    width: 0.5rem;
    height: 1.0rem;
    background: url(../m-images/icon2.png) no-repeat 0 -31.083rem;
    background-size: 33.333rem 33.333rem;
}
.logistics .logistics-item {
    display: inline-block;
    vertical-align: middle;
    width: 70%;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
/*鐗╂祦缁撴潫*/

/*鍦板潃寮€濮�*/
.address-box {
    margin-bottom: 0.708rem;
    padding: 1.0rem 1.333rem;
    background: #fff;
}
.name-phone span {
    margin-right: 0.625rem;
}
.address {
    margin-top: 0.625rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.address i {
    display: inline-block;
    vertical-align: middle;
    width: 0.9rem;
    height: 1.2rem;
    background: url(../m-images/icon2.png) no-repeat 0 -24.2rem;
    background-size: 33.333rem 33.333rem;
}
.address span {
    font-size: 0.833rem;
    color: #999;
    word-break: break-all;
}
/*鍦板潃缁撴潫*/

/*涔板鐣欒█寮€濮�*/
.leave-word {
    padding: 1.0rem 1.333rem;
    margin-bottom: 0.833rem;
    background-color: #fff;
    word-break: break-all;
}
/*涔板鐣欒█缁撴潫*/

/*鏀粯淇℃伅寮€濮�*/
.pay-info {
    margin-bottom: 0.708rem;
    padding: 1.0rem 1.333rem;
    line-height: 1.5;
    background-color: #fff;
}
/*鏀粯淇℃伅缁撴潫*/

/*璁㈠崟淇℃伅寮€濮�*/
.order-item {
    padding-bottom: 0.833rem;
    margin-bottom: 0.708rem;
    background-color: #fff;
}
.order-item h2 {
    height: 3rem;
    line-height: 3rem;
    padding: 0 1.333rem;
    border-bottom: 1px solid #ebebeb;
    font-size: 1rem;
}
.order-item .post-tip {
    margin-left: 10px;
    position: relative;
    z-index: 10;
    border:1px solid #9f2e33;
    padding:2px 5px;
    color: #fff;
    box-shadow: 2px 2px 0 #c68d8f;
    font-size: 0.75rem;
    background: #9f2e33;
}
.order-item .post-tip:before {
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
.order-item .goods-details {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-between;
    justify-content: space-between;
    height: 5.833rem;
    margin-bottom: 0.417rem;
    padding: 0.667rem 1.333rem;
    background: #fcfcfc;
    color: #333;
}
.order-item .img-box {
    width: 4.583rem;
    height: 4.583rem;
    overflow:hidden;
}
.order-item .goods-der {
    width: 13.75rem;
    margin: 0 0.417rem;
}
.order-item .goods-name {
    height: 3rem;
    line-height: 1.5;
    font-size: 1.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.order-item .goods-tips {
    margin-top: 0.208rem;
    color: #acacac;
    font-size: 0.833rem;
}
.order-item .price {
    text-align: right;
    line-height: 1.5;
}
.order-item .goods-num {
    color: #8b8b8b;
    font-size: 0.833rem;
    vertical-align: middle;
}
.order-item .price a {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.417rem;
    width: 100%;
    line-height: 1.917rem;
    border:1px solid #9c9c9c;
    color: #9c9c9c;
    text-align: center;
    border-radius: 3px;
}
/*璁㈠崟淇℃伅缁撴潫*/

/*閲戦寮€濮�*/
.price-box {
    margin-bottom: 0.708rem;
    border-top: 1px solid #ebebeb;
    background-color: #fff;
}
.price-box p {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-between;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
    line-height: 2.75rem;
    padding: 0 1.333rem;
}
.make-box2,
.make-box1 {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    border-top: 1px solid #ebebeb;
    padding:10px 1.333rem 0 0;
    text-align: right;
    height:45px;
    background-color: #fff;
}
.make-box2 a {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.417rem;
    width: 6.917rem;
    line-height: 25px;
    border:1px solid #9c9c9c;
    color: #9c9c9c;
    text-align: center;
    border-radius: 3px;
    font-size: 1.167rem;
}
.make-box2 .red {
    color: #9f2e33;
    border:1px solid #9f2e33;
}
/*閲戦寮€濮�*/

/*鏈敮浠樼姸鎬佸紑濮�*/
.continue-pay {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-between;
    justify-content: space-between;
    padding: 1.333rem;
    background-color: #9f2e33;
    color: #fff;
    line-height: 1.5;
}
.continue-tips {
    width: 70%;
}
.continue-img {
    width: 30%;
    text-align: center;
}
.continue-img img {
    width: 3.833rem;
}
.continue {
    color: #f34f34;
}
.make-box1 {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-between;
    justify-content: space-between;
    -webkit-align-items:center;
    align-items:center;
    padding: 0;
}
.make-box1 .custom-service {
    width: 24%;
    height: 100%;
    border-right: 1px solid #ebebeb;
    background: url(../m-images/goods-custom.png) no-repeat center;
    background-size: 24px 21px;
    color: #131313;
    text-align: center;
}
.cancel-order {
    width: 38%;
    text-align: center;
    color: #000;
}
.pay-after {
    width: 38%;
    line-height: 45px;
    color: #fff;
    text-align: center;
    background-color: #9f2e33;
}
.price-box .item {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    padding: 0 1.333rem;
    height: 2.708rem;
    border-bottom: 1px solid #ebebeb;
    color: #1a1a1a;
}
.coupon-num {
    color: #9f2e33;
}
.deal-success {
    background-color: #ff7700;
}
.already-closed {
    background-color: #9d9c9c;
}
/*鏈敮浠樼姸鎬佺粨鏉�*/
</style>

