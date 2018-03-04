import React from 'react';
import {Layout, Menu, Button} from 'antd';
import {IndexActions, IndexStore} from './api.js';
import {HashRouter as Router,Redirect,Link, Switch, Route} from 'react-router-dom';


import NotFound from './notfound';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

import LocarnoFastList from './locarno/fast/list.js';
import LocarnoFastCreate from './locarno/fast/create.js';
import LocarnoFastDetails from './locarno/fast/details.js';

import LocarnoSeniorList from './locarno/senior/list.js';
import LocarnoSeniorCreate from './locarno/senior/create.js';
import LocarnoSeniorDetails from './locarno/senior/details.js';

import LocarnoZoneList from './locarno/zone/list.js';
import LocarnoZoneCreate from './locarno/zone/create.js';
import LocarnoZoneDetails from './locarno/zone/details.js';

import ImageInfo from './tools/imageinfo/index.js';

import './styles/app.less';
class App extends React.Component {
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
                                {/*外观.快速检索.历史查询*/}
                                <Route path="/main/locarno/fast/list" component={LocarnoFastList}/>
                                {/*新建快速查询*/}
                                <Route path="/main/locarno/fast/create" component={LocarnoFastCreate}/>
                                {/*快速检索结果*/}
                                <Route path="/main/locarno/fast/details" component={LocarnoFastDetails}/>

                                {/*外观.快速检索.历史查询*/}
                                <Route path="/main/locarno/senior/list" component={LocarnoSeniorList}/>
                                {/*新建快速查询*/}
                                <Route path="/main/locarno/senior/create" component={LocarnoSeniorCreate}/>
                                {/*快速检索结果*/}
                                <Route path="/main/locarno/senior/details" component={LocarnoSeniorDetails}/>

                                {/*外观.快速检索.历史查询*/}
                                <Route path="/main/locarno/zone/list" component={LocarnoZoneList}/>
                                {/*新建快速查询*/}
                                <Route path="/main/locarno/zone/create" component={LocarnoZoneCreate}/>
                                {/*快速检索结果*/}
                                <Route path="/main/locarno/zone/details" component={LocarnoZoneDetails}/>

                                {/*快速局部结果*/}
                                <Route path="/main/tools/imageinfo" component={ImageInfo}/>

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
