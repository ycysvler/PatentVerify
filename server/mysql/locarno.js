var pool = require('./pool');

module.exports = class LocarnoDAL {
    constructor() {
        this.user = null;
    }

    getResult(body, callback) {
        let pagesize = body.pager.pagesize;
        let skip = pagesize * (body.pager.current - 1);
        let shape = body.weight.shape;
        let color = body.weight.color;
        let lbp = body.weight.lbp;
        let deep = body.weight.deep;
        let jobid = body.jobid;

        let sql = ` select t.image,t.code, (t.shape * ? + t.color * ? + t.lbp * ? + t.deep * ?) as score from
        (SELECT image, code,
        min(case arithmetic when 0 then score else 100 end) color,
        min(case arithmetic when 1 then score else 100 end) shape,
        min(case arithmetic when 2 then score else 100 end) lbp,
        min(case arithmetic when 3 then score else 100 end) deep 
        FROM locarno_job_result where jobid=? group by image) as t       
        order by score limit ?, ?`;
        pool.query(sql, [shape,color,lbp,deep,jobid, skip, pagesize], function (error, results, fields) {
            if (error) {
                console.error('error query: ' + error.stack);
                callback(500);
            } else {
                callback(results);
            }
        }.bind(this));
    }

    getPatent(table, ap_num, callback){
        let sql = `select * from `+ table +` where ap_num = ?`;
        pool.query(sql, [ap_num], function (error, results, fields) {
            if (error) {
                console.error('error query: ' + error.stack);
                callback(500);
            } else {
                if(results.length > 0)
                    callback(results[0]);
            }
        }.bind(this));
    }
}