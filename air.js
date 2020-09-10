const axios = require('axios')
const config = require('./config')
const _ = require("lodash")
var express = require('express');
var router = express.Router();
const fs = require('fs')

let params = {}

let results = []

function airGet(baseURL, headers, name, write = true) {
     //Axios get method, for Airtable records 
    return axios({
      baseURL: baseURL,
      headers: headers,
      params: params
  }).then(axios => {
      if(write === true) {
        //console.log(process.cwd() + '\\data\\' + name + ".json")
        fs.writeFile(process.cwd() + '\\data\\' + name + ".json", JSON.stringify(axios.data.records, null, 2), (err) => { 
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
  
  function airRoute(router, view, title) { 
      router.get('/', function(req, res, next) {
    let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + view + '.json'))
          res.render(view, { 
              title: title, 
              results: results
           });
      });
  }
  
  function airRouteId(router, view, title) { router.get('/:id', function(req, res, next) {
      let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + view + '.json'))
      for (let result of results) {
          if (req.params.id === result.id) {
          res.render(view + '_id', { 
              title: title, 
              result: result,
              results: results
           });
          }}
      });
  }
  
  
  function airRealtimeUpdateJson(baseURL, headers, view, sleeptime = 20000) {
  setInterval(function data() {
      airGet(baseURL, headers, view).then(results => {return results}) 
      return data;
       }(), sleeptime);    
  }

  
function air(router, headers, base, nomid, titlehtml, id = false) {
    airRealtimeUpdateJson(base, headers, nomid)
    airRoute(router, nomid, titlehtml) //arg1: view, arg2: title(html header)
    if (id === true ) {
        airRouteId(router, nomid, titlehtml)
    }
    }

    
  global.airRealtimeUpdateJson = airRealtimeUpdateJson
  global.airRoute = airRoute
  global.airRouteId = airRouteId
  global.airGet = airGet
  global.air = air
  
  module.exports = router
