<template>
<div>
    <div class="com-top">
        唯妮用户注册<a href="login.html" class="com-back"><strong></strong><span>返回</span></a>
    </div>
    <div class="register">
        <div class="phone-pwd">
            <div class="phone">
                <input type="tel" placeholder="请输入11位手机号" autocomplete="off" v-model="mobile.value"/>
            </div>
            <div class="pwd">
                <input type="password" placeholder="请输入6-20位登录密码" autocomplete="off" v-model="password.value" id="pwd"/>
                <a href="javascript:;" class="show-pwd" v-on:click="isShowPwd()">显 示</a>
            </div>
        </div>
        <div class="verification">
            <input type="text" placeholder="请输入短信验证码" v-model="code.value">
            <a href="javascript:;" class="get-verification" v-on:click="getCode()">获取短信验证码</a>
        </div>
        <a href="javascript:;" class="com-next" v-on:click="register()">立即注册</a>
        <router-link to="login" class="has-account">已有唯妮账户></router-link>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'
export default {

    name : 'register',

    data () {
        return {
            mobile : {value:'', success:false, errorInfo: '手机号为空或者格式不正确'},
            password: {value:'', success:false, errorInfo: '密码为空或者格式不正确（长度在6-20位之间）'},
            code : {value:'', success:false, errorInfo: '手机验证码为空'},
        }
    },

    methods : {

        isShowPwd : function() {
            var pwd = $('#pwd'),
                showPwd = $('.show-pwd');
            if( pwd.attr('type')==='password' ) {
                showPwd.text('隐 藏');
                pwd.attr('type', 'text');
            } else {
                showPwd.text('显 示');
                pwd.attr('type', 'password');
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
        checkCode : function() {
            if( $.trim(this.code.value) !== '' ) {
                this.code.success = true;
            } else {
                this.code.success = false;
                $.customTips({
                    msg : this.code.errorInfo
                });
            }
        },
        checkPassword: function() {
            if( /^\w{6,20}$/.test($.trim(this.password.value)) ) {
                this.password.success = true;
            } else {
                this.password.success = false;
                $.customTips({
                    msg : this.password.errorInfo
                });
            }
        },
        getCode : function() {
            var oThis = this,
                btn = $(".get-verification");
            this.checkMobile();
            if( this.mobile.success ) {
                if( !btn.hasClass('disabled') ) {
                    $.ajax({
                        type: "POST",
                        url:  API.sendMoRandmoCode,
                        data: {
                            mobile : oThis.mobile.value,
                            type : '2'
                        },
                        dataType: 'json',
                        success: function (data) {
                            var flag = data.msg,
                                curCount = 60,
                                timer = null;
                            if( flag == '00000000' ) {
                                btn.addClass('disabled');
                                btn.text(curCount + '秒后重新发');
                                timer = setInterval(function() {
                                    if( curCount === 0 ) {
                                        clearInterval(timer);
                                        btn.removeClass('disabled').text('获取短信验证码');
                                    } else {
                                        curCount--;
                                        btn.text(curCount + '秒后重新发');
                                    }
                                } ,1000);
                            } else if ( flag=='00000005' ) {
                                $.customTips({
                                    msg : '手机号已经被注册'
                                });
                            } else if ( flag=='000000019' ) {
                                $.customTips({
                                    msg : '短信验证码发送次数已达上线'
                                });
                            } else if ( flag=='00000007' ) {
                                $.customTips({
                                    msg : '手机号格式错误'
                                });
                            } else if ( flag=='00000001' ) {
                                $.customTips({
                                    msg : '验证码发送失败'
                                });
                            }
                        }
                    });
                }
            }
        },

        register : function() {
            this.checkMobile();
            if( this.mobile.success ) {
                this.checkPassword();
                if( this.password.success ) {
                    var oThis = this;
                    $.ajax({
                        type: "post",
                        url:  API.userRegister,
                        data: {
                            mobile : oThis.mobile.value,
                            password : oThis.password.value,
                            code : oThis.code.value,
                            shareCode : ''
                        },
                        dataType: 'json',
                        success: function (data) {
                            var msg = data.msg;
                            if(msg=="00000000") {
                                $.customTips({
                                    msg : '恭喜你，注册成功啦 ^!^'
                                });

                                oThis.$router.push('index');
                            } else if(msg=="00000001") {
                                $.customTips({
                                    msg : '很抱歉，注册失败'
                                });
                            } else if (msg=="00000005") {
                                $.customTips({
                                    msg : '手机号已经被注册'
                                });
                            } else if (msg=="00000006") {
                                $.customTips({
                                    msg : '短信验证码错误'
                                });
                            }
                        }
                    });
                }
            }
        }
    },
    components : {
    }
}
</script>

<style scoped>
/*娉ㄥ唽寮€濮�*/
.register {
    padding: 1.333rem;
}
.register .phone-pwd {
    border:1px solid #b5b5b5;
    padding: 15px;
    background-color: #fff;
}
.register  .phone {
    height: 2.5rem;
    border-bottom: 1px solid #eee;
    padding-left: 1.875rem;
    background:url(../m-images/icon.png) 0 0.308rem no-repeat;
    background-size: 18.875rem 14.167rem;
}
.register .phone input,
.register .pwd input {
    width: 15rem;
    height: 2rem;
    border:none;
    font-size: 1rem;
}
.register .phone-pwd .pwd {
    height: 1.8rem;
    padding-left: 1.875rem;
    padding-top: 0.833rem;
    border-bottom: none;
    background:url(../m-images/icon.png) 0 -3.5rem no-repeat;
    background-size: 18.875rem 14.167rem;
    box-sizing:content-box;
}
.register .show-pwd {
    float: right;
    font-size: 0.917rem;
    color: #535353;
    padding:0.417rem 0.625rem;
    background:#dddcdc;
    -webkit-border-radius:3px;
    border-radius: 3px;
}
.register .identify,
.register .verification {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    margin-top: 0.75rem;
    height: 3.333rem;
}
.register .identify input,
.register .verification input {
    width: 60%;
    padding: 0 15px;
    border:1px solid #b5b5b5;
    border-radius: 0;
    font-size: 1rem;
}
.register .identify a,
.register .verification a {
    width: 35%;
}
.register .verification .get-verification {
    background-color: #363539;
    color: #fff;
    font-size: 0.917rem;
    text-align: center;
    line-height: 3.333rem;
    -webkit-border-radius:3px;
    border-radius: 3px;
}
.register .verification .disabled {
    background: #b1b1b1;
    color: #fff;
    cursor: not-allowed;
    font-size: 1rem;
}
.register .tips {
    margin-top: 0.75rem;
    font-size: 0.9rem;
}
.register .tips a {
    color: #f48679;
}
.register .has-account {
    display: block;
    padding-top: 10px;
    text-align: center;
    color: #9f2e33;
}
/*娉ㄥ唽缁撴潫*/

/*鎵惧洖瀵嗙爜寮€濮�*/
.register .back-phone {
    height: 3.333rem;
    padding: 0 15px 0 2.5rem;
    border: 1px solid #b5b5b5;
    border-radius: 0;
    font-size: 1rem;
    background-color: #fff;
    background:#fff url(../m-images/icon.png) 1rem .85rem no-repeat;
    background-size: 18.875rem 14.167rem;
}
.register .back-phone input {
    height: 100%;
    font-size: 1rem;
    border: none;
}
.register .pwd-input {
    width: 100%;
    height: 3.333rem;
    padding: 0 15px;
    border: 1px solid #b5b5b5;
    margin-top: 0.75rem;
    font-size: 1rem;
    border-radius: 0;
}
.register .register-success {
    margin-bottom: 5.958rem;
    text-align: center;
}
.register .register-success p {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 4.0rem 0 2.583rem;
}
.register .register-success img {
    width: 5.625rem;
}
/*鎵惧洖瀵嗙爜缁撴潫*/

.success-tips {
    margin-top: 8rem;
    color: #605f62;
    line-height: 1.6;
}
.success-tips h2 {
    font-size: 1.083rem;
}
.success-tips p {
    font-size: 0.917rem;
}
</style>

