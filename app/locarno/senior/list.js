/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb} from 'antd';
import LocarnoJobList from '../common/joblist';
import '../../attached/common/css.css';

class LocarnoSeniorList extends React.Component {

    goToCreateNewSearch() {
        this.context.router.push("/locarno/senior/create");
    }

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>高级检索</Breadcrumb.Item>
                        <Breadcrumb.Item>历史查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <LocarnoJobList history={this.props.history}  jobType="1" jobTypeText="senior" />
            </Layout>
        );
    }
}

export default LocarnoSeniorList;
