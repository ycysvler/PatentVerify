import React from 'react';
import {Layout, Menu, Button} from 'antd';
import {IndexActions, IndexStore} from '../api.js';
import {HashRouter as Router,Link, Switch, Route} from 'react-router-dom';

import NotFound from '../notfound';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

import LocarnoFastList from '../locarno/fast/list.js';
import LocarnoFastCreate from '../locarno/fast/create.js';
import LocarnoFastDetails from './fast_v2/detail.js';

import LocarnoSeniorList from '../locarno/senior/list.js';
import LocarnoSeniorCreate from '../locarno/senior/create.js';
import LocarnoSeniorDetails from '../locarno/senior/details.js';

import LocarnoZoneList from '../locarno/zone/list.js';
import LocarnoZoneCreate from '../locarno/zone/create.js';
import LocarnoZoneDetails from '../locarno/zone/details.js';

export default class Locarno extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = IndexStore.listen(this.onStatusChange.bind(this));
        this.state ={"indexList": [], "leftIndex": [],topMenuKey:"02","leftMenuKey":this.getMenuKey()};

        IndexActions.getIndexes();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }


    getTopMenuChildren=(data)=>{
        var self = this;
        for(var i=0;i<data.length;i++){
            var item = data[i];
            if(item.rid === "02"){
                return item.children;
            }
        }
    }
    getMenuKey=()=>{
        var url =  window.location.hash;

        if(url.indexOf("locarno/fast")>-1){return "0201";}
        if(url.indexOf("locarno/senior")>-1){return "0202";}
        if(url.indexOf("locarno/zone")>-1){return "0203";}
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


                            <Route component={NotFound}/>
                        </Switch>
                    </Router>

                </Layout>


            </Layout>
        );
    }
}

