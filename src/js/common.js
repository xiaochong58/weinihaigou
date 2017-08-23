"use strict";
(function() {

    // 控制根字体大小
    var winWidth = document.body.clientWidth;
    if ( winWidth > 640 ) {
        winWidth = 640;
    }
    document.querySelector('html').style.fontSize = winWidth/640 * 24 + 'px';
    window.addEventListener('orientationchange', function(event){
        winWidth = document.body.clientWidth;
        if ( winWidth > 640 ) {
            winWidth = 640;
        }
        document.querySelector('html').style.fontSize = winWidth/640 * 24 + 'px';
    });

})();

var commonMthods = {

    getUrlPram : function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if(r!=null) {
            return  decodeURI(r[2]);
        }
        return null;
    },

    format : function(time) {
        var date = new Date(time);
        function two(day) {
            if( day<10 ) {
                return '0' + day;
            }
            return day;
        }
        return  date.getFullYear()+ '-' + two(date.getMonth()+1) + '-' +
        two(date.getDate());
    },

    testPhone : function(phone) {
        return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test( phone );
    },

    testPwd : function(pwd) {
        return /^\w{6,20}$/.test(pwd);
    },

    testVerifyCard : function(cardId) {
        return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(cardId);
    },
    // 设置Cookie
    setCookie : function(name, value) {
        var Days = .5;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + "; path=/";
    },

    // 获取Cookie
    getCookie : function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
        }
        return "";
    },

    // 删除Cookie
    delCookie : function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval= commonMthods.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    },

    toFixed : function(num, s) {
        var times = Math.pow(10, s),
            des = num * times + 0.5;
        des = parseInt(des, 10) / times;
        return des;
    }
};


$.customPop = function(options) {
        var defaults = {
            msg : '',//提示信息
            trueText : '确认',
            cancelText : '取消',
            sureCallBack : function() {},//点击确认的回调函数（可选）
        },
        html = '';
        options = $.extend({} ,defaults, options);
        html = $('<div class="pop-box"><div class="pop-bg"></div><div class="pop-main"><div class="pop-tip"><div class="tip-main">'
                + options.msg +
            '</div><div class="make-box"><a href="javascript:;" class="cancel">'
                + options.cancelText + '</a><a href="javascript:;" class="sure">'
                + options.trueText +
                '</a></div></div></div></div> ');
        $('body').append(html);
        $('.pop-box .sure').click(function() {
            setTimeout(function() {
                $('.pop-box').remove();
                options.sureCallBack();
            }, 300);
        });
        $('.pop-box .cancel').click(function() {
            setTimeout(function() {
                $('.pop-box').remove();
            }, 300);
        });
    };
    //公告提示框
    $.customTips = function(options) {
        var defaults = {
            msg : '',//提示信息
            duration : 2000//几秒后自动关闭
        },
        html = '';
        options = $.extend({} ,defaults, options);
        html = $('<div class="pop-box1"><div class="pop-bg pop-bg1"></div><div class="pop-main1"><div class="tips">'
            + options.msg +
            '</div></div></div>');
        $('body').append(html);
        setTimeout(function() {
            $('.pop-box1').remove();
        }, options.duration);
        $('.pop-main1').click(function() {
            setTimeout(function() {
                $('.pop-box1').remove();
            }, 300);
        });
    }

export default commonMthods;