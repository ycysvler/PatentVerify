/**
 * Created by VLER on 2017/7/25.
 */
/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import $ from 'jquery'
import Config from 'config';
import moment from 'moment';

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
                let items = data.data;
                for(let agent of items){
                    for(let instance of agent.instances){
                        let now = new moment();
                        let time = new moment(instance.time);
                        let diff = now.diff(time);
                        console.log('diff', diff);
                        instance['state'] = diff < 60 * 5 * 1000;
                    }
                }
                self.trigger("list", items);
            },
            error: function (reason) {
                console.log(reason);
            }
        });
    }

});

exports.AgentActions =  AgentActions;
exports.AgentStore =  AgentStore;