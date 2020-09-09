const axios = require('axios')
const config = require('./config')
const _ = require("lodash")
var express = require('express');
var router = express.Router();
const fs = require('fs')


let results = []

let params = {}

function axGet(baseURL, headers, name, write = true) {
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
  
  function axRoute(router, headers, view, title) { 
      router.get('/', function(req, res, next) {
    let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + view + '.json'))
          res.render(view, { 
              title: title, 
              results: results
           });
      });
  }
  
  function axRouteId(router, headers, view, title) { router.get('/:id', function(req, res, next) {
      let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + view + '.json'))
      for (let result of results) {
          if (req.params.id === result.id) {
          res.render(view + 'id', { 
              title: title, 
              result: result,
              results: results
           });
          }}
      });
  }
  
  
  function axRealtimeUpdateJson(baseURL, headers, view, sleeptime = 20000) {
  setInterval(function data() {
      axGet(baseURL, headers, view).then(results => {return results}) 
      return data;
       }(), sleeptime);    
  }

  
function branch(router, headers, base, nomid, titlehtml, id = false) {
    axRealtimeUpdateJson(base, headers, nomid)
    axRoute(router, headers, nomid, titlehtml) //arg1: view, arg2: title(html header)
    if (id === true ) {
        axRouteId(router, headers, nomid, titlehtml)
    }
    }

    
  global.axRealtimeUpdateJson = axRealtimeUpdateJson
  global.axRoute = axRoute
  global.axRouteId = axRouteId
  global.axGet = axGet
  global.branch = branch
  
  module.exports = router
