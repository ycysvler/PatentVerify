import React from 'react';
import {Layout, Checkbox,Table, Modal} from 'antd';
import Config from 'config';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import {ContrastActions, ContrastStore} from '../contrast/reflux.js';
import Patent from '../patent/index';

import '../style/locarno.less';

export default class PatentGrid extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_contrast = ContrastStore.listen(this.onStatusChange.bind(this));

        this.state = {
            visible: false,
            contrast: [],
            showIndex: -1,
            data: []
        };
    }

    componentWillUnmount() {
        this.unsubscribe_locarno();
        this.unsubscribe_contrast();
    }

    onStatusChange(action, data) {
        if (action === "getResultPatents") {
            this.setState({data: data});
        }
        if (action === "contrast") {
            this.setState({contrast: data});
        }
    }

    columns = [{
        title: '产品名称',
        dataIndex: 'ap_name',
        key: 'ap_name',
        render: text => <a href="#">{text}</a>,
    }, {
        title: '公开号',
        dataIndex: 'pub_num',
        key: 'pub_num'
    }, {
        title: '分类',
        dataIndex: 'main_class',
        key: 'main_class'
    }, {
        title: '申请日',
        dataIndex: 'ap_date',
        key: 'ap_date'
    }, {
        title: '设计人',
        dataIndex: 'designer',
        key: 'designer'
    }];
    expandedRowRender = record => {
        let doms = [];
        record.images.map((item,index)=>{
          doms.push( <div className="img-box-small" key={index} >
              <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + item.name}/>
          </div>);
        });
        return <div className="patent-imgs">
            <div className="img-box-small" style={{border:0}} >
                <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + record.image}/>
            </div>
            {doms}
            </div>;
    };

    onMouseEnter = (key) => (e) => {
        this.setState({showIndex: key});
    }

    onCheck = (item) => (e) => {
        if (e.target.checked) {
            ContrastActions.add(item);
        } else {
            ContrastActions.remove(item.image);
        }
    }

    showPatent = (ap_num) => {
        this.setState({ap_num: ap_num, typeid: this.props.typeid, visible: true});
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        return (<div className="img-layout-patent" >
            <Table rowKey="id" expandedRowRender={this.expandedRowRender}
                   rowSelection={{}}
                   Pagination={{ position: 'both' }}
                   columns={this.columns} dataSource={this.state.data} />

            <Modal
                width={840}
                title="专利详情" footer={null}
                visible={this.state.visible}
                onCancel={this.handleCancel}
            >
                <Patent ap_num={this.state.ap_num} typeid={this.props.typeid}/>
            </Modal>
        </div>);
    }
}