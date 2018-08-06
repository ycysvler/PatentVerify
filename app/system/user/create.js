import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Popover, Button, Row, Select, Col, Input, TreeSelect, Icon} from 'antd';
import {UserActions, UserStore} from './userapi';
import {LocarnoActions} from "../../locarno/locarnoapi";

const {Content} = Layout;
const Option = Select.Option;

export default class UserCreate extends React.Component {

    constructor(props) {
        super(props);
        this.unsubscribe = UserStore.listen(this.onStatusChange.bind(this));
    }

    componentDidMount() {
    }

    onStatusChange = (type, data) => {
        if (type === "uploadImage") {
            var uploadImageList = this.state.uploadImageList;
            console.log('upload', data);
            this.setState({uploadImageList: uploadImageList.concat(data.data.name), imageState: true});
        } else if (type === "getAllType") {
            this.treeData = data;
            this.setState({typeList: data});
        } else if (type === "create") {
            console.log(this.props);
            this.goToHistorySearch();
        }
    }

    render() {
        let self = this;

        return (
            <Layout className="info">
                <Content style={{background: "#fff", paddingTop:12}}>

                    <Row className="row">
                        <Col span="4" className="label">
                            <span>用户名：</span>
                        </Col>
                        <Col span="8">
                            <Input placeholder="用户名"/>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>密码：</span>
                        </Col>
                        <Col span="8">
                            <Input type="password" placeholder="密码"/>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>角色：</span>
                        </Col>
                        <Col span="8">
                            <Select defaultValue="lucy"  >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="disabled" disabled>Disabled</Option>
                                <Option value="Yiminghe">yiminghe</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>昵称：</span>
                        </Col>
                        <Col span="8">
                            <Input  placeholder="中文名"/>
                        </Col>
                    </Row>

                    <div style={{position: "relative", marginTop: 24}}>
                        <Col span="4">
                            <span></span>
                        </Col>
                        <Col span="8">
                            <Button type="primary" >确定</Button>
                            <Link to="/main/system/users"><Button style={{marginLeft: 8}}>取消</Button></Link>
                        </Col>
                    </div>
                </Content>
            </Layout>
        );
    }

}