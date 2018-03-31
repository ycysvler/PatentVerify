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