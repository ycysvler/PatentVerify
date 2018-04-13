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

    router.get('/system/menu', (req, res, next) => {
        let dal = new SystemDAL();
        let userid = req.query.userid;
        dal.getResourcesByUserid(userid,(code, data)=>{
           if(code === 200){
               // 该写递归了
               let root = {"rid":"0"};
               menuAdapter(data, root);

               res.send({code:code, data:root.children});
           }
        });
    });

    menuAdapter=function(list, node){
        node.children = [];
        node.count = 0;
        for(let i in list){
            let item = list[i];
            if(item.parentid===node.rid){
                node.count++;
                let n = {"rid": item.rid,"rname":  item.rname,"url":  item.url};
                node.children.push(n);
                menuAdapter(list, n);
            }
        }
    }
}