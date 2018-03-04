/**
 * Created by VLER on 2017/7/25.
 */
/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import $ from 'jquery'

const UserActions = Reflux.createActions([
    'create',
    'list',
    'single',
    'remove'
]);

const UserStore = Reflux.createStore({
    listenables:[UserActions],

    onCreate: function(user_id,job_name,type_ids,type_names,images,jobtype,token) {
        let url = window.server_address + "/locarno/create.ashx?jobtype=" + jobtype;
        let self = this;
        let param = {
            userid:user_id,
            jobname:job_name,
            typeids:type_ids,
            typenames:type_names,
            images:images
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(param),
            cache: false,
            contentType: false,        //不可缺参数
            processData: false,        //不可缺参数
            dataType:"json",
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (data,status) {
                self.trigger("create",data.data)
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },

    onRemove:function(data,token) {
        let url = window.server_address + "/locarno/remove.ashx?";

        let self = this;
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: "json",
            cache: false,
            contentType: false,        //不可缺参数
            processData: false,        //不可缺参数
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
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
        let url = window.server_address + "/systems/users.ashx";

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

exports.UserActions =  UserActions;
exports.UserStore =  UserStore;