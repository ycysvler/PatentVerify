let multiparty = require('multiparty');
let moment = require('moment');
let uuid = require('uuid');
let request = require('request');
let service = require('../config/service');

module.exports  = class CloudAs{
    constructor(){}

    locarnoSearch(params, callback){
        let body = {"name":params.jobname,
            "jobtype":params.jobtype,
            "imagetypes":params.typeids,
            "images":params.images,
            "featuretypes":["shape","deep","lbp","color"]
        };

        let options = {
            method: 'post',
            url: service.url + '/api/search',
            json: true,
            headers: {
                "appid":service.appid,
                "content-type": "application/json",
            },
            body:body
        };

        request(options, function (err, res, body) {
            if (err) {
                callback(500, err);
            }else {
                callback(200, body);
            }
        })
    }
}

