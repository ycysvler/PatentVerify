/**
 * Created by VLER on 2017/7/8.
 */

import React from 'react';
import {Card,Popover} from 'antd';
import './css.less';

class GroupCards extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    renderOneImage(url) {
        url = Config.url + '/image.ashx?name=' + url;
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
                      title={self.getTitle(item.ap_name, index)}
                      extra={
                          <span>命中：{item.count}</span>}
                      style={{
                          width: 390,
                          marginBottom: 20,
                          marginLeft: 6,
                          overflow: "left",
                          float: 'left'
                      }}>
            <div>
                <div>
                    <table style={{width:'100%'}}>
                        <tbody>
                        <tr><td>申请号：</td>
                            <td><a style={{
                                width: 140,
                                whiteSpace: 'nowrap',
                                wordBreak: 'keep-all',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                                       onClick={self.props.getdetail.bind(self, item.ap_num, item.ap_num)}
                            >{item.ap_num}</a></td>
                            <td>申请日：</td>
                            <td>{item.ap_date}</td>
                        </tr>
                        <tr><td>公告号：</td>
                            <td><div  style={{
                                    width: 140,
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'keep-all',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{item.pub_num} </div>
                            </td>
                            <td>公告日：</td>
                            <td>{item.pub_date}</td>
                        </tr>
                        <tr><td>申请人：</td>
                            <td><div  style={{
                                width: 140,
                                whiteSpace: 'nowrap',
                                wordBreak: 'keep-all',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>{item.ap_name} </div></td>
                            <td>分类号：</td>
                            <td>{item.main_class}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{height: '60px',marginTop:'8px'}}>
                    {
                        item.images != null ? item.images.map(function (image, index) {
                                return (index < 5 ? <Popover key={image.name}
                                                             content={self.renderOneImage(image.name)}>
                                        <div className="image_border">
                                        <img alt=""
                                             style={{height: '50px', maxWidth: '50px'}}
                                             src={ Config.url + '/image.ashx?name=' + image.name}/></div>
                                    </Popover> : null)
                            }) :
                            null
                    }
                </div>

            </div>
        </Card>)
    }
}

export default GroupCards;