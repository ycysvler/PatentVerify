import React from 'react';
import {Layout, Checkbox} from 'antd';
const {Content, Sider, Header} = Layout;
import Config from 'config';
import {LocarnoActions, LocarnoStore} from '../locarnoapi.js';
import {ContrastActions, ContrastStore} from '../contrast/stone.js';

import '../style/locarno.less';

export default class ImageGrid extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_locarno = LocarnoStore.listen(this.onStatusChange.bind(this));
        this.unsubscribe_contrast = ContrastStore.listen(this.onStatusChange.bind(this));

        this.state = {
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
        if (action === "getResult") {
            this.setState({data: data});
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
    }

    onMouseEnter = (key) => (e) => {
        this.setState({showIndex: key});
    }

    onCheck = (item) => (e) => {
        if (e.target.checked) {
            ContrastActions.add(item);
        } else {
            ContrastActions.remove(item.image);
        }
    }

    drawItems = () => {
        let doms = [];

        let self = this;
        for (let index in this.state.data.data) {
            let item = this.state.data.data[index];
            let checked = self.isSelected(item.image);
            let border = checked ? "img-box selected" : "img-box";
            let dy = this.state.showIndex == index ? 'block' : 'none';

            doms.push(<div className={border} key={item.image + '_' + index} onMouseEnter={self.onMouseEnter(index)}>
                <img src={Config.api + '/api/images/data/' + Config.appid + '/' + item.image}/>

                <div className="img-check" style={{display: dy}}>
                    <Checkbox
                        checked={checked}
                        onChange={self.onCheck(item)}
                        style={{color: '#fff'}}>
                        对比 </Checkbox></div>

            </div>);
        }

        return doms;
    }


    render() {
        return (<div className="img-layout">
            {this.drawItems()}
        </div>);
    }
}