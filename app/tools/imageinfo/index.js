/**
 * Created by VLER on 2017/6/21.
 */
import React from 'react';
import {Layout,  Breadcrumb} from 'antd';
import { Form, Icon, Input, Button ,Tabs} from 'antd';
import {ToolsActions,ToolsStore} from '../toolsapi.js';
import Config from 'config';


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
            this.setState({feature: data});
        }
    }
    onSearch=()=>{
        var name = this.refs.image.input.value;
        this.setState({name:name});

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
                                     src={ Config.api + '/api/images/data/' + Config.appid + '/' + this.state.name}/>
                            </FormItem>
                            <FormItem>
                                <h3>彩色归一图</h3>
                                <img alt="" style={{maxWidth:"100%", maxHeight: 180}}
                                     src={ Config.api + '/api/images/data/' + Config.appid + '/' + this.state.name + '?type=color'}/>
                            </FormItem>
                            <FormItem>
                                <h3>黑白归一图</h3>
                                <img alt="" style={{maxWidth:"100%", maxHeight: 180}}
                                     src={ Config.api + '/api/images/data/' + Config.appid + '/' + this.state.name + '?type=shape'}/>
                            </FormItem>
                        </Form>
                        }
                    </Content>
                </Layout>

            </Layout>


        );
    }
}

export default ImageInfo;