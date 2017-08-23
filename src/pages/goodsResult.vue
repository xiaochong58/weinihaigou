<template>
<div class="goods-box">
    <div class="search-wrap" v-if="$route.query.keyword">
        <div class="search-main">
            <a href="javascript:history.go(-1)" class="header-back"></a>
            <router-link to="/search"><div class="search-box search-tips" v-html="$route.query.keyword"></div></router-link>
        </div>
    </div>

    <div class="header" v-if="$route.query.twoCategoryId">
        <a href="javascript:history.go(-1)" class="header-back"></a>
        <h1 v-html="$route.query.twoCategoryName"></h1>
    </div>

     <div class="header" v-if="$route.query.brandId">
        <a href="javascript:history.go(-1)" class="header-back"></a>
        <h1 v-html="$route.query.brandName"></h1>
    </div>

    <div class="goods-sort-box">
        <div class="com-goods-sort">
            <a href="javascript:;" class="items" data-sort="xl">销量</a>
            <a href="javascript:;" class="items" data-sort="sj">售价</a>
            <a href="javascript:;" class="items" data-sort="kc">库存量</a>
            <a href="javascript:;" class="items" data-sort="sjsj">上架时间</a>
        </div>
    </div>
    <goods-list :queryParams="queryParams" :queryApi="queryApi" ref="goodsList"></goods-list>
</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import goodsList from '../components/goodsList'

export default {

    data () {
        return {
            queryParams : {
                page : 1,//第几页
                sort : 'empty',//排序类型
                order : '',//1：升；0：降
                keyword : this.$route.query.keyword,
                twoCategoryId : this.$route.query.twoCategoryId,
                brandId: this.$route.query.brandId
            },
            queryApi : API.searchGoods
        }
    },

    mounted() {

        var oThis = this;

        // 条件筛选
        $('.com-goods-sort a').click(function() {
            var that = $(this),
                flag = 0,
                sort = that.attr('data-sort'),
                className = that.attr('class');
            oThis.queryParams.page = 1,
            oThis.queryParams.sort = sort;

            // 升降序
            if( that.hasClass('up') ) {
                flag = 1;
                oThis.queryParams.order = 0;
            } else if ( that.hasClass('down') ) {
                flag = 2;
                oThis.queryParams.order = 1;
            } else {
                oThis.queryParams.order = 0;
            }

            if ( sort=='xl'&&flag==2 ) {
                return;
            }

            // 样式控制
            $('.com-goods-sort a').removeClass('active up down');
            if ( flag===1&&sort!='xl' ) {
                that.removeClass('up').addClass('active down');
            } else if ( flag===2 ) {
                that.removeClass('down').addClass('active up');
            } else {
                that.addClass('active').addClass('down');
            }
            oThis.initGoodList();
        });

    },

    methods : {
        initGoodList() {
            this.$refs.goodsList.getGoodsList();
        }
    },

    components : {
        goodsList
    }
}
</script>

<style scoped>
.goods-box {
    margin-top: 6.5rem;
}
/*搜索框开始*/
.search-wrap {
    position:fixed;
    z-index: 66;
    width: 100%;
    left: 0;
    top: 0;
    height:3.417rem;
    border-bottom: 1px solid #ebebeb;
    background-color: #fff;
}
.search-wrap .search-main {
    position: relative;
    max-width: 640px;
    margin: 0 auto;
}
.search-wrap .search-box {
    position: absolute;
    left: 3rem;
    top: .56rem;
    width: 21rem;
    height: 2.292rem;
    background: #f4f4f4;
    border-radius: 4px;
    color: #333;
    line-height: 2.292rem;
}
.search-wrap .search {
    width: 80%;
    margin-top: .4rem;
    margin-left: 1rem;
    height: 1.6rem;
    line-height: 1.6rem;
    border:none;
    background: #f4f4f4;
}
.search-wrap .search-btn {
    float: right;
    margin-right: .8rem;
    margin-top: 1.2rem;
    width: 1.167rem;
    height: 1.167rem;
    background: url(../m-images/icon2.png) no-repeat 0 0;
    background-size:400px 400px;
    vertical-align: middle;
}
.search-wrap .response-box {
    position: absolute;
    left: 0;
    top: 3.417rem;
    width: 100%;
    background-color: #fff;
}
.search-wrap .response-box li {
    padding-left: 1rem;
    border-bottom: 1px solid #ebebeb;
}
.search-wrap .response-box a {
    display: block;
    line-height: 2.708rem;
    color: #000;
}
.search-wrap .empty-search {
    float: right;
    margin-top: .5rem;
    margin-right: 1rem;
    width: 1.4rem;
    height: 1.4rem;
    background:  url(../m-images/icon2.png) no-repeat 0 -3.958rem;
    background-size: 33.333rem 33.333rem;
}
/*搜索框结束*/

/*搜索结果页面*/
.goods-sort-box {
    position: fixed;
    z-index: 66;
    left: 0;
    top: 3.417rem;
    width: 100%;
    background-color: #fff;
}
.search-wrap .search-tips {
    padding-left: 2.5rem;
    background: #f4f4f4 url(../m-images/icon2.png) no-repeat 0.625rem 0.5rem;
    background-size: 33.333rem 33.333rem;
    line-height: 2.4rem;
}
.margin-top1 {
    margin-top: 7rem;
}
.margin-top {
    margin-top: 15rem !important;
}
</style>

