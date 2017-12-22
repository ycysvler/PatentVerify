/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb} from 'antd';
import JobList from '../common/joblist';
import '../common/css.css';

class AttachedSeniorList extends React.Component {

    goToCreateNewSearch() {
        this.props.router.push("/attached/senior/create");
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
                <JobList jobType="1" jobTypeText="senior" />
            </Layout>
        );
    }
}



export default AttachedSeniorList;
