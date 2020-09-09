const axios = require('axios')
const config = require('./config')
const _ = require("lodash")
var express = require('express');
var router = express.Router();
const fs = require('fs')


let results = []
let headers = { authorization: "Bearer " + config.dcvm.auth_key }
let params = {}

function axGet(baseURL, name, write = true) {
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
  
  function axRoute(router, view, title) { 
      router.get('/', function(req, res, next) {
    let results = JSON.parse(fs.readFileSync(process.cwd() + '\\data\\' + view + '.json'))
          res.render(view, { 
              title: title, 
              results: results
           });
      });
  }
  
  function axRouteId(router, view, title) { router.get('/:id', function(req, res, next) {
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
  
  
  function axRealtimeUpdateJson(baseURL, view, sleeptime = 20000) {
  setInterval(function data() {
      axGet(baseURL, view).then(results => {return results}) 
      return data;
       }(), sleeptime);    
  }

  
function branch(router, base, nomid, titlehtml, id = false) {
    axRealtimeUpdateJson(base, nomid)
    axRoute(router, nomid, titlehtml) //arg1: view, arg2: title(html header)
    if (id === true ) {
        axRouteId(router, nomid, titlehtml)
    }
    }

    
  global.axRealtimeUpdateJson = axRealtimeUpdateJson
  global.axRoute = axRoute
  global.axRouteId = axRouteId
  global.axGet = axGet
  global.branch = branch
  
  module.exports = router
