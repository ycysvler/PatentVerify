/**
 * Created by xiaoshilei on 2017/3/15.
 */
import Reflux from 'reflux';
import $ from 'jquery'
import Config from 'config';

const IndexActions = Reflux.createActions([
    "getIndexes",
    "login"
]);

const IndexStore = Reflux.createStore({
    listenables:[IndexActions],
    currentUser:null,

    onGetIndexes: function(userid,token) {
        let url = Config.url + "/systems/menus.ashx?";
        let param = {};
        let self = this;
        param.userid = userid;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            data: param,
            beforeSend: function (xhr) {
               // xhr.setRequestHeader("Authorization",token);
            },
            success: function (data, status) {
                let action = 'getIndexes';
                self.trigger(action, data);
            },
            error: function (reson) {
                console.log(reson);
            }
        });
    },

    onLogin: function(username,password) {
        let self = this;
        let url = Config.url  + "/systems/login.ashx";
        let param = {
            username: username,
            password: password
        };
        $.ajax({
            url: url,
            type: 'POST',
            data: param,
            success: function (data, status) {
                if(JSON.parse(data).code === 200) {
                    self.currentUser = JSON.parse(data).data;
                    console.log(data);
                    self.trigger('signin',JSON.parse(data).data);
                }
            },
            error: function (reson) {
                console.log(reson);
            }
        });
    }
});

exports.IndexActions = IndexActions;
exports.IndexStore = IndexStore;