<template>
<div class="body">
    <div class="header">
        <router-link to="/search" class="search-logo"></router-link>
        <router-link to="/shopCar" class="shopping-logo"><span v-html="$store.state.carCount"></span></router-link>
        <h1><img src="../m-images/logo.png" /></h1>
    </div>

    <div class="banner">
        <swiper swipeId="swipe" :swiperList="indexData.bannerList" :autoplay="3000"></swiper>
    </div>

    <div class="nav clearfix">
        <a href="javascript:;" class="nav-item"><img src="../m-images/index-top.png">TOP榜</a>
        <a href="javascript:;" class="nav-item"><img src="../m-images/index-new.png">每周上新</a>
        <a href="javascript:;" class="nav-item"><img src="../m-images/index-support.png">唯妮保障</a>
        <a href="javascript:;" class="nav-item"><img src="../m-images/index-gift.png">邀请有礼</a>
    </div>

    <div class="hot clearfix" v-if="indexData!={}" v-cloak>
        <h2><a href="javascript:;">Hot<span class="no-explan">热门推荐</span></a></h2>
        <ul class="clearfix">
            <li v-for="data in indexData.subject">
                <router-link :to="'/hot?themeId=' + data.id">
                    <img src="../m-images/error.jpg" v-bind:src="data.url">
                </router-link>
            </li>
        </ul>
    </div>

    <div class="global-selection">
        <h2><a href="javascript:;">Global<span class="explan">全球精选好货</span></a></h2>
        <goods-list :oneList="indexData.goodsType"></goods-list>
    </div>

    <com-loading :isLoading="isLoading"></com-loading>
    <com-end :end="!isLoading"></com-end>
    <com-footer :activeIndex='true'></com-footer>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import imgLazy from '../js/img-lazy'
import swiper from '../components/swiper'
import comFooter from "../components/comFooter"
import comEnd from '../components/comEnd'
import comLoading from '../components/comLoading'
import goodsList from '../components/goodsList'

export default {

    data () {
        return {
            indexData : {},
            isLoading: true,
        }
    },

    mounted() {
        let vue = this;
        axios.post(API.indexMo)
        .then(function(data) {
            vue.indexData = data.data;
            vue.isLoading = false;
            new lazyImg({
                extendHeight: 400
            });
        })
        .catch(function(err){
          console.log(err);
        });
    },

    methods : {},

    components : {
        swiper,
        comFooter,
        comEnd,
        comLoading,
        goodsList
    }
}
</script>

<style scoped>
@import '../css/common.css';
.body {
    padding-bottom: 45px;
}
/*banner开始*/
.banner {
    margin-top: 3.5rem;
    height: 12.083rem;
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
}
.banner .swiper-container {
    height: 100%;
}
.banner .swiper-slide a {
    display: block;
    height: 100%;
    text-align: center;
}
.banner .pagination {
    position: absolute;
    z-index: 20;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
}
.banner .swiper-pagination-switch {
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
.banner .swiper-active-switch {
    background: #9f2e33;
    border:1px solid #9f2e33;
    opacity: 1;
}
/*banner结束*/

/*nav开始*/
.nav {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:space-around;
    justify-content: space-around;
    -webkit-align-items:center;
    align-items: center;
    padding: 0.75rem 0;
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
}
.nav .nav-item {
    width: 25%;
    text-align: center;
    color: #000;
}
.nav img {
    display: block;
    margin: 0 auto .25rem;
    width: 2.083rem;
}
/*nav结束*/

/*限时抢购开始*/
.flash-sale .sale-main {
    padding: 0 1.25rem 1.25rem;
   border-bottom: 1px solid #ebebeb;
}
.flash-sale .count-down-box {
    position: relative;
    margin-top: 1rem;
    height: 1.5rem;
    border-top: 1px solid #ebebeb;
}
.flash-sale .count-down {
    position: absolute;
    top: -0.65rem;
    left: 5.4rem;
    width: 13rem;
    background-color: #fff;
    text-align: center;
}
.flash-sale .count-down span {
    color: #f34f34;
}
.sale-item-box {
    width: 100%;
    height: 9.167rem;
    border: 1px solid #e5e5e5;
    -webkit-box-shadow: 5px 5px 5px #e8e8e8;
    box-shadow: 5px 5px 5px #e8e8e8;
}
.flash-sale .sale-item-box .swiper-wrapper,
.flash-sale .sale-item-box .swiper-slide {
    width: 23.583rem;
    height: 8.708rem;
}
.flash-sale .sale-item {
    display: block;
    padding: 1.792rem 0 0 1.042rem;
}
.flash-sale .sale-goods-img {
    float: left;
    margin-right: 0.833rem;
    width: 6.25rem;
    height: 6.25rem;
    overflow: hidden;
}
.flash-sale .sale-goods-der {
    width: 12.5rem;
    height: 3rem;
    margin: .417rem 0;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #4d4d4d;
}
.flash-sale .sale-goods-price dt,
.flash-sale .sale-goods-price dd {
    float: left;
    color: #7f7f7f;
}
.flash-sale .sale-goods-price .current-price {
    text-decoration: none;
    color: #f34f34;
    font-size: 1rem;
}
.flash-sale .sale-goods-price .original-price {
    font-size: .8rem;
}
.flash-sale .pagination1 {
    position: absolute;
    z-index: 20;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
 }
.flash-sale .swiper-pagination-switch {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    opacity: 0.5;
    background-color: #bfbfbf;
    border: 1px solid #bfbfbf;
    cursor: pointer;
}
.flash-sale .swiper-active-switch {
    background: #fff;
    border:1px solid #000;
    opacity: 1;
}
/*限时抢购结束*/

/*热门推荐开始*/
.flash-sale,
.hot,
.global-selection {
    margin-top:17px;
    background-color: #fff;
    border-top: 1px solid #ebebeb;
    background-color: #fff;
}
.flash-sale h2,
.hot h2,
.global-selection h2 {
    height: 3.125rem;
    text-align: center;
    font-size: 1.167rem;
    border-bottom: 1px solid #ebebeb;
    color: #f2f2f2;
    font-size: 1.667rem;
}
.flash-sale .no-bottom {
    border-bottom: none;
}
.flash-sale h2 a,
.hot h2 a,
.global-selection h2 a {
    display: block;
    width: 10rem;
    height: 100%;
    margin: 0 auto;
    position: relative;
    color: #f2f2f2;
}
.explan,
.no-explan {
    position: absolute;
    left: 0;
    right: 0;
    top: 0.833rem;
    margin: auto;
    min-width: 5.708rem;
    font-size: 1.3rem;
    color: #000;
}
.explan:after {
    content:'';
    display: inline-block;
    margin-left: .5rem;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-left: 7px solid #1c1b21;
    border-bottom: 5px solid transparent;
}
.hot li {
    float: left;
    width: 50%;
    height: 5.75rem;
    padding: .25rem 0;
    margin-left: -1px;
    border-left: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    overflow:hidden;
}
.hot li a {
    display: block;
    height: 100%;
    overflow:hidden;
    background-color: #fff;
}
.hot li a img {
    display: block;
    margin:0 auto;
    width: 99%;
    height: 100%;
}
/*热门推荐结束*/
</style>

