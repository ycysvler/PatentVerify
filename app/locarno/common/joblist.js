/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Icon, Button, Input, Table, Progress} from 'antd';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import moment from 'moment';
import {IndexStore} from '../../api.js';
import ImageList from '../../attached/common/imagelist.js';

const {Content} = Layout;

class LocarnoJobList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.state = {
            selectNum: 0,
            jobsData: [],
            keyword: '',
            jobType: this.props.jobType,
            jobTypeText: this.props.jobTypeText
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    componentDidMount() {
        LocarnoActions.getJobs(this.state.jobType, this.state.keyword);
    }
    /*
     * store 触发的事件
     * */
    onStatusChange(action, jobtype, data) {
        if (action === "getJobs" && jobtype === this.state.jobType) {
            this.setState({jobsData: data});
            this.refush(data);
        }
        if (action === "remove") {
            LocarnoActions.getJobs(this.state.jobType, this.state.keyword);
            this.setState({selectNum: 0});
        }
    }

    refush(data) {
        var self = this;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.progress < 1 || item.progress === undefined) {
                setTimeout(function () {
                    LocarnoActions.getJobs(self.state.jobType, self.state.keyword);
                }, 2000);
                return;
            }
        }
    }


    adapterData(jobData) {
        let data = [];
        if (jobData) {
            for (let i = 0; i < jobData.length; i++) {
                let item = {};
                item.jobid = jobData[i]._id;
                item.description = jobData[i].description;
                item.typeids = jobData[i].imagetypes;
                item.images = jobData[i].images;
                item.typenames = jobData[i].imagetypes;
                item.name = jobData[i].name;
                item.schedule = "100%";
                item.progress = jobData[i].progress ? parseInt(jobData[i].progress * 100) : 0;
                item.progress = item.progress > 0 ? item.progress : -1 * item.progress;
                item.create_time = moment(jobData[i].createtime).format('YYYY-MM-DD HH:mm:ss');
                item.end_time = moment(jobData[i].endtime).format('YYYY-MM-DD HH:mm:ss');
                data.push(item);
            }
        }
        return data;
    }

    goToCreateNewSearch = () => {
        this.props.history.push("/main/locarno/" + this.state.jobTypeText + "/create");
    }

    columns = [
        {title: '描述', dataIndex: "name"},
        {
            title: '图像', dataIndex: 'images',
            render(text, record) {
                return (<ImageList key={record.jobid} imageUrls={record.images}></ImageList>);
            }
        },
        {
            title: '类型', width: 140, dataIndex: 'typenames',
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
            title: '进度', width: 200, dataIndex: 'progress',
            render(text, record) {
                return <div><Progress percent={text} strokeWidth={8}/></div>
            }
        },
        {title: '创建日期', width: 190, dataIndex: 'create_time'},
        {title: '完成时间', width: 190, dataIndex: 'end_time'}
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
        record.key = record.jobid;
        var _pathname = '/main/locarno/' + this.state.jobTypeText + '/details';


        //this.context.router.push({pathname:_pathname, state: {searchData: record}});

        this.props.history.push({pathname: _pathname, jobinfo: record});
    }

    keywordChange(event) {
        this.setState({keyword: event.target.value});
    }

    /*
     * 删除查询任务
     * */
    remove() {
        var keys = this.state.selectedRowKeys;
        LocarnoActions.remove(keys);
    }

    render() {
        var self = this;
        var state = {
            rowKey: "jobid",
            bordered: true,
            loading: true,
            rowSelection: this.rowSelection,
            columns: this.columns,
            dataSource: this.adapterData(this.state.jobsData),
            onRowinstead: this.rowClick.bind(this)
        };
        //if(this.state.jobsData.length > 0){ state.loading=false;}
        state.loading = false;
        return (
            <Layout>
                <Layout >
                    <Content className="content">
                        <div>
                            <Button className="fast-delete-btn" onClick={this.remove.bind(this)}>删除</Button>
                            <Button className="fast-new-search-btn"
                                    onClick={this.goToCreateNewSearch.bind(this)}>新建查询</Button>
                            <span className="fast-check-num"><Icon style={{"marginRight": "6px", "color": "blue"}}
                                                                   type="info-circle"/>已选择{this.state.selectNum}项数据</span>

                            <Button className="fast-search-btn"
                                    onClick={() => {
                                        LocarnoActions.getJobs(this.state.jobType, this.state.keyword)
                                    }}
                            >搜索</Button>
                            <Input
                                onChange={this.keywordChange.bind(this)}
                                style={{"width": "20%", "position": "relative", "float": "right", "marginRight": "5px"}}
                                placeholder="请输入描述关键词"/>
                        </div>
                        <Table onRow={(record) => {
                            return {
                                onClick: () => {
                                    self.rowClick(record)
                                }
                            }
                        }} {...state} style={{marginTop: "20px"}}/>

                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default LocarnoJobList;
