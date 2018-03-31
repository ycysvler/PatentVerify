import React from 'react';
import {Layout, Tabs, Modal, Radio} from 'antd';
import Config from 'config';
import {ContrastActions, ContrastStore} from './reflux.js';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';

const {Content, Sider, Header} = Layout;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import './contrast.less';

export default class Contrast extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe_contrast = ContrastStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));

        this.state = {
            'items': ContrastStore.items
        }

        this.getPatent();
    }

    componentWillUnmount() {
        this.unsubscribe_contrast();
        this.unsubscribe_locarno();
    }

    getPatent() {
        for (let index in this.state.items) {
            let item = this.state.items[index];

            if (!item.hasOwnProperty("patent")) {
                LocarnoActions.getPatent(item.code, "d_ap_0701");
            }
        }
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action, items) {
        if (action === "contrast") {
            this.state.items = items;
            this.getPatent();
        }
        if (action === "getPatent") {
            let datas = this.state.items;
            for (let index in datas) {
                let item = datas[index];
                if (items.ap_num === item.code) {
                    item.patent = items;
                }
            }
            this.setState({items: datas});

            console.log(datas);
        }
    }

    getImage(item, index){
        if(item.patent){
            if(item.patent.images.length > index){
                return <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + item.patent.images[index].name} />
            }else{
                return null;
            }
        }else{
            return null;
        }
    }

    renderImage(){
        let self = this;
        let dom = (<div className="tab-div">
            <table className="table2">
                <tbody>

                <tr>
                    <th ><div >图像</div></th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>
                            <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + item.image} />
                        </td>
                    })}
                </tr>
                <tr>
                    <th>专利名</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}><b>{item.patent?item.patent.ap_name:''}</b></td>
                    })}
                </tr>
                <tr>
                    <th>公开号</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{item.patent?item.patent.pub_num:''}</td>
                    })}
                </tr>
                <tr>
                    <th>1</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 0)}</td>
                    })}
                </tr>
                <tr>
                    <th>2</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 1)}</td>
                    })}
                </tr>
                <tr>
                    <th>3</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 2)}</td>
                    })}
                </tr>
                <tr>
                    <th>4</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 3)}</td>
                    })}
                </tr>
                <tr>
                    <th>5</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 4)}</td>
                    })}
                </tr>
                <tr>
                    <th>6</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 5)}</td>
                    })}
                </tr>
                <tr>
                    <th>7</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 6)}</td>
                    })}
                </tr>
                <tr>
                    <th>8</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 7)}</td>
                    })}
                </tr>
                <tr>
                    <th>9</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 8)}</td>
                    })}
                </tr>
                <tr>
                    <th>10</th>
                    {this.state.items.map((item, index) => {
                        return <td key={index}>{self.getImage(item, 9)}</td>
                    })}
                </tr>
                </tbody>
            </table></div>);
        return dom;
    }

    renderPatent() {
        let dom = (<div className="tab-div">
            <table className="table">
            <tbody>
            <tr>
                <th ><div style={{width:100}}>图像</div></th>
                {this.state.items.map((item, index) => {
                    return <td style={{textAlign:'center'}} key={index}>
                        <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + item.image} />
                        </td>
                })}
            </tr>
            <tr>
                <th>专利名</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.ap_name:''}</td>
                })}
            </tr>
            <tr>
                <th>公开号</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.pub_num:''}</td>
                })}
            </tr>
            <tr>
                <th>申请号</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.ap_num:''}</td>
                })}
            </tr>

            <tr>
                <th>申请日</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.ap_date:''}</td>
                })}
            </tr>
            <tr>
                <th>公开日</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.pub_date:''}</td>
                })}
            </tr>
            <tr>
                <th>设计人</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.designer:''}</td>
                })}
            </tr>
            <tr>
                <th>申请人</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.pa_name:''}</td>
                })}
            </tr>
            <tr>
                <th>公开日</th>
                {this.state.items.map((item, index) => {
                    return <td key={index}>{item.patent?item.patent.pub_date:''}</td>
                })}
            </tr>
            <tr>
                <th>说明</th>
                {this.state.items.map((item, index) => {
                    return <td key={index} style={{verticalAlign:'top'}}>{item.patent?item.patent.abstract:''}</td>
                })}
            </tr>
            </tbody>
        </table></div>);
        return dom;
    }

    render() {
        return (<div className="contrast" >
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="图像对比" key="1">
                    {this.renderImage()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="专利对比" key="2">
                    {this.renderPatent()}
                </Tabs.TabPane>
            </Tabs>
        </div>);
    }
}
