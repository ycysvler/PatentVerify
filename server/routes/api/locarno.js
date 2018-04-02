let Redis = require('ioredis');
let fs = require('fs');
let mysql = require('mysql');
let async = require('async');
let request = require('request');
let getMongoPool = require('../../mongo/pool');
let rediscfg = require('../../config/redis');
let LocarnoDAL = require('../../mysql/locarno');

let pub = new Redis(rediscfg);

let LocarnoImage = getMongoPool().LocarnoImage;

module.exports = function (router) {

    // PaaS -> 查询结果
    router.post('/locarno/result/images', (req, res, next) => {
        let dal = new LocarnoDAL();
        dal.getResultImage(req.body, function (results) {
            res.send({code: 200, data: results});
        });
    });
    router.post('/locarno/result/patents', (req, res, next) => {
        let dal = new LocarnoDAL();
        dal.getResultPatent(req.body, function (results) {

            async.map(results,
                (item,callback)=>{

                    LocarnoImage.find({'ap_num': item.code}, {_id:0,name:1}, function (err, images) {
                        if (!err) {
                            item.images = images;
                            callback(null, item);
                        } else {
                            callback(err.toString(),null );
                        }
                    })

                },
                (err,datas)=>{
                    res.send({code: 200, data: datas});
                });
        });
    });

    router.get('/locarno/patent/:code/type/:type', (req, res, next) => {
        let dal = new LocarnoDAL();
        let code = req.params.code;
        let type = req.params.type;

        let table = 'd_ap_' + type.replace("-","");

        dal.getPatent(table, code, function (results) {
            let result = {code: 200, data: results};
            LocarnoImage.find({'ap_num': code}, "name", function (err, items) {
                if (!err) {
                    let images = [];
                    for(let index in items){
                        let item = items[index];
                        images.push(item);
                    }
                    result.data.images = images;
                    res.send(result);
                } else {
                    res.send(500, err.toString());
                }
            })
        });
    });
}