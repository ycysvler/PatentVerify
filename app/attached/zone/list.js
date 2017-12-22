/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb} from 'antd';
import JobList from '../common/joblist';
import '../common/css.css';

class AttachedZoneList extends React.Component {

    goToCreateNewSearch() {
        this.context.router.push("/attached/zone/create");
    }

    render() {
        return (
            <Layout >
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>局部检索</Breadcrumb.Item>
                        <Breadcrumb.Item>历史查询</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <JobList jobType="2" jobTypeText="zone" />
            </Layout>
        );
    }
}



export default AttachedZoneList;
