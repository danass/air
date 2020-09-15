const {config} = require('./../config')
var express = require('express');
require('../air')
let db = require('../air')


let airConf = {
    router: express.Router(),
    _id: true,
    writeJson: true,
    base: config.compta,
    dbWrite: true,
    init: false, 
    refreshTime: 3333,
    tablePosition: 0,
} 

airIt(airConf)


module.exports = airConf.router