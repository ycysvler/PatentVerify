import React from 'react';
import {Layout, Menu, Button} from 'antd';
import {IndexActions, IndexStore} from '../api.js';
import {HashRouter as Router,Link, Switch, Route} from 'react-router-dom';
import Locarno from '../locarno';
import NotFound from '../notfound';

import './main.less';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = IndexStore.listen(this.onStatusChange.bind(this));
        this.state ={"indexList": [], "leftIndex": [],topMenuKey:this.getTopMenuKey(this.getUrl()),"leftMenuKey":this.getUrl()};

        if(IndexStore.currentUser == null){
            props.history.push("/signin");
        }else{
            IndexActions.getIndexes();
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
        if(url.indexOf("data")>-1){return "06";}
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

    onClickHandler= (e)=> {
        for (let i = 0; i < this.state.indexList.length; i++) {
            if (this.state.indexList[i].rid === e.key) {
                this.setState({leftIndex: this.state.indexList[i].children});
                return;
            }
        }
    }
    render=()=> {
        let index_list = this.state.indexList;
        return (
            <Layout className="main-root">
                <Header style={{height:65}} className="header">
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
                    <Router>
                        <Switch>
                            {/*外观.快速检索.历史查询*/}
                            <Route path="/main/locarno" component={Locarno}/>


                            <Route component={NotFound}/>
                        </Switch>
                    </Router>

                </Layout>


            </Layout>
        );
    }
}

