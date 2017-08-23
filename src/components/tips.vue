<template>
<div class="com-tips-box" v-show="isShow1">
    <div v-html="msg" class="com-tips-con"></div>
</div>
</template>

<script>
export default {
    props: ['msg', 'isShow'],
    data : function() {
        return  {
            isShow1 : this.isShow
        }
    },
    mounted : function() {
        let vue = this;
        console.log(this.msg);
        setTimeout(()=> {
            vue.isShow1 = false;
        }, 3000);
    }
}
</script>

<style>
.com-tips-box {
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    -webkit-justify-content: center;
    justify-content: center;
    align-items: center;
    -webkit-align-items: center;
}
.com-tips-con {
    background: #333;
    padding: 1rem;
    opacity: .9;
    color: #fff;
    border-radius: 6px;
}
</style>