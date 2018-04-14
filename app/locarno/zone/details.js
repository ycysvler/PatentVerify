import React from 'react';
import {Layout, Breadcrumb, Radio, Modal, Divider, Slider} from 'antd';
import {HashRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';
import ContrastBar from '../contrast/contrastbar';
import ImageGrid from '../common/imagegrid.js';
import PatentGrid from '../common/patentgrid.js';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import {ContrastActions, ContrastStore} from '../contrast/reflux.js';

const {Content, Sider, Header} = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import '../style/locarno.less';

export default class LocarnoZoneDetails extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_contrast = ContrastStore.listen(this.onStatusChange.bind(this));

        ContrastActions.clear();

        this.state = {
            jobid:props.location.jobinfo.jobid,
            typeid:props.location.jobinfo.typeids[0],
            contrast: [],
            showIndex: -1,
            collapsed: false,
            data: [],
            visible:false,
            showtype:'image',
            weight: {"color": 2, "shape": 3, "lbp": 3, "deep": 5}
        };

        this.search(1);
    }

    componentWillUnmount() {
        this.unsubscribe_locarno();
        this.unsubscribe_contrast();
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action, data) {
        if (action === "contrast") {
            this.setState({contrast: data});
        }
    }

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    }

    onWeightColorChange = (value) => {
        let weight = this.state.weight;
        weight.color = value;
        this.setState({weight: weight});
        this.search(1);
    }
    onWeightShapeChange = (value) => {
        let weight = this.state.weight;
        weight.shape = value;
        this.setState({weight: weight});
        this.search(1);
    }
    onWeightLbpChange = (value) => {
        let weight = this.state.weight;
        weight.lbp = value;
        this.setState({weight: weight});
        this.search(1);
    }
    onWeightDeepChange = (value) => {
        let weight = this.state.weight;
        weight.deep = value;
        this.setState({weight: weight});
        this.search(1);
    }

    search = (page) => {
        let weight_color = this.state.weight.color;
        let weight_shape = this.state.weight.shape;
        let weight_lbp = this.state.weight.lbp;
        let weight_deep = this.state.weight.deep;

        let pagetsize = this.state.showtype == 'image' ? 60:10;

        let param = {
            "jobid":this.state.jobid,"type":this.state.typeid,
            "pager": {"pagesize":pagetsize, "current": page},
            "weight": {"color": weight_color, "shape": weight_shape, "lbp": weight_lbp, "deep": weight_deep}
        };
        if(this.state.showtype === 'image')
            LocarnoActions.getResultImages(param);
        else
            LocarnoActions.getResultPatents(param);
    }

    /*
     * 切换视图（图像视图，专利视图）
     * */
    onViewChange=(e)=> {
        this.state.showtype = e.target.value;
        this.setState({showtype:e.target.value});
        this.search(1);
    }
    /*
     * 翻页
     * */
    onPageChange = (page) => {
        this.state.current = page;
        this.search(page);
    }

    render() {
        let self = this;

        return (<Layout className="locarno">
            <div className="breadcrumb">
                <Breadcrumb className="bg_white" style={{margin: '11px 0'}}>
                    <Breadcrumb.Item><Link to='/main/locarno/senior/list'>高级检索</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/main/locarno/senior/list'>历史查询</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>查询结果</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Layout >
                <div style={{flexDirection: 'column',background:'#fff', flexGrow: 1, display: 'flex'}}>
                    <div className="breadcrumb locarno_result_toolbar">
                        <div className="bg_white querybar">
                            <b > 视图</b>
                            <RadioGroup size="small" onChange={this.onViewChange} defaultValue="image" className="margin">
                                <RadioButton value="image">图像视图</RadioButton>
                                <RadioButton value="patent">专利视图</RadioButton>
                            </RadioGroup>
                            {/*<Divider className="margin" type="vertical" style={{height: 30}}/>*/}
                            {/*<b className="margin">检索权重</b>*/}
                            {/*颜色*/}
                            {/*<Slider min={1} max={5} value={this.state.weight.color} onChange={this.onWeightColorChange}*/}
                            {/*style={{width: 100}}*/}
                            {/*className="margin"/>*/}
                            {/*形状*/}
                            {/*<Slider min={1} max={5} value={this.state.weight.shape} onChange={this.onWeightShapeChange}*/}
                            {/*style={{width: 100}}*/}
                            {/*className="margin"/>*/}
                            {/*纹理*/}
                            {/*<Slider min={1} max={5} value={this.state.weight.lbp} onChange={this.onWeightLbpChange}*/}
                            {/*style={{width: 100}}*/}
                            {/*className="margin"/>*/}
                            {/*综合*/}
                            {/*<Slider min={1} max={5} value={this.state.weight.deep} onChange={this.onWeightDeepChange}*/}
                            {/*style={{width: 100}}*/}
                            {/*className="margin"/>*/}
                        </div>
                        {/*对比*/}
                        <ContrastBar typeid={this.state.typeid} />
                    </div>
                    {/*图片列表控件*/}
                    {
                        this.state.showtype == 'image' ? <ImageGrid onPageChange={this.onPageChange} typeid={this.state.typeid}/>:<PatentGrid onPageChange={this.onPageChange} typeid={this.state.typeid} />
                    }

                </div>
            </Layout>
        </Layout>);
    }
}



