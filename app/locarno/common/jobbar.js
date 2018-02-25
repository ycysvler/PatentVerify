/**
 * Created by VLER on 2017/7/6.
 */
import React from 'react';
import {Popover,Progress} from 'antd';
import './css.less';
import Config from 'config';

class JobBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    renderOneImage(url) {
        return <div>
            <img alt="" style={{maxWidth:400, maxHeight:400}} src={ Config.api + '/api/images/data/' + Config.appid + "/"+url}/>
        </div>
    }
    render() {
        let self = this;
        return (<div className="props">
                <div className="item" ><h2>任务信息</h2></div>
                <div className="item">任务描述</div>
                <div className="dark item">{this.props.job.jobname}</div>
                <div className="item">专类类型</div>
                <div className="dark item">{this.props.job.typenames.join() }</div>
                <div className="item">检索进度</div>
                <div className="dark item">
                    <Progress percent={this.props.job.progress} strokeWidth={8} />
                     </div>
                <div className="item">创建日期</div>
                <div className="dark item">{this.props.job.create_time }</div>
                <div className="item"> 完成时间</div>
                <div className="dark item"> {this.props.job.end_time  }</div>
                <div className="item">检索图像</div>
                <div className="dark item" style={{padding:'12px'}}>
                {
                    this.props.job.images.map(function (url) {
                        return <Popover key={url} content={self.renderOneImage(url)}>
                                <img alt=""
                                     style={{width:'40%',margin:'5%',maxHeight:'200px'}}
                                     src={ Config.api + '/api/images/data/' + Config.appid + "/"+url}/>

                        </Popover>
                    })
                }</div>
            </div>
        )
    }
}

export default JobBar;