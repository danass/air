const config = require('./../config')
var express = require('express');
var router = express.Router();
require('../air')

let tableName = "Factures" 
let headers = { authorization: "Bearer " + config.compta.auth_key }
let base = "https://api.airtable.com/v0/" + config.compta.base_name + "/" + tableName + "/"

air(router, headers, base, "index", "La page est nouvelle", true)

module.exports = router