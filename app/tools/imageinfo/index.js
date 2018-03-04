/**
 * Created by VLER on 2017/6/21.
 */
import React from 'react';
import {Layout,  Breadcrumb} from 'antd';
import { Form, Icon, Input, Button ,Tabs} from 'antd';
import {ToolsActions,ToolsStore} from '../toolsapi.js';


const FormItem = Form.Item;
const { Content} = Layout;
const TabPane = Tabs.TabPane;

class ImageInfo extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = ToolsStore.listen(this.onStatusChange.bind(this));
        this.state = {
            name:'',
            feature:{}
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(type, data, name) {
        if (type === "getFeature") {
            this.setState({feature: data, 'name':name});
        }
    }
    onSearch=()=>{
        var name = this.refs.image.refs.input.value;
        console.log(name);
        ToolsActions.getFeature(name);
    }

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>辅助工具</Breadcrumb.Item>
                        <Breadcrumb.Item>图像信息</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Layout className="content">
                    <Content >
                        <Form layout="inline" >
                            <FormItem >
                                <Input ref="image" name="image" prefix={<Icon type="picture" style={{ fontSize: 13 }} />} style={{width:400}}  placeholder="图片名称" />
                            </FormItem>
                            <FormItem>
                                <Button  type="primary"   onClick={this.onSearch}  >   Search   </Button>
                            </FormItem>
                        </Form>
                        <br />
                        {
                            this.state.name === '' ? null: <Form layout="inline" >
                            <FormItem>
                                <h3>原图</h3>
                                <img alt="" style={{maxWidth:"100%", maxHeight: 180}}
                                     src={ window.server_address + '/image.ashx?name=' + this.state.name}/>
                            </FormItem>
                            <FormItem>
                                <h3>彩色归一图</h3>
                                <img alt="" style={{maxWidth:"100%", maxHeight: 180}}
                                     src={ window.server_address + '/image.ashx?type=color&name=' + this.state.name}/>
                            </FormItem>
                            <FormItem>
                                <h3>黑白归一图</h3>
                                <img alt="" style={{maxWidth:"100%", maxHeight: 180}}
                                     src={ window.server_address + '/image.ashx?type=shape&name=' + this.state.name}/>
                            </FormItem>
                        </Form>
                        }
                        <Tabs>
                            <TabPane tab="形状特征" key="shape">
                                <div style={{wordBreak:'break-all',padding:'0 1rem'}}>
                                    {this.state.feature.shape}</div>
                            </TabPane>
                            <TabPane tab="颜色特征" key="color">
                                <div style={{wordBreak:'break-all',padding:'0 1rem'}}>
                                    {this.state.feature.color}</div>
                            </TabPane>
                            <TabPane tab="纹理特征" key="lbp">
                                <div style={{wordBreak:'break-all',padding:'0 1rem'}}>
                                    {this.state.feature.lbp}</div>
                            </TabPane>
                            <TabPane tab="综合特征" key="deep">
                                <div style={{wordBreak:'break-all',padding:'0 1rem'}}>
                                    {this.state.feature.deep}</div>
                            </TabPane>
                        </Tabs>


                    </Content>
                </Layout>

            </Layout>


        );
    }
}

export default ImageInfo;