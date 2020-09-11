const config = require('./../config')
var express = require('express');
require('../air')

let airConfig = {
    router: express.Router(),
    pugViewName: "index",
    htmlTitle: "Nouvelle page",
    _id: true,
    writeJson: true
} 

air(Air(config.compta, airConfig))

module.exports = airConfig.router