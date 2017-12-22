import React from 'react';
import {Input, Row, Col,  Button} from 'antd';
import {IndexActions, IndexStore} from './api.js';

import './styles/login.less';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = IndexStore.listen(this.onStatusChange.bind(this));
        this.state ={"logined": false};

    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange=(data)=> {
        window.document.cookie = "token="+data.token+";path=/";
        window.document.cookie = "user_id="+data.userid+";path=/";
        window.document.cookie = "user_name="+data.username+";path=/";
        //this.context.router.push("/attached/fast/list");
        this.props.router.push( '/locarno/fast/list');
    }

    login=()=> {
        let account = this.state.account;
        let password = this.state.password;

        if(account && account === "") {
            alert("账号不能为空");
            return;
        }
        if(password && password === "") {
            alert("密码不能为空");
            return;
        }
       IndexActions.login(account,password);
    }

    accountChange=(e)=>{
        this.state.account = e.target.value;
    }

    passwordChange=(e)=>{
        this.state.password = e.target.value;
    }

    render=()=> {
        let selectshowstyle = this.state.logined ? {display: 'block'} : {display: 'none'};
        let loginput = !this.state.logined ? {display: 'block'} : {display: 'none'};

        return (
            <div className="login_root">

                <header id="header" className="clearfix">
                    <div className="ant-row">
                        <div className="ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-8">
                            <a href="#/">
                                <div className='logo'/>
                                <span className="title">专利图形搜索系统</span></a>
                        </div>
                    </div>
                </header>
                <div className="login">
                    <div className="content-main">
                        <section className="login login-frame">
                            <div className="login-form" style={{height: '480px', width: '450px'}}>
                                <div className="login-form">
                                    <div className="login-main">
                                        <div className="login-title">
                                            <div className="logo-con">
                                                <span className="logo-img"/>
                                            </div>
                                            <span>欢迎使用专利图形搜索系统</span>
                                        </div>
                                        <div className="form-item">
                                            <div style={loginput}>
                                                <Input size="large" onChange={this.accountChange}  name="account" placeholder="账户（邮箱或手机号）"/>
                                                <Input size="large" onChange={this.passwordChange}  type="password" name="account" placeholder="密码"/>
                                                <Button type="primary" className="login-button" onClick={this.login}>登
                                                    录</Button>
                                            </div>
                                            <Row gutter={16} className="form-in" style={selectshowstyle}>
                                                <Col span={12}><a href="#/figure/feature"><Button
                                                    type="primary">登录（专利附图）</Button></a></Col>
                                                <Col span={12}><a href="#/appearance/feature"><Button type="primary">登录（专利外观）</Button></a></Col>
                                            </Row>
                                            <div className="ui-form-explain"></div>
                                        </div>
                                        <div className="link-con">
                                            <a className="link-item link-item-last" title="系统建设中，后期开放...."
                                               target="_parent">免费注册</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <footer id="footer">
                    <div style={{padding: '10px'}}>
                        版权所有 © 2015 北京邦焜威讯网络技术有限公司
                    </div>
                </footer>
            </div>
        );
    }
}

export default Login;
