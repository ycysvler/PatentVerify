/**
 * Created by xiao on 2017/4/5.
 */
import React from 'react';
import {Modal,Popover} from 'antd';
import './fast.css';

class DetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:this.props.visible,
            detailData:this.props.detailData
        }
    }
    renderOneImage(url) {

        return <div>
            <img alt="" style={{maxWidth:500, maxHeight:500}} src={url}/>
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
                <table className="detailTable" >
                    <tbody>
                    <tr><th><div>申请号：</div></th><td><div>{data["基本信息"]["申请号"]}</div></td><th><div>优先权：</div></th><td><div>{data["基本信息"]["优先权"]}</div></td></tr>
                    <tr><th><div>申请日：</div></th><td><div>{data["基本信息"]["申请日"]}</div></td><th><div>公开/公告号：</div></th><td> <div>{data["基本信息"]["公告号"]}</div></td></tr>
                    <tr><th><div>公开/公告日：</div></th><td><div>{data["基本信息"]["公告日"]}</div></td><th><div>申请/专利权人：</div></th><td><div>{data["基本信息"]["专利权人"]}</div></td></tr>
                    <tr><th><div>发明/设计人：</div></th><td><div>{data["基本信息"]["设计人"]}</div></td><th><div>主分类号：</div></th><td><div>{data["基本信息"]["主分类号"]}</div></td></tr>
                    <tr><th><div>分类号：</div></th><td><div>{data["基本信息"]["分类号"]}</div></td><th><div>分案申请：</div></th><td><div>{data["基本信息"]["分案申请"]}</div></td></tr>
                    <tr><th><div>地址：</div></th><td><div>{data["基本信息"]["地址"]}</div></td><th> <div>国省代码：</div></th><td><div>{data["基本信息"]["国省代码"]}</div></td></tr>
                    <tr><th><div>颁证日：</div></th><td><div>{data["基本信息"]["颁证日"]}</div></td><th><div>范畴分类：</div></th><div>{data["基本信息"]["范畴分类"]}</div><td></td></tr>
                    <tr><th><div>专利代理机构：</div></th><td><div>{data["基本信息"]["专利代理机构"]}</div></td><th><div>代理人：</div></th><td><div>{data["基本信息"]["代理人"]}</div></td></tr>
                    <tr><th><div>国际申请：</div></th><td><div>{data["基本信息"]["国际申请"]}</div></td><th> <div>国际公布：</div></th><td><div>{data["基本信息"]["国际公布"]}</div></td></tr>
                    <tr><th><div>进入国家日期：</div></th><td><div>{data["基本信息"]["进入国家日期"]}</div></td><th></th><td></td></tr>
                    <tr><td colSpan="4"> <div style={{margin:'10px 0',height:"1px",background:"#cccccc"}}></div></td></tr>

                    <tr><th>附图:</th><td colSpan="3">
                        <div>
                            {
                                data["附图"].map(function(item){
                                    return  <Popover  key={item}
                                                      content={self.renderOneImage(Config.url+'/image.ashx?name='+item)}>
                                            <img alt="" style={{marginRight:30, marginBottom:10, maxHeight: 90}}
                                                 src={ Config.url+'/image.ashx?name='+item}/>
                                        </Popover>
                                })
                            }

                        </div>
                    </td></tr>
                    <tr><td colSpan="4"> <div style={{margin:'10px 0',height:"1px",background:"#cccccc"}}></div></td></tr>
                    <tr><th>摘要:</th><td colSpan="3"><div style={{minHeight:60}}>{data["摘要"]}</div></td></tr>

                    <tr><td colSpan="4"> <div style={{margin:'10px 0',height:"1px",background:"#cccccc"}}></div></td></tr>

                    <tr><th>主权项:</th><td colSpan="3"><div style={{minHeight:60}}>{data["主权项"]}</div></td></tr>
                    </tbody>
                </table>
            </Modal>
        )
    }
}

export default DetailModal;