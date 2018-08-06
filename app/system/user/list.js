/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Icon, Table, Button, Breadcrumb} from 'antd';
import {UserActions,UserStore} from './userapi';

const { Content} = Layout;

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = UserStore.listen(this.onStatusChange.bind(this));
        this.state = {items:[]};
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
        UserActions.list();
    }
    /*
     * store 触发的事件
     * */
    onStatusChange(action, data) {
        console.log(data);
        if (action === "list") {
            this.setState({items: data.data, total : data.data.length});
        }
    }

    columns = [
        {
            title: 'username',
            dataIndex: 'username',
        },
        {
            title: 'cname',
            dataIndex: 'cname',
        } ];
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selectedRowKeys:selectedRowKeys});
            this.setState({selectNum: selectedRowKeys.length});
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
        getCheckboxProps: record => ({
            disabled: record.key === '3',
        }),
    };

    onPageChange = (pageNumber) => {
        //OrganizationActions.getList(pageNumber, 10);
    };
    onDelete=()=>{
        //console.log(this.state.selectedRowKeys);
        //OrganizationActions.remove(this.state.selectedRowKeys);
    };

    render() {
        return (
            <Layout>
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Layout>
                    <Content className="content">
                        <div >
                            <Button type="danger"  className="fast-delete-btn" onClick={this.onDelete}>删除</Button>
                            <Link to='/main/system/users/create'><Button className="fast-new-search-btn" >新建用户</Button></Link>
                            <span className="fast-check-num"><Icon style={{"marginRight": "6px", "color": "blue"}}
                                                                   type="info-circle"/>已选择{this.state.selectNum}项数据</span>

                        </div>
                        <Table style={{marginTop: "20px"}}
                               bordered={true}
                            rowKey="_id"
                            rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items}
                            pagination={{
                                showSizeChanger: true,
                                onChange: this.onPageChange,
                                pageSizeOptions: ["2", "3", "4", "5"],
                                defaultPageSize: 10, total: this.state.total,
                                hideOnSinglePage: true
                            }} size="middle"/>

                    </Content>
                </Layout>
            </Layout>


        );
    }
}

export default UserList;
