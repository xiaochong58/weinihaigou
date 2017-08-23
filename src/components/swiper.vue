<template>
<!-- 注意这里的swipeid，用来区分多个轮播实例 -->
<div class="swiper-container" :class="swipeId">
    <div class="swiper-wrapper">
        <div v-for="data in swiperList" class="swiper-slide">
            <a :href="data.adUrl" class="slide-item">
                <img :src="data.adImgUrl" />
            </a>
        </div>
    </div>
    <!-- 分页器 -->
    <div :class="{'swiper-pagination':pagination}"></div>
</div>
</template>
<script>
import '../js/swiper.js'
export default {
    // 组件的pros相当于插件的参数,比如我们要配置这个swiper,那么就会传入一些参数，都写props里面，然后在使用该组件的时候用:attr来传入对应的参数
    props: {
        // 数据来源
        swiperList : {
            type : Array,
            default : () => {
                return [];
            }
        },
        swipeId: {
            type: String,
            default: ''
        },
        effect: {
            type: String,
            default: 'slide'
        },
        loop: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: 'horizontal'
        },
        pagination: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Number,
            default: 5000,
        },
        paginationType: {
            type: String,
            default: 'bullets'
        },
        target : {
            type : String,
            default : ''
        }
    },
    data(){
        return {
            dom:""
        }
    },
    mounted() {
        var That = this;
        // 注意这里，一个页面可能会有多个这样的实例，所以要把每一个实例单独出来提取一个swipeid
        this.dom = new Swiper('.' + That.swipeId, {
            //循环
            loop: That.loop,
            //分页器
            pagination: '.swiper-pagination',
            //分页类型
            paginationType: That.paginationType, //fraction,progress,bullets
            //自动播放
            // autoplay: That.autoplay,
            autoplay: That.autoplay,
            //方向
            direction: That.direction,
            //特效
            effect: That.effect, //slide,fade,coverflow,cube
            autoplayDisableOnInteraction: false,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true //修改swiper的父元素时，自动初始化swiper
        })
    }
}
</script>
<style>
@import '../css/swiper.min.css';
</style>
