const {db, writeScheme} = require('./scheme')
const {config} = require("./config");
const cookieParser = require("cookie-parser");

writeScheme(config)

setInterval(function data() {
        console.log(config.length == Object.keys(db.scheme).length)
        console.log(config.length, Object.keys(db.scheme).length)
        
        if (config.length == Object.keys(db.scheme).length) {
            console.log("db loaded")
            clearInterval(this)
             require('./bin/www')
             
    }
        return data;
         }(), 1000);    

