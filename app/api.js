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
    currentUser:{"userid":"4dd3562851d641b09f78e074d672a221","username":"admin","password":"","cname":"管理员","icon":"/upload/admin/4dd3562851d641b09f78e074d672a221.png","token":"6414fcda6e9f40479fc1b16c2c45ddac"},

    onGetIndexes: function() {
        let url = Config.url + "/systems/menus.ashx?";
        let param = {};
        let self = this;

        console.log('userid', this.currentUser.userid);

        param.userid = this.currentUser.userid;
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
        url = Config.base + "/api/system/login";
        let param = {
            username: username,
            password: password
        };
        $.ajax({
            url: url,
            type: 'POST',
            data: param,
            success: function (data, status) {
                if(data.code === 200) {
                    self.currentUser = data.data;
                    console.log(data);
                    self.trigger('signin',data.data);
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