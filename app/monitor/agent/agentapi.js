/**
 * Created by VLER on 2017/7/25.
 */
/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import $ from 'jquery'
import Config from 'config';

const AgentActions = Reflux.createActions([
    'list'
]);

const AgentStore = Reflux.createStore({
    listenables:[AgentActions],

    onList: function() {
        let url = Config.base + "/api/monitor/instances";

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

exports.AgentActions =  AgentActions;
exports.AgentStore =  AgentStore;