const axios = require('axios')
const config = require('./config')
const _ = require("lodash")
var express = require('express');
// var router = express.Router();
const fs = require('fs')

let params = {}

let results = []


function Air(config, localArgs)  {
    let airArgs = {
        headers: { authorization: "Bearer " + config.auth_key },
        baseUrl: "https://api.airtable.com/v0/" + config.base_name + "/" + config.tableNames[0] + "/",
        router: localArgs.router,
        pugViewName: localArgs.pugViewName,
        htmlTitle: localArgs.htmlTitle,
        _id: localArgs._id,
        writeJson: localArgs.writeJson,
    }
    return airArgs
}

function airGet(Air) {
    //Axios get method, for Airtable records 
   return axios({
     baseURL: Air.baseUrl,
     headers: Air.headers,
     params: params
 }).then(axios => {
     if(Air.writeJson === true) {
       //console.log(process.cwd() + '\\data\\' + name + ".json")
       fs.writeFile(process.cwd() + '\\data\\' + Air.pugViewName + ".json", JSON.stringify(axios.data.records, null, 2), (err) => { 
         if (err) console.log(err); 
         else { 
             //console.log("File written successfully\n"); 
         } 
       })
     }
     return axios.data.records
 }).catch(e => {
     console.log(e)
 })
 }

  
function airRoute(Air) { 
    Air.router.get('/', function(req, res, next) {
  let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + Air.pugViewName + '.json'))
        res.render(Air.pugViewName, { 
            title: Air.htmlTitle, 
            results: results
         });
    });
}

function airRouteId(Air) { Air.router.get('/:id', function(req, res, next) {
    let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + Air.pugViewName + '.json'))
    for (let result of results) {
        if (req.params.id === result.id) {
        res.render(Air.pugViewName + '_id', { 
            title: Air.htmlTitle, 
            result: result,
            results: results
         });
        }}
    });
}

  
function airRealtimeUpdateJson(Air, sleeptime = 20000) {
    setInterval(function data() {
        airGet(Air).then(results => {return results}) 
        return data;
         }(), sleeptime);    
    }

function air(Air) {
    airRealtimeUpdateJson(Air)
    airRoute(Air) //arg1: view, arg2: title(html header)
    if (Air._id === true ) {
        airRouteId(Air)
    }
    }

    
  global.airRealtimeUpdateJson = airRealtimeUpdateJson
  global.airRoute = airRoute
  global.airRouteId = airRouteId
  global.airGet = airGet
  global.air = air
  global.Air = Air
//   module.exports = router
