import React from 'react';
import {Modal, Button, Spin} from 'antd';
import {IndexStore} from '../../api';
import {LocarnoActions, LocarnoStore} from '../locarnoapi';
import '../../attached/common/css.css';
import './zone.css'
import Config from 'config';

export default class CutImage extends React.Component {
    constructor(props) {
        super(props);
        // 注册上传图片的回调方法
        this.unsubscribe = LocarnoStore.listen(this.onStatusChange.bind(this));

        this.state = {visible: false, uploading: false, uploadImageList: [], imageState: false};

        window.onmousemove = this.onMouseMove;
        window.onmouseup = this.onMouseUp;
    }

    componentWillUnmount() {
        window.onmousemove = null;
        window.onmouseup = null;
        // 注销上传事件回调
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        if (type === "uploadImage") {
            this.setState({uploadImageList: data, imageState: true, uploading: false});
        }else if(type === "cutImage"){
            this.setState({visible: false,uploading:false});

            this.props.addImage(this.state.uploadImageList[0]);
        }
    }

    dragdiv = {mouseDown: false, begin: {x: 0, y: 0}, position: {x: 0, y: 0}}
    dragbar = {mouseDown: false, begin: {x: 0, y: 0}, size: {width: 100, height: 100}}

    onDragDivMouseDown = (event) => {
        event = event.nativeEvent;
        window.document.body.style['user-select'] = 'none';

        this.dragdiv.mouseDown = true;
        this.dragdiv.begin = {x: parseInt(event.screenX), y: parseInt(event.screenY)};
        this.dragdiv.position = {x: parseInt(event.target.style.left), y: parseInt(event.target.style.top)};
    }

    onDragBarMouseDown = (event) => {
        event = event.nativeEvent;
        window.document.body.style['user-select'] = 'none';

        this.dragbar.mouseDown = true;
        this.dragbar.begin = {x: parseInt(event.screenX), y: parseInt(event.screenY)};
        this.dragbar.size = {
            width: parseInt(this.refs.drag.style.width),
            height: parseInt(this.refs.drag.style.height)
        };
    }

    onMouseUp = (event) => {
        window.document.body.style['user-select'] = '';
        this.dragdiv.mouseDown = false;
        this.dragbar.mouseDown = false;
    }
    onMouseMove = (event) => {
        this.onDragDivMove(event);
        this.onDragBarMove(event);
    }

    onDragBarMove = (event) => {
        if (this.dragbar.mouseDown) {
            let point = {x: event.screenX - this.dragbar.begin.x, y: event.screenY - this.dragbar.begin.y};
            let div_x = parseInt(this.refs.drag.style.left);
            let div_y = parseInt(this.refs.drag.style.top);

            let width = this.dragbar.size.width + point.x;
            let height = this.dragbar.size.height + point.y;

            width = width < 20 ? 20 : width;
            width = width + div_x > 300 ? 300 - div_x : width;

            height = height < 20 ? 20 : height;
            height = height + div_y > 300 ? 300 - div_y : height;

            this.refs.drag.style.width = width + 'px';
            this.refs.drag.style.height = height + 'px';
        }
    }

    onDragDivMove = (event) => {
        if (this.dragdiv.mouseDown) {
            let point = {x: event.screenX - this.dragdiv.begin.x, y: event.screenY - this.dragdiv.begin.y};
            let width = parseInt(this.refs.drag.style.width);
            let height = parseInt(this.refs.drag.style.height);

            let x = (this.dragdiv.position.x + point.x);
            let y = (this.dragdiv.position.y + point.y);

            x = x < 0 ? 0 : x;
            x = x + width > 300 ? 300 - width : x;
            this.refs.drag.style.left = x + 'px';

            y = y < 0 ? 0 : y;
            y = y + height > 300 ? 300 - height : y;
            this.refs.drag.style.top = y + 'px';
        }
    }

    showModal = () => {
        this.setState({visible: true,});
    }
    handleOk = (e) => {
        let name = this.state.uploadImageList[0].image;
        let colour = this.state.uploadImageList[0].colour;
        let rect = [
            parseInt(this.refs.drag.style.left),
            parseInt(this.refs.drag.style.top),
            parseInt(this.refs.drag.style.width),
            parseInt(this.refs.drag.style.height)
        ];
        console.log('rect', rect);
        LocarnoActions.cutImage(name, colour, rect);
        this.setState({visible: false,});
    }
    handleCancel = (e) => {
        this.setState({visible: false,});
    }

    handleUplad = () => {
        this.refs.inputfile.click();
    }

    inputChange = () => {
        let self = this;
        let data = new FormData();
        var filenames = [];
        if (self.refs.inputfile.files.length > 0) {
            let file = self.refs.inputfile.files[0];
            data.append('upload_file', file);
            filenames.push(file.name);
        }
        LocarnoActions.uploadImage(data);
        this.setState({uploading: true});
    }


    getBackgroundImage = () => {
        let result = "";
        if (this.state.imageState) {
            let imageInfo = this.state.uploadImageList[0];
            if (imageInfo.colour == 0) {
                result = Config.url + "/image.ashx?type=color&name=" + imageInfo.image;
            } else {
                result = Config.url + "/image.ashx?type=shape&name=" + imageInfo.image;
            }
        }
        return result;
    }

    render() {
        let backgroundImage = "url(" + this.getBackgroundImage() + ")";
        return (
            <div>

                <Button icon="plus" type="primary" onClick={this.showModal} style={{
                    height: 50, width: 50, fontSize: 18,
                    cursor: "pointer"
                }}></Button>
                <input ref="inputfile" type="file" accept="" onChange={this.inputChange}
                       style={{display: "none"}}/>
                <Modal width="350" title="编辑图片" visible={this.state.visible}
                       onCancel={this.handleCancel}
                       footer={[
                           this.state.uploading ? <Spin key="spin" style={{float: 'left', margin: 5}}/> : null,
                           <Button key="upload" size="large" onClick={this.handleUplad}>选择图片</Button>,
                           <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                               确定
                           </Button>,
                       ]}
                >
                    <div className="cutimage">
                        <div ref="image" id="image" style={{'backgroundImage': backgroundImage}}>
                            <div ref="drag" style={{
                                left: 100,
                                top: 100,
                                width: 100,
                                height: 100,
                                display: this.state.imageState ? 'flex' : 'none'
                            }} id="drag"
                                 onMouseDown={this.onDragDivMouseDown}>
                                <div ref="bar" id="bar" style={{width: 6, height: 6, background: '#fff'}}
                                     onMouseDown={this.onDragBarMouseDown}></div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}




