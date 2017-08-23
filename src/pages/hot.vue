<template>
<div>
     <div class="header clearfix">
        <a href="/m-html/goods/shop-car.html" class="shopping-logo"></a>
        <h1>热门推荐</h1>
        <a href="javascript:history.go(-1)" class="header-back"></a>
    </div>
    <div class="banner">
        <img v-bind:src="bannerImgUrl.adImgUrl" onerror='this.src="../m-images/error.jpg"' />
    </div>
    <goods-list :queryParams="queryParams" :queryApi="queryApi" ></goods-list>
</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import comEnd from '../components/comEnd'
import comLoading from '../components/comLoading'
import goodsList from '../components/goodsList'

export default {

    name : 'hot',

    data () {
        return {
            queryParams : {
                pageNum : 1,
                themeId : parseInt(this.$route.query.themeId),
            },
            queryApi : API.theme,
            bannerImgUrl : []
        }
    },

    mounted() {
        var oThis = this;
        this.getBanner();
    },

    methods : {

        getBanner : function() {
            var oThis = this;
            $.ajax({
                type : 'post',
                url:  API.themeBanner,
                dataType: 'json',
                data : {
                    themeId : this.$route.query.themeId
                },
                success : function(data) {
                    console.log(data);
                    if( data.message ) {
                        oThis.bannerImgUrl = data.bannerList[0];
                    }
                }
            });
        }
    },

    components : {
        comEnd,
        comLoading,
        goodsList
    }
}
</script>

<style scoped>
/*banner寮€濮�*/
.banner {
    margin-top: 3.5rem;
    height: 10.417rem;
    overflow: hidden;
    text-align: center;
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
}
.banner img {
    max-width: 100%;
}
/*banner缁撴潫*/

/*鍊掕鏃跺紑濮�*/
.count-down-margin {
    margin-top: 4rem;
}
.count-down-box {
    position: relative;
    height: 2.583rem;
    background-color:#f5f5f5;
    color: #5e5e5e;
}
.count-down-bg {
    position: absolute;
    width: 23.917rem;
    top: 1.3rem;
    left: 1.2rem;
    border-top: 1px solid #ebebeb;
    background-color: #f5f5f5;
}
.count-down {
    position: absolute;
    top: -0.65rem;
    left: 2.7rem;
    width: 18rem;
    background-color: #f5f5f5;
    text-align: center;
}
.count-down span {
    color: #f34f34;
}
.activity-instruction {
    line-height: 3.667rem;
    text-align: center;
    border-bottom: 1px solid #ebebeb;
}
/*鍊掕鏃剁粨鏉�*/
</style>

