let multiparty = require('multiparty');
let moment = require('moment');
let uuid = require('uuid');
let request = require('request');
let service = require('../config/service');

module.exports  = class CloudAs{
    constructor(){}

    search(){
        console.log(service.url);

        let options = {
            method: 'post',
            url: service.url + '/api/search',
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({})
        };

        request(options, function (err, res, body) {
            if (err) {
                console.log(err)
            }else {
                console.log(body);
            }
        })
    }


}

