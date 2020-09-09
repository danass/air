const config = require('./../config')
var express = require('express');
var router = express.Router();
require('./../ax')

let basePersonne = "https://api.airtable.com/v0/" + config.dcvm.base_name + "/Personne/"

branch(router, basePersonne, "index", "La page est nouvelle", 0)

module.exports = router