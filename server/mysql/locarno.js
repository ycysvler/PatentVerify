var pool = require('./pool');

module.exports = class LocarnoDAL {
    constructor() {
        this.user = null;
    }

    getResultImage(body, callback) {
        let pagesize = body.pager.pagesize;
        let skip = pagesize * (body.pager.current - 1);
        let shape = body.weight.shape;
        let color = body.weight.color;
        let lbp = body.weight.lbp;
        let deep = body.weight.deep;
        let table = 'd_ap_' + body.type.replace("-","");
        let jobid = body.jobid;

        let sql = `select t.image,t.code, (t.shape * ? + t.color * ? + t.lbp * ? + t.deep * ?) as score from
        (SELECT image, code,
        max(case arithmetic when 0 then 1-score else 0 end) color,
        max(case arithmetic when 1 then 1-score else 0 end) shape,
        max(case arithmetic when 2 then 1-score else 0 end) lbp,
        max(case arithmetic when 3 then 1-score else 0 end) deep 
        FROM locarno_job_result where jobid=? group by image) as t       
        order by score desc limit ?, ?`;
        pool.query(sql, [shape,color,lbp,deep,jobid, skip, pagesize], function (error, results, fields) {
            if (error) {
                console.error('error query: ' + error.stack);
                callback(500);
            } else {
                callback(results);
            }
        }.bind(this));
    }

    getResultPatent(body, callback) {
        let pagesize = body.pager.pagesize;
        let skip = pagesize * (body.pager.current - 1);
        let shape = body.weight.shape;
        let color = body.weight.color;
        let lbp = body.weight.lbp;
        let deep = body.weight.deep;
        let table = 'd_ap_' + body.type.replace("-","");
        let jobid = body.jobid;

        let sql = `select img.image, img.code, img.score,concat(p.id, img.image) as id, p.ap_num, p.ap_name,p.ap_date,p.db_type, p.main_class, p.sub_class,p.pub_num,p.pa_name,p.designer,p.agent_name from `
            +table+
            ` as p right join( select t.image,t.code, (t.shape * ? + t.color * ? + t.lbp * ? + t.deep * ?) as score from
        (SELECT image, code,
        max(case arithmetic when 0 then 1-score else 0 end) color,
        max(case arithmetic when 1 then 1-score else 0 end) shape,
        max(case arithmetic when 2 then 1-score else 0 end) lbp,
        max(case arithmetic when 3 then 1-score else 0 end) deep 
        FROM locarno_job_result where jobid=? group by image) as t       
        order by score desc limit ?, ?) as img on p.ap_num = img.code`;
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