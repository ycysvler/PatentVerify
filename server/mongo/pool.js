let patentSchemas = require('./patentschemas');
const pool = new Map();

let getMongoPool = () => {
    if (!pool.has("patent")) {
        let schemas = new patentSchemas();
        pool.set("patent", schemas);
    }
    let db = pool.get("patent");
    return db;
}

module.exports = getMongoPool;