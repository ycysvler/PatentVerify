let moment = require('moment');
let uuid = require('uuid');
let path = require('path');
let CloudType = require('../../cloud/cloudtype');

let cloudType = new CloudType();

module.exports = function (router) {
    // PaaS -> 新建类型
    router.post('/types', (req, res, next) => {
        cloudType.create(req.body);
    });
}