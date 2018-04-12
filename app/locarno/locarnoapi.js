/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import $ from 'jquery';
import Config from 'config';
import {IndexStore} from '../api';
const LocarnoActions = Reflux.createActions([
    'uploadImage',
    'cutImage',
    'getJobs',
    'getAllType',
    'create',
    'getResultImages',
    'getResultPatents',
    'getZoneResult',
    'getDetail',
    'remove',
    'getPatent'
]);

const LocarnoStore = Reflux.createStore({
    listenables:[LocarnoActions],

    onUploadImage:function(data) {
        let self = this;
        let url = Config.url + "/uploadimages.ashx?username=" + IndexStore.currentUser.username;
        url = Config.api + "/api/search/images";

        $.ajax({
            url: url,
            type: 'POST',
            data: data,dataType: "json",
            cache: false,
            contentType: false,        //不可缺参数
            processData: false,        //不可缺参数
            beforeSend: function (xhr) {
                xhr.setRequestHeader("appid",Config.appid);
            },
            success: function (result) {
                console.log(result);
                self.trigger("uploadImage", result.name);
            },
            error: function (msg) {
                console.log("上传失败！");
            }
        });
    },
    onCutImage:function(name, colour, rect){
        let self = this;
        let url = Config.url + "/cutimage.ashx?";
        let param = {'name':name,'colour':colour,'rect':JSON.stringify(rect)};

        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            data: param,

            beforeSend: function (xhr) {
            },
            success: function (result) {
                self.trigger("cutImage", result.data);
            },
            error: function (msg) {
                console.log("上传失败！");
            }
        });
    },

    // v2.1, 获取类型树
    onGetAllType: function() {
        let url = Config.base + "/api/locarno/nodes";
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

    // v2.1, 删除任务
    onRemove:function(data,token) {
        let url = Config.base + "/api/locarno/job";

        console.log(data);

        let self = this;
        $.ajax({
            url: url,
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
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

    // v2.1, 获取任务列表
    onGetJobs: function(jobtype,keyword) {
        let user_id = IndexStore.currentUser.userid;
        // v1.0 , .net 版本
        // let url = Config.url + "/locarno/jobs.ashx?";

        // v2.1, nodejs 版本
        let url = Config.base + "/api/locarno/job";
        let param = {'userid':user_id,'jobtype':jobtype,'keyword':keyword};
        let self = this;
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
                    self.trigger("getJobs", jobtype, data.data);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },

    // v2.1, 创建查询
    onCreate: function(job_name,type_ids,type_names,images,jobtype) {
        // v1.0 , .net 版本
        //let url = Config.url + "/locarno/create.ashx?jobtype=" + jobtype;

        // v2.1 ，nodejs 版本
        let url = Config.base + "/api/locarno/create";
        let self = this;
        let param = {
            "jobtype":jobtype,
            "userid":IndexStore.currentUser.userid,
            "jobname":job_name,
            "typeids":type_ids,
            "typenames":type_names,
            "images":images
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify( param),
            cache: false,
            contentType: "application/json; charset=utf-8",
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

    // v1.0 , 已废弃
    onGetResult: function(jobid,patent_type,feature_type,page) {
        let url = Config.url + "/locarno/result.ashx?";
        let self = this;
        let param = {
            jobid:jobid,
            patent_type:patent_type,
            feature_type:feature_type,
            page:page
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
                    self.trigger('getResult', data.data, patent_type,feature_type);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },

    // v2.1 , 获取查询结果（图片分组）
    onGetResultImages:function(param){
        let url = Config.base + "/api/locarno/result/images";
        let self = this;

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(param),
            cache: false,
            contentType: 'application/json',        //不可缺参数
            processData: false,                     //不可缺参数
            dataType:"json",
            beforeSend: function (xhr) {},
            success: function (data,status) {
                self.trigger("getResultImages",data.data);
            },
            error: function (reason) {console.log(reason);}
        });
    },

    // v2.1 , 获取查询结果（专利分组）
    onGetResultPatents:function(param){
        let url = Config.base + "/api/locarno/result/patents";
        let self = this;

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(param),
            cache: false,
            contentType: 'application/json',        //不可缺参数
            processData: false,                     //不可缺参数
            dataType:"json",
            beforeSend: function (xhr) {},
            success: function (data,status) {
                self.trigger("getResultPatents",data.data)
            },
            error: function (reason) {console.log(reason);}
        });
    },

    // v2.1 , 获取专利详情
    onGetPatent:function(ap_num, patent_type){
        let url = Config.base + "/api/locarno/patent/" + ap_num + "/type/" + patent_type;
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
                    self.trigger('getPatent', data.data);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },

    // v1.0 等待重写
    onGetZoneResult: function(jobid,patent_type,feature_type,page) {
        let url = Config.url + "/locarno/zoneresult.ashx?";
        let self = this;
        let param = {
            jobid:jobid,
            patent_type:patent_type,
            feature_type:feature_type,
            page:page
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
                    self.trigger('getZoneResult', data.data, patent_type,feature_type);
                }
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    },

    // v1.0， 已废弃
    onGetDetail: function(code,main_class, token) {
        let url = Config.url + "/locarno/patent.ashx";
        let self = this;
        let param = {
            'main_class':main_class,
            'code':code
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

exports.LocarnoActions = LocarnoActions;
exports.LocarnoStore = LocarnoStore;