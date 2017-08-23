<!-- loading组件 -->
<template>
<div class="com-loading" v-show="isLoading">
    <img src="../m-images/loading.gif" />
</div>
</template>
<script>
export default {
    props : {
        isLoading : {
            type : Boolean,
            default : true
        }
    },
    methods : {

    }
}
</script>
