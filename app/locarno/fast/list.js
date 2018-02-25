/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb} from 'antd';
import LocarnoJobList from '../common/joblist';
import '../common/css.less';

class LocarnoFastList extends React.Component {
    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>快速检索</Breadcrumb.Item>
                        <Breadcrumb.Item>历史查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <LocarnoJobList history={this.props.history} jobType="0" jobTypeText="fast" />
            </Layout>
        );
    }
}

export default LocarnoFastList;
