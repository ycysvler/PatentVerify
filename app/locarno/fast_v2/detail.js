import React from 'react';
import {Layout, Breadcrumb, Radio, Card, Menu, Icon, Button, Checkbox} from 'antd';
import {HashRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';
import Contrast from '../contrast';
import Config from 'config';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import {ContrastActions, ContrastStore} from '../contrast/stone.js';
const {Content, Sider, Header} = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import '../style/locarno.less';

export default class LocarnoFastDetails extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_contrast = ContrastStore.listen(this.onStatusChange.bind(this));

        this.state = {contrast: [], showIndex: -1, collapsed: false, data: []};

        let param = {
            "jobid": "5ab7544b2840d21e24d1084a",
            "pager": {"pagesize": 100, "current": 1},
            "weight": {"color": 3, "shape": 3, "lbp": 2, "deep": 1}
        };

        LocarnoActions.getResult(param);
    }

    componentWillUnmount() {
        this.unsubscribe_locarno();
        this.unsubscribe_contrast();
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action, data) {
        if (action === "getResult") {
            console.log('page >', data);
            this.setState({data: data});
        }
        if (action === "contrast") {
            this.setState({contrast: data});
            console.log('contrast', data);
        }
    }

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    }


    onMouseEnter = (key) => (e) => {
        this.setState({showIndex: key});
    }
    onCheck = (item) => (e) => {
        if (e.target.checked) {
            ContrastActions.add(item);
        } else {
            ContrastActions.remove(item.image);
        }
    }

    isSelected = (image) => {
        let result = false;
        for (let index in  this.state.contrast) {
            let item = this.state.contrast[index];
            if (item.image === image)
                result = true;
        }
        return result;
    }

    drawItems = () => {
        let doms = [];

        let self = this;
        for (let index in this.state.data.data) {
            let item = this.state.data.data[index];
            let checked = self.isSelected(item.image);
            let border = checked ? "img-box selected" : "img-box";
            let dy = this.state.showIndex == index ? 'block' : 'none';

            doms.push(<div className={border} key={index} onMouseEnter={self.onMouseEnter(index)}>
                <img src={Config.api + '/api/images/data/' + Config.appid + '/' + item.image}/>

                <div className="img-check" style={{display: dy}}>
                    <Checkbox
                        checked={checked}
                        onChange={self.onCheck(item)}
                              style={{color: '#fff'}}>
                        对比 </Checkbox></div>

            </div>);
        }

        return doms;
    }

    render() {
        let self = this;

        return (<Layout className="locarno">
            <div className="breadcrumb">
                <Breadcrumb className="bg_white" style={{margin: '11px 0'}}>
                    <Breadcrumb.Item><Link to='/main/locarno/fast/list'>快速检索</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/main/locarno/fast/list'>历史查询</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>查询结果</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Layout>

                <div style={{flexDirection: 'column', flexGrow: 1, display: 'flex'}}>
                    <div className="breadcrumb locarno_result_toolbar">
                        <div className="bg_white">
                            <RadioGroup onChange={this.onChange} defaultValue="image">
                                <RadioButton value="image">图像视图</RadioButton>
                                <RadioButton value="patent">专利试图</RadioButton>
                            </RadioGroup>
                        </div>
                        {/*对比*/}
                        <Contrast />
                    </div>
                    <div className="img-layout">
                        {this.drawItems()}
                    </div>
                </div>


                <Sider collapsible style={{background: '#fff'}}
                       collapsed={this.state.collapsed}
                       onCollapse={this.onCollapse}
                >
                    <div>

                    </div>
                </Sider>
            </Layout>
        </Layout>);
    }
}
