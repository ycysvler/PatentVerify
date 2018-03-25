/**
 * Created by xiao on 2017/3/30.
 */
import Reflux from 'reflux';
import Config from 'config';
const ContrastActions = Reflux.createActions([
    'add',
    'remove',
    'removeByIndex',
    'clear'
]);

const ContrastStore = Reflux.createStore({
    listenables:[ContrastActions],

    items: [
        "http://wg.cnipr.com/userPic/b799335f4370e185345481fcadc183f7/EF03F2029B746723DC2C8873DA335C81.jpg",
        "http://wg.cnipr.com/image/getstream/thum/aHR0cDovL2ltYWdlLmNuaXByLmNvbS9kYXRhMi93Z2RhdGF0aHVtLzEzNS8wNzUvMDQ2L0lNQUdFLzE2MF8xNjBfMDAwMDIyLkpQRw==",
        "http://wg.cnipr.com/userPic/b799335f4370e185345481fcadc183f7/EF03F2029B746723DC2C8873DA335C81.jpg"
    ],

    onAdd:function(item) {
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
    onClear:function(){},
    onRemove:function(key){
        this.items.splice(key,1);
    },
    onRemoveByIndex:function(index){
        this.items.splice(index,1);
        this.trigger("change", this.items);
    }
});

exports.ContrastActions = ContrastActions;
exports.ContrastStore = ContrastStore;