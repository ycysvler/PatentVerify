/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Icon, Button, Input, Table} from 'antd';
import {AttachedActions, AttachedStore} from '../attachedapi.js';
import ImageList from './imagelist.js';

const {Content} = Layout;

class JobList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = AttachedStore.listen(this.onStatusChange.bind(this));
        this.state = {
            selectNum: 0,
            jobsData: [],
            keyword:'',
            jobType:this.props.jobType,
            jobTypeText:this.props.jobTypeText
        }

        AttachedActions.getJobs(this.getCookie("user_id"),this.state.jobType, this.state.keyword, this.getCookie("token"));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    /*
     * store 触发的事件
     * */
    onStatusChange(action,jobtype, data) {
        if (action === "getJobs" && jobtype === this.state.jobType) {
            this.setState({jobsData: data});
        }
        if (action === "remove") {
            AttachedActions.getJobs(this.getCookie("user_id"), this.state.jobType, this.state.keyword,this.getCookie("token"));
            this.setState({selectNum: 0});
        }
    }

    formatJobData(jobData) {
        let self = this;
        self.data = [];
        for (let i = 0; i < jobData.length; i++) {
            let item = {};
            item.jobid = jobData[i].jobid;
            item.description = jobData[i].description;
            item.typeids = jobData[i].typeids;
            item.images = jobData[i].images;
            item.typenames = jobData[i].typenames;
            item.schedule = "100%";
            item.create_time = jobData[i].create_time;
            item.end_time = jobData[i].end_time;
            self.data.push(item);
        }
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

    goToCreateNewSearch() {
        this.context.router.push("/attached/"+this.state.jobTypeText+"/create");
    }

    columns = [
        {title: '描述', dataIndex: "jobname"},
        {
            title: '图像', dataIndex: 'images',
            render(text, record) {
                return (<ImageList key={record.jobid} imageUrls={record.images}></ImageList>);
            }
        },
        {
            title: '类型', width: 100, dataIndex: 'typenames',
            render(text, record) {
                let type_name = "";
                for (let i = 0; i < record.typenames.length; i++) {
                    if (i < (record.typenames.length - 1)) {
                        type_name += record.typenames[i] + ",";
                    } else if (i === (record.typenames.length - 1)) {
                        type_name += record.typenames[i];
                    }
                }
                return <span>{type_name}</span>
            }
        },
        {
            title: '进度', width: 100, dataIndex: 'progress',
            render(text, record) {
                return <span>{text + '%'}</span>
            }
        },
        {title: '创建日期', width: 180, dataIndex: 'create_time'},
        {title: '完成时间', width: 180, dataIndex: 'end_time'}
    ];

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selectNum: selectedRowKeys.length});
            this.setState({"selectedRowKeys": selectedRowKeys});
        }
    }

    /*
    * 行点击，跳转查询结果
    * */
    rowClick(record, index) {
        console.log(record, index);
        record.key = record.jobid;
        var _pathname =  '/attached/'+this.state.jobTypeText+'/details';

        console.log(_pathname);
        this.context.router.push({pathname:_pathname, state: {searchData: record}});
    }

    keywordChange(event) {
        this.setState({keyword: event.target.value});
    }


    /*
     * 删除查询任务
     * */
    remove() {
        var keys = this.state.selectedRowKeys;
        AttachedActions.remove(keys);
    }

    render() {
        var state = {
            rowKey: "jobid",
            bordered: true,
            loading: false,
            pagination: false,
            rowSelection: this.rowSelection,
            columns: this.columns,
            dataSource: this.state.jobsData,
            onRowClick: this.rowClick.bind(this)
        };

        return (
            <Layout>
                <Layout className="content">
                    <Content >
                        <div>
                            <Button className="fast-delete-btn" onClick={this.remove.bind(this)}>删除</Button>
                            <Button className="fast-new-search-btn"
                                    onClick={this.goToCreateNewSearch.bind(this)}>新建查询</Button>
                            <span className="fast-check-num"><Icon style={{"marginRight": "6px", "color": "blue"}}
                                                                   type="info-circle"/>已选择{this.state.selectNum}项数据</span>
                            <Button className="fast-search-btn"
                            onClick={()=>{AttachedActions.getJobs(this.getCookie("user_id"),this.state.jobType, this.state.keyword,this.getCookie("token"))}}
                            >搜索</Button>
                            <Input
                                onChange={this.keywordChange.bind(this)}
                                style={{"width": "20%", "position": "relative", "float": "right", "marginRight": "5px"}}
                                placeholder="请输入描述关键词"/>
                        </div>

                        <Table {...state} style={{marginTop: "20px"}}/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default JobList;
