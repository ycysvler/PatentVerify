let Redis = require('ioredis');
let uuid = require('uuid');
let rediscfg = require('../../config/redis');
let SystemDAL = require('../../mysql/system');
let pub = new Redis(rediscfg);

module.exports = function (router) {
    router.post('/system/login', (req, res, next) => {
        let dal = new SystemDAL();
        dal.login(req.body.username, req.body.password,(code, data)=>{
            if(code === 200){
                let token = uuid.v1();
                res.cookie("token", token);
                res.send({"code":200,"data": data});
            }
            if(code === 404){
                res.send({"code":404,"data": null});
            }
        });
    });
}