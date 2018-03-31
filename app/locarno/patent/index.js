import React from 'react';
import {Layout, Popover} from 'antd';
import {HashRouter as Router, Redirect, Link, Switch, Route} from 'react-router-dom';
const {Content, Sider, Header} = Layout;
import Config from 'config';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import './patent.less';
export default class Patent extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));

        this.state = {
            typeid: this.props.typeid,
            ap_num: this.props.ap_num,
            patent: null
        }
        LocarnoActions.getPatent(this.state.ap_num, this.state.typeid);
    }

    componentWillUnmount() {
        this.unsubscribe_locarno();
    }

    componentWillReceiveProps(props) {
        LocarnoActions.getPatent(props.ap_num, props.typeid);
    }

    onStatusChange(action, items) {
        if (action === "getPatent") {
            this.setState({patent: items});
        }
    }

    renderOneImage(name) {
        return <div>
            <img alt="" style={{maxWidth:500, maxHeight:500}} src={Config.api + '/api/images/data/' + Config.appid + '/' + name}/>
        </div>
    }

    drawImages() {
        let self = this;
        let doms = [];
        if (this.state.patent) {
            for (let index in this.state.patent.images) {
                let image = this.state.patent.images[index];
                doms.push( <Popover  key={index} content={self.renderOneImage(image.name)}>
                    <div className="img">

                <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + image.name}/>
                    </div> </Popover>
                );
            }
        }
        return doms;
    }

    render() {
        return (<div className="patent">
            <table>
                <tbody>
                <tr>
                    <th>专利名</th>
                    <td>{this.state.patent ? this.state.patent.ap_name : ''}</td>
                    <th>主分类号</th>
                    <td>{this.state.patent ? this.state.patent.main_class : ''}</td>
                    <th>次分类号</th>
                    <td>{this.state.patent ? this.state.patent.sub_class : ''}</td>
                </tr>
                <tr>
                    <th>公开号</th>
                    <td>{this.state.patent ? this.state.patent.pub_num : ''}</td>
                    <th>申请号</th>
                    <td>{this.state.patent ? this.state.patent.ap_num : ''}</td>
                    <th>设计人</th>
                    <td>{this.state.patent ? this.state.patent.designer : ''}</td>
                </tr>
                <tr>
                    <th>公开日</th>
                    <td>{this.state.patent ? this.state.patent.pub_date : ''}</td>
                    <th>申请日</th>
                    <td>{this.state.patent ? this.state.patent.ap_date : ''}</td>
                    <th>申请人</th>
                    <td>{this.state.patent ? this.state.patent.pa_name : ''}</td>
                </tr>

                <tr>
                    <th>简要说明</th>
                    <td colSpan="5">{this.state.patent ? this.state.patent.abstract : ''}</td>

                </tr>

                </tbody>
            </table>

            <div  className="imgDiv">
                {this.drawImages()}
            </div>
        </div>);
    }
}