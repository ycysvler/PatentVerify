import React from 'react';
import {Layout, Popover,Table, Modal} from 'antd';
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
            data: [],
            total:0,
            expandedRowKeys:[]
        };
    }

    componentWillUnmount() {
        this.unsubscribe_locarno();
        this.unsubscribe_contrast();
    }

    onStatusChange(action, data) {
        if (action === "getResultPatents") {
            let expandedRowKeys = [];
            for(let index in data.datas){
                let item = data.datas[index];
                expandedRowKeys.push(item.image);
            }
            this.setState({expandedRowKeys:expandedRowKeys,total:data.total,data: data.datas});
        }
        if (action === "contrast") {
            this.setState({contrast: data});
        }
    }



    columns = [{
        title: '产品名称',
        dataIndex: 'ap_name',
        key: 'ap_name',
        render: (text,record) => <a onClick={this.showPatent.bind(this,record.code)} >{text}</a>,
    }, {
        title: '公开号',
        dataIndex: 'pub_num',
        key: 'pub_num'
    }, {
        title: '公开日',
        dataIndex: 'pub_date',
        key: 'pub_date'
    }, {
        title: '申请号',
        dataIndex: 'ap_num',
        key: 'ap_num'
    }, {
        title: '申请日',
        dataIndex: 'ap_date',
        key: 'ap_date'
    }, {
        title: '分类',
        dataIndex: 'main_class',
        key: 'main_class'
    }, {
        title: '设计人',
        dataIndex: 'designer',
        key: 'designer'
    }];
    expandedRowRender = record => {
        let doms = [];
        let self = this;
        record.images.map((item,index)=>{
            doms.push(<Popover key={index} content={self.renderOneImage(item.name)}> <div className="img-box-small" key={index} >
              <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + item.name}/>
          </div></Popover>);
        });
        return <div className="patent-imgs">
            <Popover  content={self.renderOneImage(record.image)}>
            <div className="img-box-small" style={{border:0, background:'#1890ff'}} >
                <img  src={Config.api + '/api/images/data/' + Config.appid + '/' + record.image}/>
            </div></Popover>
            {doms}
            </div>;
    };

    renderOneImage(name) {
        return <div>
            <img alt="" style={{maxWidth:500, maxHeight:500}} src={Config.api + '/api/images/data/' + Config.appid + '/' + name}/>
        </div>
    }

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

    onPageChange = (page) => {
        this.state.current = page;
        this.props.onPageChange(page);
    }

    onRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            ContrastActions.over(selectedRows);
        }
    };

    render() {
        return (<div className="img-layout-patent" >
            <Table rowKey="image" expandedRowRender={this.expandedRowRender}
                   rowSelection={this.onRowSelection}
                   expandedRowKeys={this.state.expandedRowKeys}
                   pagination={{ position:'top',total:this.state.total,pageSize:10,onChange:this.onPageChange}}
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