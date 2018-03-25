import React from 'react';
import {Layout, Breadcrumb, Radio, Card, Menu, Icon, Button} from 'antd';
import {HashRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';
import Contrast from '../contrast';

const {Content, Sider, Header} = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import '../style/locarno.less';

export default class LocarnoFastDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {collapsed: false,};
    }

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    }

    onChange = (e) => {
        console.log(`radio checked:${e.target.value}`);
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
                <Layout>
                    <div className="breadcrumb locarno_result_toolbar">
                        <div className="bg_white" style={{margin: '11px 0'}}>
                            <RadioGroup onChange={this.onChange} defaultValue="image">
                                <RadioButton value="image">图像视图</RadioButton>
                                <RadioButton value="patent">专利试图</RadioButton>
                            </RadioGroup>
                        </div>
                        {/*对比*/}
                        <Contrast />
                    </div>
                </Layout>
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
