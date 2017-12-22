
import React from 'react';
import {Layout, Breadcrumb, Radio,Card} from 'antd';
import {LocarnoActions, LocarnoStore} from '../locarnoapi';
import ZoneCards from '../common/zonecard.js';
import GroupCards from '../common/groupcard.js';
import JobBar from '../common/jobbar';
import DetailModal from '../../attached/fast/detailModal.js';

import '../../attached/common/css.css';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const {Content, Sider, Header} = Layout;

class LocarnoZoneDetails extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.state = {
            data: [],
            searchData: this.props.location.state.searchData,
            showDetailDialog: false,
            detailData: {},
            patent_type: this.props.location.state.searchData.typeids[0],
            feature_type: 'shape',
            page: 0
        };
        this.getResult(this.props.location.state.searchData.typeids[0], 'shape');

    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(type, data, patent_type, feature_type) {
        if (type === "getDetail") {
            this.setState({showDetailDialog: true, detailData: data});
        }
        if (type === "getZoneResult") {
            let temp = this.state.data;
            let page = this.state.page;

            if (this.state.feature_type === feature_type) {
                temp = temp.concat(data);
            } else {
                temp = data;
                page = 0;
            }

            this.setState({data: temp, feature_type: feature_type, page: page});
        }
    }

    hideDetailDialog() {
        this.setState({showDetailDialog: false});
    }

    getDetail(code,main_class) {
        LocarnoActions.getDetail(code,main_class);
    }


    goToHistorySearch() {
        this.props.router.push("/locarno/zone/list");
    }


    data = [];

    renderDetailModal() {
        if (this.state.showDetailDialog) {
            return <DetailModal visible={this.state.showDetailDialog}
                                detailData={this.state.detailData}
                                hide={this.hideDetailDialog.bind(this)}
            ></DetailModal>
        }
    }

    onPatentChange(e) {
        this.getResult(e.target.value, this.state.feature_type, this.state.page);
    }

    onFeatureChange(e) {
        this.getResult(this.state.patent_type, e.target.value, this.state.page);
    }

    getResult(patent_type, feature_type, page) {
        LocarnoActions.getZoneResult(
            this.props.location.state.searchData.jobid,
            patent_type,
            feature_type,
            page
        );
    }

    onMore() {
        let page = this.state.page + 1;
        this.getResult(this.state.patent_type, this.state.feature_type, page);
        this.setState({'page': page});
    }

    render() {
        let self = this;
        self.data = [];
        self.data.push(self.state.searchData);
        return (
            <Layout >
                {
                    self.renderDetailModal()
                }
                <div className="breadcrumb">
                    <Breadcrumb style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>高级查询</Breadcrumb.Item>
                        <Breadcrumb.Item style={{cursor: "pointer"}}
                                         onClick={self.goToHistorySearch.bind(self)}>历史查询</Breadcrumb.Item>
                        <Breadcrumb.Item>查询结果</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Layout>
                    <Content>
                        <Layout>
                            <Header className="bg_white bottom_line"
                                    style={{position: 'fixed', zIndex: 5, width: '100%'}}>
                                类别：
                                <RadioGroup onChange={self.onPatentChange.bind(this)}
                                            defaultValue={self.state.searchData.typeids[0]}
                                            style={{marginRight: 24}}>
                                    {
                                        self.state.searchData.typeids.map(function (item) {
                                            return <RadioButton key={item} value={item}>{item}</RadioButton>
                                        })
                                    }
                                </RadioGroup>
                                特征：
                                <RadioGroup onChange={self.onFeatureChange.bind(this)} defaultValue="shape">
                                    <RadioButton className="patent_type_radio" value="shape">形状</RadioButton>
                                </RadioGroup>
                            </Header>
                            <Content className="bg_white" style={{paddingTop: 80}}>
                                {self.state.data.map(function (item, index) {
                                    return (self.state.feature_type === 'group' ?
                                            <GroupCards getdetail={self.getDetail.bind(self)} key={index} index={index}
                                                        item={item}/> :
                                            <ZoneCards getdetail={self.getDetail.bind(self)} key={index} index={index}
                                                         item={item}/>
                                    )
                                })}
                                <Card
                                    title="more"
                                    style={{
                                        cursor: 'pointer',
                                        width: 390,
                                        height: 228,
                                        marginBottom: 20,
                                        marginLeft: 6,
                                        overflow: "left",
                                        float: 'left'
                                    }}>
                                    <div className="more_card" onClick={this.onMore.bind(this)}>
                                        <h1 style={{marginTop: '40px'}}>加载更多......</h1>
                                    </div>

                                </Card>
                            </Content>
                        </Layout>
                    </Content>
                    <Sider style={{background: '#404040', zIndex: 6}} width="250">
                        <JobBar job={this.props.location.state.searchData}></JobBar>
                    </Sider>
                </Layout>


            </Layout>
        );
    }
}

export default LocarnoZoneDetails;


