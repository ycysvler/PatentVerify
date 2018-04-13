/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Popover, Button, Row, Col, Input, TreeSelect} from 'antd';
import $ from 'jquery';
import {AttachedActions, AttachedStore} from '../attachedapi.js';

const {Content} = Layout;

class AttachedCreate extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = AttachedStore.listen(this.onStatusChange.bind(this));

        this.state = {
            uploadImageList: [],
            description: "",
            typeIds: [],
            typeNames: [],
            describeState: false,
            typeState: false,
            imageState: false,
            typeList: [],
            jobType:this.props.jobType,
            jobListPath:"/attached/"+this.props.jobTypeText+"/list"
        };
    }

    componentDidMount() {
        AttachedActions.getAllType(this.getCookie("token"));
        this.refs.inputfile.onchange = this.inputChange.bind(this);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(type, data) {
        if (type === "uploadImage") {
            var uploadImageList = this.state.uploadImageList;
            this.setState({uploadImageList: uploadImageList.concat(data.name), imageState: true});
        } else if (type === "getAllType") {
            this.treeData = data;
            this.setState({typeList: data});
        } else if (type === "create") {
            this.context.router.push(this.state.jobListPath);
        }
    }

    goToHistorySearch() {
        this.context.router.push(this.state.jobListPath);
    }

    getCookie(name) {
        if (window.document.cookie === "") {
            this.context.router.push("/");
            return;
        }
        let cookies = window.document.cookie.split(";");
        if (name === "token") {
            let token = cookies[0].substring(6);
            if (!token || token === "") {
                this.context.router.push("/");
                return;
            } else {
                return token;
            }
        } else if (name === "user_id") {
            let user_id = cookies[1].substring(9);
            if (!user_id || user_id === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_id;
            }
        } else {
            let user_name = cookies[2].substring(11);
            if (!user_name || user_name === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_name;
            }
        }
    }

    inputChange() {
        let self = this;
        let data = new FormData();

        var filenames = [];
        $.each(self.refs.inputfile.files, function (i, file) {
            data.append('upload_file' + i, file);
            filenames.push(file.name);
        });

        AttachedActions.uploadImage(Config.url + "/uploadimages.ashx?username=" + this.getCookie("user_name"), data, filenames, this.getCookie("token"));
    }

    checkImage() {
        this.refs.inputfile.click();
    }

    show_parent = TreeSelect.SHOW_ALL;

    getRandomKeys() {
        let k = Math.random() * 1000000;
        return k;
    }

    setDescribeState(e) {
        if (e.target.value === "") {
            this.setState({describeState: false});
        } else {
            this.setState({describeState: true, description: e.target.value});
        }
    }

    setTypeState(value, label) {
        if (label.length > 0) {
            this.setState({typeState: true, typeIds: label, typeNames: label});
        } else {
            this.setState({typeState: false});
        }
    }

    createNewJob() {
        AttachedActions.create(this.getCookie("user_id"), this.state.description, this.state.typeIds, this.state.typeNames, this.state.uploadImageList,this.state.jobType, this.getCookie("token"));
    }


    renderOneImage(url) {
        return <div>
            <img alt="" style={{maxWidth: 500, maxHeight: 500}} src={Config.url + "/" + url}/>
        </div>
    }

    render() {
        let self = this;
        let canSearch = self.state.describeState && self.state.typeState && self.state.imageState;
        return (
            <Layout >
                <Content style={{background: "#fff"}}>
                    <div style={{marginTop: "24px"}}>
                        <Col span="4" style={{"textAlign": "right", "paddingTop": "5px"}}>
                            <span>描述：</span>
                        </Col>
                        <Col span="8">
                            <Input placeholder="查询任务描述信息" onBlur={self.setDescribeState.bind(self)}/>
                        </Col>
                    </div>
                    <br/>
                    <div style={{marginTop: "24px"}}>
                        <Row>
                            <Col span="4" style={{"textAlign": "right", "paddingTop": "5px"}}>
                                <span>选择分类：</span>
                            </Col>
                            <Col span="8">
                                <TreeSelect multiple
                                            treeData={this.treeData}
                                            showCheckedStrategy={this.show_parent}
                                            onChange={this.setTypeState.bind(this)}
                                            style={{width: "100%"}}
                                ></TreeSelect>
                            </Col>
                        </Row>
                    </div>
                    <div style={{marginTop: "12px"}}>
                        <Row>
                            <Col span="4" style={{"textAlign": "right", "paddingTop": "5px"}}>
                                <span>选择图像：</span>
                            </Col>
                            <Col span="18">

                                {
                                    self.state.uploadImageList.map(function (image) {
                                        return <div key={image}
                                                    style={{height: 50, width: 50, marginRight: 8, float: 'left'}}>
                                            <Popover content={self.renderOneImage(image)}>
                                                <img alt="" style={{width: "90%", height: "90%"}}
                                                     src={Config.url + "/" + image}/></Popover></div>
                                    })
                                }
                                <Button icon="plus" onClick={this.checkImage.bind(this)} style={{
                                    height: 50, width: 50, fontSize: 18,
                                    cursor: "pointer"
                                }}>
                                </Button>
                            </Col>
                        </Row>
                        <input multiple="multiple" ref="inputfile" type="file" accept=""
                               style={{display: "none"}}/>
                    </div>
                    <div style={{position: "relative", marginTop: 24}}>
                        <Col span="4">
                            <span></span>
                        </Col>
                        <Col span="8">
                            <Button type="primary" onClick={self.createNewJob.bind(self)}
                                    disabled={!canSearch}>查询</Button>
                            <Button style={{marginLeft: 8}}>取消</Button>
                        </Col>
                    </div>
                    <br/>
                </Content>
            </Layout>
        );
    }
}

export default AttachedCreate;
