<template>
<p class="com-end" v-cloak v-if="end">就到这里吧！我可是有底线的呢！</p>
</template>

<script>
export default {
    // 组件的pros相当于插件的参数,比如我们要配置这个swiper,那么就会传入一些参数，都写props里面，然后在使用该组件的时候用:attr来传入对应的参数
    props: {
        end : {
            type : Boolean,
            default : false
        }
    }
}
</script>

<style scoped>
.com-end {
    font-size: 0.75rem;
    color: #c4c4c4;
    text-align: center;
    line-height: 3.667rem;
}
</style>