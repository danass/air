const config = require("./config")
const {db, writeScheme} = require('./scheme')
const {_config} = require("./config");
const cookieParser = require("cookie-parser");

writeScheme(_config)

setInterval(function data() {
        console.log(_config.length == Object.keys(db.scheme).length)
        console.log(_config.length, Object.keys(db.scheme).length)
        
        if (_config.length == Object.keys(db.scheme).length) {
            console.log("db loaded")
            clearInterval(this)
             require('./bin/www')
             
    }
        return data;
         }(), 1000);    

