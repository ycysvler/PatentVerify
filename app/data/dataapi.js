/**
 * Created by VLER on 2017/6/21.
 */
import Reflux from 'reflux';
import $ from 'jquery';
import Config from 'config';


const DataActions = Reflux.createActions([
    'reBuildIndex'
]);


const DataStore = Reflux.createStore({
    listenables:[DataActions],

    onReBuildIndex:function(type) {
        let url = Config.api + "/api/indexs";
        let self = this;
        let param = {
            type:0,
            imageTypes:[]
        };

        param.imageTypes.push({"code":type});

        let data = JSON.stringify(param);

        console.log('data', data);

        $.ajax({
            url: url,
            type: 'POST',
            dataType:"json",
            data: data,
            contentType:"application/json; charset=utf-8",
            cache: false,
            processData: false,        //不可缺参数

            beforeSend: function (xhr) {
                xhr.setRequestHeader("appid",Config.appid);
            },
            success: function (result) {
                self.trigger("reBuildIndex", result.data ,name);
            },
            error: function (msg) {
                console.log("重建索引异常！");
            }
        });
    },


});

exports.DataActions = DataActions;
exports.DataStore = DataStore;