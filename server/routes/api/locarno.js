let Redis = require('ioredis');
let fs = require('fs');
let mysql = require('mysql');
let request = require('request');
let getMongoPool = require('../../mongo/pool');
let rediscfg = require('../../config/redis');
let LocarnoDAL = require('../../mysql/locarno');

let pub = new Redis(rediscfg);

let LocarnoImage = getMongoPool().LocarnoImage;

module.exports = function (router) {

    // PaaS -> 查询结果
    router.post('/locarno/results', (req, res, next) => {
        let dal = new LocarnoDAL();
        dal.getResult(req.body, function (results) {
            res.send({code: 200, data: results});
        });
    });
    router.get('/locarno/patent/:code/type/:type', (req, res, next) => {
        let dal = new LocarnoDAL();
        let code = req.params.code;
        let type = req.params.type;

        dal.getPatent(type, code, function (results) {
            let result = {code: 200, data: results};
            LocarnoImage.find({'ap_num': code}, "name", function (err, items) {
                if (!err) {
                    let images = [];
                    for(let index in items){
                        let item = items[index];
                        if(item.name.indexOf('cbs_10') > -1 ||
                            item.name.indexOf('cbs_11') > -1 ||
                            item.name.indexOf('cbs_12') > -1 ||
                            item.name.indexOf('cbs_13') > -1 ||
                            item.name.indexOf('cbs_14') > -1 ||
                            item.name.indexOf('cbs_15') > -1 ||
                            item.name.indexOf('cbs_16') > -1 ||
                            item.name.indexOf('cbs_17') > -1 ||
                            item.name.indexOf('cbs_18') > -1 ||
                            item.name.indexOf('cbs_19') > -1){
                            continue;
                        }
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