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
    'getResult',
    'getZoneResult',
    'getDetail',
    'remove'
]);

const LocarnoStore = Reflux.createStore({
    listenables:[LocarnoActions],

    onUploadImage:function(data) {
        let self = this;
        let url = Config.url + "/uploadimages.ashx?username=" + IndexStore.currentUser.username;
        //let url = Config.base + "/api/search/images";

        console.log(url);

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
                self.trigger("uploadImage", result.data);
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

    onRemove:function(data,token) {
        let url = Config.url + "/locarno/remove.ashx?";

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

    onGetJobs: function(jobtype,keyword) {
        let user_id = IndexStore.currentUser.userid;
        let url = Config.url + "/locarno/jobs.ashx?";
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
    onGetAllType: function() {
        let url = Config.url + "/locarno/type/nodes.ashx?parentid=0";
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
    onCreate: function(job_name,type_ids,type_names,images,jobtype) {
        console.log('imgs',IndexStore.currentUser.userid);
        let url = Config.url + "/locarno/create.ashx?jobtype=" + jobtype;
        let self = this;
        let param = {
            userid:IndexStore.currentUser.userid,
            jobname:job_name,
            typeids:type_ids,
            typenames:type_names,
            images:images
        };

        console.log('url > ', url);
        console.log('param > ', JSON.stringify(param));

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