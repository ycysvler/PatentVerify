/**
 * Created by xiao on 2017/4/5.
 */
import React from 'react';
import {Modal, Popover} from 'antd';
import Config from 'config';
import './fast.css';

class DetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            detailData: this.props.detailData
        }
    }

    renderOneImage(url) {

        return <div>
            <img alt="" style={{maxWidth: 500, maxHeight: 500}} src={url}/>
        </div>
    }

    hideSelf() {
        this.props.hide();
    }

    render() {
        let self = this;
        let data = this.props.detailData["专利公开详情"];
        return (
            <Modal title={this.props.detailData["ap_name"]}
                   visible={this.props.visible}
                   width="1000px"
                   onCancel={this.hideSelf.bind(this)}
                   footer={null}
            >
                <table className="detailTable">
                    <tbody>
                    <tr>
                        <th>申请号：</th>
                        <td>{data["基本信息"]["申请号"]}</td>
                        <th>优先权：</th>
                        <td>{data["基本信息"]["优先权"]}</td>
                    </tr>
                    <tr>
                        <th>申请日：</th>
                        <td>{data["基本信息"]["申请日"]}</td>
                        <th>公开/公告号：</th>
                        <td> {data["基本信息"]["公告号"]}</td>
                    </tr>
                    <tr>
                        <th>公开/公告日：</th>
                        <td>{data["基本信息"]["公告日"]}</td>
                        <th>申请/专利权人：</th>
                        <td>{data["基本信息"]["专利权人"]}</td>
                    </tr>
                    <tr>
                        <th>发明/设计人：</th>
                        <td>{data["基本信息"]["设计人"]}</td>
                        <th>主分类号：</th>
                        <td>{data["基本信息"]["主分类号"]}</td>
                    </tr>
                    <tr>
                        <th>分类号：</th>
                        <td>{data["基本信息"]["分类号"]}</td>
                        <th>分案申请：</th>
                        <td>{data["基本信息"]["分案申请"]}</td>
                    </tr>
                    <tr>
                        <th>地址：</th>
                        <td>{data["基本信息"]["地址"]}</td>
                        <th> 国省代码：</th>
                        <td>{data["基本信息"]["国省代码"]}</td>
                    </tr>
                    <tr>
                        <th>颁证日：</th>
                        <td>{data["基本信息"]["颁证日"]}</td>
                        <th>范畴分类：</th>
                        <td>{data["基本信息"]["范畴分类"]}</td>
                    </tr>
                    <tr>
                        <th>专利代理机构：</th>
                        <td>{data["基本信息"]["专利代理机构"]}</td>
                        <th>代理人：</th>
                        <td>{data["基本信息"]["代理人"]}</td>
                    </tr>
                    <tr>
                        <th>国际申请：</th>
                        <td>{data["基本信息"]["国际申请"]}</td>
                        <th> 国际公布：</th>
                        <td>{data["基本信息"]["国际公布"]}</td>
                    </tr>
                    <tr>
                        <th>进入国家日期：</th>
                        <td>{data["基本信息"]["进入国家日期"]}</td>
                        <th></th>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan="4"></td>
                    </tr>

                    <tr>
                        <th>附图:</th>
                        <td colSpan="3">
                            {
                                data["附图"].map(function (item) {
                                    return <Popover key={item}
                                                    content={self.renderOneImage(Config.url + '/image.ashx?name=' + item)}>
                                        <img alt="" style={{marginRight: 30, marginBottom: 10, maxHeight: 90}}
                                             src={ Config.url + '/image.ashx?name=' + item}/>
                                    </Popover>
                                })
                            }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4" style={{margin: '10px 0', height: "1px", background: "#cccccc"}}></td>
                    </tr>
                    <tr>
                        <th>摘要:</th>
                        <td colSpan="3" style={{minHeight: 60, display: 'block'}}
                            dangerouslySetInnerHTML={{__html: data["摘要"].replace(/\r\n/g, '<br/>')}}></td>
                    </tr>

                    <tr>
                        <td colSpan="4" style={{margin: '10px 0', height: "1px", background: "#cccccc"}}></td>
                    </tr>

                    <tr>
                        <th>主权项:</th>
                        <td colSpan="3" style={{minHeight: 60, display: 'block'}}>{data["主权项"]}</td>
                    </tr>
                    </tbody>
                </table>
            </Modal>
        )
    }
}

export default DetailModal;