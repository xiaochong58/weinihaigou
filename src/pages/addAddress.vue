<template>
<div class="address-box">
    <div class="header clearfix">
        <a href="javascript:;" class="complete" v-on:click="addAddress()">完成</a>
        <h1>添加地址</h1>
        <a href="javascript:;" class="header-back" v-on:click="back()"></a>
    </div>
    <div class="add-item name-item">
        <input type="text"  placeholder="真实姓名" v-model="realName.value" />
    </div>
    <div class="add-item">
        <input type="tel"  placeholder="手机号码" v-model="mobile.value" />
    </div>
    <div class="add-item">
        <select name="province" class="info" v-model="province.value" id="pro"></select>
        <select name="city" class="info" v-model="city.value" id="city"></select>
        <select name="area" class="info" v-model="county.value" id="area"></select>
    </div>
    <div class="address-details-item">
        <textarea placeholder="详细信息" v-model="detailsAddress.value"></textarea>
    </div>
    <div class="default-address">
        <a href="javascript:;" class="default" :class="{active : flag==1}" v-on:click="isDefault()"><i></i><span>设置为默认地址</span></a>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
import address from '../js/address.js'
import comLoading from '../components/comLoading'

export default {

    name : 'address',

    data () {
        return {
            realName : {value:'', success:false, errorInfo: '请输入真实姓名'},
            mobile : {value:'', success:false, errorInfo: '手机号为空或者格式不正确'},
            cardId : {value:'', success:false, errorInfo: '身份证号为空或者格式不正确'},
            province : {value:'', success:false, errorInfo: '请选择地址'},
            city : {value:'', success:false, errorInfo: '请选择地址'},
            county : {value:'', success:false, errorInfo: '请选择地址'},
            detailsAddress : {value:'', success:false, errorInfo: '请输入详细地址'},
            flag : 0,
            from : this.$route.query.fromAddress
        }
    },

    mounted() {
        var oThis = this;
        if ( !this.$store.state.isLogin ) {
            this.$router.push('login');
        }

        new address({
            pro : document.querySelector('#pro'),
            city : document.querySelector('#city'),
            area : document.querySelector('#area'),
        });
    },

    methods : {

        back() {
            if( this.from=='1' ) {
               this.$router.push('address?fromAddress=' + this.from);
            } else {
               this.$router.push('address');
            }
        },

        isDefault() {
            this.flag == 1 ? this.flag = 0 : this.flag = 1;
        },

        checkRealName : function() {
            if( $.trim(this.realName.value) ) {
                this.realName.success = true;
            } else {
                this.realName.success = false;
                $.customTips({
                    msg : this.realName.errorInfo
                });
            }
        },
        checkMobile: function() {
            if( /^0?1[3|4|5|7|8][0-9]\d{8}$/.test($.trim(this.mobile.value)) ) {
                this.mobile.success = true;
            } else {
                this.mobile.success = false;
                $.customTips({
                    msg : this.mobile.errorInfo
                });
            }
        },
        checkCardId : function() {
            if( /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test($.trim(this.cardId.value)) ) {
                this.cardId.success = true;
            } else {
                this.cardId.success = false;
                $.customTips({
                    msg : this.cardId.errorInfo
                });
            }
        },
        checkAreaName : function() {
            if( $.trim(this.province.value) ) {
                this.province.success = true;
            } else {
                this.province.success = false;
                $.customTips({
                    msg : this.province.errorInfo
                });
            }
        },
        checkdetailsAddress : function() {
            if( $.trim(this.detailsAddress.value) ) {
                this.detailsAddress.success = true;
            } else {
                this.detailsAddress.success = false;
                $.customTips({
                    msg : this.detailsAddress.errorInfo
                });
            }
        },
        addAddress : function() {
            var  oThis = this;
            this.checkRealName();
            if( this.realName.success ) {
                this.checkMobile();
                if( this.mobile.success ) {
                    this.checkAreaName();
                    if( this.province.success ) {
                        this.checkdetailsAddress();
                        if( this.detailsAddress.success ) {
                            $.ajax({
                                type : "POST",
                                url :  "/api/user/insertAddr.shtml",
                                dataType : 'json',
                                data:{
                                    area_name : $('#province').val() + ' ' + $('#city').val() + ' ' + $('#area').val(),//省县市
                                    address:oThis.detailsAddress.value,//详细地址
                                    person_name:oThis.realName.value,//真实姓名
                                    serv_num:oThis.mobile.value,//手机号
                                    card_no:oThis.cardId.value,//身份证
                                    flag:oThis.flag//是否设为默认地址
                                },
                                success : function(data) {
                                    if( data.success ) {
                                        $.customTips({
                                            msg : '新增地址成功！'
                                        });
                                        oThis.back();
                                    } else {
                                        $.customTips({
                                            msg : '新增地址失败！'
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    },

    components : {
    }
}
</script>

<style scoped>
.address-box {
    padding-top: 3.5rem;
}
.complete {
    position:absolute;
    top: 1.2rem;
    right: .875rem;
    color: #ff4b4b;
    font-size: 0.917rem;
}
.hot-tips {
    padding-left: 1.333rem;
    line-height: 2.0rem;
    color: #ff4b4b;
    font-size: 0.833rem;
}
.add-item {
    height: 2rem;
    padding: .75rem 1.333rem;
    background: #fff;
    box-sizing: content-box;
    border-bottom: 1px solid #ebebeb;
}
.address-details-item {
    height:3.25rem;
    padding: .75rem 1.333rem;
    background: #fff;
    box-sizing: content-box;
    border-bottom: 1px solid #ebebeb;
}
.address-details-item textarea {
    width: 100%;
    height: 100%;
    border:none;
    padding:0;
    overflow-y: auto;
    font-size: 1.1rem;
}
.add-item input {
    width: 80%;
    height: 2rem;
    line-height: 2rem;
    border: none;
    font-size: 1.1rem;
}
.add-item select {
    height: 100%;
    border: none;
    font-size: 1.1rem;
}
.name-item {
    border-bottom: none;
    margin-bottom: 0.708rem;
}
.no-bottom {
    border-bottom: none;
}
.default-address {
    margin-top: 0.708rem;
    height: 2rem;
    padding: .75rem 1.333rem;
    background: #fff;
    box-sizing: content-box;
}
.default-address .default {
    display: block;
    padding-top: .4rem;
    height: 2rem;
    color: #000;
}
.default-address span {
    vertical-align: middle;
}
.default-address .default i, .default-address .active i {
    display: inline-block;
    vertical-align: middle;
    margin-right: .4rem;
    width: 1.4rem;
    height: 1.4rem;
    background: url(../m-images/pay.png) no-repeat 0 -9.8rem;
    background-size: 16.667rem 16.667rem;
}
.default-address .active i {
    background-position: 0 -13.65rem;
}
.tips {
    width: 25.0rem;
    margin:1.0rem auto;
    background: #f1e1c9;
    padding: 0.833rem;
}
.tips p {
    text-decoration: underline;
    line-height: 1.8;
}
</style>

