import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Popover, Button, Row, Select, Col, Input, TreeSelect, Icon} from 'antd';
import {UserActions, UserStore} from './userapi';
import {RoleActions, RoleStore} from '../role/roleapi';
import {LocarnoActions} from "../../locarno/locarnoapi";

const {Content} = Layout;
const Option = Select.Option;

export default class UserCreate extends React.Component {

    constructor(props) {
        super(props);
        this.unsubscribe_user = UserStore.listen(this.onUserStatusChange.bind(this));
        this.unsubscribe_role = RoleStore.listen(this.onRoleStatusChange.bind(this));

        this.state = {roles:[], info:{}, enable:true};
    }

    componentDidMount() {
        RoleActions.list();
    }

    componentWillUnmount() {
        this.unsubscribe_user();
        this.unsubscribe_role();
    }

    onUserStatusChange = (type, data) => {
        if (type === "create") {
            this.props.history.push('/main/system/users');
        }
    }

    onRoleStatusChange = (type, data) => {
        if (type === "list") {
            this.setState({roles:data.data});
        }
    }

    onSubmit=()=>{
        UserActions.create(this.state.info);
    }

    handleChange=(value)=> {
        let self = this;
        for(let item of this.state.roles){
            if(item.rolename === value){
                let info = self.state.info;
                info.menus = item.menus;
                self.setState({'info':info, enable:false});
            }
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
                            <Input placeholder="用户名"
                                onBlur={(e)=>{
                                    var info = this.state.info;
                                    info.username = e.target.value;
                                    this.setState({'info':info})}}
                            />
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>密码：</span>
                        </Col>
                        <Col span="8">
                            <Input type="password" placeholder="密码"
                                   onBlur={(e)=>{
                                       var info = this.state.info;
                                       info.password = e.target.value;
                                       this.setState({'info':info})}}
                            />
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>角色：</span>
                        </Col>
                        <Col span="8">
                            <Select style={{width:200}} onChange={this.handleChange} >
                                {
                                    this.state.roles.map((item, index)=>{
                                        return <Option key={item.rolename} value={item.rolename}>{item.cname}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>昵称：</span>
                        </Col>
                        <Col span="8">
                            <Input  placeholder="中文名"
                                    onBlur={(e)=>{
                                        var info = this.state.info;
                                        info.cname = e.target.value;
                                        this.setState({'info':info})}}
                            />
                        </Col>
                    </Row>

                    <div style={{position: "relative", marginTop: 24}}>
                        <Col span="4">
                            <span></span>
                        </Col>
                        <Col span="8">
                            <Button onClick={this.onSubmit} type="primary"
                                    disabled={this.state.enable}
                            >确定</Button>
                            <Link to="/main/system/users"><Button style={{marginLeft: 8}}>取消</Button></Link>
                        </Col>
                    </div>
                </Content>
            </Layout>
        );
    }

}