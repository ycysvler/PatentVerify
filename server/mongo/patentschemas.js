var mongodbconfig = require('../config/mongodb');
var mongoose = require('mongoose');

module.exports = class Schemas{
    constructor(){
        let uri = mongodbconfig.uri + 'patent';
        let conn = mongoose.createConnection(uri, mongodbconfig.options);

        conn.then(function(patent) {
            console.log("patent mongodb connected!");
        });
        this.LocarnoImageSchema = new mongoose.Schema({
            name: {type: String,index: {unique: true, dropDups: true}},       // 图片名称
            ap_num: {type: String,index:true},                     // 专利号
            patent_type: {type: String,index:true},                // 版本
            colour:{type: Number,index: true},                     // 业务类型
            source:Buffer                                           //  原始图像
        });
        this.LocarnoImage = conn.model('Image', this.LocarnoImageSchema, 'locarno_image');
    }
}

