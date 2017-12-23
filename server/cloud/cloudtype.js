let multiparty = require('multiparty');
let moment = require('moment');
let uuid = require('uuid');
let request = require('request');
let service = require('../config/service');

module.exports = class CloudType {
    constructor() {
    }

    create(json, cb) {
        request(
            {
                method: 'post',
                url: service.url + '/api/types',
                json: true,
                headers: {
                    "content-type": "application/json",
                    "appid": service.appid
                },
                body: json
            }, function (err, res, body) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(body);
                }

                cb(err, res, body);
            });
    }
}