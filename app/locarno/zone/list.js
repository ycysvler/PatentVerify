/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb} from 'antd';
import LocarnoJobList from '../common/joblist';
import '../../attached/common/css.css';

class LocarnoSeniorList extends React.Component {

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>局部检索</Breadcrumb.Item>
                        <Breadcrumb.Item>历史查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <LocarnoJobList history={this.props.history} jobType="2" jobTypeText="zone" />
            </Layout>
        );
    }
}

export default LocarnoSeniorList;
