<template>
<div>
    <div class="header">
        <router-link to="/search" class="search-logo"></router-link>
        <router-link to="/shopCar" class="shopping-logo"><span v-html="$store.state.carCount"></span></router-link>
        <h1><img src="../m-images/logo.png" /></h1>
    </div>
    <div class="classify-main clearfix">
        <div class="classify-tab">
            <ul>
                <li class="tab-item" v-for="data in oneClassList" v-html="data.classdesc" v-bind:id="data.classid" :class="{'active' : data.classid==categoryId}" @click="change($event)"></li>
            </ul>
        </div>
        <div class="classify-con">
            <div class="con-slide" >
                <com-loading :isLoading="isLoading"></com-loading>
                <div class="classify-items" v-for="data in twoClassList" v-if="twoClassList.length>0">
                    <h2 v-html="data.name"></h2>
                    <ul class="clearfix">
                        <li v-for="goods in data.threeCategoryList">
                            <router-link :to="'/goodsResult?twoCategoryId=' + goods.id +'&twoCategoryName=' + goods.threeName" class="link-items" v-bind:id="goods.id">
                                <img v-bind:src="goods.imgUrl" />
                                <p v-html="goods.threeName"></p>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="com-no-num" v-show="noNum" v-cloak><img src="../m-images/com-no-num.png" /></div>
            </div>
        </div>
    </div>
    <com-footer :activeClassify='true'></com-footer>
</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import comLoading from '../components/comLoading'
import comFooter from "../components/comFooter"

export default {

    name : 'class',

    data () {
        return {
            oneClassList : [],//一级分类数据
            twoClassList : [],//二级分类数据
            categoryId : '',//一级页面ID
            isLoading : true,
            noNum : false,
            stagingStation : {}
        }
    },

    mounted() {
        this.getOneClassList();
    },

    methods : {

        change(e) {
            var e = e.target,
                oThis = this;
            if( oThis.categoryId == e.id ) {
                return;
            }
            oThis.categoryId = e.id;
            oThis.noNum = false;
            if( oThis.stagingStation[oThis.categoryId] ) {
                oThis.twoClassList = oThis.stagingStation[oThis.categoryId];
                if( oThis.twoClassList.length==0 ) {
                    oThis.noNum = true;
                }
            } else {
                oThis.getTwoClassList(oThis.categoryId);
            }
        },

        getOneClassList : function() {
            var oThis = this;
            axios.post(API.getCategory)
            .then(function(data) {
                var data = data.data;
                if( data.message ) {
                    oThis.oneClassList = data.classList;
                    oThis.categoryId = oThis.oneClassList[0].classid;
                    oThis.getTwoClassList(oThis.categoryId);
                }
            })
            .catch(function(err){
              console.log(err);
            });
        },

        getTwoClassList : function(categoryId) {
            var oThis = this;
            this.isLoading = true;
            this.noNum = false;
            oThis.twoClassList = [];
            $.ajax({
                type : 'post',
                url:  API.getCategoryTwo,
                data : {
                    categoryId : categoryId
                },
                dataType: 'json',
                success : function(data) {
                    if( data.message ) {
                        oThis.twoClassList = data.classTwoList;
                        oThis.stagingStation[categoryId] = data.classTwoList;
                        oThis.isLoading = false;
                        if( oThis.twoClassList.length==0 ) {
                            oThis.noNum = true;
                        }
                    }
                }
            });
        }
    },

    components : {
        comLoading,
        comFooter
    }
}
</script>

<style scoped>
html,
body {
    height: 100%;
}
.classify-main {
    height: 100%;
    padding-top: 3.5rem;
    overflow-y: hidden;
    background: #fff;
}
/*綏�捷�鏁�紮�*/
.classify-tab {
    float: left;
    padding-top: 20px;
    width: 25%;
    height: 100%;
    overflow:auto;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
}
.classify-tab .tab-item {
    margin-bottom: 1.25rem;
    line-height: 1.75rem;
    border-left: 4px solid #fff;
    text-align: center;
    color: #4d4d4d;
    font-size: 1rem;
}
.classify-tab .active {
    border-left: 4px solid #aa4f53;
    color: #aa4f53;
}
/*綏�捷�靳���*/

/*�勈捷��絎劫�紮�*/
.classify-con {
    float: right;
    width: 75%;
    height: 100%;
    overflow:hidden;
    overflow-y:auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    border-left: 1px solid #ebebeb;
}
.classify-con .con-slide {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    padding: 1.333rem 0.583rem;
}
.classify-con .con-header {
    display: block;
    height: 5.417rem;
    margin-bottom: 1.042rem;
    text-align: center;
    overflow:hidden;
}
.classify-con .con-header img {
    max-width: 100%;
    height: 100%;
}
.classify-con .classify-items {
    margin-top: 0.833rem;
}
.classify-con .classify-items h2 {
    font-size: 1.1rem;
    margin-bottom: .5rem;
}
.classify-con .classify-items li {
    float: left;
    margin-bottom: .5rem;
    width: 33.33%;
}
.classify-con .link-items {
    display: block;
    height: 7rem;
    text-align: center;
    color: #4d4d4d;
    font-size: 0.917rem;
    overflow:hidden;
}
.classify-con .link-items p {
    height: 2.4rem;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow:hidden;
    text-align: center;
}
.classify-con .link-items img {
    display: block;
    margin: 0 auto .3rem;
    width: 4rem;
    height: 4rem;
}
/*�勈捷��絎合���*/
</style>

