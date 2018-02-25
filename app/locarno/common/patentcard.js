/**
 * Created by VLER on 2017/7/8.
 */

import React from 'react';
import {Card, Row, Col, Popover } from 'antd';
import Config from 'config';

class PatentCards extends React.Component {

    constructor(props) {
        super(props);

        this.state = { }
    }
    renderOneImage(url) {
        url = Config.api + '/api/images/data/' + Config.appid + "/"+url;//Config.url + '/image.ashx?name=' + url;
        return <div>
            <img alt="" style={{maxWidth: 300, maxHeight: 300}} src={url}/>
        </div>
    }

    getTitle(title, index) {
        return (
            <div
                title={title}
                style={{
                    width: 280,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    wordBreak: 'keep-all',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >{"[" + (index + 1) + "] " + title}</div>
        );
    }

    render() {
        var self = this;
        var item = this.props.item;
        var index = this.props.index;

        return (<Card key={item.image}
                      title={self.getTitle(item.patent.ap_name, index)}
                      extra={<span>{((1 - item.score) * 100).toFixed(2)  + '%'}</span>}
                      style={{
                          width: 390,
                          marginBottom: 20,
                          marginLeft: 6,
                          overflow: "left",
                          float: 'left'
                      }}>
            <div>
                <Row>
                    <Col span="10" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '130px',
                        alignItems: "center"
                    }}>
                        <Popover
                            content={self.renderOneImage(item.image)}>
                            <img alt=""
                                 style={{maxWidth: "100%", maxHeight: 90}}
                                 src={ Config.api + '/api/images/data/' + Config.appid + "/" + item.image}/>
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
                        <a style={{
                            width: 140,
                            whiteSpace: 'nowrap',
                            wordBreak: 'keep-all',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                           onClick={self.props.getdetail.bind(self, item.code, item.patent.main_class)}
                        >{item.code}</a>
                        <div>{item.patent.ap_date}</div>
                        <div title={item.patent.code} style={{
                            width: 140,
                            whiteSpace: 'nowrap',
                            wordBreak: 'keep-all',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{item.patent.pub_num} </div>
                        <div>{item.patent.pub_date}</div>
                        <div title={item.patent.pa_name} style={{
                            width: 140,
                            whiteSpace: 'nowrap',
                            wordBreak: 'keep-all',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{item.patent.pa_name} </div>
                        <div>{item.patent.main_class}</div>
                        <div title={item.patent.sub_class} style={{
                            width: 140,
                            whiteSpace: 'nowrap',
                            wordBreak: 'keep-all',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{item.patent.sub_class}</div>
                    </Col>
                </Row>
            </div>
        </Card>)
    }
}

export default PatentCards;