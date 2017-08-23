<template>
<div>
    <div class="header clearfix">
        <h1>我的收藏</h1>
        <a href="/m-html/my/my.html" class="header-back"></a>
    </div>
    <div v-if="list.length">
        <div class="my-collection" v-for="data in list" v-cloak>
            <a href="/m-html/goods/goods-details.html?goodsNo={{data.goodsNo}}&goodsName={{encodeURI(data.goodsName2)}}" v-bind:id="data.goodsNo" class="item">
                <div class="goods-img-box">
                    <div v-show="data.isShow==0||data.status!=1" class="no-goods" v-bind:class="{'opacity':(data.isShow==0||data.status!=1)}">已下架
                    </div>
                    <div v-else>
                    <div v-if="data.count<0||data.count==0" class="no-goods"  v-bind:class="{'opacity':(data.isShow==0||data.status!=1)}">已抢光</div>
                    </div>
                    <div class="goods-img">
                        <img v-bind:src="data.imgUrl2" width="100%">
                    </div>
                </div>
                <div class="goods-der">
                   <p> <span class="activity" v-html="data.couponPolicyName" v-if="data.couponPolicyName &&getNowTime(nowTime) > getNowTime(data.startTime) && getNowTime(nowTime) < getNowTime(data.endTime)"></span>
                    <span v-html="data.goodsName2"></span></p>
                    ¥<ins class="current-price" v-html="data.skuPrice.toFixed(2)"></ins>
                </div>
                <i class="com-right-tip"></i>
            </a>
        </div>
    </div>
    <div v-if="noNum" class="com-no-num margin-top no-collection" v-cloak><img src="/m-images/no-collection.png" /></div>
    <div class="com-loading" v-show="isLoading">
        <img src="/m-images/loading.gif" />
    </div>
    <p class="com-end" v-show="end" v-cloak>就到这里吧！我可是有底线的呢！</p>

</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
export default {

    name : 'search',

    data () {
        return {
            searchKey : '',//搜索词
            responseList : [],//按键感应内容
            hotSearch : [],//热搜词
            history : [],//历史记录
            lastGo : true,
            linkContent : ''//默认搜索
        }
    },

    mounted() {

       var oThis = this;

        // 获取默认搜索
        this.getTextSearch();

        // 非无痕模式取本地存储
        if( this.storageTest(window.localStorage) ) {
            // 获取历史记录数据
            var storage = window.localStorage,
               obj = new Object();
            if( storage.getItem('nisu') == '{}' ) {
                storage.setItem('nisu', JSON.stringify(obj));//对象转字符串
            }
            this.getHistory();
        }

        // 获取热门搜索数据
        this.getHotList();
    },

    // 监听搜索词变化
    watch : {
        searchKey :function() {
            this.getResponseData();
        }
    },

    methods : {

        // 判断是不是无痕模式
        storageTest : function(storage) {
            if(!!storage) {
                try {
                    storage.setItem("key", "value");
                    storage.removeItem("key");
                    return true;
                } catch(e) {
                    return false;
                }
            } else {
                return false;
            }
        },

        // 默认搜索
        getTextSearch : function() {
            var oThis = this;
            this.responseList = [];
            axios.post(API.getTextSearch)
            .then(function(data) {
                var data = data.data;
                if( data.message ) {
                    if( data.list.length>0 ) {
                        oThis.linkContent = data.list[0]['linkContent'];
                    }
                }
            })
            .catch(function(err){
              console.log(err);
            });
        },

        // 按键精灵
        getResponseData : function() {
            var oThis = this;
            if( this.lastGo ) {
                this.lastGo = false;
                axios.post(API.hotSearch, {
                    keyword : oThis.searchKey
                })
                .then(function(data) {
                    if( data.message ) {
                            oThis.responseList = data.data;
                        } else {
                            oThis.responseList = [];
                        }
                })
                .catch(function(err){
                  console.log(err);
                });
            }
        },

        // 清除搜索关键词
        clearSearch : function() {
            this.searchKey = '';
            this.responseList = [];
        },

        // 获取热门搜索数据
        getHotList : function() {
            var oThis = this;
            axios.post(API.getHotSearch)
            .then(function(data) {
                if( data.data.message ) {
                   oThis.hotSearch = data.data.hotList;
                }
            })
            .catch(function(err){
              console.log(err);
            });
        },

        // 跳转到搜索结果
        go : function(e) {
            var dom = e.target,
                oThis = this;
            oThis.searchKey = dom.innerText;
            if( this.searchKey.trim()==='' ) {
                this.$router.push({ path: 'goodsResult', query: { keyword : this.linkContent }});
                return;
            }
            if ( this.storageTest(window.localStorage) ) {
                this.setHistory(this.searchKey);
            }
            oThis.responseList = [];
            this.$router.push({ path: 'goodsResult', query: {  keyword : oThis.searchKey }});
            oThis.searchKey = '';
        },

        go1 : function() {
            if( this.searchKey=='' ) {
                this.searchKey = this.linkContent;
            }
            this.$router.push({ path: 'goodsResult', query: {  keyword : this.searchKey }});
        },

        // 设置历史记录
        setHistory : function(strKey) {
            var nowtime = (new Date()).getTime(),
            storage = window.localStorage,
            obj = JSON.parse(storage.getItem('nisu'));//字符串转对象
            obj[strKey] = nowtime;
            storage.setItem('nisu', JSON.stringify(obj));//对象转字符串
        },

        // 获取历史记录
        getHistory : function() {
            var storage = window.localStorage,
                length = 10,
                arr = [],
                obj = {},
                newObj = {};
            obj = JSON.parse(storage.getItem('nisu'));//字符串转对象
            for(var x in obj) {
                arr.push(obj[x]);
            }
            arr.sort(function(a, b) {
                return b-a;
            });
            arr.length>=10 ? length = 10 : length = arr.length;
            for(var i=0; i<length; i++) {
                for(var x in obj) {
                    if( obj[x]===arr[i] ) {
                        this.history.push({q : x});
                        newObj[x] = arr[i];
                    }
                }
            }
            storage.setItem('nisu', JSON.stringify(newObj));//对象转字符串
        },

        // 清除历史记录
        removeHistory : function() {
            if( this.storageTest(window.localStorage) ) {
                this.history = [];
                window.localStorage.removeItem('nisu');
                var storage = window.localStorage,
                    obj = new Object();
                storage.setItem('nisu', JSON.stringify(obj));//对象转字符串
            }
        },

        throttle : function(method, context) {
            clearTimeout(method.tId);
                method.tId = setTimeout(function(){
                    method.call(context);
            }, 200);
        }
    },

    components : {


    }
}
</script>

<style scoped>
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

/*热门搜索开始*/
.hot-search {
    margin-top: 3.417rem;
    padding: 1rem;
    background-color: #fff;
}
.hot-search .hot-items li {
    float: left;
    margin: 10px 10px 0 0;
}
.hot-search .hot-items a {
    display: block;
    padding: 5px 10px;
    line-height: 1.2rem;
    background-color: #f1f1f1;
    color: #3b3b3b;
    border-radius: 3px;
}
/*热门搜索结束*/

/*历史记录开始*/
.history {
    margin-top: 0.708rem;
    background-color: #fff;
}
.history .history-header {
    padding: 0 1rem;
    line-height: 3.125rem;
    border-bottom: 1px solid #ebebeb;
}
.history .empty-history {
    float: right;
    margin-top: 0.833rem;
    padding: 0.208rem 0.417rem;
    color: #b3b3b3;
    line-height: 1;
    border:1px solid #b3b3b3;
    border-radius: 2px;
}
.history .history-items {
    padding-left: 1rem;
}
.history .history-items li {
    line-height: 2.5rem;
    border-bottom: 1px solid #ebebeb;
}
.history .history-items a {
    display: block;
    color: #3b3b3b;
}
/*历史记录结束*/

</style>

