let multiparty = require('multiparty');
let moment = require('moment');
//et Redis = require('ioredis');
let uuid = require('uuid');
let path = require('path');
let fs = require('fs');
let request = require('request');
//let rediscfg = require('../../config/redis');
let CloudAs = require('../../cloud/cloudas');

let getMongoPool = require('../../mongo/pool');

//let pub = new Redis(rediscfg);

module.exports = function (router) {

    // PaaS -> 图片上传
    router.post('/search/images', (req, res, next) => {
        let entid = "";
        let Image = getMongoPool(entid).Image;
        var form = new multiparty.Form({uploadDir: './public/upload/'});
        form.parse(req, function (err, fields, files) {
            var resolvepath;
            var originalFilename;

            console.log('files', files);
            console.log('fields', fields);

            var  options = {
                method: 'post',

                form: content,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            for (var name in files) {
                 let item = files[name][0];

                 resolvepath = path.resolve(item.path);
                 originalFilename = item.originalFilename;

                 console.log(name, resolvepath, originalFilename);
             }
            //
            // let file = path.resolve(resolvepath);
            // fs.readFile(file, function (err, chunk) {
            //     if (err) {
            //         res.send(500, err.errmsg);
            //     } else {
            //         let item = new Image();
            //         item.createtime = new moment();
            //         //path.extname
            //         let extname = path.extname(originalFilename);
            //         item.name = uuid.v1() + extname;
            //         item.source = chunk;
            //         // 如果有类型和扩展信息，那就加上吧
            //         item.type = 'query';    // 这是一个用于查询的图像
            //         item.state = 0;         // 0:新图，1:正在计算特征，2：计算特征成功，-1：计算特征失败
            //
            //         item.save(function (err, item) {
            //             fs.unlink(file, () => {
            //             });
            //
            //             if (err) {
            //                 res.send(500, err.errmsg);
            //             }
            //             else {
            //                 res.send(200, {name: item.name});
            //
            //                 var msg = {name: item.name, type: 'query', entid: entid};
            //
            //                 pub.publish('Feature:BuildFeature', JSON.stringify(msg));
            //
            //             }
            //         });
            //     }
            // });

        });
    });


}