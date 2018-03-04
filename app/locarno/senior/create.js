/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb, TreeSelect} from 'antd';

import LocarnoCreate from '../common/create';

class LocarnoSeniorCreate extends React.Component {
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
        this.props.history.push("/main/locarno/senior/list");
    }

    show_parent = TreeSelect.SHOW_PARENT;

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>高级检索</Breadcrumb.Item>
                        <Breadcrumb.Item style={{cursor: "pointer"}}
                                         onClick={this.goToHistorySearch.bind(this)}>历史查询</Breadcrumb.Item>
                        <Breadcrumb.Item>新建查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <LocarnoCreate jobType="1" history={this.props.history} jobTypeText="senior" back={this.goToHistorySearch.bind(this)} />
            </Layout>
        );
    }
}

export default LocarnoSeniorCreate;