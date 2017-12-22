/**
 * Created by xiao on 2017/4/4.
 */
import React from 'react';
import {Card, Row, Col, Popover,Tabs, Button,Spin } from 'antd';
import {LocarnoActions, LocarnoStore}  from '../locarnoapi';

import './css.css';

const TabPane = Tabs.TabPane;

class LocarnoResultCards extends React.Component {

    constructor(props) {
        super(props);
        this.unsubscribe = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.state = {
            jobid: this.props.jobid,
            typeid: this.props.typeid,
            page:0,
            data: {shape:[],lbp:[],color:[],deep:[]}
        }
    }

    componentWillReceiveProps(n, o){
        this.setState({jobid:n.jobid, typeid:n.typeid});

        LocarnoActions.getResult(n.jobid, n.typeid, this.getCookie("token"),0);

        if(this.state.data.shape.length === 0){
            // 有数据了，就不再取了

        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    componentDidMount() {
        LocarnoActions.getResult(this.state.jobid, this.state.typeid, this.getCookie("token"),0);
    }

    indexOf = function (array, item) {
        for (var i = 0, j = array.length; i < j; i++) {
            if (array[i].image === item.image) {
                return i;
            }
        }
        return -1;
    }
    unique= function(array){
    var res = [];
    var self = this;

    for(var i = 0; i < array.length; i++){
        if(self.indexOf(res, array[i])===-1){
            res.push(array[i])
        }
    }
    return res;
}

    onStatusChange(action,typeid, data) {
        if (action === "getResult" && typeid === this.state.typeid) {
            var temp = this.state.data;
            if(temp.hasOwnProperty("color")){
                temp.color = this.unique(temp.color.concat(data.color));
            }
            if(temp.hasOwnProperty("deep")){
                temp.deep = this.unique(temp.deep.concat(data.deep));
            }
            if(temp.hasOwnProperty("shape")){
                temp.shape = this.unique(temp.shape.concat(data.shape));
            }
            if(temp.hasOwnProperty("lbp")){
                temp.lbp = this.unique(temp.lbp.concat(data.lbp));
            }
            this.setState({"data": temp});
        } else if (action === "getDetail") {
            this.setState({showDetailDialog: true, detailData: data});
        }
    }

    renderOneImage(url) {
        url = Config.url + '/image.ashx?name=' + url;
        return <div>
            <img alt="" style={{maxWidth:300, maxHeight:300}} src={url}/>
        </div>
    }
    getDetail(code, main_class) {
        this.props.getDetail(code, main_class);
    }

    getTitle(title, index){
        return(
            <div
                title={title}
            style={{width:280,
                fontWeight:'bold',
                whiteSpace:'nowrap',
                wordBreak:'keep-all',
                overflow:'hidden',
                textOverflow:'ellipsis'}}
            >{"["+(index+1) + "] " + title}</div>
        );
    }
    more=()=>{
        var page = this.state.page + 1;
        this.setState({'page':page});
        LocarnoActions.getResult(this.state.jobid, this.state.typeid, this.getCookie("token"),page);
    }
    getTabs(){
        var self = this;
        if(this.state.data.hasOwnProperty("deep") && this.state.data.deep.length>1){
            return (<Tabs  type="line" >
                <TabPane tab={"综合 （" + self.state.data.deep.length +"）"} key="deep">

                    {self.state.data.deep.map(function (item,index) {
                        return (<Card key={'deep_' + item.image} title={self.getTitle(item.patent.ap_name, index)} extra={<span>{((100-item.score.toFixed(2))*100)/100 + '%'}</span>}
                                      style={{
                                          width: 390,
                                          marginBottom: 20,
                                          marginLeft: 6,
                                          overflow: "left",
                                          float: 'left'
                                      }}>
                            <div>
                                <Row>
                                    <Col span="10" style={{display:'flex', justifyContent:'center', height:'130px', alignItems:"center"}}>
                                        <Popover
                                            content={self.renderOneImage(item.image)}>
                                            <img alt="" style={{maxWidth:"100%", maxHeight: 90}}
                                                 src={ Config.url + '/image.ashx?name=' + item.image}/>
                                        </Popover>
                                    </Col>
                                    <Col span="5" style={{textAlign: "right"}}>
                                        <div>申请号：</div>
                                        <div>申请日：</div>
                                        <div>公告号：</div>
                                        <div>公告日：</div>
                                        <div>申请人：</div>
                                        <div>主分类号：</div>
                                        <div>分类号：</div>
                                    </Col>
                                    <Col span="8">
                                        <a　style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}} onClick={self.getDetail.bind(self, item.code, item.patent.main_class)}>{item.code}</a>
                                        <div>{item.patent.ap_date}</div>
                                        <div title={item.patent.code} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pub_num}　</div>
                                        <div>{item.patent.pub_date}</div>
                                        <div title={item.patent.pa_name} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pa_name}　</div>

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

                </TabPane>
                <TabPane tab={"形状 （" + this.state.data.shape.length +"）"} key="shape">
                    {this.state.data.shape.map(function (item, index) {
                        return (<Card key={'shape_' + item.image} title={self.getTitle(item.patent.ap_name,index)} extra={<span>{((100-item.score.toFixed(2))*100)/100 + '%'}</span>}
                                      style={{
                                          width: 390,
                                          marginBottom: 20,
                                          marginLeft: 6,
                                          overflow: "left",
                                          float: 'left'
                                      }}>
                            <div>
                                <Row>
                                    <Col span="10" style={{display:'flex', justifyContent:'center', height:'130px', alignItems:"center"}}>
                                        <Popover
                                            content={self.renderOneImage(item.image)}>
                                            <img alt="" style={{maxWidth:"100%", maxHeight: 90}}
                                                 src={ Config.url + '/image.ashx?name=' + item.image}/>
                                        </Popover>
                                    </Col>
                                    <Col span="5" style={{textAlign: "right"}}>
                                        <div>申请号：</div>
                                        <div>申请日：</div>
                                        <div>公告号：</div>
                                        <div>公告日：</div>
                                        <div>申请人：</div>
                                        <div>主分类号：</div>
                                        <div>分类号：</div>
                                    </Col>
                                    <Col span="8">
                                        <a style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}} onClick={self.getDetail.bind(self, item.code, item.patent.main_class)}>{item.code}</a> <div>{item.patent.ap_date}</div>
                                        <div title={item.patent.code} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pub_num}　</div>
                                        <div>{item.patent.pub_date}</div>
                                        <div title={item.patent.pa_name} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pa_name}　</div>

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
                </TabPane>
                <TabPane tab={"颜色 （" + this.state.data.color.length +"）"}  key="color">
                    {this.state.data.color.map(function (item, index) {
                        return (<Card key={'color_' + item.image} title={self.getTitle(item.patent.ap_name, index)} extra={<span>{((100-item.score.toFixed(2))*100)/100 + '%'}</span>}
                                      style={{
                                          width: 390,
                                          marginBottom: 20,
                                          marginLeft: 6,
                                          overflow: "left",
                                          float: 'left'
                                      }}>
                            <div>
                                <Row>
                                    <Col span="10" style={{display:'flex', justifyContent:'center', height:'130px', alignItems:"center"}}>
                                        <Popover
                                            content={self.renderOneImage(item.image)}>
                                            <img alt="" style={{maxWidth:"100%", maxHeight: 90}}
                                                 src={ Config.url + '/image.ashx?name=' + item.image}/>
                                        </Popover>
                                    </Col>
                                    <Col span="5" style={{textAlign: "right"}}>
                                        <div>申请号：</div>
                                        <div>申请日：</div>
                                        <div>公告号：</div>
                                        <div>公告日：</div>
                                        <div>申请人：</div>
                                        <div>主分类号：</div>
                                        <div>分类号：</div>
                                    </Col>
                                    <Col span="8">
                                        <a style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}　onClick={self.getDetail.bind(self, item.code, item.patent.main_class)}>{item.code}</a> <div>{item.patent.ap_date}</div>
                                        <div title={item.patent.code} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pub_num}　</div>
                                        <div>{item.patent.pub_date}</div>
                                        <div title={item.patent.pa_name} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pa_name}　</div>

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
                </TabPane>
                <TabPane tab={"纹理 （" + this.state.data.lbp.length +"）"}  key="lbp">
                    {this.state.data.lbp.map(function (item, index) {
                        return (<Card key={'lbp_' + item.image} title={self.getTitle(item.patent.ap_name, index)} extra={<span>{((100-item.score.toFixed(2))*100)/100 + '%'}</span>}
                                      style={{
                                          width: 390,
                                          marginBottom: 20,
                                          marginLeft: 6,
                                          overflow: "left",
                                          float: 'left'
                                      }}>
                            <div>
                                <Row>
                                    <Col span="10" style={{display:'flex', justifyContent:'center', height:'130px', alignItems:"center"}}>
                                        <Popover

                                            content={self.renderOneImage(item.image)}>
                                            <img alt="" style={{maxWidth:"100%", maxHeight: 90}}
                                                 src={ Config.url + '/image.ashx?name=' + item.image}/>
                                        </Popover>
                                    </Col>
                                    <Col span="5" style={{textAlign: "right"}}>
                                        <div>申请号：</div>
                                        <div>申请日：</div>
                                        <div>公告号：</div>
                                        <div>公告日：</div>
                                        <div>申请人：</div>
                                        <div>主分类号：</div>
                                        <div>分类号：</div>
                                    </Col>
                                    <Col span="8">
                                        <a　style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}} onClick={self.getDetail.bind(self, item.code, item.patent.main_class)}>{item.code}</a> <div>{item.patent.ap_date}</div>
                                        <div title={item.patent.code} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pub_num}　</div>
                                        <div>{item.patent.pub_date}</div>
                                        <div title={item.patent.pa_name} style={{width:140,
                                            whiteSpace:'nowrap',
                                            wordBreak:'keep-all',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis'}}>{item.patent.pa_name}　</div>

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
                </TabPane>

            </Tabs>);
        }else if(this.state.data.hasOwnProperty("shape") && this.state.data.shape.length>0){
         return (
             <Tabs   type="line" style={{marginTop:12}}>
                 <TabPane tab={"结果 （" + self.state.data.shape.length +"）"} key="shape">
                     { self.state.data.shape.map(function (item, index) {

                         return (<Card key={'shape_' + item.image} title={self.getTitle(item.patent.ap_name, index)} extra={<span>{((100-item.score.toFixed(2))*100)/100 + '%'}</span>}
                                       style={{
                                           width: 390,
                                           marginBottom: 20,
                                           marginLeft: 6,
                                           overflow: "left",
                                           float: 'left'
                                       }}>
                             <div>
                                 <Row>
                                     <Col span="10" style={{display:'flex', justifyContent:'center', height:'130px', alignItems:"center"}}>
                                         <Popover
                                             content={self.renderOneImage(item.image)}>
                                             <img alt="" style={{maxWidth:"100%", maxHeight: 90}}
                                                  src={ Config.url + '/image.ashx?name=' + item.image}/>
                                         </Popover>
                                     </Col>
                                     <Col span="5" style={{textAlign: "right"}}>
                                         <div>申请号：</div>
                                         <div>申请日：</div>
                                         <div>公告号：</div>
                                         <div>公告日：</div>
                                         <div>申请人：</div>
                                         <div>主分类号：</div>
                                         <div>分类号：</div>
                                     </Col>
                                     <Col span="8">
                                         <a style={{width:140,
                                             whiteSpace:'nowrap',
                                             wordBreak:'keep-all',
                                             overflow:'hidden',
                                             textOverflow:'ellipsis'}} onClick={self.getDetail.bind(self, item.code, item.patent.main_class)}>{item.code}</a>
                                         <div>{item.patent.ap_date}</div>
                                         <div title={item.patent.code} style={{width:140,
                                             whiteSpace:'nowrap',
                                             wordBreak:'keep-all',
                                             overflow:'hidden',
                                             textOverflow:'ellipsis'}}>{item.patent.pub_num}　</div>
                                         <div>{item.patent.pub_date}</div>
                                         <div title={item.patent.pa_name} style={{width:140,
                                             whiteSpace:'nowrap',
                                             wordBreak:'keep-all',
                                             overflow:'hidden',
                                             textOverflow:'ellipsis'}}>{item.patent.pa_name}　 </div>

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
                 </TabPane>
             </Tabs>
         );
        }else{
            return <div style={{'textAlign':'center','padding':'1rem'}}><Spin /></div>;
        }
    }
    render() {
        var self = this;

        return (<div>
                {self.getTabs()}
                <div style={{'clear':'both','textAlign':'center'}}><Button  style={{width:'100%'}} onClick={this.more}>更多</Button></div>
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

export default LocarnoResultCards;