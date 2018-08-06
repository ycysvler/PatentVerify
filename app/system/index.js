import React from 'react';
import {Layout, Menu, Button} from 'antd';
import {IndexActions, IndexStore} from '../api.js';
import {HashRouter as Router,Link, Switch, Route} from 'react-router-dom';
import UserList from './user/list';
import UserCreate from './user/create';
import NotFound from '../notfound';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;


export default class System extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = IndexStore.listen(this.onStatusChange.bind(this));
        this.state ={"indexList": [], "leftIndex": [],topMenuKey:"07","leftMenuKey":this.getMenuKey()};

        if(IndexStore.currentUser == null){
            props.history.push("/signin");
        }else{
            IndexActions.getIndexes();
        }
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    shouldComponentUpdate(nextProps, nextState){
        if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
            return true;
        } else {
            return false;
        }
    }

    getTopMenuChildren=(data)=>{
        var self = this;
        for(var i=0;i<data.length;i++){
            var item = data[i];
            if(item.rid === "07"){
                return item.children;
            }
        }
    }
    getMenuKey=()=>{
        var url =  window.location.hash;
        if(url.indexOf("system/users")>-1){return "0701";}
        if(url.indexOf("locarno/roles")>-1){return "0702";}
    }

    onStatusChange=(action, result)=> {
        // 判断一下action,当同一个Store多个不同的方法发出trigger时好区分是谁发的
        if (action === 'getIndexes') {
            this.setState({indexList: result.data});
            this.setState({leftIndex: this.getTopMenuChildren(result.data)});
        }
    }

    render=()=> {
        let lIndexs = this.state.leftIndex;
        return (
            <Layout >
                <Sider width={250} style={{background: '#fff'}} className="ant-layout-sider">
                    <Menu
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
                <Layout className="patent-layout-content">
                    <Router>
                        <Switch>
                            {/*外观.快速检索.历史查询*/}

                            <Route path="/main/system/users/create" component={UserCreate}/>
                            <Route path="/main/system/users" component={UserList}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Router>

                </Layout>


            </Layout>
        );
    }
}

