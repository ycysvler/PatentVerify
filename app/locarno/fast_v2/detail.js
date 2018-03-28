import React from 'react';
import {Layout, Breadcrumb, Radio, Card, Menu, Icon, Button, Divider, Slider, Checkbox} from 'antd';
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

        this.state = {
            contrast: [],
            showIndex: -1,
            collapsed: false,
            data: [],
            weight: {"color": 2, "shape": 3, "lbp": 3, "deep": 5}
        };

        this.search();
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
            this.setState({data: data});
        }
        if (action === "contrast") {
            this.setState({contrast: data});
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

    onWeightColorChange = (value) => {
        let weight = this.state.weight;
        weight.color = value;
        this.setState({weight: weight});
        this.search();
    }
    onWeightShapeChange = (value) => {
        let weight = this.state.weight;
        weight.shape = value;
        this.setState({weight: weight});
        this.search();
    }
    onWeightLbpChange = (value) => {
        let weight = this.state.weight;
        weight.lbp = value;
        this.setState({weight: weight});
        this.search();
    }
    onWeightDeepChange = (value) => {
        let weight = this.state.weight;
        weight.deep = value;
        this.setState({weight: weight});
        this.search();
    }

    search=()=>{
        let weight_color = 5 - this.state.weight.color;
        let weight_shape = 5 - this.state.weight.shape;
        let weight_lbp = 5 - this.state.weight.lbp;
        let weight_deep = 5 - this.state.weight.deep;

        let param = {
            "jobid": "5ab7544b2840d21e24d1084a",
            "pager": {"pagesize": 100, "current": 1},
            "weight": {"color":weight_color, "shape": weight_shape, "lbp": weight_lbp, "deep": weight_deep}
        };

        LocarnoActions.getResult(param);
    }

    drawItems = () => {
        let doms = [];

        let self = this;
        for (let index in this.state.data.data) {
            let item = this.state.data.data[index];
            let checked = self.isSelected(item.image);
            let border = checked ? "img-box selected" : "img-box";
            let dy = this.state.showIndex == index ? 'block' : 'none';

            doms.push(<div className={border} key={item.image + '_' + index} onMouseEnter={self.onMouseEnter(index)}>
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
                        <div className="bg_white querybar">
                            <b > 视图</b>
                            <RadioGroup size="small" onChange={this.onChange} defaultValue="image" className="margin">
                                <RadioButton value="image">图像视图</RadioButton>
                                <RadioButton value="patent">专利试图</RadioButton>
                            </RadioGroup>
                            <Divider className="margin" type="vertical" style={{height: 30}}/>
                            <b className="margin">检索权重</b>
                            颜色
                            <Slider min={1} max={5} value={this.state.weight.color} onChange={this.onWeightColorChange} style={{width: 100}}
                                    className="margin"/>
                            形状
                            <Slider min={1} max={5} value={this.state.weight.shape} onChange={this.onWeightShapeChange} style={{width: 100}}
                                    className="margin"/>
                            纹理
                            <Slider min={1} max={5} value={this.state.weight.lbp} onChange={this.onWeightLbpChange} style={{width: 100}}
                                    className="margin"/>
                            综合
                            <Slider min={1} max={5} value={this.state.weight.deep} onChange={this.onWeightDeepChange} style={{width: 100}}
                                    className="margin"/>
                        </div>
                        {/*对比*/}
                        <Contrast />
                    </div>
                    <div className="img-layout">

                        {this.drawItems()}


                    </div>
                </div>


            </Layout>
        </Layout>);
    }
}
