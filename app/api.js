/**
 * Created by xiaoshilei on 2017/3/15.
 */
import Reflux from 'reflux';
import $ from 'jquery'

const IndexActions = Reflux.createActions([
    "getIndexes",
    "login"
]);

const IndexStore = Reflux.createStore({
    listenables:[IndexActions],

    cuttentUser:null,
    //cuttentUser:{userid: "4dd3562851d641b09f78e074d672a221", username: "admin",  cname: "管理员", icon: "/upload/admin/4dd3562851d641b09f78e074d672a221.png"},

    onGetIndexes: function(userid,token) {
        let url = window.server_address + "/systems/menus.ashx?";
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
        let url = window.server_address  + "/systems/login.ashx";
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
                    self.cuttentUser = JSON.parse(data).data;
                    self.trigger(JSON.parse(data).data);
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