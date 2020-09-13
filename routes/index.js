const config = require('./../config')
var express = require('express');
require('../air')
let db = require('../air')

let airConfig = {
    router: express.Router(),
   // pugViewName: "index",
    _id: true,
    writeJson: true,
    base: config.compta,
    dbWrite: true,
    init: false, 
    refreshTime: 1000,
} 



airAll(airConfig)

    // setInterval(function data() {
    //     console.log(db.airtable)
    //     return data;
    //      }(), 1000);    

module.exports = airConfig.router