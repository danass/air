const {config, _config} = require('./../config')
var express = require('express');
// require('../air')
let  {db, getConf} = require('../air')
const _ = require('lodash')

let airConf = {
    router: express.Router(),
    base: config.chat,
    tablePosition: 1,
    tablePositionPost: 1,
    refreshTime: 2500,
    data: {
      records: [
        {
          fields: {
            sender: ["rectQTt7ZQYvYGAVn"],
            receiver: ["rec1asnaPlHngcUsL"]
            }
        }
      ]},
      _id: false,
      dbWrite: true,

} 

// function getId(id, file) {
//     return _.find(file, function(o) { return o.id == id });
// }

airIt(airConf)
routeChat(Air(airConf))




module.exports = airConf.router