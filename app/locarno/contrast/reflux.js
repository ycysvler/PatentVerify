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

    items: [],

    onAdd:function(image) {
        this.items.push(image);
        this.trigger("contrast", this.items);
    },
    onClear:function(){},
    onRemove:function(image){
        let i = -1;
        for (let index in  this.items) {
            let item = this.items[index];
            if (item.image === image)
                i = index;
        }

        if(i != -1){
            this.items.splice(i,1);
            this.trigger("contrast", this.items);
        }
    },
    onRemoveByIndex:function(index){
        this.items.splice(index,1);
        this.trigger("contrast", this.items);
    }
});

exports.ContrastActions = ContrastActions;
exports.ContrastStore = ContrastStore;