const axios = require('axios')
const {config, _config} = require('./config')
const {db} = require('./scheme')
const _ = require("lodash")
var express = require('express');
const fs = require('fs')

let params = {}

db.airtable = []



function Air(localArgs, index = 0)  {
    let airArgs = {
        headers: { 'Authorization': "Bearer " + localArgs.base.auth_key, 
        'Content-Type': "application/json"},
        baseUrl: "https://api.airtable.com/v0/" + localArgs.base.base_name + "/" + localArgs.base.tableNames[index] + "/",
        baseUrlPost: "https://api.airtable.com/v0/" + localArgs.base.base_name + "/" + localArgs.baseName + "/",
        router: localArgs.router,
        tableName: localArgs.base.tableNames[index],
        allTables: localArgs.base.tableNames,
        pugViewName: localArgs.base.tableNames[index],
        _id: localArgs._id,
        writeJson: localArgs.writeJson,
        dbWrite: localArgs.dbWrite,
        init: localArgs.init,
        refreshTime: localArgs.refreshTime,
        data: localArgs.data,
        scheme: db.scheme[Object.keys(db.scheme).find(el => el == 'chat')],
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
     if(Air.writeJson === true & Air.init == false) {
         Air.init = true
         fs.writeFile(process.cwd() + '\\data\\' + Air.pugViewName + ".json", JSON.stringify(axios.data.records, null, 2), (err) => { 
         if (err) console.log(err); 
         else { 
             console.log("File written successfully\n"); 
         } 
       })
     }
     if (Air.dbWrite == true) {
        db.airtable[Air.pugViewName] = {
           [Air.pugViewName]: axios.data.records
       }

     }
     return axios.data.records
 }).catch(e => {
     console.error(e)
 })
 }

  
function airPost(Air) {
    return axios({
        method: 'post',
        url: Air.baseUrlPost,
        headers: Air.headers,
        data : Air.data
    }).catch(e => console.error(e))
}

function airRoute(Air) { 
    Air.router.get('/' + Air.tableName, function(req, res, next) {
    //let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + Air.pugViewName + '.json'))
    let dbresults = db.airtable[Air.tableName]
        res.render(Air.tableName, { 
            path: Air.tableName + '/',
            results: dbresults[Air.tableName]
         });
    });
}

function routeChat(Air) {
    Air.router.post('/send', (req, res, next) => {
        //let message = req.body.message
        // console.log(req.body.message)
        Air.data.records[0].fields.message = req.body.message
        // console.log(Air.data.records)
        airPost(Air)
       res.send("ok")

      })
}

function airRouteId(Air) { Air.router.get('/' + Air.tableName + '/:id', function(req, res, next) {
    //let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + Air.pugViewName + '.json'))
    let dbresults = db.airtable[Air.tableName]
    for (let result of dbresults[Air.tableName]) {
        if (req.params.id === result.id) {
        res.render(Air.tableName + '_id', { 
            path: Air.tableName + '/',
            result: result,
            results: dbresults[Air.tableName]
         });
        }}
    });
}
  
function airRealtimeUpdateJson(Air, sleeptime = Air.refreshTime) {
    setInterval(function data() {
        airGet(Air).then(results => {return results}) 
        return data;
         }(), Air.refreshTime);    
    }

function branch(Air) {
    airRealtimeUpdateJson(Air)
    airRoute(Air) //arg1: view, arg2: title(html header)
    if (Air._id === true ) {
        airRouteId(Air)
    }
    }

    function airAll(localconfig) {
        for (index of localconfig.base.tableNames) {
        branch(Air(localconfig, localconfig.base.tableNames.indexOf(index)))
        }
    }

function monitorDb(timeInterval) {
        setInterval(function data() {
        console.log(db.airtable)
        return data;
         }(), timeInterval);    
}

function getConf(nom) {
    return  _.find(_config, function(confObj) {return confObj.name == nom} )
  }


  global.airRealtimeUpdateJson = airRealtimeUpdateJson
  global.airRoute = airRoute
  global.airRouteId = airRouteId
  global.airGet = airGet
  global.branch = branch
  global.Air = Air
  global.airAll = airAll
  global.db = db
  global.airPost = airPost
  global.routeChat = routeChat

  module.exports = {
      db:db,
    getConf:getConf
}

