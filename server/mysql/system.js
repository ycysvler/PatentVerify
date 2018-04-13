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

    getResourcesByUserid (userid,callback){
        let sql = `select mu.*, mr.*, r.* 
        from map_role_user mu join map_role_resoure mr on mu.roleid = mr.roleid 
        join resource r on mr.rid=r.rid
        where userid = ?`;

        pool.query(sql, [userid], function (error, results, fields) {
            if (error) {
                console.error('error query: ' + error.stack);
                callback(500,error);
            } else {
                if(results.length > 0)
                    callback(200, results);
                else
                    callback(404,null);
            }
        }.bind(this));
    }
}