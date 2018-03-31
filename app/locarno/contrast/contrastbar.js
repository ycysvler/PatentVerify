import React from 'react';
import {Layout, Modal, Button, Radio} from 'antd';
import {HashRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';
import Config from 'config';
import Contrast from './index';
import {ContrastActions, ContrastStore} from './reflux.js';

const {Content, Sider, Header} = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import './contrast.less';

export default class ContrastBar extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = ContrastStore.listen(this.onStatusChange.bind(this));

        this.state = {
            'items': ContrastStore.items,
            visible:false
        }
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action, items) {
        if (action === "contrast") {
            this.setState({'items': items});
        }
    }

    removeItem=(index)=>{
        // 删除指定的图片
        ContrastActions.removeByIndex(index);
    }

    onContrast=()=>{
        this.setState({
            visible: true,
        });
    }


    getImageItems() {
        let result = [];
        let self = this;
        for (let key in this.state.items) {
            let url = Config.api + '/api/images/data/' + Config.appid + '/' + this.state.items[key].image;
            result.push(<div  className="contrast_image" key={key} onClick={self.removeItem.bind(self, key)}>
                <img  className="image" src={url}/></div>);
        }
        return result;
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render() {
        return (<div className="contrast">
            {
                this.getImageItems()
            }
            {
                this.state.items.length>0?<Button type="primary" onClick={this.onContrast} style={{marginLeft: '12px'}}>对比</Button>:null
            }

            <Modal
                style={{padding:2}}
                width={this.state.items.length * 200 + 120}
                title="对比" footer={null}
                visible={this.state.visible}
                onCancel={this.handleCancel}
            >
                <Contrast />
            </Modal>
        </div>);
    }
}