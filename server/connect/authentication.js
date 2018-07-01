/**
 * Created by VLER on 2017/8/26.
 */
let getMongoPool = require('../mongo/pool');

module.exports = (req, res, next) => {

    if (req.path == "/api/system/login") {
        next();
    }else if(req.path.indexOf("/api") > -1){
        // if (req.cookies["token"] != null) {
        //     var token = req.cookies["token"];
        //     console.log('token', token);
        //     next();
        // } else {
        //     res.json(401, {error: '您需要登录！'});
        // }
        next();
    }else{
        next();
    }
}