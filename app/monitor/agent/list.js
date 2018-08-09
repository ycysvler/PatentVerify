/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout,  Row,Table,  Col,  Breadcrumb} from 'antd';
import {AgentActions,AgentStore} from './agentapi';

const { Content} = Layout;

export default class AgentList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = AgentStore.listen(this.onStatusChange.bind(this));
        this.state = {items:[]};
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        AgentActions.list();
    }
    /*
     * store 触发的事件
     * */
    onStatusChange(action, data) {
        if (action === "list") {
            this.setState({items: data.data});
        }
    }

    columns = [
        {
            title: 'instanceid',
            dataIndex: 'instanceid',
        },
        {
            title: 'package',
            dataIndex: 'package',
        },
        {
            title: 'time',
            dataIndex: 'time',
        } ];


    render() {
        let self = this;
        return (
            <Layout className="info">
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>服务监控</Breadcrumb.Item>
                        <Breadcrumb.Item>服务监控</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Layout>
                    <Content className="content">
                        {
                            this.state.items.map((item, index)=>{
                                return <Row key={index}>
                                    <Col span="24"><b style={{paddingLeft:8}}>Agent IP : {item.ip}</b></Col>
                                    <Col span="24">

                                        <Table style={{marginTop: "20px"}}
                                               bordered={true}
                                               rowKey="package"
                                               columns={self.columns} dataSource={item.instances}
                                               size="middle"/>

                                    </Col>

                                </Row>
                            })
                        }


                    </Content>
                </Layout>
            </Layout>


        );
    }
}

