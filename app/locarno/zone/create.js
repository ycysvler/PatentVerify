/**
 * Created by VLER on 2017/3/10.
 */

import React from 'react';
import {Layout, Breadcrumb, Popover, Button, Row, Col, Input, TreeSelect, Icon, Steps} from 'antd';
import {LocarnoActions, LocarnoStore} from '../locarnoapi';
import CutImage from './cutimage';
import $ from 'jquery';
import Config from 'config';
const {Content} = Layout;
const Step = Steps.Step;

class LocarnoZoneCreate extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = LocarnoStore.listen(this.onStatusChange.bind(this));

        let typeids = window.localStorage["typeIds"] ? window.localStorage["typeIds"].split(',') : [];
        let typeState = window.localStorage["typeIds"] ? true : false;

        this.state = {
            uploadImageList: [],
            description: "",
            typeIds: typeids,
            typeNames: typeids,
            describeState: false,
            typeState: typeState,
            imageState: false,
            typeList: []
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        LocarnoActions.getAllType();
        this.refs.inputfile.onchange = this.inputChange.bind(this);
    }

    onStatusChange = (type, data) => {
        if (type === "getAllType") {
            this.treeData = data;
            this.setState({typeList: data});
        } else if (type === "create") {
            this.goToHistorySearch();
        }
    }

    componentWillReceiveProps = (newProps) => {
    }


    goToHistorySearch() {
        this.props.history.push("/main/locarno/zone/list");
    }

    inputChange() {
        let self = this;
        let data = new FormData();

        var filenames = [];
        $.each(self.refs.inputfile.files, function (i, file) {
            data.append('upload_file' + i, file);
            filenames.push(file.name);
        });
        console.log('create > upload > filenames ', filenames);
        // 如果选图片取消了，就不上传了
        if (filenames.length > 0)
            LocarnoActions.uploadImage(data);
    }

    checkImage() {
        this.refs.inputfile.click();
    }

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
        value = [value];
        window.localStorage["typeIds"] = value;

        if (label.length > 0) {
            this.setState({typeState: true, typeIds: value, typeNames: value});
        } else {
            this.setState({typeState: false});
        }
    }

    createNewJob() {
        let images = [];
        for (let i = 0; i < this.state.uploadImageList.length; i++) {
            let item = this.state.uploadImageList[i];
            images.push(item);
        }
        LocarnoActions.create(this.state.description, this.state.typeIds, this.state.typeNames, images, 2);
    }

    renderOneImage(url) {
        return <div>
            <img alt="" style={{maxWidth: 500, maxHeight: 500}}
                 src={Config.api + '/api/images/data/' + Config.appid + '/' + url + "?radom=" + Math.random()}
            />
        </div>
    }

    remove = (image) => {
        var imageList = this.state.uploadImageList;
        this.removeItem(imageList, image);
        console.log('create > remove > imageList ', imageList);
        this.setState({'uploadImageList': imageList});
    }

    removeItem(array, dx) {
        for (var i = 0, n = 0; n < array.length; i++, n++) {
            if (array[i] === dx) {
                n++;
                array[i] = array[n]
            }
        }
        array.length -= 1
    };

    addImage = (item) => {
        let images = [];
        images.push(item);
        this.setState({uploadImageList: images, imageState: true});
    }

    show_parent = TreeSelect.SHOW_PARENT;

    render() {
        let self = this;
        let canSearch = self.state.describeState && self.state.typeState && self.state.imageState;

        return (

            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>局部检索</Breadcrumb.Item>
                        <Breadcrumb.Item style={{cursor: "pointer"}}
                                         onClick={this.goToHistorySearch.bind(this)}>历史查询</Breadcrumb.Item>
                        <Breadcrumb.Item>新建查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
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
                                    <TreeSelect value={this.state.typeIds}
                                                treeData={this.state.typeList}
                                                showCheckedStrategy={this.show_parent}
                                                onChange={this.setTypeState.bind(this)}
                                                style={{width: "100%"}}
                                    ></TreeSelect>

                                </Col>
                            </Row>
                        </div>
                        <br/>
                        <div style={{marginTop: "12px"}}>
                            <Row>
                                <Col span="4" style={{"textAlign": "right", "paddingTop": "5px"}}>
                                    <span>选择图像：</span>
                                </Col>
                                <Col span="18">
                                    {
                                        self.state.uploadImageList.map(function (item) {
                                            let image = item;
                                            return <div key={image}
                                                        style={{height: 50, width: 50, marginRight: 8, float: 'left'}}>
                                                <Popover content={self.renderOneImage(image)}>
                                                    <div style={{position: 'relative'}}>

                                                        <img alt="" onClick={self.remove.bind(self, item)} style={{
                                                            maxWidth: "50px",
                                                            maxHeight: "50px",
                                                            cursor: "pointer"
                                                        }}
                                                             src={Config.api + '/api/images/data/' + Config.appid + '/' + image + "?radom=" + Math.random()}/>
                                                        <Icon type="close-circle"
                                                              style={{position: 'absolute', right: '0px', top: '0px'}}/>

                                                    </div>
                                                </Popover></div>
                                        })
                                    }
                                    {self.state.uploadImageList.length > 0 ? null :
                                        <CutImage addImage={this.addImage}/>}
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
                                <Button style={{marginLeft: 8}} onClick={self.props.back}>取消</Button>
                            </Col>
                        </div>
                        <br/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default LocarnoZoneCreate;