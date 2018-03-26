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

        var sql = `select r.image,r.code, sum(r.score) as score from ( 
        select image,code, (case arithmetic when 0 then score*? when 1 then score*? when 2 then score*? when 3 then score*? else 0 end) as score from locarno_job_result  where jobid=? ) as r
        group by r.image
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
}