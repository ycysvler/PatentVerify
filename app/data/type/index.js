/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb, Table, Button} from 'antd';
import {LocarnoActions, LocarnoStore} from '../../locarno/locarnoapi';
import {DataActions, DataStore} from '../dataapi';
const {Content} = Layout;

class TypeList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribeLocarno = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.unsubscribeData = DataStore.listen(this.onStatusChange.bind(this));

        this.state = {typeList: []}

    }

    componentDidMount() {
        LocarnoActions.getAllType();
    }

    componentWillUnmount() {
        this.unsubscribeLocarno();
        this.unsubscribeData();
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action, data) {
        if (action === "list") {
            this.setState({users: data});
        } else if (action === "getAllType") {
            this.setState({typeList: data});
        }
    }

    columns = [{
        title: '类型',
        dataIndex: 'label',
        key: 'label',
    }, {
        title: '类型',
        width:150,
        dataIndex: '', key: 'key',
        render: (row) => <Button onClick={this.rebuild.bind(this, row)}>重建索引</Button>
    },
    ];

    rebuild = (row) => {
        console.log('rebuild', row);


        DataActions.reBuildIndex(row.key);
    }

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Layout className="content">
                    <Content >
                        <Table bordered pagination={{pageSize: 100, hideOnSinglePage: true}} columns={this.columns}
                               rowSelection={this.rowSelection} dataSource={this.state.typeList}/>
                    </Content>
                </Layout>

            </Layout>


        );
    }
}

export default TypeList;
