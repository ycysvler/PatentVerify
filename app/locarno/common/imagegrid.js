import React from 'react';
import {Pagination, Checkbox, Modal} from 'antd';
import Config from 'config';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import {ContrastActions, ContrastStore} from '../contrast/reflux.js';
import Patent from '../patent/index';

import '../style/locarno.less';

export default class ImageGrid extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_contrast = ContrastStore.listen(this.onStatusChange.bind(this));

        this.state = {
            visible: false,
            contrast: [],
            showIndex: -1,
            data: []
        };
    }

    componentWillUnmount() {
        this.unsubscribe_locarno();
        this.unsubscribe_contrast();
    }

    onStatusChange(action, data) {
        if (action === "getResultImages") {
            this.setState({data: data.datas, total: data.total});
        }
        if (action === "contrast") {
            this.setState({contrast: data});
        }
    }

    isSelected = (image) => {
        let result = false;
        for (let index in  this.state.contrast) {
            let item = this.state.contrast[index];
            if (item.image === image)
                result = true;
        }
        return result;
    };

    onMouseEnter = (key) => (e) => {
        this.setState({showIndex: key});
    };

    onCheck = (item) => (e) => {
        if (e.target.checked) {
            ContrastActions.add(item);
        } else {
            ContrastActions.remove(item.image);
        }
    };

    showPatent = (ap_num) => {
        this.setState({ap_num: ap_num, typeid: this.props.typeid, visible: true});
    };

    drawItems = () => {
        let doms = [];

        let self = this;
        for (let index in this.state.data) {
            let item = this.state.data[index];
            let checked = self.isSelected(item.image);
            let border = checked ? "img-box selected" : "img-box";
            let dy = this.state.showIndex == index ? 'block' : 'none';

            doms.push(<div className={border} key={item.image + '_' + index} onMouseEnter={self.onMouseEnter(index)}>
                <img onClick={self.showPatent.bind(self, item.code)}
                     src={Config.base + '/api/images/data/' + item.image}/>

                <div className="img-check" style={{display: dy}}>
                    <Checkbox
                        checked={checked}
                        onChange={self.onCheck(item)}
                        style={{color: '#fff'}}>
                        对比 </Checkbox></div>

            </div>);
        }

        return doms;
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    onPageChange = (page) => {
        this.state.current = page;
        this.props.onPageChange(page);
    };

    render() {
        return (
            <div className="img-root">
                <div className="img-layout">
                    {this.drawItems()}

                    <Modal width={840} title="专利详情" footer={null}
                           visible={this.state.visible} onCancel={this.handleCancel}
                    >
                        <Patent ap_num={this.state.ap_num} typeid={this.props.typeid}/>
                    </Modal>
                </div>
                <div className="pager"><Pagination total={this.state.total} pageSize={60} onChange={this.onPageChange}/></div>
            </div>);
    }
}