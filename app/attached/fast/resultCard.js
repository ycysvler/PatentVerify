/**
 * Created by xiao on 2017/4/4.
 */
import React from 'react';
import {Card, Row, Col, Popover} from 'antd';
import {FastActions, FastStore} from './fastApi.js';

class ResultCards extends React.Component {

    constructor(props) {
        super(props);
        this.unsubscribe = FastStore.listen(this.onStatusChange.bind(this));
        this.state = {
            jobid: this.props.jobid,
            typeid: this.props.typeid,
            data: []
        }
    }

    componentWillReceiveProps(n, o){
        this.setState({jobid:n.jobid, typeid:n.typeid});
        FastActions.getResult(n.jobid, n.typeid, this.getCookie("token"));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        FastActions.getResult(this.state.jobid, this.state.typeid, this.getCookie("token"));
    }

    onStatusChange(action,typeid, data) {
        if (action === "getResult" && typeid === this.state.typeid) {
            this.setState({"data": data});
        } else if (action === "getDetail") {
            this.setState({showDetailDialog: true, detailData: data});
        }
    }

    renderOneImage(url) {
        url = Config.url + '/' + url;
        return <div>
            <img alt="" style={{maxWidth:300, maxHeight:300}} src={url}/>
        </div>
    }

    getDetail(code, main_class) {
        this.props.getDetail(code, main_class);
    }

    getTitle(title){
        return(
            <div
                title={title}
            style={{width:280,
                fontWeight:'bold',
                whiteSpace:'nowrap',
                wordBreak:'keep-all',
                overflow:'hidden',
                textOverflow:'ellipsis'}}
            >{title}</div>
        );
    }

    render() {
        var self = this;
        return (<div>
                {this.state.data.map(function (item) {
                    return (<Card key={item.image} title={self.getTitle(item.patent.ap_name)} extra={<span>{item.score}</span>}
                                  style={{
                                      width: 420,
                                      marginBottom: 20,
                                      marginLeft: 6,
                                      overflow: "left",
                                      float: 'left'
                                  }}>
                        <div>
                            <Row>
                                <Col span="10" style={{marginTop: -10}}>
                                    <Popover
                                        content={self.renderOneImage(item.image)}>
                                        <img alt="" style={{maxWidth:"100%", maxHeight: 90}}
                                             src={ Config.url + '/' + item.image}/>
                                    </Popover>
                                </Col>
                                <Col span="5" style={{textAlign: "right"}}>
                                    <div>专利号：</div>
                                    <div>申请人：</div>
                                    <div>申请日：</div>
                                    <div>主分类号：</div>
                                    <div>分类号：</div>
                                </Col>
                                <Col span="8">
                                    <a onClick={self.getDetail.bind(self, item.code, item.patent.main_class)}>{item.code}</a>
                                    <div title={item.patent.pa_name} style={{width:140,
                                        whiteSpace:'nowrap',
                                        wordBreak:'keep-all',
                                        overflow:'hidden',
                                        textOverflow:'ellipsis'}}>{item.patent.pa_name}</div>
                                    <div>{item.patent.ap_date}</div>
                                    <div>{item.patent.main_class}</div>
                                    <div title={item.patent.sub_class} style={{width:140,
                                        whiteSpace:'nowrap',
                                        wordBreak:'keep-all',
                                        overflow:'hidden',
                                        textOverflow:'ellipsis'}}>{item.patent.sub_class}</div>
                                </Col>
                            </Row>
                        </div>
                    </Card>)
                })}
            </div>
        )
    }

    getCookie(name) {
        if (window.document.cookie === "") {
            this.context.router.push("/");
            return;
        }
        let cookies = window.document.cookie.split(";");
        if (name === "token") {
            let token = cookies[0].substring(6);
            if (!token || token === "") {
                this.context.router.push("/");
                return;
            } else {
                return token;
            }
        } else if (name === "user_id") {
            let user_id = cookies[1].substring(9);
            if (!user_id || user_id === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_id;
            }
        } else {
            let user_name = cookies[2].substring(11);
            if (!user_name || user_name === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_name;
            }
        }
    }
}

export default ResultCards;