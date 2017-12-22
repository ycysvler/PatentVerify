/**
 * Created by xiao on 2017/4/4.
 */
import React from 'react';
import {Popover} from 'antd';

class ImageList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrls: this.props.imageUrls
        }
    }

    renderOneImage(url) {
        return <div>
            <img alt="" style={{maxWidth:400, maxHeight:400}} src={Config.url + "/image.ashx?name=" + url}/>
        </div>
    }

    render() {
        let self = this;
        return (
            <div style={{height: "auto"}}>
                {
                    self.state.imageUrls.map(function (url) {
                        return <Popover key={url} content={self.renderOneImage(url)}>
                            <div style={{width: "50px", height: "50px", float:'left', marginRight:8, border:'1px solid #dddddd', padding:3}}>
                                <img alt=""
                                     style={{width:'95%',height:'95%'}}
                                     src={Config.url + "/image.ashx?name=" + url}/>
                            </div>
                        </Popover>
                    })
                }
            </div>

        )
    }
}
export default ImageList;