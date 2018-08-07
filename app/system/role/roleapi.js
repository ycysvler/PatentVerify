/**
 * Created by VLER on 2017/7/25.
 */
/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import $ from 'jquery'
import Config from 'config';

const RoleActions = Reflux.createActions([
    'create',
    'list',
    'single',
    'remove'
]);

const RoleStore = Reflux.createStore({
    listenables:[RoleActions],

    onCreate: function(info) {
        let url = Config.base + "/api/system/roles";
        let self = this;
        let param = info;

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(param),
            cache: false,
            processData: false,        //不可缺参数
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            beforeSend: function (xhr) {
            },
            success: function (data,status) {
                self.trigger("create",data.data)
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },

    onRemove:function(data) {
        let url = Config.base + "/api/system/roles";
        let param = data;

        console.log('param', param);

        let self = this;
        $.ajax({
            url: url,
            type: 'DELETE',
            data:JSON.stringify(param),
            dataType: "json",
            cache: false,
            processData: false,        //不可缺参数
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
            },
            success: function (result) {
                self.trigger("remove", result);
            },
            error: function (msg) {
                console.log("删除失败！");
            }
        });
    },


    onList: function() {
        let url = Config.base + "/api/system/roles";

        let self = this;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            beforeSend: function (xhr) {

            },
            success: function (data, status) {
                self.trigger("list", data);
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    }

});

exports.RoleActions =  RoleActions;
exports.RoleStore =  RoleStore;