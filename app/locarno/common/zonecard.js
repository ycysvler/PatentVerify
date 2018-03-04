/**
 * Created by VLER on 2017/7/8.
 */

import React from 'react';
import {Card, Popover} from 'antd';
import './css.less';
import Config from 'config';
export default class ZoneCards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    renderOneImage(url) {
        url = Config.api + '/api/images/data/' + Config.appid + "/"+url;
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

        return (
            <Card key={item.image}
                  title={self.getTitle(item.patent.ap_name, index)}
                  extra={
                      <span>{item.result.score  + '%'}</span>}
                  style={{
                      width: 390,
                      marginBottom: 20,
                      marginLeft: 6,
                      overflow: "left",
                      float: 'left'
                  }}>
                <div>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                            <tr>
                                <td>申请号：</td>
                                <td><a style={{
                                    width: 140,
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                       onClick={self.props.getdetail.bind(self, item.patent.ap_num, item.patent.ap_num)}
                                >{item.patent.ap_num}</a></td>
                                <td>申请日：</td>
                                <td>{item.patent.ap_date}</td>
                            </tr>
                            <tr>
                                <td>公告号：</td>
                                <td>
                                    <div style={{
                                        width: 140,
                                        whiteSpace: 'nowrap',
                                        wordBreak: 'keep-all',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>{item.patent.pub_num} </div>
                                </td>
                                <td>公告日：</td>
                                <td>{item.patent.pub_date}</td>
                            </tr>
                            <tr>
                                <td>申请人：</td>
                                <td>
                                    <div style={{
                                        width: 140,
                                        whiteSpace: 'nowrap',
                                        wordBreak: 'keep-all',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>{item.patent.ap_name} </div>
                                </td>
                                <td>分类号：</td>
                                <td>{item.patent.main_class}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{height: '160px', marginTop: '8px'}}>
                        <Popover
                                 content={self.renderOneImage(item.result.image)}>
                            <div className="image_border">
                                <img alt=""
                                     style={{height: '150px', maxWidth: '150px'}}
                                     src={Config.api + '/api/images/data/' + Config.appid + '/' + item.result.image}/>
                            </div>
                        </Popover>
                        <Popover
                                 content={self.renderOneImage(item.result.image + '&colour=' + item.result.colour + '&rect=' + item.result.rect)}>
                            <div className="image_border">
                                <img alt=""
                                     style={{height: '150px', maxWidth: '150px'}}
                                     src={ Config.url + '/image.ashx?name=' + item.result.image + '&colour=' + item.result.colour + '&rect=' + item.result.rect}/>
                            </div>
                        </Popover>
                    </div>

                </div>
            </Card>)
    }
}
