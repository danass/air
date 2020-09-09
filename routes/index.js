const config = require('./../config')
var express = require('express');
var router = express.Router();
require('./../ax')

let tableName = "Personne" 

let base = "https://api.airtable.com/v0/" + config.dcvm.base_name + "/" + tableName + "/"

branch(router, base, "index", "La page est nouvelle", 0)

module.exports = router