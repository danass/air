const {config, _config} = require('./../config')
var express = require('express');
// require('../air')
let  {db, getConf} = require('../air')
const _ = require('lodash')

let airConf = {
    router: express.Router(),
    base: getConf('chat'),
    allTables: "d",
    baseName: 'conversation',
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

airAll(airConf)
routeChat(Air(airConf))
// airPost(Air(conf))


module.exports = airConf.router