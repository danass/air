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

let airConfigPOST = {
    router: express.Router(),
   // pugViewName: "index",
    // _id: true,
    // writeJson: true,
    base: config.chat,
    baseName: 'conversation',
    // dbWrite: true,
    // init: false, 
    // refreshTime: 1000,
    data: {
        records: [
            {fields: {
                message: "ta soeur",
                sender: ["rectQTt7ZQYvYGAVn"],
                receiver: [
                    "rec1asnaPlHngcUsL"
                  ]
                  
            }}
        ]
    }
} 

// airPost()

airPost(airArgs(airConfigPOST))
// airAll(airConfig)

    // setInterval(function data() {
    //     console.log(db.airtable)
    //     return data;
    //      }(), 1000);    

module.exports = airConfig.router