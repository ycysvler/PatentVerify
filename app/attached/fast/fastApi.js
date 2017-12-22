/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import $ from 'jquery'

const FastActions = Reflux.createActions([
    'uploadImage',
    'getJobs',
    'getAllType',
    'create',
    'getResult',
    'getDetail',
    'remove'
]);

const FastStore = Reflux.createStore({
    listenables:[FastActions],

    onUploadImage:function(url,data,file,token) {
        let self = this;
        $.ajax({
            url: url,
            type: 'POST',
            data: data,dataType: "json",
            cache: false,
            contentType: false,        //不可缺参数
            processData: false,        //不可缺参数
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (result) {
                self.trigger("uploadImage", result);
            },
            error: function (msg) {
                console.log("上传失败！");
            }
        });
    },

    onRemove:function(data,token) {
        let url = Config.url + "/attached/fast/remove.ashx?";

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

    onGetJobs: function(user_id,token) {
        let url = Config.url + "/attached/fast/jobs.ashx?";
        let param = {};
        let self = this;
        param.userid = user_id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            data: param,
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (data, status) {
                if(data.code === 200) {
                    self.trigger('getJobs', data.data);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },
    onGetAllType: function(token) {
        let url = Config.url + "/attached/type/nodes.ashx?parentid=0";
        let self = this;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (data, status) {
                if(data.code === 200) {
                    self.trigger('getAllType', data.data);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },
    onCreate: function(user_id,job_name,type_ids,type_names,images,token) {
        let url = Config.url + "/attached/fast/create.ashx";
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
    onGetResult: function(jobid,typeid,token) {
        console.log('fastApi:getresult');
        let url = Config.url + "/attached/fast/result.ashx?";
        let self = this;
        let param = {
            jobid:jobid,
            typeid:typeid
        };
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            data: param,
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (data, status) {
                if(data.code === 200) {
                    self.trigger('getResult', typeid, data.data);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },
    onGetDetail: function(code,token) {
        let url = Config.url + "/attached/patent.ashx?";
        let self = this;
        let param = {
            code:code
        };
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            data: param,
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (data, status) {
                if(data.code === 200) {
                    self.trigger('getDetail', data.data);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    }
});

exports.FastActions = FastActions;
exports.FastStore = FastStore;