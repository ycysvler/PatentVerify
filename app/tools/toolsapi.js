/**
 * Created by VLER on 2017/6/21.
 */
import Reflux from 'reflux';
import $ from 'jquery'


const ToolsActions = Reflux.createActions([
    'getFeature'
]);


const ToolsStore = Reflux.createStore({
    listenables:[ToolsActions],

    onGetFeature:function(name) {
        let url = window.server_address + "/feature.ashx?name=" + name;

        let self = this;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: "json",
            cache: false,
            contentType: false,        //不可缺参数
            processData: false,        //不可缺参数
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Authorization",token);
            },
            success: function (result) {
                self.trigger("getFeature", result.data ,name);
            },
            error: function (msg) {
                console.log("获取图像特征失败！");
            }
        });
    },


});

exports.ToolsActions = ToolsActions;
exports.ToolsStore = ToolsStore;