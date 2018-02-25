/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb, TreeSelect} from 'antd';

import Create from '../common/create';

class LocarnoFastCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadImageList: [],
            description: "",
            typeIds: [],
            typeNames: [],
            describeState: false,
            typeState: false,
            imageState: false,
            typeList: []
        };
    }

    goToHistorySearch() {
        this.props.history.push("/main/locarno/fast/list");
    }

    show_parent = TreeSelect.SHOW_PARENT;

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>快速检索</Breadcrumb.Item>
                        <Breadcrumb.Item style={{cursor: "pointer"}}
                                         onClick={this.goToHistorySearch.bind(this)}>历史查询</Breadcrumb.Item>
                        <Breadcrumb.Item>新建查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Create jobType="0" history={this.props.history} jobTypeText="fast" back={this.goToHistorySearch.bind(this)} />
            </Layout>
        );
    }
}

export default LocarnoFastCreate;
