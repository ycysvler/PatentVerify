import React from 'react';
import {Layout, Menu, Button, Radio} from 'antd';
import {HashRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';

import {ContrastActions, ContrastStore} from './stone.js';

const {Content, Sider, Header} = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


export default class Contrast extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = ContrastStore.listen(this.onStatusChange.bind(this));

        this.state = {
            'items': ContrastStore.items
        }
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action, items) {
        if (action === "change") {
            this.setState({'items': items});
        }
    }

    removeItem=(index)=>{
        // 删除指定的图片
        ContrastActions.removeByIndex(index);
    }

    onContrast=()=>{
        console.log('对比');
    }


    getImageItems() {
        let result = [];
        let self = this;


        for (let key in this.state.items) {
            result.push(<div  className="contrast_image" key={key} onClick={self.removeItem.bind(self, key)}>
                <img  className="image" src={this.state.items[key]}/></div>);
        }
        return result;
    }

    render() {
        return (<div className="contrast">
            {
                this.getImageItems()
            }
            {
                this.state.items.length>1?<Button type="primary" style={{marginLeft: '12px'}}>对比</Button>:null
            }
        </div>);
    }
}