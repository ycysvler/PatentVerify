import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Tree, Button, Row, Select, Col, Input} from 'antd';

import {RoleActions, RoleStore} from './roleapi';
import {LocarnoActions} from "../../locarno/locarnoapi";

const {Content} = Layout;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

export default class RoleCreate extends React.Component {

    constructor(props) {
        super(props);
        this.unsubscribe_role = RoleStore.listen(this.onRoleStatusChange.bind(this));

        this.state = {roles: [], info: {}, enable: true};
    }

    componentDidMount() {
        RoleActions.list();
    }

    componentWillUnmount() {
        this.unsubscribe_role();
    }



    onRoleStatusChange = (type, data) => {
        if (type === "list") {
            this.setState({roles: data.data});
        }
        if (type === "create") {
            this.props.history.push('/main/system/roles');
        }
    }

    onSubmit = () => {
        RoleActions.create(this.state.info);
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }

    onCheck = (checkedKeys) => {
        let nodes = [];

        for(let n1 of this.tree){
            if(checkedKeys.indexOf(n1.rid) > -1){
                let node = {"rid":n1.rid, "rname":n1.rname, "url":n1.url,children:[]};
                nodes.push(node);
                for(let n2 of n1.children){
                    if(checkedKeys.indexOf(n2.rid) > -1){
                        node.children.push({"rid":n2.rid, "rname":n2.rname, "url":n2.url,children:[]});
                    }
                }
            }
        }

        let info = this.state.info;
        info.menus = nodes;
        this.setState({'info':info});
    }

    tree = [
        {
            "rid": "02",
            "rname": "外观检索",
            "url": "/main/locarno/fast/list",
            "children": [
                {
                    "rid": "0201",
                    "rname": "快速检索",
                    "url": "/main/locarno/fast/list",
                    "children": [],
                    "count": 0
                },
                {
                    "rid": "0202",
                    "rname": "高级检索",
                    "url": "/main/locarno/senior/list",
                    "children": [],
                    "count": 0
                },
                {
                    "rid": "0203",
                    "rname": "局部检索",
                    "url": "/main/locarno/zone/list",
                    "children": [],
                    "count": 0
                }
            ],
            "count": 3
        },
        {
            "rid": "03",
            "rname": "辅助工具",
            "url": "/main/tools/imageinfo",
            "children": [
                {
                    "rid": "0301",
                    "rname": "图像信息",
                    "url": "/main/tools/imageinfo",
                    "children": [],
                    "count": 0
                }
            ],
            "count": 1
        },
        {
            "rid": "06",
            "rname": "数据管理",
            "url": " ",
            "children": [],
            "count": 0
        },
        {
            "rid": "07",
            "rname": "系统管理",
            "url": "/main/system/users",
            "children":
                [
                    {
                        "rid": "0701",
                        "rname": "用户管理",
                        "url": "/main/system/users",
                        "children": [],
                        "count": 0
                    },
                    {
                        "rid": "0702",
                        "rname": "角色管理",
                        "url": "/main/system/roles",
                        "children": [],
                        "count": 0
                    }
                ],
            "count": 2
        }
    ] ;

    render() {
        let self = this;

        return (
            <Layout className="info">
                <Content style={{background: "#fff", paddingTop: 12}}>

                    <Row className="row">
                        <Col span="4" className="label">
                            <span>角色名：</span>
                        </Col>
                        <Col span="8">
                            <Input placeholder="角色名"
                                   onBlur={(e) => {
                                       var info = this.state.info;
                                       info.rolename = e.target.value;
                                       this.setState({'info': info})
                                   }}
                            />
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>中文名：</span>
                        </Col>
                        <Col span="8">
                            <Input placeholder="中文名"
                                   onBlur={(e) => {
                                       var info = this.state.info;
                                       info.cname = e.target.value;
                                       this.setState({'info': info})
                                   }}
                            />
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col span="4" className="label">
                            <span>角色：</span>
                        </Col>
                        <Col span="8">
                            <Tree
                                checkable
                                onSelect={this.onSelect}
                                onCheck={this.onCheck}
                            >
                                <TreeNode defaultExpandAll={true}  title="root" key="root">
                                    {
                                        this.tree.map((n1, index)=>{
                                            return <TreeNode title={n1.rname} key={n1.rid}>
                                                {
                                                    n1.children.map((n2, index)=>{
                                                        return <TreeNode title={n2.rname} key={n2.rid} />
                                                    })
                                                }
                                            </TreeNode>
                                        })
                                    }
                                </TreeNode>
                            </Tree>
                        </Col>
                    </Row>

                    <div style={{position: "relative", marginTop: 24}}>
                        <Col span="4">
                            <span></span>
                        </Col>
                        <Col span="8">
                            <Button onClick={this.onSubmit} type="primary"

                            >确定</Button>
                            <Link to="/main/system/users"><Button style={{marginLeft: 8}}>取消</Button></Link>
                        </Col>
                    </div>
                </Content>
            </Layout>
        );
    }

}