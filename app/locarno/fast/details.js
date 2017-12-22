/**
 * Created by VLER on 2017/3/10.
 */
import React from 'react';
import {Layout, Breadcrumb, Radio, Card} from 'antd';
import {LocarnoActions, LocarnoStore} from '../locarnoapi';
import PatentCards from '../common/patentcard.js';
import GroupCards from '../common/groupcard.js';
import DetailModal from '../../attached/fast/detailModal.js';
import JobBar from '../common/jobbar';

import '../../attached/common/css.css';
import '../common/css.css';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const {Content, Sider, Header} = Layout;


class LocarnoFastDetails extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.state = {
            data: [],
            searchData: this.props.location.state.searchData,
            showDetailDialog: false,
            detailData: {},
            patent_type: this.props.location.state.searchData.typeids[0],
            feature_type: 'deep',
            page: 0
        };

        this.getResult(this.props.location.state.searchData.typeids[0], 'deep');
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(type, data, patent_type, feature_type) {
        if (type === "getDetail") {
            this.setState({showDetailDialog: true, detailData: data});
        }

        if (type === "getResult") {
            let temp = this.state.data;
            let page = this.state.page;


            // 判断专利分类变化
            if(this.state.patent_type === patent_type){
                // 判断特征分类变化
                if (this.state.feature_type === feature_type) {
                    temp = temp.concat(data);
                } else {
                    temp = data;
                    page = 0;
                }
            }else{
                temp = data;
                page = 0;
            }

            this.setState({data: temp,patent_type:patent_type, feature_type: feature_type, page: page});
        }
    }

    hideDetailDialog() {
        this.setState({showDetailDialog: false});
    }

    getDetail(code, main_class) {
        LocarnoActions.getDetail(code, main_class);
    }

    goToHistorySearch() {
        this.props.router.push('/locarno/fast/list');
    }

    renderDetailModal() {
        if (this.state.showDetailDialog) {
            return <DetailModal visible={this.state.showDetailDialog}
                                detailData={this.state.detailData}
                                hide={this.hideDetailDialog.bind(this)}
            ></DetailModal>
        }
    }

    onPatentChange(e) {
        console.log(e.target.value);
        this.getResult(e.target.value, this.state.feature_type, this.state.page);
    }

    onFeatureChange(e) {
        this.getResult(this.state.patent_type, e.target.value, this.state.page);
    }

    onMore() {
        let page = this.state.page + 1;
        this.getResult(this.state.patent_type, this.state.feature_type, page);
        this.setState({'page': page});
    }

    getResult(patent_type, feature_type, page) {
        LocarnoActions.getResult(
            this.props.location.state.searchData.jobid,
            patent_type,
            feature_type,
            page
        );
    }


    render() {
        let self = this;

        return (
            <Layout >
                {
                    self.renderDetailModal()
                }
                <div className="breadcrumb">
                    <Breadcrumb className="bg_white" style={{margin: '11px 0'}}>
                        <Breadcrumb.Item>快速查询</Breadcrumb.Item>
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
                                <RadioGroup onChange={self.onFeatureChange.bind(this)} defaultValue="deep">

                                    {this.state.searchData.images.length>1?<RadioButton className="patent_type_radio" value="group">权重</RadioButton>:null}
                                    <RadioButton className="patent_type_radio" value="deep">综合</RadioButton>
                                    <RadioButton className="patent_type_radio" value="shape">形状</RadioButton>
                                    <RadioButton className="patent_type_radio" value="color">颜色</RadioButton>
                                    <RadioButton className="patent_type_radio" value="lbp">纹理</RadioButton>
                                </RadioGroup>
                            </Header>
                            <Content className="bg_white" style={{paddingTop: 80}} >
                                {self.state.data.map(function (item, index) {
                                    return (self.state.feature_type === 'group' ?
                                            <GroupCards getdetail={self.getDetail.bind(self)} key={index} index={index}
                                                        item={item}/> :
                                            <PatentCards getdetail={self.getDetail.bind(self)} key={index} index={index}
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

export default LocarnoFastDetails;
