var pool = require('./pool');

module.exports = class SystemDAL {
    login(username,password, callback){
        let sql = `SELECT * FROM user WHERE username=? and password=?`;
        pool.query(sql, [username,password], function (error, results, fields) {
            if (error) {
                console.error('error query: ' + error.stack);
                callback(500,error);
            } else {
                if(results.length > 0)
                    callback(200, results[0]);
                else
                    callback(404,null);
            }
        }.bind(this));
    }
}