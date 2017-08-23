import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import common from '../js/common'
import API from '../js/api.js'

Vue.use(Vuex)

const store = {
    state : {
        isLogin : true,
    },
    mutations : {
        checkUser( state ) {
            $.ajax({
                url : API.checkUser,
                type : 'post',
                dataType : 'json',
                anysc : false,
                success : function(data) {
                    state.isLogin = data.success;
                }
            });
        }
    }

}

export default new Vuex.Store({
    store
})