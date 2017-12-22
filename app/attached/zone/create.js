/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb, TreeSelect} from 'antd';

import AttachedCreate from '../common/create';

class AttachedZoneCreate extends React.Component {
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
        this.context.router.push("/attached/zone/list");
    }

    getCookie(name) {
        if (window.document.cookie === "") {
            this.context.router.push("/");
            return;
        }
        let cookies = window.document.cookie.split(";");
        if (name === "token") {
            let token = cookies[0].substring(6);
            if (!token || token === "") {
                this.context.router.push("/");
                return;
            } else {
                return token;
            }
        } else if (name === "user_id") {
            let user_id = cookies[1].substring(9);
            if (!user_id || user_id === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_id;
            }
        } else {
            let user_name = cookies[2].substring(11);
            if (!user_name || user_name === "") {
                this.context.router.push("/");
                return;
            } else {
                return user_name;
            }
        }
    }

    show_parent = TreeSelect.SHOW_PARENT;

    render() {
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
                <AttachedCreate jobType="2" jobTypeText="zone"  />
            </Layout>
        );
    }
}

export default AttachedZoneCreate;