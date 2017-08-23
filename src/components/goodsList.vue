<template>
<div>
    <ul class="clearfix com-goods-list" >
        <li v-for="data in  goodsList1">
            <router-link :to="'/goodsDetails?goodsNo=' + data.goodsNo">
                <div v-if="data.count==0" class="no-goods">已抢光</div>
                <div class="goods-img">
                    <img src="../m-images/error.jpg" v-bind:data-src="data.imgUrl2" width="100%" onerror='this.src="/m-images/error.jpg"' />
                </div>
                <p class="goods-der"><span class="activity" v-html="data.couponPolicyName" v-if="data.couponPolicyName &&getNowTime(nowTime) > getNowTime(data.startTime) && getNowTime(nowTime) < getNowTime(data.endTime)"></span><span v-html="data.goodsName2"></span></p>
                <div class="goods-price">
                    <ins class="current-price">¥<span v-html="data.skuPrice.toFixed(2)"></span></ins>
                    <del class="original-price">¥<span v-html="data.marketPrice.toFixed(2)"></span></del>
                </div>
            </router-link>
        </li>
    </ul>
    <div v-if="noNum" class="com-no-num"><img src="../m-images/com-no-num.png" /></div>
    <com-end :end="end"></com-end>
    <com-loading :isLoading="isLoading"></com-loading>
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

    name : 'goodsList',

    props : ['queryParams', 'queryApi', 'oneList'],

    data () {
        return {
            goodsList :[],
            pageTotal : 1,//请求总共页面
            isLoading : true,//是否在请求中
            runing : true,//防止一次触发多次请求开关
            end : false, //判断是否加载完毕
            noNum : false,//判断是否有数据
            nowTime : '',
        }
    },

    // 父组件的参数是异步获取的，子组件必须在计算属性里面才能获取到
    computed : {
        goodsList1() {
            return this.oneList || this.goodsList;
        }
    },

    mounted() {
        var oThis = this;
        if ( this.queryParams ) {
            this.getGoodsList();
            // 下滑加载更多数据(节流函数)
            $(window).scroll(function() {
                oThis.scrollGetData();
            });
        } else {
            this.isLoading = false;
        }
    },

    methods : {

        scrollGetData() {
            var oThis = this;
            if( $(window).scrollTop() +500 >= $(document).height() - $(window).height() ) {
                if (  oThis.pageTotal>0 && oThis.queryParams.page<oThis.pageTotal+1 && oThis.runing ) {
                    oThis.getGoodsList();
                }
            }
        },

        getGoodsList() {
            var oThis = this;
            if( oThis.changePage()==1 ) {
                oThis.goodsList = [];
                $('.com-loading').addClass('margin-top1');
                $(window).scrollTop(0);
            }
            oThis.isLoading = true;
            oThis.end = false;
            oThis.runing = false;
            oThis.noNum = false;
            $.ajax({
                type : 'post',
                url:  this.queryApi,
                dataType: 'json',
                data : this.queryParams,
                success : function(data) {
                    console.log(data);
                    if( data.message ) {
                        //第一次加载
                        if( oThis.changePage()===1 ) {
                            oThis.goodsList = data.list;
                            oThis.pageTotal = data.pageTotal;
                            // 没有数据
                            if( oThis.goodsList.length===0 ) {
                                oThis.isLoading = false;
                                this.noNum  = true;
                            }
                        } else {
                            oThis.goodsList = oThis.goodsList.concat(data.list);
                        }

                        new lazyImg();
                        oThis.nowTime = data.nowTime;
                        oThis.addPage();
                        oThis.runing = true;

                        // 数据加载完毕
                        if( oThis.changePage()===oThis.pageTotal+1 ) {
                            oThis.end = true;
                            oThis.isLoading = false;
                        }
                    }
                }
            });
        },

        getNowTime(nowTime) {
            return new Date(nowTime).getTime();
        },

        changePage() {
            return this.queryParams.page || this.queryParams.pageNum;
        },

        addPage() {
            return this.queryParams.page++ || this.queryParams.pageNum++;
        }

    },

    components : {
        comEnd,
        comLoading
    }
}
</script>

<style scoped>
/*公共商品列表开始*/
.com-goods-list li {
    position: relative;
    float: left;
    width: 50%;
    height: 6.25rem;
    border-bottom: 1px solid #ebebeb;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 18.5rem;
}
.com-goods-list li:nth-child(odd) {
    margin-left: -1px;
    border-right: 1px solid #ebebeb;
}
.com-goods-list .goods-img {
    position: relative;
    width: 11rem;
    height: 11rem;
    margin: 0.833rem auto;
    overflow:hidden;
}
.com-goods-list .tips-box {
    position: absolute;
    left: 0;
    top: 0;
}
.com-goods-list .tips-box img {
    width: 2.792rem;
}
.com-goods-list .goods-img img {
    max-width: 100%;
}
.com-goods-list .goods-der {
    height: 2.7rem;
    line-height: 1.4rem;
    padding: 0 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #4d4d4d;
}
.goods-der .activity {
    margin-right: 2px;
    color: #a54144;
    border:1px solid #a54144;
    padding: 1px 1px;
    font-size: 0.75rem;
    line-height: 1.5;
}
.com-goods-list .goods-price {
    margin-top: 0.417rem;
    padding: 0 0.75rem;
}
.com-goods-list .current-price {
    color: #f34f34;
    font-size: 1.2rem;
    margin-right: 3px;
    text-decoration: none;
    vertical-align: middle;
}
.com-goods-list .original-price {
    color: #b6bbc1;
    text-orientation: none;
    vertical-align: middle;
}
.com-goods-list li a {
    display: block;
    height: 100%;
    overflow:hidden;
    background-color: #fff;
}
.com-goods-list .com-none {
    opacity: 0;
}
.com-goods-list .no-goods {
    position: absolute;
    z-index: 1;
    left: 4.5rem;
    top: 4.5rem;
    width: 3.958rem;
    height: 3.958rem;
    line-height: 3.958rem;
    background-color: #999;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    opacity: .8;
}
/*公共商品列表结束*/
</style>

