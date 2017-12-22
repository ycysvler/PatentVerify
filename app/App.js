import React from 'react';
import {Layout, Menu, Button} from 'antd';
import {IndexActions, IndexStore} from './api.js';
import {HashRouter as Router,Redirect,Link, Switch, Route} from 'react-router-dom';
import LocarnoFastList from './locarno/fast/list.js';
import NotFound from './notfound';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

import './styles/app.less';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = IndexStore.listen(this.onStatusChange.bind(this));
        this.state ={"indexList": [], "leftIndex": [],topMenuKey:this.getTopMenuKey(this.getUrl()),"leftMenuKey":this.getUrl()};

        IndexActions.getIndexes(this.getCookie("user_id"),this.getCookie("token"));

        if(IndexStore.currentUser == null){
            props.history.push("/signin");
        }
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    getTopMenuKey=(url)=>{
        if(url.indexOf("attached")>-1){return "01";}
        if(url.indexOf("locarno")>-1){return "02";}
        if(url.indexOf("system")>-1){return "07";}
        if(url.indexOf("tools")>-1){return "03";}
    }
    getTopMenuChildren=(data, url)=>{
        var self = this;
        for(var i=0;i<data.length;i++){
            var item = data[i];
            if(item.rid === self.getTopMenuKey(url)){
                return item.children;
            }
        }
    }
    getUrl=()=>{
        var path =  window.location.hash;
        return path.substring(1, path.length);
    }

    onStatusChange=(action, result)=> {
        // 判断一下action,当同一个Store多个不同的方法发出trigger时好区分是谁发的
        if (action === 'getIndexes') {
            this.setState({indexList: result.data});
            this.setState({leftIndex: this.getTopMenuChildren(result.data, this.getUrl())});
        }
    }
    getCookie=(name)=> {
        if(window.document.cookie === "") {
            this.context.router.push("/");
            return;
        }
        let cookies = window.document.cookie.split(";");
        if(name === "token") {
            let token = cookies[0].substring(6);
            if(!token || token === "") {
                this.context.router.push("/");
                return;
            } else {
                return token;
            }
        } else if(name === "user_id") {
            let user_id = cookies[1].substring(9);
            if(!user_id || user_id === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_id;
            }
        } else {
            let user_name = cookies[2].substring(11);
            if(!user_name || user_name === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_name;
            }
        }
    }

    onClickHandler= (e)=> {
        for (let i = 0; i < this.state.indexList.length; i++) {
            if (this.state.indexList[i].rid === e.key) {
                this.setState({leftIndex: this.state.indexList[i].children});
                return;
            }
        }
    }
    render=()=> {
        let lIndexs = this.state.leftIndex;
        let index_list = this.state.indexList;
        return (
            <Layout className="app-root">
                <Header style={{background: '#fff'}}>
                    <div className="logo" >专利图形搜索系统</div>
                    <div style={{float: 'right'}}>
                        <Layout style={{"background": "white"}}>
                            <Content>
                                <Menu mode="horizontal"
                                      defaultSelectedKeys={[this.state.topMenuKey]}
                                    style={{lineHeight: '63px'}}
                                    onClick={this.onClickHandler}
                                >
                                    {
                                        index_list.map(function (index) {
                                            return <Menu.Item key={index.rid}>{index.rname}</Menu.Item>
                                        })
                                    }
                                </Menu>
                            </Content>

                            <Sider width={160} className="box"
                                   style={{background: '#fff', height: '64px', justifyContent: 'flex-end'}}>
                                <Button style={{"background": "#fff", "border": "none"}} icon="question-circle-o"
                                        size="small" className="header-help">帮助</Button>

                            </Sider>

                        </Layout>
                    </div>
                </Header>

                <Layout>
                    <Sider width={250} >
                        <Menu theme="dark"
                            mode="inline"
                              defaultSelectedKeys={[this.state.leftMenuKey]}
                        >
                            {
                                lIndexs.map(function (lIndex) {
                                    if (lIndex.children.length > 0) {
                                        return <SubMenu key={lIndex.rid} title={<span>{lIndex.rname}</span>}>
                                            {
                                                lIndex.children.map(function (i) {
                                                    return <Menu.Item key={i.rid}><Link to={i.url}>{i.rname }</Link></Menu.Item>
                                                })
                                            }
                                        </SubMenu>
                                    } else {
                                        return <Menu.Item key={lIndex.rid}><Link to={lIndex.url}>{lIndex.rname }</Link></Menu.Item>
                                    }
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout>
                        <Router>
                            <Switch>
                                <Route strict path="/main/locarno/fast/list" component={LocarnoFastList}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </Router>


                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default App;
