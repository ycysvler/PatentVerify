let Redis = require('ioredis');
let fs = require('fs');
let mysql = require('mysql');
let request = require('request');
let rediscfg = require('../../config/redis');
let LocarnoDAL = require('../../mysql/locarno');

let pub = new Redis(rediscfg);

module.exports = function (router) {

    // PaaS -> 图片上传
    router.post('/locarno/results', (req, res, next) => {

        console.log('body >', req.body);
        let dal = new LocarnoDAL();

        dal.getResult( req.body,function (results) {
            res.send({code:200, data:results});
        });
    });
}