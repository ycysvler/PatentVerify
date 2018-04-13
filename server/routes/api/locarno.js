let Redis = require('ioredis');
let fs = require('fs');
let mysql = require('mysql');
let async = require('async');
let request = require('request');
let moment = require('moment');
let getMongoPool = require('../../mongo/pool');
let rediscfg = require('../../config/redis');
let LocarnoDAL = require('../../mysql/locarno');
let CloudAs = require('../../cloud/cloudas');
let pub = new Redis(rediscfg);

let LocarnoImage = getMongoPool().LocarnoImage;

module.exports = function (router) {

    // v2.1 , 获取类型树
    router.get('/locarno/nodes', (req,res,next)=>{
        let dal = new LocarnoDAL();
        dal.getTypes( (code, data)=>{
            // 该写递归了
            let root = {"value":"0"};

            nodeAdapter(data, root);
            res.send({code:200, data:root.children});
        });
    });
    nodeAdapter=function(list, node){
        node.children = [];
        for(let i in list){
            let item = list[i];
            if(item.parentid===node.value){
                let n = {
                    "label": item.typeid + ' (' + item.description + ')',
                    "value":  item.typeid,
                    "key":  item.typeid,
                    "rebuilding": false
                };
                node.children.push(n);
                nodeAdapter(list, n);
            }
        }
    }

    // v2.1 , 获取查询结果（图片分组）
    router.post('/locarno/result/images', (req, res, next) => {
        let dal = new LocarnoDAL();
        dal.getResultCount(req.body.jobid, function (count) {
            dal.getResultImage(req.body, function (results) {
                res.send({code: 200, data: {total: count, datas: results}});
            });
        });
    });

    // v2.1 , 获取查询结果（专利分组）
    router.post('/locarno/result/patents', (req, res, next) => {
        let dal = new LocarnoDAL();
        dal.getResultCount(req.body.jobid, function (count) {
            dal.getResultPatent(req.body, function (results) {

                async.map(results,
                    (item, callback) => {

                        LocarnoImage.find({'ap_num': item.code}, {_id: 0, name: 1}, function (err, images) {
                            if (!err) {
                                item.images = images;
                                callback(null, item);
                            } else {
                                callback(err.toString(), null);
                            }
                        })

                    },
                    (err, datas) => {
                        res.send({code: 200, data: {total: count, datas: datas}});
                    });
            });
        });
    });

    // v2.1 , 获取专利详情
    router.get('/locarno/patent/:code/type/:type', (req, res, next) => {
        let dal = new LocarnoDAL();
        let code = req.params.code;
        let type = req.params.type;

        type = type === '07-01(10)' ? '07-01' : type;

        let table = 'd_ap_' + type.replace("-", "");

        dal.getPatent(table, code, function (results) {
            let result = {code: 200, data: results};
            LocarnoImage.find({'ap_num': code}, "name", function (err, items) {
                if (!err) {
                    let images = [];
                    for (let index in items) {
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

    // v2.1, 获取任务列表
    router.get('/locarno/job', (req, res, next) => {
        let dal = new LocarnoDAL();
        let userid = req.query.userid;
        let jobtype = req.query.jobtype;
        let pagesize = req.query.pagesize ? req.query.pagesize:999;
        let current = req.query.current ? req.query.current:1 ;

        dal.getJob(userid,jobtype,pagesize, current, function (results) {
            let result = {code: 200, data: results};
            res.send(result);
        });
    });

    // v2.1, 创建查询任务
    router.post('/locarno/create', (req, res, next)=>{
        let as = new CloudAs();
        let dal = new LocarnoDAL();
        let body = req.body;

        as.locarnoSearch(req.body, function(code, data){
            if(code === 200){
                let id = data.id;

                body.jobid = id;
                body.create_time = new moment().format('YYYY-mm-DD HH:mm:ss');
                dal.createJob(body, (code, results)=>{
                    res.send({code: 200});
                });
            }
        });
    });

    // v2.1, 删除任务
    router.delete('/locarno/job',(req,res,next)=>{
        let dal = new LocarnoDAL();
        dal.removeJobs(req.body, (code, data)=>{
            res.send({code: 200});
        });
    });
}